import { where, orderBy, collection, query, getDocs, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { AdmissionApplication } from '../types';
import {
  createDocument,
  updateDocument,
  executeTransaction,
  getAllDocuments,
  batchWriteDocuments,
} from '../../../services/firestoreService';

// Admission Application APIs
export async function submitAdmissionApplication(application: AdmissionApplication, schoolId: string) {
  return createDocument('admissionApplications', { ...application, schoolId, applicationStatus: 'Draft' });
}

export async function getAdmissionApplications(schoolId: string, status?: string) {
  const constraints = [where('schoolId', '==', schoolId)];
  if (status) constraints.push(where('applicationStatus', '==', status));
  return getAllDocuments('admissionApplications', [...constraints, orderBy('createdAt', 'desc')]);
}

/**
 * Approve admission with transaction:
 * 1) Update application status
 * 2) Create student record
 * 3) Create parent record
 * 4) Create notification
 */
export async function approveAdmissionTransaction(
  applicationId: string,
  application: AdmissionApplication,
  approvedBy: string
) {
  if (!db) throw new Error('Firebase not configured');

  return executeTransaction(async (txn: any) => {
    // 1. Update admission application
    const appRef = doc(db!, 'admissionApplications', applicationId);
    txn.update(appRef, {
      applicationStatus: 'Approved',
      approvedBy,
      approvedAt: serverTimestamp(),
    });

    // 2. Create student record
    const studentId = `STU-${Date.now()}`;
    const studentRef = doc(db!, 'students', studentId);
    txn.set(studentRef, {
      firstName: application.studentFirstName,
      lastName: application.studentLastName,
      fullName: application.fullName,
      gender: application.gender.toLowerCase(),
      dob: application.dob,
      mobile: application.mobile,
      email: application.email,
      admissionNo: `ADM-${Date.now()}`,
      academic: {
        classId: application.applyingClassId,
        sectionId: '',
        rollNo: '',
        admissionNo: `ADM-${Date.now()}`,
      },
      status: 'active',
      createdAt: serverTimestamp(),
    });

    // 3. Create parent record
    if (application.guardianName) {
      const parentId = `PAR-${Date.now()}`;
      const parentRef = doc(db!, 'parents', parentId);
      txn.set(parentRef, {
        parentName: application.guardianName,
        parentType: 'guardian',
        email: application.email,
        phone: application.mobile,
        studentId,
        createdAt: serverTimestamp(),
      });
    }

    // 4. Create notification
    const notifId = `NOTIF-${Date.now()}`;
    const notifRef = doc(db!, 'notifications', notifId);
    txn.set(notifRef, {
      studentId,
      title: 'Admission Approved',
      message: `Your admission has been approved!`,
      type: 'admission',
      read: false,
      createdAt: serverTimestamp(),
    });

    return { applicationId, studentId, status: 'Approved' };
  });
}

/**
 * Reject admission application
 */
export async function rejectAdmissionApplication(
  applicationId: string,
  rejectionReason: string,
  rejectedBy: string
) {
  return updateDocument('admissionApplications', applicationId, {
    applicationStatus: 'Rejected',
    rejectionReason,
    rejectedBy,
    rejectedAt: new Date(),
  });
}

// Admission Fees APIs
export async function getAdmissionFees(schoolId: string, applicationId: string) {
  return getAllDocuments('admissionFees', [
    where('schoolId', '==', schoolId),
    where('applicationId', '==', applicationId),
  ]);
}

export async function recordAdmissionFeePayment(schoolId: string, paymentData: any) {
  return createDocument('admissionFees', { ...paymentData, schoolId });
}

// Admission Documents APIs
export async function uploadAdmissionDocument(schoolId: string, applicationId: string, docData: any) {
  return createDocument('admissionDocuments', {
    ...docData,
    schoolId,
    applicationId,
    uploadedAt: new Date(),
  });
}

export async function getAdmissionDocuments(schoolId: string, applicationId: string) {
  return getAllDocuments('admissionDocuments', [
    where('schoolId', '==', schoolId),
    where('applicationId', '==', applicationId),
  ]);
}
