import { UserRole } from '../types';

export const roleModules: Record<UserRole, string[]> = {
  super_admin: ['all'],
  school_admin: ['dashboard','students','admissions','attendance','academics','exams','fees','hostel','safety','health','scholarship','notifications','system'],
  principal: ['dashboard','students','admissions','attendance','academics','exams','fees','hostel','safety','health','scholarship','notifications'],
  teacher: ['dashboard','attendance','academics','exams','notifications'],
  accountant: ['dashboard','fees','notifications'],
  hostel_warden: ['dashboard','hostel','attendance','safety','health','notifications'],
  student: ['student','dashboard'],
  parent: ['parent','dashboard'],
};
