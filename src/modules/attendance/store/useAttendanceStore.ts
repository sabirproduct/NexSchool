import { create } from 'zustand';
import { studentAttendanceSeed, teacherAttendanceSeed, hostelAttendanceSeed } from '../mocks/seed';
import { AttendanceFiltersState, HostelAttendanceRecord, StudentAttendanceRecord, TeacherAttendanceRecord } from '../types';

interface AttendanceState {
  filters: AttendanceFiltersState;
  loading: boolean;
  studentRecords: StudentAttendanceRecord[];
  hostelRecords: HostelAttendanceRecord[];
  teacherRecords: TeacherAttendanceRecord[];
  setFilters: (payload: Partial<AttendanceFiltersState>) => void;
  setStudentStatus: (attendanceId: string, status: StudentAttendanceRecord['status'], remarks?: string) => void;
  markAllPresent: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  filters: { classId: '10', sectionId: 'A', date: '2026-05-25', subject: '', hostelId: '', roomId: '' },
  loading: false,
  studentRecords: studentAttendanceSeed,
  hostelRecords: hostelAttendanceSeed,
  teacherRecords: teacherAttendanceSeed,
  setFilters: (payload) => set((state) => ({ filters: { ...state.filters, ...payload } })),
  setStudentStatus: (attendanceId, status, remarks) =>
    set((state) => ({
      studentRecords: state.studentRecords.map((record) => (record.attendanceId === attendanceId ? { ...record, status, remarks } : record))
    })),
  markAllPresent: () => set((state) => ({ studentRecords: state.studentRecords.map((record) => ({ ...record, status: 'Present' })) }))
}));
