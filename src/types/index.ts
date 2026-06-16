export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'principal'
  | 'teacher'
  | 'accountant'
  | 'hostel_warden'
  | 'student'
  | 'parent';

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
  schoolId: string;
  name?: string;
  studentIds?: string[];
  assignedClassIds?: string[];
}
