export type ExamType = 'Unit Test' | 'Monthly Test' | 'Quarterly' | 'Half Yearly' | 'Annual Exam' | 'Practical Exam';
export type ExamStatus = 'Draft' | 'Scheduled' | 'Ongoing' | 'Completed' | 'Published';
export type MarkStatus = 'Present' | 'Absent' | 'Exempted';
export type ResultStatus = 'Draft' | 'Published' | 'Locked';

export interface Exam {
  id: string;
  examName: string;
  examType: ExamType;
  academicSessionId: string;
  startDate: string;
  endDate: string;
  description?: string;
  status: ExamStatus;
  createdBy: string;
  createdAt: string;
}

export interface ExamSchedule {
  id: string;
  examId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  subjectName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maximumMarks: number;
  passingMarks: number;
  roomCode?: string;
  assignedTeacherId?: string;
}

export interface MarkEntry {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  examId: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  sectionId: string;
  obtainedMarks: number;
  maximumMarks: number;
  passingMarks: number;
  grade: string;
  status: MarkStatus;
  remarks?: string;
  enteredBy: string;
  createdAt: string;
}

export interface GradeRule {
  id: string;
  minPercentage: number;
  maxPercentage: number;
  grade: string;
  gradePoint: number;
  remarks?: string;
}

export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  gpa: number;
  finalGrade: string;
  classRank: number;
  sectionRank: number;
  status: ResultStatus;
  publishedAt?: string;
}
