import { UserRole } from '../types';

export const roleModules: Record<UserRole, string[]> = {
  super_admin: ['all'],
  school_admin: ['dashboard','students','admissions','attendance','academics','exams','fees','hostel','notifications'],
  principal: ['dashboard','students','attendance','academics','exams','notifications'],
  teacher: ['dashboard','attendance','academics','exams','notifications'],
  accountant: ['dashboard','fees','notifications'],
  hostel_warden: ['dashboard','hostel','attendance','notifications'],
  student: ['student','dashboard'],
  parent: ['parent','dashboard'],
};
