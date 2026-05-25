import { StudentAttendanceRecord } from '../types';

export function validateAttendancePayload(records: StudentAttendanceRecord[]) {
  const duplicate = new Set<string>();
  for (const record of records) {
    if (!record.classId || !record.sectionId || !record.attendanceDate || !record.studentId) {
      return { valid: false, message: 'Required fields are missing.' };
    }
    if (Number.isNaN(Date.parse(record.attendanceDate))) {
      return { valid: false, message: 'Invalid attendance date.' };
    }
    const key = `${record.studentId}-${record.attendanceDate}`;
    if (duplicate.has(key)) {
      return { valid: false, message: 'Duplicate attendance records detected.' };
    }
    duplicate.add(key);
  }
  return { valid: true, message: 'Validation passed.' };
}
