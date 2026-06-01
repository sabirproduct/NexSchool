import { collection, doc, getDocs, query, serverTimestamp, setDoc, where, writeBatch, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { studentAttendanceSeed } from '../mocks/seed';
import { StudentAttendanceRecord } from '../types';
import {
  getAllDocuments,
  batchWriteDocuments,
  subscribeToCollection,
} from '../../../services/firestoreService';

/**
 * Fetch student attendance for a specific date
 */
export async function fetchStudentAttendance(
  schoolId: string,
  classId: string,
  sectionId: string,
  date: string
) {
  if (!db) {
    return studentAttendanceSeed.filter(
      (item) => item.classId === classId && item.sectionId === sectionId && item.attendanceDate === date
    );
  }

  return getAllDocuments<StudentAttendanceRecord>('studentAttendance', [
    where('schoolId', '==', schoolId),
    where('classId', '==', classId),
    where('sectionId', '==', sectionId),
    where('attendanceDate', '==', date),
  ]);
}

/**
 * Get attendance summary for a student
 */
export async function getStudentAttendanceSummary(schoolId: string, studentId: string, monthStart: string, monthEnd: string) {
  if (!db) return { totalDays: 0, presentDays: 0, absentDays: 0, percentage: 0 };

  const records = await getAllDocuments<StudentAttendanceRecord>('studentAttendance', [
    where('schoolId', '==', schoolId),
    where('studentId', '==', studentId),
    where('attendanceDate', '>=', monthStart),
    where('attendanceDate', '<=', monthEnd),
  ]);

  const presentDays = records.filter((r) => r.status === 'Present').length;
  const absentDays = records.filter((r) => r.status === 'Absent').length;
  const totalDays = presentDays + absentDays;

  return {
    totalDays,
    presentDays,
    absentDays,
    percentage: totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : '0',
  };
}

/**
 * Submit batch attendance records
 */
export async function submitStudentAttendance(
  schoolId: string,
  records: StudentAttendanceRecord[]
) {
  if (!db) return;

  const operations = records.map((record) => ({
    type: 'set' as const,
    collection: 'studentAttendance',
    docId: record.attendanceId || `${schoolId}-${record.studentId}-${record.attendanceDate}`,
    data: { ...record, schoolId },
  }));

  return batchWriteDocuments(operations);
}

/**
 * Lock attendance sheet (finalize for a day)
 */
export async function lockAttendanceSheet(
  schoolId: string,
  lockId: string,
  payload: Record<string, unknown>
) {
  if (!db) return;

  const firestore = db;
  await setDoc(doc(collection(firestore, 'attendanceLogs'), lockId), {
    ...payload,
    schoolId,
    module: 'studentAttendance',
    lockedAt: serverTimestamp(),
  });
}

/**
 * Get hostel attendance
 */
export async function fetchHostelAttendance(
  schoolId: string,
  hostelId: string,
  date: string
) {
  if (!db) return [];

  return getAllDocuments('hostelAttendance', [
    where('schoolId', '==', schoolId),
    where('hostelId', '==', hostelId),
    where('attendanceDate', '==', date),
  ]);
}

/**
 * Submit hostel attendance
 */
export async function submitHostelAttendance(
  schoolId: string,
  records: any[]
) {
  if (!db) return;

  const operations = records.map((record) => ({
    type: 'set' as const,
    collection: 'hostelAttendance',
    docId: record.recordId || `${schoolId}-${record.studentId}-${record.attendanceDate}`,
    data: { ...record, schoolId },
  }));

  return batchWriteDocuments(operations);
}

/**
 * Get staff attendance
 */
export async function fetchStaffAttendance(schoolId: string, date: string) {
  if (!db) return [];

  return getAllDocuments('staffAttendance', [
    where('schoolId', '==', schoolId),
    where('attendanceDate', '==', date),
  ]);
}

/**
 * Submit staff attendance
 */
export async function submitStaffAttendance(schoolId: string, records: any[]) {
  if (!db) return;

  const operations = records.map((record) => ({
    type: 'set' as const,
    collection: 'staffAttendance',
    docId: record.recordId || `${schoolId}-${record.staffId}-${record.attendanceDate}`,
    data: { ...record, schoolId },
  }));

  return batchWriteDocuments(operations);
}

/**
 * Subscribe to real-time attendance updates
 */
export function subscribeToStudentAttendance(
  schoolId: string,
  classId: string,
  date: string,
  callback: (records: StudentAttendanceRecord[]) => void
) {
  if (!db) {
    callback(studentAttendanceSeed);
    return () => {};
  }

  return subscribeToCollection<StudentAttendanceRecord>(
    'studentAttendance',
    [
      where('schoolId', '==', schoolId),
      where('classId', '==', classId),
      where('attendanceDate', '==', date),
    ],
    callback
  );
}
