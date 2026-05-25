import { AdmissionApplication } from '../types';

// Firestore collections: admissionApplications, admissionEnquiries, admissionReviews, admissionDocuments, admissionFees.
export async function submitAdmissionApplication(application: AdmissionApplication) {
  // TODO: replace with Firestore addDoc
  return application;
}

export async function approveAdmissionTransaction(application: AdmissionApplication, approvedBy: string) {
  // TODO: Firestore runTransaction:
  // 1) update admissionApplications/{id} status=Approved
  // 2) create students/{studentId} with admissionNo and rollNo placeholder
  // 3) create parents/{parentId} placeholder account
  // 4) create notifications/{id}
  return { ...application, applicationStatus: 'Approved' as const, approvedBy, approvedAt: new Date().toISOString() };
}
