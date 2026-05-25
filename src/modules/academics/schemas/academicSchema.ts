export interface SessionInput { sessionName: string; academicYear: string; startDate: string; endDate: string; }
export interface SubjectInput { subjectName: string; subjectCode: string; subjectType: 'Theory'|'Practical'|'Activity'|'Lab'; isOptional: boolean; }
export function validateSession(input: SessionInput) {
  const errors: string[] = [];
  if (!input.sessionName || input.sessionName.length < 3) errors.push('Session name is required.');
  if (!/^\d{4}-\d{4}$/.test(input.academicYear)) errors.push('Academic year must match YYYY-YYYY.');
  if (input.startDate >= input.endDate) errors.push('Start date must be before end date.');
  return errors;
}
export function validateSubject(input: SubjectInput) {
  const errors: string[] = [];
  if (!input.subjectName) errors.push('Subject name is required.');
  if (!input.subjectCode || input.subjectCode.length < 3) errors.push('Subject code is required.');
  return errors;
}
