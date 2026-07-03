export type StudentAttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Leave';
export type HostelAttendanceStatus = 'Present' | 'Missing' | 'Leave' | 'Sick';
export type StaffAttendanceStatus = 'Present' | 'Absent' | 'Late' | 'On Leave' | 'Half Day';

export type UserType = 'student' | 'teacher' | 'employee';
export type AttendanceDirection = 'IN' | 'OUT';
export type VisitorReference = 'student' | 'employee' | 'others';

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

/**
 * Unified attendance record for QR-based marking
 * Stores attendance for students, teachers, and employees in a single collection
 */
export interface UnifiedAttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userType: UserType;
  direction: AttendanceDirection;
  date: string;
  timestamp: string;
  schoolId: string;
  markedBy: string;
  metadata?: {
    classId?: string;
    sectionId?: string;
    department?: string;
    designation?: string;
  };
}

/**
 * Visitor attendance record
 */
export interface VisitorRecord {
  id: string;
  visitorId: string;
  visitorName: string;
  reference: VisitorReference;
  referenceName?: string;
  idCardUrl?: string;
  phone?: string;
  purpose?: string;
  direction: AttendanceDirection;
  date: string;
  timestamp: string;
  schoolId: string;
  markedBy: string;
  checkOutTime?: string;
}