import { Firestore, collection, doc, getDocs, query, where, writeBatch, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import {
  getAllDocuments,
  getDocument,
  createDocument,
  updateDocument,
  batchWriteDocuments,
  subscribeToCollection,
} from '../../../services/firestoreService';
import { MarkEntry } from '../types';

function getDbOrThrow(): Firestore {
  if (!db) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* keys.');
  return db;
}

/**
 * Exams APIs
 */
export async function fetchExamsBySession(schoolId: string, academicSessionId: string) {
  return getAllDocuments('exams', [
    where('schoolId', '==', schoolId),
    where('academicSessionId', '==', academicSessionId),
    orderBy('examDate'),
  ]);
}

export async function getExamById(examId: string) {
  return getDocument('exams', examId);
}

export async function createExam(schoolId: string, examData: any) {
  return createDocument('exams', { ...examData, schoolId });
}

export async function updateExam(examId: string, data: any) {
  return updateDocument('exams', examId, data);
}

/**
 * Exam Schedule APIs
 */
export async function getExamSchedules(schoolId: string, examId: string) {
  return getAllDocuments('examSchedules', [
    where('schoolId', '==', schoolId),
    where('examId', '==', examId),
  ]);
}

export async function createExamSchedule(schoolId: string, scheduleData: any) {
  return createDocument('examSchedules', { ...scheduleData, schoolId });
}

/**
 * Marks APIs
 */
export async function fetchMarksByExam(schoolId: string, examId: string, classId: string, subjectId?: string) {
  const constraints = [
    where('schoolId', '==', schoolId),
    where('examId', '==', examId),
    where('classId', '==', classId),
  ];

  if (subjectId) {
    constraints.push(where('subjectId', '==', subjectId));
  }

  return getAllDocuments('marks', [...constraints, orderBy('studentId')]);
}

export async function getMarksByStudent(schoolId: string, examId: string, studentId: string) {
  return getAllDocuments('marks', [
    where('schoolId', '==', schoolId),
    where('examId', '==', examId),
    where('studentId', '==', studentId),
  ]);
}

/**
 * Batch upsert marks
 */
export async function batchUpsertMarks(schoolId: string, entries: MarkEntry[]) {
  const firestore = getDbOrThrow();
  const batch = writeBatch(firestore);

  entries.forEach((entry) => {
    batch.set(
      doc(firestore, 'marks', entry.id),
      { ...entry, schoolId, updatedAt: new Date() },
      { merge: true }
    );
  });

  await batch.commit();
}

/**
 * Student Results APIs
 */
export async function getStudentResults(schoolId: string, examId: string, studentId: string) {
  return getAllDocuments('studentResults', [
    where('schoolId', '==', schoolId),
    where('examId', '==', examId),
    where('studentId', '==', studentId),
  ]);
}

export async function publishExamResults(schoolId: string, examId: string, resultsList: any[]) {
  const operations = resultsList.map((result) => ({
    type: 'set' as const,
    collection: 'studentResults',
    docId: `${schoolId}-${examId}-${result.studentId}`,
    data: { ...result, schoolId, examId, publishedAt: new Date() },
  }));

  return batchWriteDocuments(operations);
}

/**
 * Grade Rules APIs
 */
export async function getGradeRules(schoolId: string) {
  return getAllDocuments('gradeRules', [where('schoolId', '==', schoolId)]);
}

export async function createGradeRule(schoolId: string, ruleData: any) {
  return createDocument('gradeRules', { ...ruleData, schoolId });
}

/**
 * Calculate student rank and GPA
 */
export async function calculateStudentRanks(schoolId: string, examId: string, classId: string) {
  const results = await getAllDocuments('studentResults', [
    where('schoolId', '==', schoolId),
    where('examId', '==', examId),
    where('classId', '==', classId),
    orderBy('totalMarks', 'desc'),
  ]);

  // Assign ranks
  const rankedResults = results.map((result, index) => ({
    ...result,
    rank: index + 1,
    gpa: calculateGPA(result.totalMarks),
  }));

  return rankedResults;
}

/**
 * Helper to calculate GPA (example: out of 10)
 */
function calculateGPA(totalMarks: number, maxMarks: number = 100): number {
  return parseFloat(((totalMarks / maxMarks) * 10).toFixed(2));
}

/**
 * Subscribe to real-time exam updates
 */
export function subscribeToExams(schoolId: string, callback: (exams: any[]) => void) {
  if (!db) {
    callback([]);
    return () => {};
  }

  return subscribeToCollection(
    'exams',
    [where('schoolId', '==', schoolId)],
    callback
  );
}

/**
 * Subscribe to real-time marks updates
 */
export function subscribeToMarks(
  schoolId: string,
  examId: string,
  classId: string,
  callback: (marks: MarkEntry[]) => void
) {
  if (!db) {
    callback([]);
    return () => {};
  }

  return subscribeToCollection<MarkEntry>(
    'marks',
    [
      where('schoolId', '==', schoolId),
      where('examId', '==', examId),
      where('classId', '==', classId),
    ],
    callback
  );
}
