import { AdmissionApplication } from '../types';

export const admissionSeed: AdmissionApplication[] = [
  {
    id: 'app-1',
    applicationNo: 'NS-2026-0001',
    studentFirstName: 'Aarav',
    studentLastName: 'Sharma',
    fullName: 'Aarav Sharma',
    gender: 'Male',
    dob: '2014-08-22',
    studentType: 'Day Scholar',
    applyingClassId: '6',
    guardianName: 'Rakesh Sharma',
    mobile: '9876543210',
    email: 'parent1@example.com',
    hostelRequired: false,
    applicationStatus: 'Submitted',
    admissionFeeStatus: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString()
  },
  {
    id: 'app-2',
    applicationNo: 'NS-2026-0002',
    studentFirstName: 'Saanvi',
    studentLastName: 'Verma',
    fullName: 'Saanvi Verma',
    gender: 'Female',
    dob: '2013-01-10',
    studentType: 'Residential',
    applyingClassId: '7',
    guardianName: 'Amit Verma',
    mobile: '8765432109',
    email: 'parent2@example.com',
    hostelRequired: true,
    preferredHostel: 'Girls Hostel A',
    applicationStatus: 'Under Review',
    admissionFeeStatus: 'Paid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString()
  }
];
