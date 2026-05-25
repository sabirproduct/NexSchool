export type StudentType = 'Day Scholar' | 'Residential';
export type AdmissionStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Waiting List' | 'Enrolled';
export type FeeStatus = 'Paid' | 'Pending' | 'Failed';

export interface AdmissionApplication {
  id: string;
  applicationNo: string;
  studentFirstName: string;
  studentLastName: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup?: string;
  religion?: string;
  category?: string;
  studentType: StudentType;
  applyingClassId: string;
  guardianName: string;
  mobile: string;
  email: string;
  hostelRequired: boolean;
  preferredHostel?: string;
  applicationStatus: AdmissionStatus;
  submittedAt?: string;
  reviewedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  admissionFeeStatus: FeeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionFiltersState {
  search: string;
  status?: AdmissionStatus;
  applyingClassId?: string;
  gender?: AdmissionApplication['gender'];
  studentType?: StudentType;
}
