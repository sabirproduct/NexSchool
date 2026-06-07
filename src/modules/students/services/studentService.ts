import { where, orderBy, limit, getDocs, query, collection } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Student, StudentFilters } from '../types';
import {
  getDocument,
  createDocument,
  updateDocument,
  batchWriteDocuments,
  subscribeToCollection,
} from '../../../services/firestoreService';

const SCHOOL_CODE = 'ABC';

/**
 * Generate an auto-generated admission number
 * Format: {year}-{sequentialNumber:04d}-{schoolCode}
 */
export async function generateAdmissionNo(): Promise<string> {
  const year = new Date().getFullYear().toString().slice(-2);
  const prefix = `${year}-`;
  let nextSeq = 1;

  if (db) {
    try {
      const q = query(
        collection(db, 'students'),
        where('academic.admissionNo', '>=', prefix),
        where('academic.admissionNo', '<=', prefix + '\uf8ff'),
        orderBy('academic.admissionNo', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (snapshot.docs.length > 0) {
        const lastAdmissionNo = snapshot.docs[0].data().academic?.admissionNo as string;
        const parts = lastAdmissionNo.split('-');
        if (parts.length >= 2 && parts[0] === prefix.slice(0, -1)) {
          nextSeq = parseInt(parts[1], 10) + 1;
        }
      }
    } catch {
      nextSeq = 1;
    }
  }

  return `${prefix}${String(nextSeq).padStart(4, '0')}-${SCHOOL_CODE}`;
}

export async function listStudents(filters: StudentFilters, page: number, pageSize: number, schoolId?: string) {
  if (!db) return { rows: [], total: 0 };
  try {
    const whereConstraints: any[] = [];
    if (schoolId) whereConstraints.push(where('schoolId', '==', schoolId));
    if (filters.search) {
      whereConstraints.push(where('fullName', '>=', filters.search));
      whereConstraints.push(where('fullName', '<=', filters.search + '\uf8ff'));
    }
    if (filters.classId) whereConstraints.push(where('academic.classId', '==', filters.classId));
    if (filters.sectionId) whereConstraints.push(where('academic.sectionId', '==', filters.sectionId));
    if (filters.gender) whereConstraints.push(where('gender', '==', filters.gender));
    if (filters.status) whereConstraints.push(where('status', '==', filters.status));
    if (filters.studentType) whereConstraints.push(where('academic.studentType', '==', filters.studentType));

    const sortByField = filters.sortBy === 'rollNo' ? 'academic.rollNo' : filters.sortBy === 'admissionDate' ? 'academic.admissionDate' : 'fullName';
    const sortOrder = filters.sortOrder === 'desc' ? 'desc' : 'asc';

    const q = filters.search
      ? query(collection(db, 'students'), ...whereConstraints, orderBy('fullName', sortOrder), limit((page + 1) * pageSize))
      : query(collection(db, 'students'), ...whereConstraints, orderBy(sortByField, sortOrder), limit((page + 1) * pageSize));
    const snapshot = await getDocs(q);
    const rows = snapshot.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        ...data,
        photoUrl: data.photoUrl || data.photoBinary || undefined,
      } as Student;
    });
    return { rows: rows.slice(page * pageSize), total: rows.length };
  } catch (error) {
    console.error('Error listing students:', error);
    return { rows: [], total: 0 };
  }
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  if (!db) return undefined;
  try {
    const doc = await getDocument<Student>('students', id);
    return doc || undefined;
  } catch (error) {
    console.error('Error fetching student:', error);
    return undefined;
  }
}

export async function createStudent(student: Student, schoolId?: string): Promise<Student> {
  if (!db) throw new Error('Firebase not configured');
  return createDocument<Student>('students', { ...student, schoolId });
}

export async function updateStudent(id: string, patch: Partial<Student>): Promise<Student | undefined> {
  if (!db) return undefined;
  await updateDocument('students', id, { ...patch, updatedAt: new Date().toISOString() });
  return getStudentById(id);
}

export async function softDeleteStudent(id: string): Promise<Student | undefined> {
  return updateStudent(id, { status: 'inactive' });
}

export async function promoteStudents(ids: string[], classId: string, sectionId: string, session: string): Promise<void> {
  const operations = ids.map((id) => ({
    type: 'update' as const,
    collection: 'students',
    docId: id,
    data: { academic: { classId, sectionId, session } },
  }));
  await batchWriteDocuments(operations);
}

export function subscribeToStudents(schoolId: string, callback: (students: Student[]) => void) {
  if (!db) { callback([]); return () => {}; }
  return subscribeToCollection('students', [where('schoolId', '==', schoolId)], callback);
}
