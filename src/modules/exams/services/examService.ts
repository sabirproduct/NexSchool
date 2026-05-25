import { Firestore, collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { MarkEntry } from '../types';

export async function fetchExamsBySession(academicSessionId: string) {
  const firestore = getDbOrThrow();
  const q = query(collection(firestore, 'exams'), where('academicSessionId', '==', academicSessionId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function batchUpsertMarks(entries: MarkEntry[]) {
  const firestore = getDbOrThrow();
  const batch = writeBatch(firestore);
  entries.forEach((entry) => batch.set(doc(firestore, 'marks', entry.id), entry, { merge: true }));
  await batch.commit();
}


function getDbOrThrow(): Firestore {
  if (!db) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* keys.');
  return db;
}
