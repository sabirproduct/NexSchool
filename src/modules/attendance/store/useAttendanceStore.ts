import { create } from 'zustand';
import { studentAttendanceSeed, teacherAttendanceSeed, hostelAttendanceSeed } from '../mocks/seed';
import { AttendanceFiltersState, HostelAttendanceRecord, StudentAttendanceRecord, TeacherAttendanceRecord } from '../types';

export interface AnomalyRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  classId: string;
  sectionId: string;
  anomalyType: 'Frequent Absent' | 'Frequent Late' | 'Consecutive Missing';
  occurrences: number;
  totalDays: number;
  percentage: number;
}

interface AttendanceState {
  filters: AttendanceFiltersState;
  loading: boolean;
  studentRecords: StudentAttendanceRecord[];
  hostelRecords: HostelAttendanceRecord[];
  teacherRecords: TeacherAttendanceRecord[];
  setFilters: (payload: Partial<AttendanceFiltersState>) => void;
}

function computeAnomalies(records: StudentAttendanceRecord[]): AnomalyRecord[] {
  const totalDays = records.length || 1;
  const studentMap = new Map<string, StudentAttendanceRecord[]>();
  for (const r of records) {
    const key = r.studentId;
    if (!studentMap.has(key)) studentMap.set(key, []);
    studentMap.get(key)!.push(r);
  }

  const anomalies: AnomalyRecord[] = [];
  for (const [, studentRecords] of studentMap) {
    // For mock data, each student appears once, so analyze individually
    const sr = studentRecords[0];
    if (!sr) continue;

    const absentCount = studentRecords.filter((r) => r.status === 'Absent').length;
    const lateCount = studentRecords.filter((r) => r.status === 'Late').length;
    const totalStudentDays = studentRecords.length;

    if (absentCount > 0) {
      anomalies.push({
        studentId: sr.studentId,
        studentName: sr.studentName,
        rollNumber: sr.rollNumber,
        classId: sr.classId,
        sectionId: sr.sectionId,
        anomalyType: 'Frequent Absent',
        occurrences: absentCount,
        totalDays: totalStudentDays,
        percentage: Math.round((absentCount / totalDays) * 100),
      });
    }
    if (lateCount > 0) {
      anomalies.push({
        studentId: sr.studentId,
        studentName: sr.studentName,
        rollNumber: sr.rollNumber,
        classId: sr.classId,
        sectionId: sr.sectionId,
        anomalyType: 'Frequent Late',
        occurrences: lateCount,
        totalDays: totalStudentDays,
        percentage: Math.round((lateCount / totalDays) * 100),
      });
    }
  }

  return anomalies.sort((a, b) => b.occurrences - a.occurrences);
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  filters: { classId: '10', sectionId: 'A', date: '2026-05-25', subject: '', hostelId: '', roomId: '' },
  loading: false,
  studentRecords: studentAttendanceSeed,
  hostelRecords: hostelAttendanceSeed,
  teacherRecords: teacherAttendanceSeed,
  setFilters: (payload) => set((state) => ({ filters: { ...state.filters, ...payload } })),
}));

export { computeAnomalies };