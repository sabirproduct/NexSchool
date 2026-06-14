export type AcademicSessionStatus = 'active' | 'inactive' | 'locked';
export type SubjectType = 'Theory' | 'Practical' | 'Activity' | 'Lab';
export type PeriodType = 'Regular' | 'Break' | 'Lunch';
export type CalendarEventType = 'Holiday' | 'Exam' | 'Event' | 'Meeting';
export type TopicStatus = 'not-started' | 'in-progress' | 'completed';

export interface AcademicSession { id: string; sessionName: string; academicYear: string; startDate: string; endDate: string; status: AcademicSessionStatus; }
export interface SchoolClass { id: string; className: string; classLevel: number; capacity: number; classTeacherId?: string; description?: string; academicSessionId: string; status: 'active'|'inactive'; }
export interface Section { id: string; sectionName: string; classId: string; capacity: number; roomNumber?: string; classTeacherId?: string; }
export interface Subject { id: string; subjectName: string; subjectCode: string; subjectType: SubjectType; description?: string; isOptional: boolean; }
export interface TeacherAssignment { id: string; teacherId: string; teacherName: string; subjectId: string; classId: string; sectionId: string; weeklyPeriodCount: number; }
export interface Period { id: string; periodName: string; startTime: string; endTime: string; type: PeriodType; }
export interface TimetableEntry { id: string; classId: string; sectionId: string; day: 'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday'; periodId: string; subjectId: string; teacherId: string; startTime: string; endTime: string; academicSessionId: string; }
export interface AcademicEvent { id: string; title: string; date: string; type: CalendarEventType; description?: string; }
export interface SyllabusTopic { id: string; subjectId: string; topicName: string; subtopics: string[]; totalClasses: number; completedClasses: number; status: TopicStatus; startDate: string; endDate: string; }
export interface Syllabus { id: string; subjectId: string; classId: string; sectionId: string; academicSessionId: string; topics: SyllabusTopic[]; }