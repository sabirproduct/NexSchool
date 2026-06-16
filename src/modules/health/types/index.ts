export type HealthCategory = 'General Checkup' | 'Vaccination' | 'Illness' | 'Injury' | 'Dental' | 'Vision' | 'Menstrual Health' | 'Emergency' | 'Other';
export type HealthSeverity = 'Mild' | 'Moderate' | 'Severe' | 'Emergency';
export type VaccinationStatus = 'Completed' | 'Pending' | 'Overdue' | 'Not Required';

export interface HealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  class: string;
  date: string;
  category: HealthCategory;
  description: string;
  severity: HealthSeverity;
  diagnosis?: string;
  treatment?: string;
  medication?: string;
  followUpDate?: string;
  doctorName?: string;
  clinicVisit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vaccination {
  id: string;
  studentId: string;
  studentName: string;
  vaccinationName: string;
  scheduledDate: string;
  administeredDate?: string;
  status: VaccinationStatus;
  administeredBy?: string;
  batchNo?: string;
  notes?: string;
  createdAt: string;
}

export interface Allergy {
  id: string;
  studentId: string;
  studentName: string;
  allergen: string;
  reaction: string;
  severity: HealthSeverity;
  medication?: string;
  notes?: string;
  createdAt: string;
}

export interface MenstrualHealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  recordDate: string;
  cyclePhase: string;
  symptoms: string[];
  wellnessScore: number; // 1-10
  requiresFollowUp: boolean;
  notes?: string;
  privacyLevel: 'confidential' | 'warden_only' | 'medical_only';
  createdAt: string;
}

export interface HealthDashboardData {
  totalRecords: number;
  recentIllnesses: number;
  upcomingVaccinations: number;
  activeAllergies: number;
  clinicVisitsThisMonth: number;
  emergencyCases: number;
  menstrualHealthAwareness: number;
  monthlyTrend: { month: string; visits: number; emergencies: number }[];
  severityDistribution: { name: string; value: number; color: string }[];
}