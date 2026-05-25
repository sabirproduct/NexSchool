export type StudentAttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Leave';
export type HostelAttendanceStatus = 'Present' | 'Missing' | 'Leave' | 'Sick';
export type StaffAttendanceStatus = 'Present' | 'Absent' | 'Late' | 'On Leave' | 'Half Day';

export interface AttendanceFiltersState {
  classId: string;
  sectionId: string;
  date: string;
  subject: string;
  hostelId: string;
  roomId: string;
}

export interface StudentAttendanceRecord {
  attendanceId: string;
  studentId: string;
  classId: string;
  sectionId: string;
  attendanceDate: string;
  rollNumber: string;
  studentName: string;
  studentPhotoUrl?: string;
  status: StudentAttendanceStatus;
  remarks?: string;
  markedBy: string;
  markedAt: string;
  updatedAt: string;
  schoolId?: string;
}

export interface HostelAttendanceRecord {
  recordId: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  roomId: string;
  attendanceType: 'Morning' | 'Night';
  status: HostelAttendanceStatus;
  date: string;
  markedBy: string;
}

export interface TeacherAttendanceRecord {
  attendanceId: string;
  teacherId: string;
  teacherName: string;
  staffType: 'Teacher' | 'Staff';
  status: StaffAttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  date: string;
}

export interface AttendanceSummary {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalHalfDay: number;
  attendancePercentage: number;
  updatedAt: string;
}
