export type ScholarshipStatus = 'Applied' | 'Approved' | 'Disbursed' | 'Rejected' | 'Pending Documents';
export type SchemeType = 'Central Government' | 'State Government' | 'Private Trust' | 'NGO' | 'School Fund';

export interface ScholarshipScheme {
  id: string;
  schemeName: string;
  schemeType: SchemeType;
  provider: string;
  description: string;
  amount: number;
  eligibilityCriteria: string;
  requiredDocuments: string[];
  applicationDeadline: string;
  isActive: boolean;
  academicSession: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScholarshipApplication {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  class: string;
  schemeId: string;
  schemeName: string;
  schemeType: SchemeType;
  amount: number;
  applicationDate: string;
  status: ScholarshipStatus;
  documentsSubmitted: string[];
  remarks?: string;
  approvedDate?: string;
  disbursedDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVaultItem {
  id: string;
  studentId: string;
  studentName: string;
  documentType: 'Birth Certificate' | 'Aadhaar Card' | 'Transfer Certificate' | 'Scholarship Doc' | 'Income Certificate' | 'Caste Certificate' | 'Medical Report' | 'Fee Receipt' | 'Other';
  documentName: string;
  fileUrl?: string;
  uploadedDate: string;
  expiryDate?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface GovernmentAidRecord {
  id: string;
  studentId: string;
  studentName: string;
  aidType: 'Scholarship' | 'Uniform Grant' | 'Textbook Grant' | 'Mid-Day Meal' | 'Transport Subsidy' | 'Other';
  schemeName: string;
  provider: string;
  amount: number;
  applicationDate: string;
  approvalDate?: string;
  status: ScholarshipStatus;
  fiscalYear: string;
  remarks?: string;
  createdAt: string;
}

export interface ScholarshipDashboardData {
  totalSchemes: number;
  activeApplications: number;
  totalDisbursed: number;
  totalAwarded: number;
  pendingDocuments: number;
  governmentSchemesTracked: number;
  approvedThisMonth: number;
  documentsStored: number;
  schemeDistribution: { name: string; value: number; color: string }[];
  monthlyDisbursement: { month: string; amount: number; count: number }[];
}