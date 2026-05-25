import { HostelAttendanceRecord, StudentAttendanceRecord, TeacherAttendanceRecord } from '../types';

export const studentAttendanceSeed: StudentAttendanceRecord[] = Array.from({ length: 18 }).map((_, i) => ({
  attendanceId: `att-${i + 1}`,
  studentId: `stu-${i + 1}`,
  classId: '10',
  sectionId: i % 2 === 0 ? 'A' : 'B',
  attendanceDate: '2026-05-25',
  rollNumber: `${i + 1}`,
  studentName: `Student ${i + 1}`,
  status: i % 7 === 0 ? 'Absent' : i % 5 === 0 ? 'Late' : 'Present',
  markedBy: 'teacher-1',
  markedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  remarks: i % 7 === 0 ? 'Parent informed' : ''
}));

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
