import { Student } from '../types';
export const mockStudents: Student[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `st_${i+1}`,
  firstName: `Student${i+1}`,
  lastName: 'Demo',
  fullName: `Student${i+1} Demo`,
  gender: i % 2 ? 'male' : 'female',
  dob: '2010-01-10',
  bloodGroup: 'O+',
  mobile: `98765432${(10+i).toString().padStart(2,'0')}`,
  email: `student${i+1}@demo.com`,
  parent: { fatherName: 'Father', motherName: 'Mother', guardianName: 'Guardian', guardianMobile: '9998887776' },
  address: { addressLine: 'Street 1', state: 'State', district: 'District', city: 'City', pinCode: '110011' },
  academic: { admissionNo: `ADM${1000+i}`, rollNo: `${i+1}`, admissionDate: '2025-04-01', classId: i%2?'10':'9', sectionId: i%3?'A':'B', session: '2025-26', studentType: i%4===0?'residential':'day_scholar' },
  hostel: i%4===0 ? { hostelName: 'Blue House', roomNo: '12', bedNo: '2', wardenName: 'Mr Rao', joiningDate: '2025-04-03' } : undefined,
  status: 'active',
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'seed',
}));
