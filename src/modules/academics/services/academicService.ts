import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import {
  getAllDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  batchWriteDocuments,
} from '../../../services/firestoreService';

/**
 * Academic Sessions APIs
 */
export async function listAcademicSessions(schoolId: string, pageSize = 20) {
  if (!db) throw new Error('Firebase not configured');
  const q = query(
    collection(db, 'academicSessions'),
    where('schoolId', '==', schoolId),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
  return (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getActiveAcademicSession(schoolId: string) {
  return getAllDocuments('academicSessions', [
    where('schoolId', '==', schoolId),
    where('isActive', '==', true),
  ]);
}

export async function createAcademicSession(schoolId: string, sessionData: any) {
  return createDocument('academicSessions', { ...sessionData, schoolId });
}

/**
 * Classes APIs
 */
export async function getClasses(schoolId: string, sessionId: string) {
  return getAllDocuments('classes', [
    where('schoolId', '==', schoolId),
    where('academicSessionId', '==', sessionId),
  ]);
}

export async function getClassById(classId: string) {
  return getDocument('classes', classId);
}

export async function createClass(schoolId: string, classData: any) {
  return createDocument('classes', { ...classData, schoolId });
}

/**
 * Sections APIs
 */
export async function getSections(schoolId: string, classId: string) {
  return getAllDocuments('sections', [
    where('schoolId', '==', schoolId),
    where('classId', '==', classId),
  ]);
}

export async function createSection(schoolId: string, sectionData: any) {
  return createDocument('sections', { ...sectionData, schoolId });
}

/**
 * Subjects APIs
 */
export async function getSubjects(schoolId: string, classId: string) {
  return getAllDocuments('subjects', [
    where('schoolId', '==', schoolId),
    where('classId', '==', classId),
    orderBy('subjectCode'),
  ]);
}

export async function createSubject(schoolId: string, subjectData: any) {
  return createDocument('subjects', { ...subjectData, schoolId });
}

/**
 * Teacher Assignments APIs
 */
export async function getTeacherAssignments(schoolId: string, classId: string) {
  return getAllDocuments('teacherAssignments', [
    where('schoolId', '==', schoolId),
    where('classId', '==', classId),
  ]);
}

export async function assignTeacher(schoolId: string, assignmentData: any) {
  return createDocument('teacherAssignments', { ...assignmentData, schoolId });
}

export async function removeTeacherAssignment(assignmentId: string) {
  return deleteDocument('teacherAssignments', assignmentId);
}

/**
 * Timetable APIs
 */
export async function getTimetable(schoolId: string, classId: string, sectionId: string) {
  return getAllDocuments('timetable', [
    where('schoolId', '==', schoolId),
    where('classId', '==', classId),
    where('sectionId', '==', sectionId),
  ]);
}

export async function createTimetable(schoolId: string, timetableData: any) {
  return createDocument('timetable', { ...timetableData, schoolId });
}

export async function updateTimetable(timetableId: string, data: any) {
  return updateDocument('timetable', timetableId, data);
}

/**
 * Periods/Time Slots APIs
 */
export async function getPeriods(schoolId: string) {
  return getAllDocuments('periods', [where('schoolId', '==', schoolId), orderBy('periodNo')]);
}

export async function createPeriod(schoolId: string, periodData: any) {
  return createDocument('periods', { ...periodData, schoolId });
}

/**
 * Bulk operations for academics
 */
export async function createAcademicYear(
  schoolId: string,
  sessionId: string,
  classes: any[],
  sections: any[],
  subjects: any[]
) {
  const operations: any[] = [
    ...classes.map((c) => ({
      type: 'set' as const,
      collection: 'classes',
      docId: `${schoolId}-${sessionId}-${c.classCode}`,
      data: { ...c, schoolId, academicSessionId: sessionId },
    })),
    ...sections.map((s) => ({
      type: 'set' as const,
      collection: 'sections',
      docId: `${schoolId}-${s.classId}-${s.sectionCode}`,
      data: { ...s, schoolId },
    })),
    ...subjects.map((sb) => ({
      type: 'set' as const,
      collection: 'subjects',
      docId: `${schoolId}-${sb.classId}-${sb.subjectCode}`,
      data: { ...sb, schoolId },
    })),
  ];

  return batchWriteDocuments(operations);
}
