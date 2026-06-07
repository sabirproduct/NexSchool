export type StudentType = 'day_scholar' | 'residential';
export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'transferred';
export type StudentSortBy = 'name' | 'admissionDate' | 'rollNo';
export type SortOrder = 'asc' | 'desc';

export interface ParentInfo {
  fatherName: string;
  motherName: string;
  guardianName: string;
  guardianMobile: string;
  guardianEmail?: string;
  occupation?: string;
  annualIncome?: string;
}
export interface AddressInfo { addressLine: string; state: string; district: string; city: string; pinCode: string; }
export interface AcademicInfo {
  admissionNo: string; rollNo: string; admissionDate: string; classId: string; sectionId: string; session: string; previousSchool?: string; studentType: StudentType;
}
export const CLASS_OPTIONS = [
  'Playgroup', 'Nursery', 'LKG', 'UKG',
  'Standard 1', 'Standard 2', 'Standard 3', 'Standard 4', 'Standard 5',
  'Standard 6', 'Standard 7', 'Standard 8', 'Standard 9', 'Standard 10',
] as const;
export const SECTION_OPTIONS = ['A', 'B', 'C', 'D'] as const;
export const SESSION_OPTIONS = ['2026-2027', '2027-2028', '2028-2029', '2029-2030', '2030-2031'] as const;
export interface HostelInfo { hostelName: string; roomNo: string; bedNo: string; wardenName: string; joiningDate: string; }
export interface Student {
  id: string; firstName: string; lastName: string; fullName: string; gender: 'male'|'female'|'other'; dob: string; bloodGroup?: string;
  religion?: string; category?: string; aadhaarNo?: string; mobile: string; email?: string; photoUrl?: string;
  schoolId?: string; parent: ParentInfo; academic: AcademicInfo; address: AddressInfo; hostel?: HostelInfo; status: StudentStatus; createdAt: string; updatedAt: string; createdBy: string;
}
export interface StudentDocument { id: string; studentId: string; label: string; url: string; mimeType: string; createdAt: string; }
export interface StudentFilters { classId?: string; sectionId?: string; gender?: string; status?: StudentStatus; studentType?: StudentType; search?: string; sortBy?: StudentSortBy; sortOrder?: SortOrder; }
