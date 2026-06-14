import { AcademicEvent, AcademicSession, Period, SchoolClass, Section, Subject, Syllabus, TeacherAssignment, TimetableEntry } from '../types';

export const academicSessions: AcademicSession[] = [
  { id:'s1', sessionName:'2026-2027', academicYear:'2026-2027', startDate:'2026-04-01', endDate:'2027-03-31', status:'active' },
  { id:'s2', sessionName:'2025-2026', academicYear:'2025-2026', startDate:'2025-04-01', endDate:'2026-03-31', status:'inactive' },
];
export const classes: SchoolClass[] = [
  { id:'c1', className:'Class 10', classLevel:10, capacity:45, classTeacherId:'t1', academicSessionId:'s1', status:'active' },
  { id:'c2', className:'Class 9', classLevel:9, capacity:50, classTeacherId:'t2', academicSessionId:'s1', status:'active' },
  { id:'c3', className:'Class 8', classLevel:8, capacity:48, classTeacherId:'t3', academicSessionId:'s1', status:'active' },
];
export const sections: Section[] = [
  { id:'sec1', sectionName:'A', classId:'c1', capacity:40, roomNumber:'R-204', classTeacherId:'t1' },
  { id:'sec2', sectionName:'B', classId:'c1', capacity:38, roomNumber:'R-205', classTeacherId:'t4' },
  { id:'sec3', sectionName:'A', classId:'c2', capacity:42, roomNumber:'R-104', classTeacherId:'t2' },
  { id:'sec4', sectionName:'A', classId:'c3', capacity:44, roomNumber:'R-002', classTeacherId:'t3' },
];
export const subjects: Subject[] = [
  { id:'sub1', subjectName:'Mathematics', subjectCode:'MTH101', subjectType:'Theory', isOptional:false },
  { id:'sub2', subjectName:'Computer Lab', subjectCode:'CSL201', subjectType:'Lab', isOptional:false },
  { id:'sub3', subjectName:'English', subjectCode:'ENG101', subjectType:'Theory', isOptional:false },
  { id:'sub4', subjectName:'Physics', subjectCode:'PHY101', subjectType:'Theory', isOptional:false },
  { id:'sub5', subjectName:'Chemistry Lab', subjectCode:'CHL201', subjectType:'Lab', isOptional:false },
  { id:'sub6', subjectName:'Physical Education', subjectCode:'PED101', subjectType:'Activity', isOptional:true },
];
export const assignments: TeacherAssignment[] = [
  { id:'a1', teacherId:'t1', teacherName:'Aarav Sharma', subjectId:'sub1', classId:'c1', sectionId:'sec1', weeklyPeriodCount:6 },
  { id:'a2', teacherId:'t2', teacherName:'Priya Patel', subjectId:'sub3', classId:'c2', sectionId:'sec3', weeklyPeriodCount:5 },
  { id:'a3', teacherId:'t3', teacherName:'Rajesh Kumar', subjectId:'sub4', classId:'c3', sectionId:'sec4', weeklyPeriodCount:4 },
  { id:'a4', teacherId:'t4', teacherName:'Sneha Reddy', subjectId:'sub2', classId:'c1', sectionId:'sec2', weeklyPeriodCount:3 },
  { id:'a5', teacherId:'t5', teacherName:'Vikram Singh', subjectId:'sub5', classId:'c2', sectionId:'sec3', weeklyPeriodCount:3 },
];
export const periods: Period[] = [
  { id:'p1', periodName:'P1', startTime:'08:00', endTime:'08:40', type:'Regular' },
  { id:'p2', periodName:'P2', startTime:'08:40', endTime:'09:20', type:'Regular' },
  { id:'p3', periodName:'Break', startTime:'09:20', endTime:'09:40', type:'Break' },
  { id:'p4', periodName:'P3', startTime:'09:40', endTime:'10:20', type:'Regular' },
  { id:'p5', periodName:'P4', startTime:'10:20', endTime:'11:00', type:'Regular' },
  { id:'p6', periodName:'Lunch', startTime:'11:00', endTime:'11:40', type:'Lunch' },
  { id:'p7', periodName:'P5', startTime:'11:40', endTime:'12:20', type:'Regular' },
  { id:'p8', periodName:'P6', startTime:'12:20', endTime:'13:00', type:'Regular' },
];
const days: ('Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday')[] = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const periodSlots = ['p1','p2','p4','p5','p7','p8'];

let ttCounter = 1;
export const timetable: TimetableEntry[] = assignments.flatMap((a) =>
  Array.from({ length: a.weeklyPeriodCount }, (_, i) => {
    const entry: TimetableEntry = {
      id: `tt${ttCounter++}`,
      classId: a.classId,
      sectionId: a.sectionId,
      day: days[i % days.length],
      periodId: periodSlots[i % periodSlots.length],
      subjectId: a.subjectId,
      teacherId: a.teacherId,
      startTime: periods.find((p) => p.id === periodSlots[i % periodSlots.length])?.startTime ?? '08:00',
      endTime: periods.find((p) => p.id === periodSlots[i % periodSlots.length])?.endTime ?? '08:40',
      academicSessionId: 's1',
    };
    return entry;
  })
);

export const syllabuses: Syllabus[] = [
  {
    id: 'syl1',
    subjectId: 'sub1',
    classId: 'c1',
    sectionId: 'sec1',
    academicSessionId: 's1',
    topics: [
      { id: 'top1', subjectId: 'sub1', topicName: 'Algebra Basics', subtopics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'], totalClasses: 12, completedClasses: 8, status: 'in-progress', startDate: '2026-04-05', endDate: '2026-05-10' },
      { id: 'top2', subjectId: 'sub1', topicName: 'Geometry', subtopics: ['Triangles', 'Circles', 'Coordinate Geometry'], totalClasses: 15, completedClasses: 15, status: 'completed', startDate: '2026-05-11', endDate: '2026-06-20' },
      { id: 'top3', subjectId: 'sub1', topicName: 'Trigonometry', subtopics: ['Ratios', 'Identities', 'Heights & Distances'], totalClasses: 10, completedClasses: 2, status: 'in-progress', startDate: '2026-06-21', endDate: '2026-07-15' },
      { id: 'top4', subjectId: 'sub1', topicName: 'Statistics', subtopics: ['Mean', 'Median', 'Mode', 'Probability'], totalClasses: 8, completedClasses: 0, status: 'not-started', startDate: '2026-07-16', endDate: '2026-08-10' },
    ],
  },
  {
    id: 'syl2',
    subjectId: 'sub3',
    classId: 'c2',
    sectionId: 'sec3',
    academicSessionId: 's1',
    topics: [
      { id: 'top5', subjectId: 'sub3', topicName: 'Grammar', subtopics: ['Tenses', 'Voice', 'Narration'], totalClasses: 10, completedClasses: 10, status: 'completed', startDate: '2026-04-05', endDate: '2026-05-05' },
      { id: 'top6', subjectId: 'sub3', topicName: 'Literature', subtopics: ['Poetry', 'Prose', 'Drama'], totalClasses: 14, completedClasses: 6, status: 'in-progress', startDate: '2026-05-06', endDate: '2026-06-25' },
      { id: 'top7', subjectId: 'sub3', topicName: 'Writing Skills', subtopics: ['Essays', 'Letters', 'Comprehension'], totalClasses: 8, completedClasses: 1, status: 'in-progress', startDate: '2026-06-26', endDate: '2026-07-20' },
    ],
  },
];

export const events: AcademicEvent[] = [
  { id:'e1', title:'Unit Test 1', date:'2026-06-15', type:'Exam' },
  { id:'e2', title:'PTM', date:'2026-06-28', type:'Meeting' },
  { id:'e3', title:'Independence Day', date:'2026-08-15', type:'Holiday' },
  { id:'e4', title:'Science Fair', date:'2026-09-10', type:'Event' },
];