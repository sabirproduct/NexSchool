import { isValidEmail, isValidMobile } from '../utils/validation';
import { Student } from '../types';

export function validateStudentPayload(input: Partial<Student>) {
  const errors: Record<string, string> = {};
  if (!input.firstName) errors.firstName = 'First name is required';
  if (!input.lastName) errors.lastName = 'Last name is required';
  if (!input.mobile || !isValidMobile(input.mobile)) errors.mobile = 'Valid 10-digit mobile required';
  if (input.email && !isValidEmail(input.email)) errors.email = 'Invalid email';
  if (!input.academic?.admissionNo) errors.admissionNo = 'Admission number is required';
  if (!input.academic?.classId) errors.classId = 'Class is required';
  if (!input.academic?.sectionId) errors.sectionId = 'Section is required';
  if (!input.academic?.session) errors.session = 'Session is required';
  if (!input.address?.state) errors.state = 'State is required';
  if (!input.address?.district) errors.district = 'District is required';
  if (!input.address?.city) errors.city = 'City is required';
  if (!input.address?.pinCode) errors.pinCode = 'Pin Code is required';
  return { valid: Object.keys(errors).length === 0, errors };
}
