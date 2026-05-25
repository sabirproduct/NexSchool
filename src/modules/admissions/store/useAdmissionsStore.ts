import { create } from 'zustand';
import { admissionSeed } from '../mocks/seed';
import { AdmissionApplication, AdmissionFiltersState, AdmissionStatus } from '../types';

interface AdmissionsState {
  applications: AdmissionApplication[];
  filters: AdmissionFiltersState;
  setFilters: (filters: Partial<AdmissionFiltersState>) => void;
  upsertApplication: (application: AdmissionApplication) => void;
  updateStatus: (id: string, status: AdmissionStatus, rejectionReason?: string) => void;
}

export const useAdmissionsStore = create<AdmissionsState>((set) => ({
  applications: admissionSeed,
  filters: { search: '' },
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  upsertApplication: (application) =>
    set((state) => {
      const idx = state.applications.findIndex((item) => item.id === application.id);
      if (idx === -1) return { applications: [application, ...state.applications] };
      const clone = [...state.applications];
      clone[idx] = application;
      return { applications: clone };
    }),
  updateStatus: (id, status, rejectionReason) =>
    set((state) => ({
      applications: state.applications.map((item) =>
        item.id === id
          ? { ...item, applicationStatus: status, rejectionReason, updatedAt: new Date().toISOString() }
          : item
      )
    }))
}));
