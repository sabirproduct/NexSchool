/**
 * Firestore Initialization & Data Setup
 * Run this once to create initial collections and documents
 */

import {
  createDocument,
  batchWriteDocuments,
} from './firestoreService';

export async function seedFirestoreData(schoolId: string) {
  console.log('🌱 Seeding Firestore with initial data...');

  try {
    // Create academic session
    await createDocument('academicSessions', {
      schoolId,
      sessionName: '2024-2025',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      isActive: true,
    });
    console.log('✅ Academic session created');

    // Create classes
    const classes = [
      { schoolId, academicSessionId: '2024-2025', className: 'Class VI', classCode: 'VI', totalStrength: 45 },
      { schoolId, academicSessionId: '2024-2025', className: 'Class VII', classCode: 'VII', totalStrength: 48 },
      { schoolId, academicSessionId: '2024-2025', className: 'Class X', classCode: 'X', totalStrength: 50 },
    ];

    const classOps = classes.map((c, i) => ({
      type: 'set' as const,
      collection: 'classes',
      docId: `${schoolId}-${c.classCode}`,
      data: c,
    }));

    await batchWriteDocuments(classOps);
    console.log('✅ Classes created');

    // Create sections
    const sections = [
      { schoolId, classId: `${schoolId}-VI`, sectionName: 'A', sectionCode: 'A' },
      { schoolId, classId: `${schoolId}-VI`, sectionName: 'B', sectionCode: 'B' },
      { schoolId, classId: `${schoolId}-X`, sectionName: 'A', sectionCode: 'A' },
    ];

    const sectionOps = sections.map((s, i) => ({
      type: 'set' as const,
      collection: 'sections',
      docId: `${schoolId}-${s.classId}-${s.sectionCode}`,
      data: s,
    }));

    await batchWriteDocuments(sectionOps);
    console.log('✅ Sections created');

    // Create subjects
    const subjects = [
      { schoolId, classId: `${schoolId}-X`, subjectName: 'Mathematics', subjectCode: 'MATH', maxMarks: 100, minMarks: 33 },
      { schoolId, classId: `${schoolId}-X`, subjectName: 'English', subjectCode: 'ENG', maxMarks: 100, minMarks: 33 },
      { schoolId, classId: `${schoolId}-X`, subjectName: 'Science', subjectCode: 'SCI', maxMarks: 100, minMarks: 33 },
    ];

    const subjectOps = subjects.map((s) => ({
      type: 'set' as const,
      collection: 'subjects',
      docId: `${schoolId}-${s.classId}-${s.subjectCode}`,
      data: s,
    }));

    await batchWriteDocuments(subjectOps);
    console.log('✅ Subjects created');

    // Create grade rules
    const gradeRules = [
      { schoolId, percentage_from: 90, percentage_to: 100, grade: 'A+', gpa: 9.5, remarks: 'Outstanding' },
      { schoolId, percentage_from: 80, percentage_to: 89, grade: 'A', gpa: 9.0, remarks: 'Excellent' },
      { schoolId, percentage_from: 70, percentage_to: 79, grade: 'B', gpa: 8.0, remarks: 'Good' },
      { schoolId, percentage_from: 60, percentage_to: 69, grade: 'C', gpa: 7.0, remarks: 'Satisfactory' },
      { schoolId, percentage_from: 0, percentage_to: 59, grade: 'D', gpa: 5.0, remarks: 'Need Improvement' },
    ];

    const gradeOps = gradeRules.map((g, i) => ({
      type: 'set' as const,
      collection: 'gradeRules',
      docId: `${schoolId}-grade-${i}`,
      data: g,
    }));

    await batchWriteDocuments(gradeOps);
    console.log('✅ Grade rules created');

    console.log('✅ Firestore seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    throw error;
  }
}

/**
 * Create a new school with basic structure
 */
export async function createSchoolStructure(schoolData: {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}) {
  try {
    const school = await createDocument('schools', schoolData);
    console.log('✅ School created:', school.id);

    // Seed initial data for this school
    await seedFirestoreData(school.id);

    return school;
  } catch (error) {
    console.error('❌ Error creating school structure:', error);
    throw error;
  }
}

/**
 * Initialize Firestore collections (call on app startup)
 */
export async function initializeFirestore() {
  try {
    console.log('🚀 Initializing Firestore...');
    // Additional setup if needed
    console.log('✅ Firestore initialized');
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
  }
}
