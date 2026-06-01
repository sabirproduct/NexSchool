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
export interface HostelInfo { hostelName: string; roomNo: string; bedNo: string; wardenName: string; joiningDate: string; }
export interface Student {
  id: string; firstName: string; lastName: string; fullName: string; gender: 'male'|'female'|'other'; dob: string; bloodGroup?: string;
  religion?: string; category?: string; aadhaarNo?: string; mobile: string; email?: string; photoUrl?: string;
  schoolId?: string; parent: ParentInfo; academic: AcademicInfo; address: AddressInfo; hostel?: HostelInfo; status: StudentStatus; createdAt: string; updatedAt: string; createdBy: string;
}
export interface StudentDocument { id: string; studentId: string; label: string; url: string; mimeType: string; createdAt: string; }
export interface StudentFilters { classId?: string; sectionId?: string; gender?: string; status?: StudentStatus; studentType?: StudentType; search?: string; sortBy?: StudentSortBy; sortOrder?: SortOrder; }
