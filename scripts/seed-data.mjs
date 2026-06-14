#!/usr/bin/env node

/**
 * Firestore Seed Script (Node.js)
 * 
 * Seeds initial data into Firestore using Firebase Admin SDK via REST API
 * 
 * Usage:
 *   npm run seed
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read env from .env file
const envPath = resolve(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const [key, ...rest] = line.split('=');
      return [key.trim(), rest.join('=').trim()];
    })
);

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SCHOOL_ID = 'school-001';

function now() {
  return Timestamp.now();
}

async function seed() {
  console.log('🌱 Starting Firestore seed...');
  console.log(`Project: ${firebaseConfig.projectId}`);
  console.log(`School ID: ${SCHOOL_ID}`);
  
  // 1. School
  console.log('\n📚 Creating school...');
  await setDoc(doc(db, 'schools', SCHOOL_ID), {
    name: 'NexSchool International',
    email: 'info@nexschool.com',
    phone: '+91-9876543210',
    address: '123 Education Lane',
    city: 'Mumbai',
    state: 'MH',
    pincode: '400001',
    createdAt: now(),
    updatedAt: now()
  });
  console.log('  ✅ School created');

  // 2. Academic Sessions
  console.log('\n📅 Creating academic sessions...');
  await setDoc(doc(db, 'academicSessions', `${SCHOOL_ID}-2025-2026`), {
    schoolId: SCHOOL_ID,
    sessionName: '2025-2026',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    isActive: false,
    createdAt: now()
  });
  await setDoc(doc(db, 'academicSessions', `${SCHOOL_ID}-2026-2027`), {
    schoolId: SCHOOL_ID,
    sessionName: '2026-2027',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    isActive: true,
    createdAt: now()
  });
  console.log('  ✅ Academic sessions created');

  // 3. Classes
  console.log('\n🏫 Creating classes...');
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
    await setDoc(doc(db, 'classes', `${SCHOOL_ID}-${c.classCode}`), {
      schoolId: SCHOOL_ID,
      academicSessionId: `${SCHOOL_ID}-2026-2027`,
      className: c.className,
      classCode: c.classCode,
      totalStrength: c.totalStrength,
      createdAt: now()
    });
  }
  console.log(`  ✅ ${classData.length} classes created`);

  // 4. Sections
  console.log('\n📋 Creating sections...');
  const sectionLetters = ['A', 'B', 'C', 'D'];
  const allClassCodes = ['PG', 'N', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  let sectionCount = 0;

  for (const classCode of allClassCodes) {
    for (const section of sectionLetters) {
      const classId = `${SCHOOL_ID}-${classCode}`;
      await setDoc(doc(db, 'sections', `${classId}-${section}`), {
        schoolId: SCHOOL_ID,
        classId: classId,
        sectionName: section,
        sectionCode: section,
        createdAt: now()
      });
      sectionCount++;
    }
  }
  console.log(`  ✅ ${sectionCount} sections created`);

  // 5. Subjects
  console.log('\n📖 Creating subjects...');
  const fullSubjects = [
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
  const lowerSubjects = [
    { subjectName: 'Mathematics', subjectCode: 'MATH', maxMarks: 100, minMarks: 33 },
    { subjectName: 'English', subjectCode: 'ENG', maxMarks: 100, minMarks: 33 },
    { subjectName: 'Hindi', subjectCode: 'HIN', maxMarks: 100, minMarks: 33 },
    { subjectName: 'Environmental Studies', subjectCode: 'EVS', maxMarks: 100, minMarks: 33 },
    { subjectName: 'General Knowledge', subjectCode: 'GK', maxMarks: 50, minMarks: 17 },
    { subjectName: 'Art & Craft', subjectCode: 'ART', maxMarks: 50, minMarks: 17 },
  ];
  let subjectCount = 0;

  for (const classCode of ['6', '7', '8', '9', '10']) {
    const classId = `${SCHOOL_ID}-${classCode}`;
    for (const sub of fullSubjects) {
      await setDoc(doc(db, 'subjects', `${classId}-${sub.subjectCode}`), {
        schoolId: SCHOOL_ID,
        classId: classId,
        ...sub,
        createdAt: now()
      });
      subjectCount++;
    }
  }

  for (const classCode of ['PG', 'N', 'LKG', 'UKG', '1', '2', '3', '4', '5']) {
    const classId = `${SCHOOL_ID}-${classCode}`;
    for (const sub of lowerSubjects) {
      await setDoc(doc(db, 'subjects', `${classId}-${sub.subjectCode}`), {
        schoolId: SCHOOL_ID,
        classId: classId,
        ...sub,
        createdAt: now()
      });
      subjectCount++;
    }
  }
  console.log(`  ✅ ${subjectCount} subjects created`);

  // 6. Grade Rules
  console.log('\n📊 Creating grade rules...');
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
    await setDoc(doc(db, 'gradeRules', `${SCHOOL_ID}-grade-${i}`), {
      schoolId: SCHOOL_ID,
      ...gradeRules[i],
      createdAt: now()
    });
  }
  console.log(`  ✅ ${gradeRules.length} grade rules created`);

  // 7. Admin User
  console.log('\n👤 Creating admin user...');
  await setDoc(doc(db, 'users', 'admin-001'), {
    schoolId: SCHOOL_ID,
    email: 'admin@nexschool.com',
    role: 'school_admin',
    fullName: 'School Admin',
    phoneNumber: '+91-9876543210',
    lastLoginAt: now(),
    createdAt: now()
  });
  console.log('  ✅ Admin user created');

  console.log('\n✅✅✅ Firestore seeding completed successfully!');
  console.log(`   🏫 School: ${SCHOOL_ID}`);
  console.log(`   📧 Admin: admin@nexschool.com`);
  console.log(`   🔗 https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});