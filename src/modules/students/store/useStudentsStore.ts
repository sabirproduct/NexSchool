import { create } from 'zustand';
import { Student, StudentFilters } from '../types';
import { listStudents, hardDeleteStudent } from '../services/studentService';
import { useAuthStore } from '../../../store/authStore';

type State = {
  rows: Student[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  filters: StudentFilters;
  selectedIds: string[];
  fetch: () => Promise<void>;
  setFilters: (f: StudentFilters) => void;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  remove: (id: string) => Promise<void>;
  setSelectedIds: (ids: string[]) => void;
  clearError: () => void;
};

export const useStudentsStore = create<State>((set, get) => ({
  rows: [],
  total: 0,
  loading: false,
  error: null,
  page: 0,
  pageSize: 10,
  filters: {},
  selectedIds: [],
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const schoolId = useAuthStore.getState().user?.schoolId;
      const { rows, total } = await listStudents(get().filters, get().page, get().pageSize, schoolId);
      set({ rows, total, loading: false });
    } catch (err: any) {
      set({
        rows: [],
        total: 0,
        loading: false,
        error: err?.message || 'Failed to load students. Please try again.',
      });
    }
  },
  setFilters: (filters) => set({ filters, page: 0 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 0 }),
  remove: async (id) => { await hardDeleteStudent(id); await get().fetch(); },
  setSelectedIds: (selectedIds) => set({ selectedIds }),
  clearError: () => set({ error: null }),
}));
