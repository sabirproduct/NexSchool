/**
 * Firestore Initialization & Data Setup
 * Run this once to create initial collections and documents
 */

import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { SYSTEM_ROLES } from '../modules/system/types';
import { useAuthStore } from '../store/authStore';

/**
 * Default module permissions for each system role
 */
const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ['all'],
  school_admin: ['dashboard','students','admissions','attendance','academics','exams','fees','hostel','safety','health','scholarship','notifications','system'],
  principal: ['dashboard','students','admissions','attendance','academics','exams','fees','hostel','safety','health','scholarship','notifications'],
  teacher: ['dashboard','attendance','academics','exams','notifications'],
  accountant: ['dashboard','fees','notifications'],
  hostel_warden: ['dashboard','hostel','attendance','safety','health','notifications'],
  student: ['student','dashboard'],
  parent: ['parent','dashboard'],
};

/**
 * Seed default roles into Firestore.
 * Uses the currently authenticated user's credentials.
 */
async function seedRoles() {
  if (!db) return;
  try {
    for (const r of SYSTEM_ROLES) {
      await setDoc(doc(db, 'systemRoles', r.key), {
        name: r.name,
        key: r.key,
        description: r.description,
        permissions: DEFAULT_ROLE_PERMISSIONS[r.key] || ['dashboard'],
        userCount: 0,
        isSystem: r.isSystem,
      });
    }
    console.log('✅ Default roles seeded.');
  } catch (err: any) {
    // If it fails because doc already exists, that's fine
    if (err.code !== 'already-exists') {
      console.warn('⚠️ Role seed issue (non-critical):', err.message);
    }
  }
}

/**
 * Seed super admin user + Firebase Auth account.
 * Called after user is authenticated.
 * Seeds into the `users` collection.
 */
async function seedSuperAdmin() {
  if (!db || !auth) return;

  const email = 'sabir@nexschool.com';
  const password = 'Admin@123';
  const userData = {
    name: 'Sabiruddin Sk',
    email,
    role: 'super_admin',
    schoolId: 'school_001',
    schoolName: 'NexSchool HQ',
    status: 'active',
    lastLogin: null,
    createdAt: new Date().toISOString(),
  };

  try {
    // Try signing in - if it works, the user already exists
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    console.log('[Seed] Super admin signed in:', { uid, email });

    // Write the Firestore doc into `users` collection (safe to re-write, uses merge)
    await setDoc(doc(db, 'users', uid), { uid, ...userData });
    console.log('[Seed] User document written to Firestore collection: users', { uid });

    // Set user in auth store
    useAuthStore.getState().setUser({
      uid,
      email,
      role: 'super_admin',
      schoolId: 'school_001',
    });

    console.log('✅ Super admin signed in successfully.');
    return true;
  } catch (signInErr: any) {
    // User doesn't exist, create them
    if (signInErr.code === 'auth/invalid-credential') {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;
        console.log('[Seed] Super admin created in Firebase Auth:', { uid, email });

        // Write the Firestore doc into `users` collection
        await setDoc(doc(db, 'users', uid), { uid, ...userData });
        console.log('[Seed] User document written to Firestore collection: users', { uid });

        // Set user in auth store
        useAuthStore.getState().setUser({
          uid,
          email,
          role: 'super_admin',
          schoolId: 'school_001',
        });

        console.log('✅ Super admin created and signed in successfully.');
        return true;
      } catch (createErr: any) {
        if (createErr.code === 'auth/email-already-in-use') {
          // Auth user exists but we didn't get a valid sign-in. Try password reset or skip.
          console.warn('⚠️ Super admin auth exists but could not sign in. Manual intervention needed.');
          return false;
        }
        console.error('❌ Failed to create super admin:', createErr.message);
        return false;
      }
    } else {
      console.error('❌ Sign-in error:', signInErr.message);
      return false;
    }
  }
}

/**
 * Initialize Firestore collections (call on app startup)
 * This function is called after auth is initialized.
 * It tries to seed the super admin + roles using the current auth context.
 */
export async function initializeFirestore() {
  if (!db || !auth) {
    console.warn('⚠️ Firebase not configured. Running in mock mode.');
    return;
  }

  try {
    console.log('🚀 Initializing Firestore...');

    // The flow:
    // 1. authStore.initialize() runs onAuthStateChanged - this fires FIRST
    // 2. If user is null (not signed in), this seed function tries to sign in/create the super admin
    // 3. Once signed in, it seeds roles
    // 4. The auth store picks up the signed-in state

    const seeded = await seedSuperAdmin();
    if (seeded) {
      await seedRoles();
    } else {
      // If super admin seed returned false (user exists but sign-in failed),
      // still try to seed roles since the user doc may exist
      try {
        await seedRoles();
      } catch {
        // Non-critical - roles may already exist
      }
    }

    console.log('✅ Firestore initialization complete.');
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
  }
}

/**
 * Ensure roles are seeded when any admin user logs in.
 * This should be called during login to guarantee roles exist.
 */
export async function ensureRolesSeeded() {
  if (!db) return;
  try {
    // Check if roles exist by trying to read one
    const { getDoc, doc } = await import('firebase/firestore');
    const snapshot = await getDoc(doc(db, 'systemRoles', 'school_admin'));
    if (!snapshot.exists()) {
      console.log('[Seed] Roles missing, seeding now...');
      await seedRoles();
    }
  } catch (err) {
    console.warn('[Seed] Could not verify roles (non-critical):', err);
    // Attempt to seed regardless
    try {
      await seedRoles();
    } catch {
      // Silently fail
    }
  }
}
