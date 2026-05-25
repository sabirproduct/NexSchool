import { create } from 'zustand';
import { examScheduleSeed, examSeed, gradeRulesSeed, marksSeed, resultsSeed } from '../mocks/seed';
import { Exam, ExamStatus, GradeRule, MarkEntry, StudentResult } from '../types';

interface ExamState {
  loading: boolean;
  exams: Exam[];
  schedules: typeof examScheduleSeed;
  marks: MarkEntry[];
  results: StudentResult[];
  gradeRules: GradeRule[];
  updateExamStatus: (examId: string, status: ExamStatus) => void;
  upsertMark: (payload: MarkEntry) => void;
  publishResult: (resultId: string) => void;
}

export const useExamStore = create<ExamState>((set) => ({
  loading: false,
  exams: examSeed,
  schedules: examScheduleSeed,
  marks: marksSeed,
  results: resultsSeed,
  gradeRules: gradeRulesSeed,
  updateExamStatus: (examId, status) => set((state) => ({ exams: state.exams.map((exam) => (exam.id === examId ? { ...exam, status } : exam)) })),
  upsertMark: (payload) =>
    set((state) => {
      const existing = state.marks.some((mark) => mark.id === payload.id);
      if (existing) {
        return { marks: state.marks.map((mark) => (mark.id === payload.id ? payload : mark)) };
      }
      return { marks: [...state.marks, payload] };
    }),
  publishResult: (resultId) =>
    set((state) => ({
      results: state.results.map((result) =>
        result.id === resultId ? { ...result, status: 'Published', publishedAt: new Date().toISOString() } : result
      )
    }))
}));
