import { create } from 'zustand';
import { Student, StudentFilters } from '../types';
import { listStudents, softDeleteStudent } from '../services/studentService';
import { useAuthStore } from '../../../store/authStore';

type State = { rows: Student[]; total: number; loading: boolean; page: number; pageSize: number; filters: StudentFilters; selectedIds: string[];
  fetch: () => Promise<void>; setFilters: (f: StudentFilters) => void; setPage: (p: number) => void; setPageSize: (s: number) => void; remove: (id: string) => Promise<void>; setSelectedIds: (ids: string[]) => void; };

export const useStudentsStore = create<State>((set, get) => ({
  rows: [], total: 0, loading: false, page: 0, pageSize: 10, filters: {}, selectedIds: [],
  fetch: async () => {
    set({ loading: true });
    const schoolId = useAuthStore.getState().user?.schoolId;
    const { rows, total } = await listStudents(get().filters, get().page, get().pageSize, schoolId);
    set({ rows, total, loading: false });
  },
  setFilters: (filters) => set({ filters, page: 0 }), setPage: (page) => set({ page }), setPageSize: (pageSize) => set({ pageSize, page: 0 }),
  remove: async (id) => { await softDeleteStudent(id); await get().fetch(); }, setSelectedIds: (selectedIds) => set({ selectedIds }),
}));
