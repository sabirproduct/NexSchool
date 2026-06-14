import { Exam, ExamSchedule, GradeRule, MarkEntry, StudentResult } from '../types';

export const examSeed: Exam[] = [
  { id: 'ex1', examName: 'Quarterly Assessment', examType: 'Quarterly', academicSessionId: '2026-27', startDate: '2026-07-10', endDate: '2026-07-20', status: 'Published', createdBy: 'admin-1', createdAt: '2026-05-25T08:00:00Z' },
  { id: 'ex2', examName: 'Unit Test 1', examType: 'Unit Test', academicSessionId: '2026-27', startDate: '2026-06-05', endDate: '2026-06-08', status: 'Published', createdBy: 'admin-1', createdAt: '2026-05-24T08:00:00Z' },
  { id: 'ex3', examName: 'Half Yearly Examination', examType: 'Half Yearly', academicSessionId: '2026-27', startDate: '2026-09-15', endDate: '2026-09-25', status: 'Scheduled', createdBy: 'admin-1', createdAt: '2026-08-01T08:00:00Z' }
];

export const examScheduleSeed: ExamSchedule[] = [
  { id: 'sch-1', examId: 'ex1', classId: '10', sectionId: 'A', subjectId: 'math', subjectName: 'Mathematics', examDate: '2026-07-10', startTime: '09:00', endTime: '12:00', maximumMarks: 100, passingMarks: 33, roomCode: 'R-101' },
  { id: 'sch-2', examId: 'ex1', classId: '10', sectionId: 'A', subjectId: 'sci', subjectName: 'Science', examDate: '2026-07-12', startTime: '09:00', endTime: '12:00', maximumMarks: 100, passingMarks: 33, roomCode: 'R-103' },
  { id: 'sch-3', examId: 'ex1', classId: '10', sectionId: 'A', subjectId: 'eng', subjectName: 'English', examDate: '2026-07-14', startTime: '09:00', endTime: '11:00', maximumMarks: 100, passingMarks: 35, roomCode: 'R-105' },
  { id: 'sch-4', examId: 'ex1', classId: '10', sectionId: 'A', subjectId: 'sst', subjectName: 'Social Studies', examDate: '2026-07-16', startTime: '09:00', endTime: '11:00', maximumMarks: 100, passingMarks: 33, roomCode: 'R-102' },
  { id: 'sch-5', examId: 'ex1', classId: '10', sectionId: 'A', subjectId: 'hindi', subjectName: 'Hindi', examDate: '2026-07-18', startTime: '09:00', endTime: '11:00', maximumMarks: 100, passingMarks: 33, roomCode: 'R-104' },
  { id: 'sch-6', examId: 'ex2', classId: '9', sectionId: 'B', subjectId: 'math', subjectName: 'Mathematics', examDate: '2026-06-05', startTime: '09:00', endTime: '11:00', maximumMarks: 50, passingMarks: 17, roomCode: 'R-201' }
];

const allStudents = [
  { id: 'stu-1', name: 'Aarav Sharma', roll: '10A-01', classId: '10', sectionId: 'A' },
  { id: 'stu-2', name: 'Diya Verma', roll: '10A-02', classId: '10', sectionId: 'A' },
  { id: 'stu-3', name: 'Arjun Patel', roll: '10A-03', classId: '10', sectionId: 'A' },
  { id: 'stu-4', name: 'Ananya Singh', roll: '10A-04', classId: '10', sectionId: 'A' },
  { id: 'stu-5', name: 'Rohan Gupta', roll: '10A-05', classId: '10', sectionId: 'A' },
  { id: 'stu-6', name: 'Priya Jain', roll: '10A-06', classId: '10', sectionId: 'A' },
  { id: 'stu-7', name: 'Karan Mehta', roll: '10A-07', classId: '10', sectionId: 'A' },
  { id: 'stu-8', name: 'Sneha Reddy', roll: '10A-08', classId: '10', sectionId: 'A' },
  { id: 'stu-9', name: 'Vikram Joshi', roll: '10A-09', classId: '10', sectionId: 'A' },
  { id: 'stu-10', name: 'Ishita Kapoor', roll: '10A-10', classId: '10', sectionId: 'A' },
];

const subjects = [
  { id: 'math', name: 'Mathematics', maxMarks: 100, passing: 33 },
  { id: 'sci', name: 'Science', maxMarks: 100, passing: 33 },
  { id: 'eng', name: 'English', maxMarks: 100, passing: 35 },
  { id: 'sst', name: 'Social Studies', maxMarks: 100, passing: 33 },
  { id: 'hindi', name: 'Hindi', maxMarks: 100, passing: 33 },
];

// Generate marks for both exams ex1 and ex2 with realistic data
const generateMarks = (examId: string, studentList: typeof allStudents): MarkEntry[] => {
  const marks: MarkEntry[] = [];
  const baseMax = examId === 'ex2' ? 50 : 100;
  const basePassing = examId === 'ex2' ? 17 : 33;

  studentList.forEach((student, idx) => {
    subjects.forEach((subj, subjIdx) => {
      // Seed-based pseudo-random but deterministic marks for consistency
      const seed = (idx + 1) * (subjIdx + 1) * (examId === 'ex1' ? 7 : 13);
      const baseObtained = ((seed * 13 + 7) % 41) + 40; // 40-80 range
      const obtained = Math.min(baseObtained + (examId === 'ex1' ? 10 : 0), baseMax);
      const status = (idx === 1 && subjIdx === 0) ? 'Absent' : 'Present';
      const grade = obtained >= 91 ? 'A+' : obtained >= 81 ? 'A' : obtained >= 71 ? 'B+' : obtained >= 61 ? 'B' : obtained >= 51 ? 'C' : obtained >= 41 ? 'D' : 'F';

      marks.push({
        id: `m-${examId}-${student.id}-${subj.id}`,
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.roll,
        examId,
        subjectId: subj.id,
        subjectName: subj.name,
        classId: student.classId,
        sectionId: student.sectionId,
        obtainedMarks: status === 'Absent' ? 0 : obtained,
        maximumMarks: baseMax,
        passingMarks: basePassing,
        grade,
        status: status as MarkEntry['status'],
        remarks: status === 'Absent' ? 'Medical leave' : undefined,
        enteredBy: 't-101',
        createdAt: '2026-05-25T09:00:00Z',
      });
    });
  });
  return marks;
};

const marksExam1 = generateMarks('ex1', allStudents);
const marksExam2 = generateMarks('ex2', allStudents.slice(0, 5));

export const marksSeed: MarkEntry[] = [...marksExam1, ...marksExam2];

// Generate results
const generateResults = (examId: string, studentList: typeof allStudents): StudentResult[] => {
  const examMarks = marksSeed.filter(m => m.examId === examId);
  const totalMax = examMarks.length > 0 ? subjects.length * (examId === 'ex2' ? 50 : 100) : 500;

  return studentList.map((student, idx) => {
    const studentMarks = examMarks.filter(m => m.studentId === student.id);
    const obtained = studentMarks.reduce((sum, m) => sum + m.obtainedMarks, 0);
    const percentage = totalMax > 0 ? (obtained / totalMax) * 100 : 0;
    const gpa = Math.round((percentage / 10) * 10) / 10;
    const finalGrade = percentage >= 91 ? 'A+' : percentage >= 81 ? 'A' : percentage >= 71 ? 'B+' : percentage >= 61 ? 'B' : percentage >= 51 ? 'C' : percentage >= 41 ? 'D' : 'F';

    return {
      id: `r-${examId}-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      examId,
      totalMarks: totalMax,
      obtainedMarks: obtained,
      percentage: Math.round(percentage * 10) / 10,
      gpa,
      finalGrade,
      classRank: 1,
      sectionRank: 1,
      status: 'Published' as const,
      publishedAt: '2026-05-25T10:00:00Z',
    };
  }).map((r, _, arr) => ({
    ...r,
    classRank: arr.filter(x => x.percentage > r.percentage).length + 1,
    sectionRank: arr.filter(x => x.percentage > r.percentage).length + 1,
  }));
};

const resultsExam1 = generateResults('ex1', allStudents);
const resultsExam2 = generateResults('ex2', allStudents.slice(0, 5));

export const resultsSeed: StudentResult[] = [...resultsExam1, ...resultsExam2];

export const gradeRulesSeed: GradeRule[] = [
  { id: 'gr-1', minPercentage: 91, maxPercentage: 100, grade: 'A+', gradePoint: 10, remarks: 'Outstanding' },
  { id: 'gr-2', minPercentage: 81, maxPercentage: 90.99, grade: 'A', gradePoint: 9, remarks: 'Excellent' },
  { id: 'gr-3', minPercentage: 71, maxPercentage: 80.99, grade: 'B+', gradePoint: 8, remarks: 'Very Good' },
  { id: 'gr-4', minPercentage: 61, maxPercentage: 70.99, grade: 'B', gradePoint: 7, remarks: 'Good' },
  { id: 'gr-5', minPercentage: 51, maxPercentage: 60.99, grade: 'C', gradePoint: 6, remarks: 'Satisfactory' },
  { id: 'gr-6', minPercentage: 41, maxPercentage: 50.99, grade: 'D', gradePoint: 5, remarks: 'Below Average' },
  { id: 'gr-7', minPercentage: 0, maxPercentage: 40.99, grade: 'F', gradePoint: 0, remarks: 'Needs Improvement' },
];

export const classData = [
  { id: '10', name: 'Class 10', section: 'A', studentCount: 10 },
  { id: '9', name: 'Class 9', section: 'B', studentCount: 5 },
];