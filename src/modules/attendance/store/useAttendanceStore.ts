import { create } from 'zustand';
import { AttendanceFiltersState, HostelAttendanceRecord, StudentAttendanceRecord, TeacherAttendanceRecord } from '../types';
import { fetchStudentAttendance, fetchHostelAttendance, fetchStaffAttendance } from '../services/attendanceService';
import { getAllDocuments, subscribeToCollection } from '../../../services/firestoreService';
import { db } from '../../../config/firebase';

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
  error: string | null;
  studentRecords: StudentAttendanceRecord[];
  hostelRecords: HostelAttendanceRecord[];
  teacherRecords: TeacherAttendanceRecord[];
  setFilters: (payload: Partial<AttendanceFiltersState>) => void;
  fetchAttendanceData: (schoolId: string) => Promise<void>;
  fetchDataForDate: (schoolId: string, date: string) => Promise<StudentAttendanceRecord[]>;
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

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  filters: { classId: '', sectionId: '', date: new Date().toISOString().split('T')[0], subject: '', hostelId: '', roomId: '' },
  loading: false,
  error: null,
  studentRecords: [],
  hostelRecords: [],
  teacherRecords: [],

  setFilters: (payload) => set((state) => ({ filters: { ...state.filters, ...payload } })),

  fetchAttendanceData: async (schoolId: string) => {
    set({ loading: true, error: null });
    const { filters } = get();
    const today = new Date().toISOString().split('T')[0];
    const date = filters.date || today;

    try {
      if (!db) {
        set({ loading: false, studentRecords: [], hostelRecords: [], teacherRecords: [] });
        return;
      }

      // Fetch student attendance
      let studentRecords: StudentAttendanceRecord[] = [];
      if (filters.classId && filters.sectionId) {
        studentRecords = await fetchStudentAttendance(schoolId, filters.classId, filters.sectionId, date);
      } else {
        // Fetch all for today
        studentRecords = await getAllDocuments<StudentAttendanceRecord>('studentAttendance');
      }

      // Fetch hostel attendance
      let hostelRecords: HostelAttendanceRecord[] = [];
      if (filters.hostelId) {
        const records = await fetchHostelAttendance(schoolId, filters.hostelId, date);
        hostelRecords = records as unknown as HostelAttendanceRecord[];
      } else {
        hostelRecords = await getAllDocuments<HostelAttendanceRecord>('hostelAttendance') as unknown as HostelAttendanceRecord[];
      }

      // Fetch staff/teacher attendance
      let teacherRecords: TeacherAttendanceRecord[] = [];
      teacherRecords = await getAllDocuments<TeacherAttendanceRecord>('teacherAttendance') as unknown as TeacherAttendanceRecord[];

      set({
        studentRecords,
        hostelRecords,
        teacherRecords,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      set({ loading: false, error: 'Failed to fetch attendance data' });
    }
  },

  fetchDataForDate: async (schoolId: string, date: string): Promise<StudentAttendanceRecord[]> => {
    if (!db) return [];
    try {
      const records = await getAllDocuments<StudentAttendanceRecord>('studentAttendance');
      return records.filter(r => r.attendanceDate === date);
    } catch (error) {
      console.error('Error fetching attendance for date:', error);
      return [];
    }
  },
}));

export { computeAnomalies };