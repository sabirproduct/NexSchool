import { ExamType, MarkStatus } from '../types';

export interface ExamFormInput {
  examName: string;
  examType: ExamType;
  academicSessionId: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export function validateExamForm(input: ExamFormInput): string[] {
  const errors: string[] = [];
  if (!input.examName || input.examName.trim().length < 3) errors.push('Exam name must be at least 3 characters');
  if (!input.academicSessionId) errors.push('Academic session is required');
  if (!input.startDate || !input.endDate) errors.push('Start and end dates are required');
  if (input.startDate > input.endDate) errors.push('Start date should be before end date');
  return errors;
}

export function validateMarksInput(obtainedMarks: number, maximumMarks: number, _status: MarkStatus): string[] {
  const errors: string[] = [];
  if (obtainedMarks < 0) errors.push('Obtained marks cannot be negative');
  if (obtainedMarks > maximumMarks) errors.push('Obtained marks cannot exceed maximum marks');
  return errors;
}
