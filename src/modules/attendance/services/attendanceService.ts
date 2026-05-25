import { collection, doc, getDocs, query, serverTimestamp, setDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { studentAttendanceSeed } from '../mocks/seed';
import { StudentAttendanceRecord } from '../types';


export async function fetchStudentAttendance(classId: string, sectionId: string, date: string) {
  if (!db) return studentAttendanceSeed.filter((item) => item.classId === classId && item.sectionId === sectionId && item.attendanceDate === date);
  const studentAttendanceCollection = collection(db, 'studentAttendance');
  const q = query(studentAttendanceCollection, where('classId', '==', classId), where('sectionId', '==', sectionId), where('attendanceDate', '==', date));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as StudentAttendanceRecord);
}

export async function submitStudentAttendance(records: StudentAttendanceRecord[]) {
  if (!db) return;
  const firestore = db;
  const batch = writeBatch(firestore);
  records.forEach((record) => {
    const ref = doc(collection(firestore, 'studentAttendance'), record.attendanceId);
    batch.set(ref, { ...record, updatedAt: serverTimestamp() }, { merge: true });
  });
  await batch.commit();
}

export async function lockAttendanceSheet(lockId: string, payload: Record<string, unknown>) {
  if (!db) return;
  const firestore = db;
  await setDoc(doc(collection(firestore, 'attendanceLogs'), lockId), {
    ...payload,
    lockedAt: serverTimestamp(),
    module: 'studentAttendance'
  });
}
