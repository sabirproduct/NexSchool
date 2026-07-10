import { where, orderBy, collection, query, getDocs, doc, serverTimestamp, limit, getCountFromServer, Timestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { AdmissionApplication, AdmissionEnquiry, AdmissionFeeRecord, SystemConfig } from '../types';
import {
  createDocument,
  updateDocument,
  setDocument,
  executeTransaction,
  getAllDocuments,
  subscribeToCollection,
  getDocument,
} from '../../../services/firestoreService';

const APPLICATIONS_COLLECTION = 'admissionApplications';
const ENQUIRIES_COLLECTION = 'admissionEnquiries';
const FEES_COLLECTION = 'admissionFees';
const CONFIG_COLLECTION = 'systemConfig';

/**
 * Safely format a date value that could be a string, Date, or Firestore Timestamp
 */
export function formatDate(val: unknown, locale: string = 'en-IN', options?: Intl.DateTimeFormatOptions): string {
  if (!val) return 'N/A';
  try {
    let date: Date;
    if (val instanceof Timestamp) {
      date = val.toDate();
    } else if (typeof val === 'string') {
      date = new Date(val);
    } else if (val instanceof Date) {
      date = val;
    } else if (typeof val === 'object' && val !== null && 'seconds' in (val as any)) {
      date = new Date((val as any).seconds * 1000);
    } else {
      date = new Date(val as any);
    }
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString(locale, options || { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return 'N/A';
  }
}

/**
 * Safely format a date-time value
 */
export function formatDateTime(val: unknown): string {
  return formatDate(val, 'en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ──────────────────────────────────────────────
//  Application APIs
// ──────────────────────────────────────────────

export async function generateApplicationNo(tenantId: string): Promise<string> {
  if (!db) {
    return `${tenantId}_ADM_${Date.now()}`;
  }
  try {
    const collRef = collection(db, APPLICATIONS_COLLECTION);
    const snapshot = await getCountFromServer(collRef);
    const count = snapshot.data().count + 1;
    return `${tenantId}_ADM_${String(count).padStart(6, '0')}`;
  } catch {
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${tenantId}_ADM_${timestamp}`;
  }
}

export async function submitAdmissionApplication(application: AdmissionApplication) {
  return setDocument(APPLICATIONS_COLLECTION, application.id, {
    ...application,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, false);
}

export async function getAdmissionApplications(tenantId: string, status?: string) {
  const constraints = [where('tenantId', '==', tenantId)];
  if (status) constraints.push(where('applicationStatus', '==', status));
  return getAllDocuments<AdmissionApplication>(APPLICATIONS_COLLECTION, [...constraints, orderBy('createdAt', 'desc')]);
}

export function subscribeToAdmissionApplications(
  tenantId: string,
  onData: (data: (AdmissionApplication & { id: string })[]) => void,
  onError?: (error: Error) => void
) {
  return subscribeToCollection<AdmissionApplication>(
    APPLICATIONS_COLLECTION,
    [where('tenantId', '==', tenantId)],
    (data) => {
      const sorted = [...data].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt as any).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt as any).getTime() : 0;
        return dateB - dateA;
      });
      onData(sorted);
    },
    (err) => {
      console.warn('Subscription with filter failed, falling back to full collection:', err);
      const unsub = subscribeToCollection<AdmissionApplication>(
        APPLICATIONS_COLLECTION,
        [],
        (data) => {
          const tenantData = data.filter(d => d.tenantId === tenantId);
          const sorted = [...tenantData].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt as any).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt as any).getTime() : 0;
            return dateB - dateA;
          });
          onData(sorted);
        },
        onError
      );
      return unsub;
    }
  );
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
  updates?: Record<string, any>
) {
  return updateDocument(APPLICATIONS_COLLECTION, applicationId, {
    applicationStatus: status,
    ...updates,
  });
}

/**
 * Approve admission with transaction:
 * 1) Update application status to Approved
 * 2) Create student record (matching Student interface)
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
    const appRef = doc(db!, APPLICATIONS_COLLECTION, applicationId);
    txn.update(appRef, {
      applicationStatus: 'Approved',
      approvedBy,
      approvedAt: serverTimestamp(),
    });

    // 2. Create student record - matching Student interface from students module
    const studentId = `STU-${applicationId}`;
    const studentRef = doc(db!, 'students', studentId);
    txn.set(studentRef, {
      id: studentId,
      firstName: application.studentFirstName,
      lastName: application.studentLastName,
      fullName: application.fullName,
      gender: application.gender.toLowerCase(),
      dob: application.dob,
      bloodGroup: application.bloodGroup || null,
      religion: application.religion || null,
      category: application.category || null,
      mobile: application.mobile,
      email: application.email,
      schoolId: application.tenantId,
      parent: {
        fatherName: '',
        motherName: '',
        guardianName: application.guardianName,
        guardianMobile: application.guardianMobile || application.mobile,
        guardianEmail: application.email,
      },
      academic: {
        admissionNo: application.applicationNo,
        rollNo: '',
        admissionDate: new Date().toISOString().split('T')[0],
        classId: application.applyingClassId,
        sectionId: '',
        session: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        studentType: application.studentType === 'Residential' ? 'residential' : 'day_scholar',
      },
      address: {
        addressLine: application.address || '',
        state: application.state || '',
        district: application.district || '',
        city: application.city || '',
        pinCode: application.pincode || '',
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: approvedBy,
    });

    // 3. Create parent record
    const parentId = `PAR-${applicationId}`;
    const parentRef = doc(db!, 'parents', parentId);
    txn.set(parentRef, {
      parentName: application.guardianName,
      parentType: 'guardian',
      email: application.email,
      phone: application.mobile,
      studentId,
      tenantId: application.tenantId,
      createdAt: serverTimestamp(),
    });

    // 4. Create notification
    const notifId = `NOTIF-${applicationId}`;
    const notifRef = doc(db!, 'notifications', notifId);
    txn.set(notifRef, {
      studentId,
      title: 'Admission Approved',
      message: `Your admission has been approved! Welcome to the school.`,
      type: 'admission',
      recipientMobile: application.mobile,
      recipientEmail: application.email,
      read: false,
      tenantId: application.tenantId,
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
  return updateDocument(APPLICATIONS_COLLECTION, applicationId, {
    applicationStatus: 'Rejected',
    rejectionReason,
    rejectedBy,
    rejectedAt: new Date().toISOString(),
  });
}

// ──────────────────────────────────────────────
//  Enquiry APIs (separate document: admissionEnquiries)
// ──────────────────────────────────────────────

export async function createAdmissionEnquiry(enquiry: AdmissionEnquiry) {
  return createDocument(ENQUIRIES_COLLECTION, enquiry);
}

export async function getAdmissionEnquiries(tenantId: string) {
  return getAllDocuments<AdmissionEnquiry>(ENQUIRIES_COLLECTION, [
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc'),
  ]);
}

export function subscribeToAdmissionEnquiries(
  tenantId: string,
  onData: (data: (AdmissionEnquiry & { id: string })[]) => void,
  onError?: (error: Error) => void
) {
  return subscribeToCollection<AdmissionEnquiry>(
    ENQUIRIES_COLLECTION,
    [where('tenantId', '==', tenantId)],
    (data) => {
      const sorted = [...data].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt as any).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt as any).getTime() : 0;
        return dateB - dateA;
      });
      onData(sorted);
    },
    (err) => {
      console.warn('Enquiry subscription error:', err);
      onError?.(err);
    }
  );
}

export async function updateAdmissionEnquiry(enquiryId: string, updates: Partial<AdmissionEnquiry>) {
  return updateDocument(ENQUIRIES_COLLECTION, enquiryId, updates);
}

export async function acknowledgeEnquiry(enquiryId: string) {
  return updateDocument(ENQUIRIES_COLLECTION, enquiryId, {
    acknowledged: true,
    acknowledgedAt: new Date().toISOString(),
  });
}

// ──────────────────────────────────────────────
//  Fee APIs
// ──────────────────────────────────────────────

export async function getAdmissionFees(tenantId: string) {
  return getAllDocuments<AdmissionFeeRecord>(FEES_COLLECTION, [
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc'),
  ]);
}

export function subscribeToAdmissionFees(
  tenantId: string,
  onData: (data: (AdmissionFeeRecord & { id: string })[]) => void,
  onError?: (error: Error) => void
) {
  return subscribeToCollection<AdmissionFeeRecord>(
    FEES_COLLECTION,
    [where('tenantId', '==', tenantId)],
    (data) => {
      const sorted = [...data].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt as any).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt as any).getTime() : 0;
        return dateB - dateA;
      });
      onData(sorted);
    },
    onError
  );
}

export async function recordAdmissionFeePayment(feeRecord: AdmissionFeeRecord) {
  return createDocument(FEES_COLLECTION, feeRecord);
}

// ──────────────────────────────────────────────
//  System Config APIs
// ──────────────────────────────────────────────

export async function getSystemConfig(tenantId: string): Promise<SystemConfig | null> {
  try {
    const config = await getDocument<SystemConfig>(CONFIG_COLLECTION, tenantId);
    return config;
  } catch {
    return null;
  }
}

export function subscribeToSystemConfig(
  tenantId: string,
  onData: (config: (SystemConfig & { id: string }) | null) => void,
  onError?: (error: Error) => void
) {
  return subscribeToCollection<SystemConfig>(
    CONFIG_COLLECTION,
    [where('tenantId', '==', tenantId)],
    (data) => {
      onData(data.length > 0 ? data[0] : null);
    },
    onError
  );
}

// ──────────────────────────────────────────────
//  Document APIs
// ──────────────────────────────────────────────

export async function getAdmissionDocument(applicationId: string) {
  return getDocument<AdmissionApplication>(APPLICATIONS_COLLECTION, applicationId);
}

// ──────────────────────────────────────────────
//  Send Message (placeholder - integrates with SMS/Email service)
// ──────────────────────────────────────────────

export async function sendMessage(params: {
  recipient: string;
  type: 'sms' | 'email';
  subject?: string;
  message: string;
}) {
  if (db) {
    await createDocument('notifications', {
      recipient: params.recipient,
      type: params.type,
      subject: params.subject || '',
      message: params.message,
      sentAt: new Date().toISOString(),
      status: 'sent',
    });
  }
  return { success: true };
}