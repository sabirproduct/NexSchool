export type SafetyEventType = 'Late Return' | 'Unauthorized Leave' | 'Emergency' | 'Visitor' | 'Night Attendance' | 'Gate Entry' | 'Gate Exit';
export type SafetyStatus = 'Safe' | 'Alert' | 'Critical' | 'Resolved';

export interface SafetyCheckIn {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  class: string;
  blockId: string;
  blockName: string;
  eventType: SafetyEventType;
  status: SafetyStatus;
  timestamp: string;
  location: string;
  notes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  parentNotified: boolean;
  createdAt: string;
}

export interface VisitorLog {
  id: string;
  visitorName: string;
  visitorType: 'Parent' | 'Guardian' | 'Relative' | 'Other';
  studentId?: string;
  studentName?: string;
  relation?: string;
  phoneNumber: string;
  purpose: string;
  checkIn: string;
  checkOut?: string;
  idCardNumber?: string;
  verifiedBy: string;
  createdAt: string;
}

export interface NightAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  blockId: string;
  blockName: string;
  roomNumber: string;
  bedNumber: string;
  date: string;
  rollCallTime: string;
  present: boolean;
  verifiedBy: string;
  remarks?: string;
  parentNotified?: boolean;
  createdAt: string;
}

export interface SafetyDashboardData {
  totalStudentsTracked: number;
  inHostel: number;
  outOfHostel: number;
  lateReturnsToday: number;
  visitorsToday: number;
  pendingAlerts: number;
  emergencyContactsAccessed: number;
  nightAttendancePending: number;
  monthlyIncidents: { month: string; alerts: number; emergencies: number }[];
  statusDistribution: { name: string; value: number; color: string }[];
}