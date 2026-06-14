/**
 * Firestore Seed Script
 * Run this to populate initial data into Firestore
 * 
 * Usage:
 *   npx vite --mode seed
 *   Then open browser console to call seedFirestore()
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig, 'seed');
const db = getFirestore(app);

const SCHOOL_ID = 'school-001';
const SCHOOL_NAME = 'NexSchool International';

async function seed() {
  console.log('🌱 Starting Firestore seed...');
  
  // 1. Create School
  console.log('Creating school...');
  await setDoc(doc(db, 'schools', SCHOOL_ID), {
    name: SCHOOL_NAME,
    email: 'info@nexschool.com',
    phone: '+91-9876543210',
    address: '123 Education Lane',
    city: 'Mumbai',
    state: 'MH',
    pincode: '400001',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });

  // 2. Create Academic Sessions
  console.log('Creating academic sessions...');
  await setDoc(doc(db, 'academicSessions', `${SCHOOL_ID}-2025-2026`), {
    schoolId: SCHOOL_ID,
    sessionName: '2025-2026',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    isActive: true,
    createdAt: Timestamp.now()
  });

  await setDoc(doc(db, 'academicSessions', `${SCHOOL_ID}-2026-2027`), {
    schoolId: SCHOOL_ID,
    sessionName: '2026-2027',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    isActive: true,
    createdAt: Timestamp.now()
  });

  // 3. Create Classes
  console.log('Creating classes...');
  const classData = [
    { className: 'Playgroup', classCode: 'PG', totalStrength: 30 },
    { className: 'Nursery', classCode: 'N', totalStrength: 35 },
    { className: 'LKG', classCode: 'LKG', totalStrength: 35 },
    { className: 'UKG', classCode: 'UKG', totalStrength: 35 },
    { className: 'Standard 1', classCode: '1', totalStrength: 40 },
    { className: 'Standard 2', classCode: '2', totalStrength: 40 },
    { className: 'Standard 3', classCode: '3', totalStrength: 40 },
    { className: 'Standard 4', classCode: '4', totalStrength: 40 },
    { className: 'Standard 5', classCode: '5', totalStrength: 40 },
    { className: 'Standard 6', classCode: '6', totalStrength: 45 },
    { className: 'Standard 7', classCode: '7', totalStrength: 45 },
    { className: 'Standard 8', classCode: '8', totalStrength: 45 },
    { className: 'Standard 9', classCode: '9', totalStrength: 45 },
    { className: 'Standard 10', classCode: '10', totalStrength: 50 },
  ];

  for (const c of classData) {
    const docId = `${SCHOOL_ID}-${c.classCode}`;
    await setDoc(doc(db, 'classes', docId), {
      schoolId: SCHOOL_ID,
      academicSessionId: `${SCHOOL_ID}-2026-2027`,
      className: c.className,
      classCode: c.classCode,
      totalStrength: c.totalStrength,
      createdAt: Timestamp.now()
    });
  }

  // 4. Create Sections for Standard 1-10
  console.log('Creating sections...');
  const sections = ['A', 'B', 'C', 'D'];
  const classCodes = ['PG', 'N', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  
  for (const classCode of classCodes) {
    for (const section of sections) {
      const classId = `${SCHOOL_ID}-${classCode}`;
      const docId = `${classId}-${section}`;
      await setDoc(doc(db, 'sections', docId), {
        schoolId: SCHOOL_ID,
        classId: classId,
        sectionName: section,
        sectionCode: section,
        createdAt: Timestamp.now()
      });
    }
  }

  // 5. Create Subjects for Standard 6-10
  console.log('Creating subjects...');
  const subjectDefinitions = [
    { subjectName: 'Mathematics', subjectCode: 'MATH', maxMarks: 100, minMarks: 33 },
    { subjectName: 'English', subjectCode: 'ENG', maxMarks: 100, minMarks: 33 },
    { subjectName: 'Hindi', subjectCode: 'HIN', maxMarks: 100, minMarks: 33 },
    { subjectName: 'Science', subjectCode: 'SCI', maxMarks: 100, minMarks: 33 },
    { subjectName: 'Social Studies', subjectCode: 'SST', maxMarks: 100, minMarks: 33 },
    { subjectName: 'Sanskrit', subjectCode: 'SAN', maxMarks: 100, minMarks: 33 },
    { subjectName: 'Computer Science', subjectCode: 'CS', maxMarks: 100, minMarks: 33 },
    { subjectName: 'General Knowledge', subjectCode: 'GK', maxMarks: 50, minMarks: 17 },
    { subjectName: 'Physical Education', subjectCode: 'PE', maxMarks: 50, minMarks: 17 },
    { subjectName: 'Art & Craft', subjectCode: 'ART', maxMarks: 50, minMarks: 17 },
  ];

  // Subjects for higher classes (6-10)
  for (const classCode of ['6', '7', '8', '9', '10']) {
    const classId = `${SCHOOL_ID}-${classCode}`;
    for (const sub of subjectDefinitions) {
      const docId = `${classId}-${sub.subjectCode}`;
      await setDoc(doc(db, 'subjects', docId), {
        schoolId: SCHOOL_ID,
        classId: classId,
        subjectName: sub.subjectName,
        subjectCode: sub.subjectCode,
        maxMarks: sub.maxMarks,
        minMarks: sub.minMarks,
        createdAt: Timestamp.now()
      });
    }
  }

  // Simplified subjects for lower classes
  const lowerSubjects = [
    { subjectName: 'Mathematics', subjectCode: 'MATH', maxMarks: 100, minMarks: 33 },
    { subjectName: 'English', subjectCode: 'ENG', maxMarks: 100, minMarks: 33 },
    { subjectName: 'Hindi', subjectCode: 'HIN', maxMarks: 100, minMarks: 33 },
    { subjectName: 'Environmental Studies', subjectCode: 'EVS', maxMarks: 100, minMarks: 33 },
    { subjectName: 'General Knowledge', subjectCode: 'GK', maxMarks: 50, minMarks: 17 },
    { subjectName: 'Art & Craft', subjectCode: 'ART', maxMarks: 50, minMarks: 17 },
  ];

  for (const classCode of ['PG', 'N', 'LKG', 'UKG', '1', '2', '3', '4', '5']) {
    const classId = `${SCHOOL_ID}-${classCode}`;
    for (const sub of lowerSubjects) {
      const docId = `${classId}-${sub.subjectCode}`;
      await setDoc(doc(db, 'subjects', docId), {
        schoolId: SCHOOL_ID,
        classId: classId,
        subjectName: sub.subjectName,
        subjectCode: sub.subjectCode,
        maxMarks: sub.maxMarks,
        minMarks: sub.minMarks,
        createdAt: Timestamp.now()
      });
    }
  }

  // 6. Create Grade Rules
  console.log('Creating grade rules...');
  const gradeRules = [
    { percentage_from: 90, percentage_to: 100, grade: 'A+', gpa: 10.0, remarks: 'Outstanding' },
    { percentage_from: 80, percentage_to: 89, grade: 'A', gpa: 9.0, remarks: 'Excellent' },
    { percentage_from: 70, percentage_to: 79, grade: 'B+', gpa: 8.0, remarks: 'Very Good' },
    { percentage_from: 60, percentage_to: 69, grade: 'B', gpa: 7.0, remarks: 'Good' },
    { percentage_from: 50, percentage_to: 59, grade: 'C', gpa: 6.0, remarks: 'Above Average' },
    { percentage_from: 40, percentage_to: 49, grade: 'D', gpa: 5.0, remarks: 'Average' },
    { percentage_from: 33, percentage_to: 39, grade: 'E', gpa: 4.0, remarks: 'Below Average' },
    { percentage_from: 0, percentage_to: 32, grade: 'F', gpa: 0.0, remarks: 'Fail' },
  ];

  for (let i = 0; i < gradeRules.length; i++) {
    const rule = gradeRules[i];
    await setDoc(doc(db, 'gradeRules', `${SCHOOL_ID}-grade-${i}`), {
      schoolId: SCHOOL_ID,
      percentage_from: rule.percentage_from,
      percentage_to: rule.percentage_to,
      grade: rule.grade,
      gpa: rule.gpa,
      remarks: rule.remarks,
      createdAt: Timestamp.now()
    });
  }

  // 7. Create Admin User
  console.log('Creating admin user...');
  await setDoc(doc(db, 'users', 'admin-001'), {
    schoolId: SCHOOL_ID,
    email: 'admin@nexschool.com',
    role: 'school_admin',
    fullName: 'School Admin',
    phoneNumber: '+91-9876543210',
    lastLoginAt: Timestamp.now(),
    createdAt: Timestamp.now()
  });

  console.log('✅ Seed completed successfully!');
  console.log(`🏫 School ID: ${SCHOOL_ID}`);
  console.log('📧 Admin Email: admin@nexschool.com');
  console.log('🔑 (Auth not configured - login page will use mock auth)');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});