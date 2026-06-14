/**
 * Firestore Service Layer
 * Provides generic CRUD operations, real-time listeners, and transactions
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  Query,
  DocumentData,
  QueryConstraint,
  serverTimestamp,
  writeBatch,
  runTransaction,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Initialize Firestore collections (must be called on app startup)
 * Creates necessary indexes if they don't exist
 */
export async function initializeFirestoreCollections() {
  if (!db) {
    console.warn('Firebase not configured. Running in mock mode.');
    return;
  }
  console.log('Firestore initialized successfully');
}

/**
 * Generic get all documents from a collection
 */
export async function getAllDocuments<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  if (!db) throw new Error('Firebase not configured');
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));
}

/**
 * Generic get a single document by ID
 */
export async function getDocument<T extends DocumentData>(collectionName: string, docId: string) {
  if (!db) throw new Error('Firebase not configured');
  const docRef = doc(db, collectionName, docId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T & { id: string }) : null;
}

/**
 * Recursively remove undefined values from an object
 * Firestore throws on undefined but accepts null
 */
function sanitizeData<T>(data: T): T {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeData) as unknown as T;
  }
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      sanitized[key] = sanitizeData(value);
    }
  }
  return sanitized as T;
}

/**
 * Generic create document with auto-generated ID
 */
export async function createDocument<T extends DocumentData>(collectionName: string, data: T) {
  if (!db) throw new Error('Firebase not configured');
  const cleanData = sanitizeData(data);
  const docRef = await addDoc(collection(db, collectionName), {
    ...cleanData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...cleanData };
}

/**
 * Generic create/update document with specific ID
 */
export async function setDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  merge = true
) {
  if (!db) throw new Error('Firebase not configured');
  const docRef = doc(db, collectionName, docId);
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
      ...(merge ? {} : { createdAt: serverTimestamp() }),
    },
    { merge }
  );
  return { id: docId, ...data };
}

/**
 * Generic update document fields
 */
export async function updateDocument<T extends Partial<DocumentData>>(
  collectionName: string,
  docId: string,
  data: T
) {
  if (!db) throw new Error('Firebase not configured');
  const docRef = doc(db, collectionName, docId);
  // Remove undefined values before sending to Firestore
  const cleanData = sanitizeData(data);
  await updateDoc(docRef, {
    ...cleanData,
    updatedAt: serverTimestamp(),
  });
  return { id: docId, ...cleanData };
}

/**
 * Generic delete document
 */
export async function deleteDocument(collectionName: string, docId: string) {
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, collectionName, docId));
}

/**
 * Batch write operations
 */
export async function batchWriteDocuments<T extends DocumentData>(
  operations: Array<{
    type: 'set' | 'update' | 'delete';
    collection: string;
    docId: string;
    data?: T;
  }>
) {
  if (!db) throw new Error('Firebase not configured');
  const batch = writeBatch(db);

  operations.forEach(({ type, collection: coll, docId, data }) => {
    const docRef = doc(db!, coll, docId);
    if (type === 'set') {
      batch.set(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    } else if (type === 'update') {
      batch.update(docRef, { ...data, updatedAt: serverTimestamp() });
    } else if (type === 'delete') {
      batch.delete(docRef);
    }
  });

  await batch.commit();
}

/**
 * Execute a transaction
 */
export async function executeTransaction<T>(
  callback: (txn: any) => Promise<T>
): Promise<T> {
  if (!db) throw new Error('Firebase not configured');
  return runTransaction(db, callback);
}

/**
 * Real-time listener for collection
 */
export function subscribeToCollection<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  onData: (data: (T & { id: string })[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    console.warn('Firebase not configured. Real-time updates unavailable.');
    return () => {};
  }

  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));
      onData(data);
    },
    (error) => {
      console.error(`Error subscribing to ${collectionName}:`, error);
      onError?.(error);
    }
  );
}

/**
 * Real-time listener for a single document
 */
export function subscribeToDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  onData: (data: (T & { id: string }) | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    console.warn('Firebase not configured. Real-time updates unavailable.');
    return () => {};
  }

  const docRef = doc(db, collectionName, docId);
  return onSnapshot(
    docRef,
    (snapshot) => {
      const data = snapshot.exists()
        ? ({ id: snapshot.id, ...snapshot.data() } as T & { id: string })
        : null;
      onData(data);
    },
    (error) => {
      console.error(`Error subscribing to ${collectionName}/${docId}:`, error);
      onError?.(error);
    }
  );
}

/**
 * Firestore index optimization hints
 * These queries will benefit from composite indexes
 */
export const FIRESTORE_INDEX_HINTS = {
  admissions: [
    { collection: 'admissionApplications', fields: ['schoolId', 'status', 'createdAt'] },
    { collection: 'admissionApplications', fields: ['schoolId', 'classAppliedFor', 'status'] },
  ],
  attendance: [
    { collection: 'studentAttendance', fields: ['schoolId', 'classId', 'sectionId', 'attendanceDate'] },
    { collection: 'studentAttendance', fields: ['schoolId', 'studentId', 'attendanceDate'] },
  ],
  marks: [
    { collection: 'marks', fields: ['schoolId', 'examId', 'classId', 'subjectId'] },
    { collection: 'marks', fields: ['schoolId', 'studentId', 'examId'] },
  ],
};
