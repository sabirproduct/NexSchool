import type { AdmissionApplication } from '../types';

export interface ValidationResult { valid: boolean; errors: string[]; }

export function validateAdmissionApplication(payload: Partial<AdmissionApplication>): ValidationResult {
  const errors: string[] = [];
  if (!payload.studentFirstName) errors.push('First name is required');
  if (!payload.mobile || payload.mobile.length < 10) errors.push('Valid mobile is required');
  if (!payload.email?.includes('@')) errors.push('Valid email is required');
  if (!payload.applyingClassId) errors.push('Applying class is required');
  if (!payload.guardianName) errors.push('Guardian name is required');
  return { valid: errors.length === 0, errors };
}
