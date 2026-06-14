export type HostelFloor = 'Ground' | 'First' | 'Second' | 'Third' | 'Fourth';
export type HostelGender = 'Boys' | 'Girls';
export type RoomType = 'Dormitory' | 'Twin Sharing' | 'Triple Sharing' | 'Single';
export type BedStatus = 'Available' | 'Occupied' | 'Maintenance';
export type ComplaintCategory = 'Maintenance' | 'Cleanliness' | 'Food' | 'Electricity' | 'Plumbing' | 'Furniture' | 'Security' | 'Other';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';

export interface HostelBlock {
  id: string;
  blockName: string;
  gender: HostelGender;
  wardenName: string;
  wardenContact: string;
  totalRooms: number;
  totalCapacity: number;
  currentOccupancy: number;
  caretakerName: string;
  caretakerContact: string;
  address: string;
  amenities: string[];
}

export interface HostelRoom {
  id: string;
  blockId: string;
  roomNumber: string;
  floor: HostelFloor;
  roomType: RoomType;
  totalBeds: number;
  occupiedBeds: number;
  isActive: boolean;
  rentPerBed: number;
  description?: string;
}

export interface HostelBed {
  id: string;
  roomId: string;
  blockId: string;
  bedLabel: string;
  status: BedStatus;
  allocatedTo?: string;
  allocatedStudentName?: string;
  allocationDate?: string;
  monthlyRent: number;
}

export interface HostelAllocation {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  classId: string;
  sectionId: string;
  blockId: string;
  roomId: string;
  bedId: string;
  roomNumber: string;
  blockName: string;
  allocationDate: string;
  endDate?: string;
  isActive: boolean;
  monthlyRent: number;
  depositPaid: number;
  remarks?: string;
}

export interface MessMenu {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  mealType: MealType;
  items: string[];
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface HostelComplaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  blockName: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  subject: string;
  description: string;
  filedDate: string;
  resolvedDate?: string;
  resolvedBy?: string;
  remarks?: string;
}

export interface MonthlyOccupancy {
  month: string;
  monthLabel: string;
  year: number;
  totalCapacity: number;
  occupied: number;
  vacant: number;
  occupancyPct: number;
}

export interface BlockWiseOccupancy {
  blockId: string;
  blockName: string;
  totalCapacity: number;
  currentOccupancy: number;
  occupancyPct: number;
  totalRooms: number;
  gender: HostelGender;
}

export interface AIHostelReport {
  overallOccupancy: string;
  occupancyTrend: string;
  complaintAnalysis: string;
  topComplaints: string[];
  revenueAnalysis: string;
  recommendations: string[];
  insights: string[];
}