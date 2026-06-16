export type TransportType = 'Bus' | 'Van' | 'Auto' | 'Walking';
export type RouteStatus = 'Active' | 'Inactive' | 'Maintenance';
export type BoardingStatus = 'Onboard' | 'Dropped' | 'Absent' | 'Not Scheduled';

export interface BusRoute {
  id: string;
  routeName: string;
  routeNumber: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  conductorName?: string;
  capacity: number;
  currentStudents: number;
  status: RouteStatus;
  stops: RouteStop[];
  createdAt: string;
}

export interface RouteStop {
  id: string;
  stopName: string;
  stopOrder: number;
  estimatedTime: string;
  latitude?: number;
  longitude?: number;
  studentsCount: number;
}

export interface StudentBoardingRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  class: string;
  routeId: string;
  routeName: string;
  stopName: string;
  date: string;
  morningStatus: BoardingStatus;
  eveningStatus: BoardingStatus;
  morningTime?: string;
  eveningTime?: string;
  parentNotified: boolean;
  notes?: string;
  createdAt: string;
}

export interface TransportDashboardData {
  totalRoutes: number;
  activeRoutes: number;
  totalStudents: number;
  busesOnRoad: number;
  todayBoarded: number;
  todayAbsent: number;
  parentNotificationsSent: number;
  routeOccupancy: { name: string; occupied: number; capacity: number; color: string }[];
}