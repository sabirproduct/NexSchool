import { create } from 'zustand';
import { AdmissionApplication, AdmissionEnquiry, AdmissionFeeRecord, SystemConfig } from '../types';

interface AdmissionsState {
  applications: AdmissionApplication[];
  enquiries: AdmissionEnquiry[];
  feeRecords: AdmissionFeeRecord[];
  systemConfig: SystemConfig | null;
  loading: boolean;
  error: string | null;
  setApplications: (apps: AdmissionApplication[]) => void;
  setEnquiries: (enqs: AdmissionEnquiry[]) => void;
  setFeeRecords: (fees: AdmissionFeeRecord[]) => void;
  setSystemConfig: (config: SystemConfig | null) => void;
  addApplication: (app: AdmissionApplication) => void;
  updateApplication: (id: string, updates: Partial<AdmissionApplication>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAdmissionsStore = create<AdmissionsState>((set) => ({
  applications: [],
  enquiries: [],
  feeRecords: [],
  systemConfig: null,
  loading: false,
  error: null,
  setApplications: (applications) => set({ applications }),
  setEnquiries: (enquiries) => set({ enquiries }),
  setFeeRecords: (feeRecords) => set({ feeRecords }),
  setSystemConfig: (systemConfig) => set({ systemConfig }),
  addApplication: (app) =>
    set((state) => ({ applications: [app, ...state.applications] })),
  updateApplication: (id, updates) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updates } : app
      ),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));