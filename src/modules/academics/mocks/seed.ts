import { AcademicEvent, AcademicSession, Period, SchoolClass, Section, Subject, TeacherAssignment, TimetableEntry } from '../types';
export const academicSessions: AcademicSession[] = [{ id:'s1', sessionName:'2026-2027', academicYear:'2026-2027', startDate:'2026-04-01', endDate:'2027-03-31', status:'active' }];
export const classes: SchoolClass[] = [{ id:'c1', className:'Class 10', classLevel:10, capacity:45, classTeacherId:'t1', academicSessionId:'s1', status:'active' }];
export const sections: Section[] = [{ id:'sec1', sectionName:'A', classId:'c1', capacity:40, roomNumber:'R-204', classTeacherId:'t1' }];
export const subjects: Subject[] = [{ id:'sub1', subjectName:'Mathematics', subjectCode:'MTH101', subjectType:'Theory', isOptional:false },{ id:'sub2', subjectName:'Computer Lab', subjectCode:'CSL201', subjectType:'Lab', isOptional:false }];
export const assignments: TeacherAssignment[] = [{ id:'a1', teacherId:'t1', teacherName:'Aarav Sharma', subjectId:'sub1', classId:'c1', sectionId:'sec1', weeklyPeriodCount:6 }];
export const periods: Period[] = [{ id:'p1', periodName:'P1', startTime:'08:00', endTime:'08:40', type:'Regular' },{ id:'p2', periodName:'P2', startTime:'08:40', endTime:'09:20', type:'Regular' },{ id:'p3', periodName:'Break', startTime:'09:20', endTime:'09:40', type:'Break' }];
export const timetable: TimetableEntry[] = [{ id:'tt1', classId:'c1', sectionId:'sec1', day:'Monday', periodId:'p1', subjectId:'sub1', teacherId:'t1', startTime:'08:00', endTime:'08:40', academicSessionId:'s1' }];
export const events: AcademicEvent[] = [{ id:'e1', title:'Unit Test', date:'2026-06-15', type:'Exam' },{ id:'e2', title:'PTM', date:'2026-06-28', type:'Meeting' }];
