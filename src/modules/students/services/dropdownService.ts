import { where } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { getAllDocuments } from '../../../services/firestoreService';

export interface ClassOption {
  id: string;
  schoolId: string;
  className: string;
  classCode: string;
  totalStrength?: number;
}

export interface SectionOption {
  id: string;
  schoolId: string;
  classId: string;
  sectionName: string;
  sectionCode: string;
}

export interface SessionOption {
  id: string;
  schoolId: string;
  sessionName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// Fallback mock data
const mockClasses: ClassOption[] = [
  { id: '1', schoolId: 'mock', className: 'Playgroup', classCode: 'PG' },
  { id: '2', schoolId: 'mock', className: 'Nursery', classCode: 'N' },
  { id: '3', schoolId: 'mock', className: 'LKG', classCode: 'LKG' },
  { id: '4', schoolId: 'mock', className: 'UKG', classCode: 'UKG' },
  { id: '5', schoolId: 'mock', className: 'Standard 1', classCode: '1' },
  { id: '6', schoolId: 'mock', className: 'Standard 2', classCode: '2' },
  { id: '7', schoolId: 'mock', className: 'Standard 3', classCode: '3' },
  { id: '8', schoolId: 'mock', className: 'Standard 4', classCode: '4' },
  { id: '9', schoolId: 'mock', className: 'Standard 5', classCode: '5' },
  { id: '10', schoolId: 'mock', className: 'Standard 6', classCode: '6' },
  { id: '11', schoolId: 'mock', className: 'Standard 7', classCode: '7' },
  { id: '12', schoolId: 'mock', className: 'Standard 8', classCode: '8' },
  { id: '13', schoolId: 'mock', className: 'Standard 9', classCode: '9' },
  { id: '14', schoolId: 'mock', className: 'Standard 10', classCode: '10' },
];

const mockSections: SectionOption[] = [
  { id: 's1', schoolId: 'mock', classId: '1', sectionName: 'A', sectionCode: 'A' },
  { id: 's2', schoolId: 'mock', classId: '1', sectionName: 'B', sectionCode: 'B' },
  { id: 's3', schoolId: 'mock', classId: '1', sectionName: 'C', sectionCode: 'C' },
  { id: 's4', schoolId: 'mock', classId: '1', sectionName: 'D', sectionCode: 'D' },
];

const mockSessions: SessionOption[] = [
  { id: 'ses1', schoolId: 'mock', sessionName: '2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', isActive: true },
  { id: 'ses2', schoolId: 'mock', sessionName: '2027-2028', startDate: '2027-04-01', endDate: '2028-03-31', isActive: false },
  { id: 'ses3', schoolId: 'mock', sessionName: '2028-2029', startDate: '2028-04-01', endDate: '2029-03-31', isActive: false },
  { id: 'ses4', schoolId: 'mock', sessionName: '2029-2030', startDate: '2029-04-01', endDate: '2030-03-31', isActive: false },
  { id: 'ses5', schoolId: 'mock', sessionName: '2030-2031', startDate: '2030-04-01', endDate: '2031-03-31', isActive: false },
];

/**
 * Fetch classes from Firestore, fallback to mock data
 */
export async function fetchClasses(schoolId?: string): Promise<ClassOption[]> {
  if (!db) return mockClasses;
  try {
    const constraints: any[] = [];
    if (schoolId) constraints.push(where('schoolId', '==', schoolId));
    const data = await getAllDocuments<ClassOption>('classes', constraints);
    return data.length > 0 ? data : mockClasses;
  } catch {
    return mockClasses;
  }
}

/**
 * Fetch sections from Firestore, fallback to mock data
 */
export async function fetchSections(schoolId?: string): Promise<SectionOption[]> {
  if (!db) return mockSections;
  try {
    const constraints: any[] = [];
    if (schoolId) constraints.push(where('schoolId', '==', schoolId));
    const data = await getAllDocuments<SectionOption>('sections', constraints);
    return data.length > 0 ? data : mockSections;
  } catch {
    return mockSections;
  }
}

/**
 * Fetch sessions from Firestore, fallback to mock data
 */
export async function fetchSessions(schoolId?: string): Promise<SessionOption[]> {
  if (!db) return mockSessions;
  try {
    const constraints: any[] = [];
    if (schoolId) constraints.push(where('schoolId', '==', schoolId));
    const data = await getAllDocuments<SessionOption>('academicSessions', constraints);
    return data.length > 0 ? data : mockSessions;
  } catch {
    return mockSessions;
  }
}

/**
 * Fetch all dropdown data at once
 */
export async function fetchDropdownData(schoolId?: string) {
  const [classes, sections, sessions] = await Promise.all([
    fetchClasses(schoolId),
    fetchSections(schoolId),
    fetchSessions(schoolId),
  ]);
  return { classes, sections, sessions };
}