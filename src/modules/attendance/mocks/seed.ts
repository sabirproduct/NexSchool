import { HostelAttendanceRecord, StudentAttendanceRecord, TeacherAttendanceRecord } from '../types';

const statuses: StudentAttendanceRecord['status'][] = ['Present', 'Present', 'Present', 'Present', 'Absent', 'Late', 'Half Day', 'Present', 'Present', 'Present'];
const statuses2: StudentAttendanceRecord['status'][] = ['Present', 'Present', 'Absent', 'Present', 'Late', 'Present', 'Present', 'Present', 'Leave', 'Present'];
const statuses3: StudentAttendanceRecord['status'][] = ['Present', 'Present', 'Present', 'Late', 'Present', 'Absent', 'Present', 'Present', 'Present', 'Present'];

function generateStudentRecords(classId: string, sectionId: string, startDate: string, days: number, studentOffset: number): StudentAttendanceRecord[] {
  const records: StudentAttendanceRecord[] = [];
  const start = new Date(startDate);

  for (let d = 0; d < days; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    for (let i = 0; i < 10; i++) {
      const statusPool = i % 3 === 0 ? statuses : i % 3 === 1 ? statuses2 : statuses3;
      const status = d < statusPool.length ? statusPool[d] : 'Present';
      records.push({
        attendanceId: `att-${classId}-${sectionId}-${studentOffset + i}-${dateStr}`,
        studentId: `stu-${studentOffset + i + 1}`,
        classId,
        sectionId,
        attendanceDate: dateStr,
        rollNumber: `${studentOffset + i + 1}`,
        studentName: `Student ${studentOffset + i + 1}`,
        status,
        markedBy: 'teacher-1',
        markedAt: dateStr + 'T09:00:00Z',
        updatedAt: dateStr + 'T09:00:00Z',
        remarks: status === 'Absent' || status === 'Late' ? 'Parent informed' : ''
      });
    }
  }
  return records;
}

// Generate 10 students across 30 weekdays (Mon-Fri) for a full month session
export const studentAttendanceSeed: StudentAttendanceRecord[] = [
  ...generateStudentRecords('10', 'A', '2026-05-01', 30, 0),
  ...generateStudentRecords('10', 'B', '2026-05-01', 30, 10),
  ...generateStudentRecords('11', 'A', '2026-05-01', 30, 20),
  ...generateStudentRecords('11', 'B', '2026-05-01', 30, 30),
];

export const hostelAttendanceSeed: HostelAttendanceRecord[] = Array.from({ length: 8 }).map((_, i) => ({
  recordId: `hostel-${i + 1}`,
  studentId: `stu-h-${i + 1}`,
  studentName: `Hostel Student ${i + 1}`,
  hostelId: i < 4 ? 'Boys Hostel' : 'Girls Hostel',
  roomId: `R-${100 + i}`,
  attendanceType: i % 2 === 0 ? 'Morning' : 'Night',
  status: i % 6 === 0 ? 'Missing' : 'Present',
  date: '2026-05-25',
  markedBy: 'warden-1'
}));

export const teacherAttendanceSeed: TeacherAttendanceRecord[] = Array.from({ length: 10 }).map((_, i) => ({
  attendanceId: `staff-${i + 1}`,
  teacherId: `teach-${i + 1}`,
  teacherName: `Teacher ${i + 1}`,
  staffType: i % 3 === 0 ? 'Staff' : 'Teacher',
  status: i % 4 === 0 ? 'Late' : 'Present',
  checkIn: i % 4 === 0 ? '09:15' : '08:45',
  checkOut: '16:00',
  date: '2026-05-25'
}));

// Helper to get unique dates from student records
export function getAttendanceDates(records: StudentAttendanceRecord[]): string[] {
  const dates = new Set(records.map(r => r.attendanceDate));
  return Array.from(dates).sort();
}

// Get unique students
export function getStudentList(records: StudentAttendanceRecord[]): { studentId: string; studentName: string; rollNumber: string; classId: string; sectionId: string }[] {
  const map = new Map<string, StudentAttendanceRecord>();
  records.forEach(r => {
    if (!map.has(r.studentId)) map.set(r.studentId, r);
  });
  return Array.from(map.values()).map(r => ({
    studentId: r.studentId,
    studentName: r.studentName,
    rollNumber: r.rollNumber,
    classId: r.classId,
    sectionId: r.sectionId,
  }));
}