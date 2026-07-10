export type StudentType = 'Day Scholar' | 'Residential';
export type AdmissionStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Waiting List' | 'Enrolled';
export type FeeStatus = 'Paid' | 'Pending' | 'Failed';
export type PaymentMethod = 'QR' | 'UPI' | 'Cash';

export const RELIGION_OPTIONS = [
  'Hinduism',
  'Islam',
  'Christianity',
  'Sikhism',
  'Buddhism',
  'Jainism',
  'Zoroastrianism',
  'Judaism',
  'Other',
] as const;

export interface AdmissionApplication {
  id: string;
  applicationNo: string;
  tenantId: string;
  studentFirstName: string;
  studentLastName: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string | null;
  religion: string | null;
  category: string | null;
  studentType: StudentType;
  applyingClassId: string;
  guardianName: string;
  guardianMobile: string | null;
  mobile: string;
  email: string;
  address: string | null;
  city: string | null;
  state: string | null;
  district: string | null;
  pincode: string | null;
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
    cashReceivedBy?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionEnquiry {
  id: string;
  tenantId: string;
  studentName: string;
  guardianName: string;
  mobile: string;
  email?: string;
  applyingClassId: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Admission' | 'Closed';
  followUpDate?: string;
  notes?: string;
  convertedToApplicationId?: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionFeeRecord {
  id: string;
  tenantId: string;
  applicationId: string;
  applicationNo: string;
  studentName: string;
  feeAmount: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  paymentDetails?: {
    transactionId?: string;
    upiId?: string;
    cashReceivedBy?: string;
    paidAt?: string;
  };
  status: FeeStatus;
  createdAt: string;
}

export interface SystemConfig {
  upiId: string;
  upiKeyword: string;
  admissionFee: number;
  tenantId: string;
}

export interface AdmissionFiltersState {
  search: string;
  status?: AdmissionStatus;
  applyingClassId?: string;
  gender?: AdmissionApplication['gender'];
  studentType?: StudentType;
}