export interface ParentDashboardStats {
  totalChildren: number;
  attendanceRate: number;
  pendingFees: number;
  upcomingExams: number;
  unreadNotifications: number;
  totalFeesPaid: number;
  totalFeesDue: number;
}

export interface ParentChildSummary {
  id: string;
  fullName: string;
  rollNo: string;
  class: string;
  section: string;
  gender: string;
  photoUrl?: string;
  attendanceRate: number;
  feesPaid: number;
  feesDue: number;
  lastExamRank?: number;
  lastExamPercentage?: number;
  status: string;
}

export interface ParentNotification {
  id: string;
  title: string;
  message: string;
  type: 'academic' | 'fee' | 'event' | 'attendance' | 'general';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
  from: string;
}

export interface ParentFeeSummary {
  id: string;
  studentName: string;
  studentId: string;
  feeName: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
}

export interface ParentExamResult {
  id: string;
  studentName: string;
  studentId: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
  term: string;
  year: string;
}

export interface ParentAttendanceRecord {
  id: string;
  studentName: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'holiday';
  subject?: string;
  teacher?: string;
}