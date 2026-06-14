export type FeeCategory = 'Tuition' | 'Hostel' | 'Transport' | 'Admission' | 'Library' | 'Sports' | 'Lab' | 'Development' | 'Miscellaneous';
export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid' | 'Overdue' | 'Waived';
export type PaymentMode = 'Cash' | 'Cheque' | 'Online Transfer' | 'UPI' | 'DD' | 'Card' | 'Razorpay';
export type FeeFrequency = 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Annual' | 'One-Time';

export interface FeeStructure {
  id: string;
  feeName: string;
  category: FeeCategory;
  frequency: FeeFrequency;
  amount: number;
  description?: string;
  applicableClasses: string[];
  isMandatory: boolean;
  dueDay: number;
  lateFeePerDay: number;
  academicSession: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeAssignment {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  classId: string;
  sectionId: string;
  feeStructureId: string;
  feeName: string;
  category: FeeCategory;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: PaymentStatus;
  installments: FeeInstallment[];
  createdAt: string;
  updatedAt: string;
}

export interface FeeInstallment {
  id: string;
  paidAmount: number;
  paymentMode: PaymentMode;
  transactionId?: string;
  paidDate: string;
  receiptNumber: string;
  remarks?: string;
  fineAmount: number;
  paidBy: string;
}

export interface FeeCollection {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  classId: string;
  sectionId: string;
  feeStructureId: string;
  feeName: string;
  category: FeeCategory;
  amount: number;
  paymentMode: PaymentMode;
  transactionId?: string;
  receiptNumber: string;
  paidDate: string;
  fineAmount: number;
  status: PaymentStatus;
  collectedBy: string;
  remarks?: string;
}

export interface MonthlyCollection {
  month: string;
  monthLabel: string;
  year: number;
  totalCollected: number;
  totalPending: number;
  totalDue: number;
  count: number;
}

export interface FeeDelayRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  classId: string;
  sectionId: string;
  feeName: string;
  dueDate: string;
  dueAmount: number;
  overdueDays: number;
  lateFee: number;
  status: PaymentStatus;
}

export interface ClassWiseCollection {
  classId: string;
  totalStudents: number;
  totalDue: number;
  totalCollected: number;
  collectionPct: number;
  pendingCount: number;
}

export interface AIFeeReport {
  overallHealth: string;
  collectionEfficiency: string;
  riskAssessment: string;
  topDelinquents: string[];
  recommendations: string[];
  predictedCollection: string;
  feeUtilization: string;
  insights: string[];
}