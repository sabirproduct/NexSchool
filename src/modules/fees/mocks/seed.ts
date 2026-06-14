import { FeeStructure, FeeAssignment, FeeInstallment, FeeCollection, MonthlyCollection, FeeDelayRecord, ClassWiseCollection } from '../types';

export const feeStructuresSeed: FeeStructure[] = [
  { id: 'FS-001', feeName: 'Tuition Fee', category: 'Tuition', frequency: 'Monthly', amount: 2500, applicableClasses: ['1','2','3','4','5','6','7','8','9','10','11','12'], isMandatory: true, dueDay: 10, lateFeePerDay: 10, academicSession: '2025-26', createdAt: '2025-04-01', updatedAt: '2025-04-01' },
  { id: 'FS-002', feeName: 'Hostel Fee', category: 'Hostel', frequency: 'Monthly', amount: 5000, applicableClasses: ['6','7','8','9','10','11','12'], isMandatory: false, dueDay: 10, lateFeePerDay: 25, academicSession: '2025-26', createdAt: '2025-04-01', updatedAt: '2025-04-01' },
  { id: 'FS-003', feeName: 'Transport Fee', category: 'Transport', frequency: 'Monthly', amount: 1200, applicableClasses: ['1','2','3','4','5','6','7','8','9','10','11','12'], isMandatory: false, dueDay: 10, lateFeePerDay: 5, academicSession: '2025-26', createdAt: '2025-04-01', updatedAt: '2025-04-01' },
  { id: 'FS-004', feeName: 'Annual Admission Fee', category: 'Admission', frequency: 'Annual', amount: 10000, applicableClasses: ['1','2','3','4','5','6','7','8','9','10','11','12'], isMandatory: true, dueDay: 15, lateFeePerDay: 0, academicSession: '2025-26', createdAt: '2025-04-01', updatedAt: '2025-04-01' },
  { id: 'FS-005', feeName: 'Library Fee', category: 'Library', frequency: 'Quarterly', amount: 500, applicableClasses: ['1','2','3','4','5','6','7','8','9','10','11','12'], isMandatory: true, dueDay: 10, lateFeePerDay: 5, academicSession: '2025-26', createdAt: '2025-04-01', updatedAt: '2025-04-01' },
  { id: 'FS-006', feeName: 'Sports Fee', category: 'Sports', frequency: 'Quarterly', amount: 750, applicableClasses: ['1','2','3','4','5','6','7','8','9','10','11','12'], isMandatory: false, dueDay: 10, lateFeePerDay: 5, academicSession: '2025-26', createdAt: '2025-04-01', updatedAt: '2025-04-01' },
  { id: 'FS-007', feeName: 'Science Lab Fee', category: 'Lab', frequency: 'Half Yearly', amount: 1500, applicableClasses: ['6','7','8','9','10','11','12'], isMandatory: true, dueDay: 10, lateFeePerDay: 10, academicSession: '2025-26', createdAt: '2025-04-01', updatedAt: '2025-04-01' },
  { id: 'FS-008', feeName: 'Development Fee', category: 'Development', frequency: 'Annual', amount: 3000, applicableClasses: ['1','2','3','4','5','6','7','8','9','10','11','12'], isMandatory: true, dueDay: 15, lateFeePerDay: 0, academicSession: '2025-26', createdAt: '2025-04-01', updatedAt: '2025-04-01' },
];

const studentNames = ['Aarav Sharma', 'Vivaan Singh', 'Aditya Patel', 'Vihaan Verma', 'Arjun Gupta', 'Reyansh Kumar', 'Ayaan Joshi', 'Ishaan Roy', 'Shaurya Das', 'Rudra Sen', 'Ananya Reddy', 'Diya Kapoor', 'Sara Khan', 'Myra Malhotra', 'Siya Choudhury', 'Aadhya Nair', 'Paridhi Saxena', 'Anika Bose', 'Navya Menon', 'Prisha Iyer',
  'Kabir Bhat', 'Dhruv Saxena', 'Arnav Rao', 'Veer Desai', 'Aryan Pillai', 'Yash Mehra', 'Sai Krishna', 'Rohan Bajaj', 'Tanishq Nair', 'Krishna Reddy',
  'Ira Banerjee', 'Tara Mehta', 'Riya Agarwal', 'Shanaya Tiwari', 'Kyra Bhatt', 'Aarushi Kaur', 'Nisha Rajan', 'Ishita Kulkarni', 'Riddhi Joshi', 'Sanvi Shetty'];

const classes = ['1','2','3','4','5','6','7','8','9','10','11','12'];
const sections = ['A', 'B', 'C'];
const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const feeCategories = ['Tuition', 'Hostel', 'Transport', 'Library', 'Sports', 'Lab'] as const;

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCollectionsForStudent(studentName: string, idx: number): FeeAssignment[] {
  const classId = classes[idx % classes.length];
  const sectionId = sections[idx % sections.length];
  const rollNumber = `${idx + 1}`;

  const monthlyTuition = 2500;
  const isHosteller = idx % 5 === 0;
  const hasTransport = idx % 3 !== 0;
  const totalMonths = 10;

  const feeAssignments: FeeAssignment[] = [];

  // Tuition fee - mandatory
  const tuitionPaid = randomInt(0, totalMonths) * monthlyTuition;
  const tuitionsDue = (totalMonths * monthlyTuition) - tuitionPaid;
  const tuitionStatus = tuitionsDue === 0 ? 'Paid' : tuitionPaid > 0 ? 'Partial' : 'Unpaid';

  const tuitionInstallments: FeeInstallment[] = [];
  const paidMonths = Math.floor(tuitionPaid / monthlyTuition);
  for (let m = 0; m < paidMonths; m++) {
    const monthIdx = (4 + m) % 12; // Start from April
    tuitionInstallments.push({
      id: `INST-T-${idx}-${m}`,
      paidAmount: monthlyTuition,
      paymentMode: randomElement(['Cash', 'UPI', 'Online Transfer', 'Card']),
      paidDate: `2025-${String(monthIdx + 1).padStart(2, '0')}-${randomInt(5, 15)}`,
      receiptNumber: `RCT-T-${String(idx + 1).padStart(4, '0')}-${m}`,
      fineAmount: 0,
      paidBy: 'admin@nexschool.com',
    });
  }

  feeAssignments.push({
    id: `FA-T-${idx}`,
    studentId: `STU-${String(idx + 1).padStart(4, '0')}`,
    studentName,
    rollNumber,
    classId,
    sectionId,
    feeStructureId: 'FS-001',
    feeName: 'Tuition Fee',
    category: 'Tuition',
    totalAmount: totalMonths * monthlyTuition,
    paidAmount: tuitionPaid,
    dueAmount: tuitionsDue,
    dueDate: '2025-04-10',
    status: tuitionStatus,
    installments: tuitionInstallments,
    createdAt: '2025-04-01',
    updatedAt: '2025-04-01',
  });

  // Hostel fee
  if (isHosteller) {
    const hostelPerMonth = 5000;
    const hostelPaid = randomInt(0, totalMonths) * hostelPerMonth;
    const hostelDue = (totalMonths * hostelPerMonth) - hostelPaid;
    const hostelStatus = hostelDue === 0 ? 'Paid' : hostelPaid > 0 ? 'Partial' : 'Overdue';
    feeAssignments.push({
      id: `FA-H-${idx}`,
      studentId: `STU-${String(idx + 1).padStart(4, '0')}`,
      studentName,
      rollNumber,
      classId,
      sectionId,
      feeStructureId: 'FS-002',
      feeName: 'Hostel Fee',
      category: 'Hostel',
      totalAmount: totalMonths * hostelPerMonth,
      paidAmount: hostelPaid,
      dueAmount: hostelDue,
      dueDate: '2025-04-10',
      status: hostelStatus,
      installments: [],
      createdAt: '2025-04-01',
      updatedAt: '2025-04-01',
    });
  }

  // Transport fee
  if (hasTransport) {
    const transportPerMonth = 1200;
    const transportPaid = randomInt(0, totalMonths) * transportPerMonth;
    const transportDue = (totalMonths * transportPerMonth) - transportPaid;
    const transportStatus = transportDue === 0 ? 'Paid' : transportPaid > 0 ? 'Partial' : 'Unpaid';
    feeAssignments.push({
      id: `FA-TR-${idx}`,
      studentId: `STU-${String(idx + 1).padStart(4, '0')}`,
      studentName,
      rollNumber,
      classId,
      sectionId,
      feeStructureId: 'FS-003',
      feeName: 'Transport Fee',
      category: 'Transport',
      totalAmount: totalMonths * transportPerMonth,
      paidAmount: transportPaid,
      dueAmount: transportDue,
      dueDate: '2025-04-10',
      status: transportStatus,
      installments: [],
      createdAt: '2025-04-01',
      updatedAt: '2025-04-01',
    });
  }

  return feeAssignments;
}

// Generate collections (flatten all assignments)
const allAssignments: FeeAssignment[] = [];
studentNames.forEach((name, idx) => {
  allAssignments.push(...generateCollectionsForStudent(name, idx));
});

export const feeAssignmentsSeed: FeeAssignment[] = allAssignments;

export const monthlyCollectionsSeed: MonthlyCollection[] = months.map((label, idx) => {
  const month = String((idx + 1)).padStart(2, '0');
  const baseCollected = 150000 + idx * 5000 + randomInt(-20000, 20000);
  const basePending = 50000 - idx * 2000 + randomInt(-10000, 10000);
  return {
    month,
    monthLabel: label,
    year: idx < 3 ? 2026 : 2025,
    totalCollected: Math.max(baseCollected, 50000),
    totalPending: Math.max(basePending, 5000),
    totalDue: Math.max(baseCollected + basePending, 100000),
    count: randomInt(15, 35),
  };
});

export const feeDelayRecordsSeed: FeeDelayRecord[] = [];

// Generate realistic delay records
const delayCandidates = studentNames.filter((_, i) => i % 3 !== 0).slice(0, 15);
delayCandidates.forEach((name, idx) => {
  const classId = classes[idx % classes.length];
  const sectionId = sections[idx % sections.length];
  const dueAmount = randomInt(2000, 12000);
  const overdueDays = randomInt(5, 90);
  const lateFee = overdueDays * (overdueDays < 30 ? 10 : overdueDays < 60 ? 15 : 20);
  feeDelayRecordsSeed.push({
    studentId: `STU-${String(studentNames.indexOf(name) + 1).padStart(4, '0')}`,
    studentName: name,
    rollNumber: String(studentNames.indexOf(name) + 1),
    classId,
    sectionId,
    feeName: randomElement(['Tuition Fee', 'Hostel Fee', 'Transport Fee', 'Library Fee']),
    dueDate: `2025-${String(4 + Math.floor(idx / 3)).padStart(2, '0')}-10`,
    dueAmount,
    overdueDays,
    lateFee,
    status: 'Overdue',
  });
});

export const classWiseCollectionsSeed: ClassWiseCollection[] = classes.map((classId) => {
  const totalStudents = randomInt(15, 45);
  const totalDue = totalStudents * randomInt(15000, 35000);
  const collectionPct = randomInt(55, 98);
  const totalCollected = Math.round((totalDue * collectionPct) / 100);
  const pendingCount = Math.round(totalStudents * ((100 - collectionPct) / 100));
  return {
    classId,
    totalStudents,
    totalDue,
    totalCollected,
    collectionPct,
    pendingCount: Math.max(pendingCount, 0),
  };
});