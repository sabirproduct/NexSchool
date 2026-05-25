import { where, orderBy, limit, startAfter, getDocs, query, collection } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { mockStudents } from '../mocks/seed';
import { Student, StudentFilters } from '../types';
import {
  getAllDocuments,
  getDocument,
  createDocument,
  updateDocument,
  batchWriteDocuments,
  subscribeToCollection,
} from '../../../services/firestoreService';

// Fallback to mock data if Firebase is not configured
async function withFallback<T>(
  firebaseCall: () => Promise<T>,
  mockData: T
): Promise<T> {
  if (!db) {
    console.warn('Firebase not configured. Using mock data.');
    return mockData;
  }
  try {
    return await firebaseCall();
  } catch (error) {
    console.error('Firestore error, falling back to mock data:', error);
    return mockData;
  }
}

export async function listStudents(filters: StudentFilters, page: number, pageSize: number, schoolId?: string) {
  return withFallback(
    async () => {
      const constraints = schoolId ? [where('schoolId', '==', schoolId)] : [];
      if (filters.search) {
        constraints.push(where('fullName', '>=', filters.search));
        constraints.push(where('fullName', '<=', filters.search + '\uf8ff'));
      }
      if (filters.classId) constraints.push(where('academic.classId', '==', filters.classId));
      if (filters.sectionId) constraints.push(where('academic.sectionId', '==', filters.sectionId));
      if (filters.status) constraints.push(where('status', '==', filters.status));

      const sortBy = filters.sortBy ?? 'fullName';
      const sortOrder = filters.sortOrder === 'desc' ? 'desc' : 'asc';
      constraints.push(orderBy(sortBy, sortOrder));

      const q = query(collection(db!, 'students'), ...constraints, limit((page + 1) * pageSize));
      const snapshot = await getDocs(q);
      const rows = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Student));

      return {
        rows: rows.slice(page * pageSize),
        total: rows.length,
      };
    },
    {
      rows: mockStudents.slice(page * pageSize, (page + 1) * pageSize),
      total: mockStudents.length,
    }
  );
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  return withFallback(
    () => getDocument<Student>('students', id),
    mockStudents.find((s) => s.id === id)
  );
}

export async function createStudent(student: Student, schoolId?: string): Promise<Student> {
  return withFallback(
    () => createDocument<Student>('students', { ...student, schoolId }),
    student
  );
}

export async function updateStudent(id: string, patch: Partial<Student>): Promise<Student | undefined> {
  await withFallback(
    () => updateDocument('students', id, { ...patch, updatedAt: new Date().toISOString() }),
    null
  );
  return getStudentById(id);
}

export async function softDeleteStudent(id: string): Promise<Student | undefined> {
  return updateStudent(id, { status: 'inactive' });
}

export async function promoteStudents(
  ids: string[],
  classId: string,
  sectionId: string,
  session: string
): Promise<void> {
  return withFallback(
    async () => {
      const operations = ids.map((id) => ({
        type: 'update' as const,
        collection: 'students',
        docId: id,
        data: {
          academic: { classId, sectionId, session },
        },
      }));
      await batchWriteDocuments(operations);
    },
    undefined
  );
}

export function subscribeToStudents(schoolId: string, callback: (students: Student[]) => void) {
  if (!db) {
    callback(mockStudents);
    return () => {};
  }
  return subscribeToCollection('students', [where('schoolId', '==', schoolId)], callback);
}
