export interface StudentDashboardStats {
  attendanceRate: number;
  totalClasses: number;
  attendedClasses: number;
  upcomingExams: number;
  pendingAssignments: number;
  unreadNotifications: number;
  feesPaid: number;
  feesDue: number;
  currentPercentage: number;
  rank?: number;
}

export interface StudentAttendanceSummary {
  present: number;
  absent: number;
  halfDay: number;
  total: number;
  percentage: number;
  weeklyData: { day: string; status: 'present' | 'absent' | 'half-day' }[];
  monthlyData: { month: string; percentage: number }[];
}

export interface StudentExamResult {
  id: string;
  examName: string;
  term: string;
  year: string;
  subjects: {
    name: string;
    marksObtained: number;
    totalMarks: number;
    percentage: number;
    grade: string;
  }[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
  remarks?: string;
}

export interface StudentTimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface StudentFeeInfo {
  id: string;
  feeName: string;
  category: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
  paymentDate?: string;
  transactionId?: string;
}

export interface StudentSubject {
  name: string;
  code: string;
  teacher: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
}