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

  // Try fetching with simple query first (no orderBy to avoid index requirement)
  // Then sort/filter client-side
  try {
    const whereConstraints: any[] = [];
    if (schoolId) whereConstraints.push(where('schoolId', '==', schoolId));

    // Only add filter constraints if they exist (keep it simple for index compliance)
    if (filters.classId) whereConstraints.push(where('academic.classId', '==', filters.classId));
    if (filters.sectionId) whereConstraints.push(where('academic.sectionId', '==', filters.sectionId));
    if (filters.gender) whereConstraints.push(where('gender', '==', filters.gender));
    if (filters.status) whereConstraints.push(where('status', '==', filters.status));
    if (filters.studentType) whereConstraints.push(where('academic.studentType', '==', filters.studentType));

    const sortByField = filters.sortBy === 'rollNo' ? 'academic.rollNo' : filters.sortBy === 'admissionDate' ? 'academic.admissionDate' : 'fullName';
    const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;

    const fetchLimit = Math.min(500, (page + 1) * pageSize + 50);

    // Try first with ordering (requires composite indexes)
    let snapshot;
    try {
      let q;
      if (filters.search) {
        q = query(
          collection(db, 'students'),
          ...whereConstraints,
          orderBy('fullName', sortOrder === 1 ? 'asc' : 'desc'),
          limit(fetchLimit)
        );
      } else {
        q = query(
          collection(db, 'students'),
          ...whereConstraints,
          orderBy(sortByField, sortOrder === 1 ? 'asc' : 'desc'),
          limit(fetchLimit)
        );
      }
      snapshot = await getDocs(q);
    } catch (indexError: any) {
      // If index is still building, fall back to simple query + client-side sorting
      if (indexError?.code === 'failed-precondition' || indexError?.message?.includes('index')) {
        console.warn('Composite index not ready yet, using fallback query. Indexes are being built...');

        // Simple query with just schoolId filter
        const simpleConstraints: any[] = [];
        if (schoolId) simpleConstraints.push(where('schoolId', '==', schoolId));

        // Apply remaining filters in the query where possible
        if (filters.classId) simpleConstraints.push(where('academic.classId', '==', filters.classId));
        if (filters.gender) simpleConstraints.push(where('gender', '==', filters.gender));
        if (filters.status) simpleConstraints.push(where('status', '==', filters.status));

        const fallbackQ = query(
          collection(db, 'students'),
          ...simpleConstraints,
          orderBy('__name__'),
          limit(fetchLimit)
        );
        snapshot = await getDocs(fallbackQ);
      } else {
        throw indexError;
      }
    }

    let allRows = snapshot.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        ...data,
        photoUrl: data.photoUrl || data.photoBinary || undefined,
      } as Student;
    });

    // Apply search filter client-side if needed
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      allRows = allRows.filter((s) => s.fullName.toLowerCase().includes(searchLower));
    }

    // Apply section filter client-side if it couldn't be applied in the query
    if (filters.sectionId && !whereConstraints.some((c: any) => c?.key === 'academic.sectionId')) {
      allRows = allRows.filter((s) => s.academic?.sectionId === filters.sectionId);
    }

    // Apply studentType filter client-side if needed
    if (filters.studentType && !whereConstraints.some((c: any) => c?.key === 'academic.studentType')) {
      allRows = allRows.filter((s) => s.academic?.studentType === filters.studentType);
    }

    // Client-side sort
    allRows.sort((a, b) => {
      let aVal: string = '';
      let bVal: string = '';
      if (filters.sortBy === 'rollNo') {
        aVal = a.academic?.rollNo ?? '';
        bVal = b.academic?.rollNo ?? '';
      } else if (filters.sortBy === 'admissionDate') {
        aVal = a.academic?.admissionDate ?? '';
        bVal = b.academic?.admissionDate ?? '';
      } else {
        aVal = a.fullName ?? '';
        bVal = b.fullName ?? '';
      }
      return aVal.localeCompare(bVal) * sortOrder;
    });

    // Paginate from the fetched results
    const start = page * pageSize;
    const rows = allRows.slice(start, start + pageSize);
    const total = allRows.length;

    return { rows, total };
  } catch (error: any) {
    console.error('Error listing students:', error);
    if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
      throw new Error(
        'Firestore composite indexes are currently being built. ' +
        'This usually takes 1-5 minutes. Please wait and refresh.\n\n' +
        'If the issue persists, deploy indexes with: firebase deploy --only firestore:indexes'
      );
    }
    throw error;
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
