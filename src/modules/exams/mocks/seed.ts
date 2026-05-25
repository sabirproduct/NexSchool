import { Exam, ExamSchedule, GradeRule, MarkEntry, StudentResult } from '../types';

export const examSeed: Exam[] = [
  { id: 'ex1', examName: 'Quarterly Assessment', examType: 'Quarterly', academicSessionId: '2026-27', startDate: '2026-07-10', endDate: '2026-07-20', status: 'Scheduled', createdBy: 'admin-1', createdAt: '2026-05-25T08:00:00Z' },
  { id: 'ex2', examName: 'Unit Test 1', examType: 'Unit Test', academicSessionId: '2026-27', startDate: '2026-06-05', endDate: '2026-06-08', status: 'Draft', createdBy: 'admin-1', createdAt: '2026-05-24T08:00:00Z' }
];

export const examScheduleSeed: ExamSchedule[] = [
  { id: 'sch-1', examId: 'ex1', classId: '10', sectionId: 'A', subjectId: 'math', subjectName: 'Mathematics', examDate: '2026-07-10', startTime: '09:00', endTime: '12:00', maximumMarks: 100, passingMarks: 33, roomCode: 'R-101' },
  { id: 'sch-2', examId: 'ex1', classId: '10', sectionId: 'A', subjectId: 'sci', subjectName: 'Science', examDate: '2026-07-12', startTime: '09:00', endTime: '12:00', maximumMarks: 100, passingMarks: 33, roomCode: 'R-103' }
];

export const marksSeed: MarkEntry[] = [
  { id: 'm-1', studentId: 'stu-1', studentName: 'Aarav Sharma', rollNumber: '10A-01', examId: 'ex1', subjectId: 'math', subjectName: 'Mathematics', classId: '10', sectionId: 'A', obtainedMarks: 88, maximumMarks: 100, passingMarks: 33, grade: 'A', status: 'Present', enteredBy: 't-101', createdAt: '2026-05-25T09:00:00Z' },
  { id: 'm-2', studentId: 'stu-2', studentName: 'Diya Verma', rollNumber: '10A-02', examId: 'ex1', subjectId: 'math', subjectName: 'Mathematics', classId: '10', sectionId: 'A', obtainedMarks: 0, maximumMarks: 100, passingMarks: 33, grade: 'F', status: 'Absent', remarks: 'Medical leave', enteredBy: 't-101', createdAt: '2026-05-25T09:05:00Z' }
];

export const resultsSeed: StudentResult[] = [
  { id: 'r-1', studentId: 'stu-1', studentName: 'Aarav Sharma', examId: 'ex1', totalMarks: 500, obtainedMarks: 434, percentage: 86.8, gpa: 8.7, finalGrade: 'A', classRank: 2, sectionRank: 1, status: 'Published', publishedAt: '2026-05-25T10:00:00Z' },
  { id: 'r-2', studentId: 'stu-2', studentName: 'Diya Verma', examId: 'ex1', totalMarks: 500, obtainedMarks: 359, percentage: 71.8, gpa: 7.2, finalGrade: 'B+', classRank: 8, sectionRank: 4, status: 'Draft' }
];

export const gradeRulesSeed: GradeRule[] = [
  { id: 'gr-1', minPercentage: 91, maxPercentage: 100, grade: 'A+', gradePoint: 10, remarks: 'Outstanding' },
  { id: 'gr-2', minPercentage: 81, maxPercentage: 90.99, grade: 'A', gradePoint: 9, remarks: 'Excellent' },
  { id: 'gr-3', minPercentage: 71, maxPercentage: 80.99, grade: 'B+', gradePoint: 8, remarks: 'Very Good' },
  { id: 'gr-7', minPercentage: 0, maxPercentage: 40.99, grade: 'F', gradePoint: 0, remarks: 'Needs Improvement' }
];
