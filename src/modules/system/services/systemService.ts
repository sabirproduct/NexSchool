/**
 * System Service - Firestore CRUD for roles, users & permissions
 */
import {
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  subscribeToCollection,
} from '../../../services/firestoreService';
import { SystemUser, SystemRole, SYSTEM_ROLES } from '../types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser as firebaseDeleteUser,
} from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { doc, setDoc, getDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const USERS_COLLECTION = 'users';
const ROLES_COLLECTION = 'systemRoles';

// ──────────────────────────────────────────────
//  USERS
// ──────────────────────────────────────────────

export async function fetchAllUsers() {
  if (!db) {
    // Return empty array for mock mode
    return [] as (SystemUser & { id: string })[];
  }
  return getAllDocuments<SystemUser>(USERS_COLLECTION);
}

export function subscribeToUsers(
  onData: (users: (SystemUser & { id: string })[]) => void,
  onError?: (error: Error) => void
) {
  return subscribeToCollection<SystemUser>(USERS_COLLECTION, [], onData, onError);
}

/**
 * Create a new user in Firebase Auth + Firestore
 */
export async function createSystemUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  schoolId: string;
  schoolName: string;
}) {
  if (!db || !auth) throw new Error('Firebase not configured');

  // Save current admin credentials before creating new user
  // (createUserWithEmailAndPassword signs in the new user, logging out the admin)
  const currentUser = auth.currentUser;
  const adminEmail = currentUser?.email;
  const adminPassword = await getAdminPassword(); // stored in state

  // 1. Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const uid = userCredential.user.uid;

  // 2. Sign BACK in as the admin BEFORE writing to Firestore
  //    so the write happens under the admin's authorized session
  if (adminEmail && adminPassword) {
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
  }

  // 3. Wait for auth state to be fully settled before writing to Firestore
  if (adminEmail) {
    await waitForAuthState(adminEmail);
  }

  const userData: Omit<SystemUser, 'id'> = {
    uid,
    name: data.name,
    email: data.email,
    role: data.role,
    schoolId: data.schoolId,
    schoolName: data.schoolName,
    status: 'active',
    lastLogin: null,
    createdAt: new Date().toISOString(),
  };

  // Write to Firestore
  const ref = doc(db, USERS_COLLECTION, uid);
  await withRetry(() => setDoc(ref, userData), 3);

  return { id: uid, ...userData };
}

/**
 * Wait for Firebase Auth state to settle to the expected user
 */
function waitForAuthState(expectedEmail: string): Promise<void> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth!, (user: FirebaseUser | null) => {
      if (user?.email === expectedEmail) {
        unsubscribe();
        resolve();
      }
    });
    // Safety timeout - resolve after 5s even if auth state doesn't match
    setTimeout(() => {
      unsubscribe();
      resolve();
    }, 5000);
  });
}

/**
 * Retry a Firestore operation with exponential backoff
 * Handles auth state race conditions after re-authentication
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries: number, delay = 500): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (attempt === maxRetries) throw err;
      // Wait for auth state to stabilize before retrying
      if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        console.warn(`[SystemService] Permission error on attempt ${attempt}, retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        delay *= 2; // exponential backoff
      } else {
        throw err; // non-permission errors should fail immediately
      }
    }
  }
  throw new Error('Retry exhausted');
}

// ── Admin password storage for session restoration ────────────────────
let _adminCredentials: { email: string; password: string } | null = null;

/** Store the admin's password so we can re-authenticate after creating other users */
export function storeAdminCredentials(email: string, password: string) {
  _adminCredentials = { email, password };
}

/** Retrieve stored admin password */
async function getAdminPassword(): Promise<string | null> {
  return _adminCredentials?.password || null;
}

export async function updateSystemUser(
  userId: string,
  data: Partial<SystemUser>
) {
  if (!db) throw new Error('Firebase not configured');
  return updateDocument<Partial<SystemUser>>(USERS_COLLECTION, userId, data);
}

export async function deleteSystemUser(userId: string) {
  if (!db) throw new Error('Firebase not configured');
  await deleteDocument(USERS_COLLECTION, userId);

  // Try to delete from Firebase Auth if possible
  try {
    const user = auth?.currentUser;
    // Note: Deleting other users requires Admin SDK, so this works only for self or via cloud function
    // For now we just delete the Firestore doc
  } catch (e) {
    console.warn('Could not delete Firebase Auth user (requires Admin SDK)');
  }
}

// ──────────────────────────────────────────────
//  ROLES & PERMISSIONS
// ──────────────────────────────────────────────

/**
 * Fetch all roles (from Firestore if available, fallback to SYSTEM_ROLES)
 */
export async function fetchAllRoles() {
  if (!db) {
    return SYSTEM_ROLES.map(r => ({
      id: r.key,
      name: r.name,
      key: r.key,
      description: r.description,
      permissions: ['dashboard'],
      userCount: 0,
      isSystem: r.isSystem,
    })) as (SystemRole & { id: string })[];
  }

  const roles = await getAllDocuments<SystemRole>(ROLES_COLLECTION);
  if (roles.length === 0) {
    // Seed default roles
    return seedDefaultRoles();
  }
  return roles;
}

export function subscribeToRoles(
  onData: (roles: (SystemRole & { id: string })[]) => void,
  onError?: (error: Error) => void
) {
  // First try to seed if empty
  return subscribeToCollection<SystemRole>(ROLES_COLLECTION, [], onData, onError);
}

/**
 * Seed default roles from SYSTEM_ROLES into Firestore
 */
export async function seedDefaultRoles() {
  if (!db) return [];

  const roles: (SystemRole & { id: string })[] = [];
  const defaultPermissions: Record<string, string[]> = {
    super_admin: ['all'],
    school_admin: ['dashboard','students','admissions','attendance','academics','exams','fees','hostel','notifications','system'],
    principal: ['dashboard','students','attendance','academics','exams','notifications'],
    teacher: ['dashboard','attendance','academics','exams','notifications'],
    accountant: ['dashboard','fees','notifications'],
    hostel_warden: ['dashboard','hostel','attendance','notifications'],
    student: ['student','dashboard'],
    parent: ['parent','dashboard'],
  };

  for (const r of SYSTEM_ROLES) {
    const roleData: SystemRole = {
      id: r.key,
      name: r.name,
      key: r.key,
      description: r.description,
      permissions: defaultPermissions[r.key] || ['dashboard'],
      userCount: 0,
      isSystem: r.isSystem,
    };
    await setDoc(doc(db, ROLES_COLLECTION, r.key), {
      name: roleData.name,
      key: roleData.key,
      description: roleData.description,
      permissions: roleData.permissions,
      userCount: roleData.userCount,
      isSystem: roleData.isSystem,
    });
    roles.push(roleData);
  }

  return roles;
}

/**
 * Update role permissions
 */
export async function updateRolePermissions(
  roleKey: string,
  permissions: string[]
) {
  if (!db) throw new Error('Firebase not configured');
  return updateDocument<Partial<SystemRole>>(ROLES_COLLECTION, roleKey, {
    permissions,
  });
}

/**
 * Create a custom role
 */
export async function createCustomRole(data: {
  name: string;
  key: string;
  description: string;
  permissions: string[];
}) {
  if (!db) throw new Error('Firebase not configured');
  const roleData: SystemRole = {
    id: data.key,
    name: data.name,
    key: data.key,
    description: data.description,
    permissions: data.permissions,
    userCount: 0,
    isSystem: false,
  };
  await setDoc(doc(db, ROLES_COLLECTION, data.key), {
    name: roleData.name,
    key: roleData.key,
    description: roleData.description,
    permissions: roleData.permissions,
    userCount: roleData.userCount,
    isSystem: roleData.isSystem,
  });
  return { ...roleData, id: data.key };
}

export async function deleteRole(roleKey: string) {
  if (!db) throw new Error('Firebase not configured');
  await deleteDocument(ROLES_COLLECTION, roleKey);
}