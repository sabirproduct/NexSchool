export interface SystemUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: string;
  schoolId: string;
  schoolName: string;
  status: 'active' | 'inactive';
  lastLogin: string | null;
  createdAt: string;
}

export interface SystemRole {
  id: string;
  name: string;
  key: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

export const SYSTEM_ROLES = [
  { key: 'super_admin', name: 'Super Admin', description: 'Full system access across all schools', isSystem: true },
  { key: 'school_admin', name: 'School Admin', description: 'Complete school-level administration', isSystem: true },
  { key: 'principal', name: 'Principal', description: 'Academic leadership & oversight', isSystem: true },
  { key: 'teacher', name: 'Teacher', description: 'Classroom & subject management', isSystem: true },
  { key: 'accountant', name: 'Accountant', description: 'Fee & financial management', isSystem: true },
  { key: 'hostel_warden', name: 'Hostel Warden', description: 'Hostel & dormitory management', isSystem: true },
  { key: 'student', name: 'Student', description: 'Student portal access', isSystem: true },
  { key: 'parent', name: 'Parent', description: 'Parent portal access', isSystem: true },
  { key: 'gate_keeper', name: 'Gate Keeper', description: 'QR attendance scanning & gate management', isSystem: true },
] as const;
