import { create } from 'zustand';
import { academicSessions, assignments, classes, events, periods, sections, subjects, timetable } from '../mocks/seed';
import { AcademicEvent, AcademicSession, Period, SchoolClass, Section, Subject, TeacherAssignment, TimetableEntry } from '../types';
interface State { sessions: AcademicSession[]; classes: SchoolClass[]; sections: Section[]; subjects: Subject[]; assignments: TeacherAssignment[]; periods: Period[]; timetable: TimetableEntry[]; events: AcademicEvent[]; activeSessionId: string; setActiveSession: (id:string)=>void; addSubject:(s:Subject)=>void; }
export const useAcademicsStore = create<State>((set)=>({ sessions: academicSessions, classes, sections, subjects, assignments, periods, timetable, events, activeSessionId:'s1', setActiveSession:(id)=>set({activeSessionId:id,sessions:academicSessions.map((s)=>({...s,status:s.id===id?'active':'inactive'}))}), addSubject:(subject)=>set((st)=>({subjects:[subject,...st.subjects]})) }));
