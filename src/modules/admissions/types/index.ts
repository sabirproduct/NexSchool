export type StudentType = 'Day Scholar' | 'Residential';
export type AdmissionStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Waiting List' | 'Enrolled';
export type FeeStatus = 'Paid' | 'Pending' | 'Failed';
export type PaymentMethod = 'QR' | 'UPI';

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
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  hostelRequired: boolean;
  preferredHostel?: string;
  applicationStatus: AdmissionStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  admissionFeeStatus: FeeStatus;
  admissionFeeAmount?: number;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  paymentDetails?: {
    transactionId?: string;
    upiId?: string;
    qrScanned?: boolean;
    paidAt?: string;
  };
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