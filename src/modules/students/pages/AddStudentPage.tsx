import { useState } from 'react';
import { StudentForm, StudentAdmissionFormValues } from '../components/StudentForm';
import { createStudent, updateStudent } from '../services/studentService';
import { uploadStudentDocuments } from '../services/storageService';
import { useAuthStore } from '../../../store/authStore';
import { HostelInfo, Student } from '../types';
import { AdmissionPrintView } from '../components/AdmissionPrintView';
import { compressImage } from '../utils/imageCompress';

export function AddStudentPage() {
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ student: Student; formValues: StudentAdmissionFormValues } | null>(null);
  const schoolId = useAuthStore((s) => s.user?.schoolId);

  const handleSubmit = async (values: StudentAdmissionFormValues) => {
    setSubmitting(true);
    setToast('');

    try {
      // 1. Compress images to reduce size before storing
      let compressedPhoto = values.photoBinary;
      let compressedDocs = values.documentsBinary ? { ...values.documentsBinary } : undefined;

      if (compressedPhoto) {
        compressedPhoto = await compressImage(compressedPhoto, 600, 0.6);
      }
      if (compressedDocs) {
        for (const key of Object.keys(compressedDocs)) {
          if (compressedDocs[key]) {
            compressedDocs[key] = await compressImage(compressedDocs[key], 800, 0.6);
          }
        }
      }

      // 2. Build the student payload with compressed binary data
      const now = new Date().toISOString();
      const studentPayload: Omit<Student, 'id'> & { photoBinary?: string; documentsBinary?: Record<string, string> } = {
        firstName: values.firstName,
        lastName: values.lastName,
        fullName: `${values.firstName} ${values.lastName}`,
        gender: values.gender,
        dob: values.dob,
        bloodGroup: values.bloodGroup,
        religion: values.religion,
        category: values.category,
        aadhaarNo: values.aadhaarNo,
        mobile: values.mobile,
        email: values.email,
        parent: values.parent,
        academic: values.academic,
        address: values.address,
        hostel: values.hostel && values.hostel.hostelName
          ? {
              hostelName: values.hostel.hostelName || '',
              roomNo: values.hostel.roomNo || '',
              bedNo: values.hostel.bedNo || '',
              wardenName: values.hostel.wardenName || '',
              joiningDate: values.hostel.joiningDate || '',
            } as HostelInfo
          : undefined,
        status: 'active',
        createdAt: now,
        updatedAt: now,
        createdBy: schoolId || 'unknown',
        schoolId,
        // Include compressed binary data directly in the document
        photoBinary: compressedPhoto,
        documentsBinary: compressedDocs,
      };

      // 3. Create the student document in Firestore (compressed binary data embedded)
      const created = await createStudent(studentPayload as unknown as Student, schoolId);
      const studentId = created.id;

      // 4. Also upload to Firebase Storage for production use
      if (values.photo && values.photo.length > 0) {
        try {
          await uploadStudentDocuments(studentId, { photo: values.photo });
        } catch {
          // Storage upload is secondary - ignore failures
        }
      }

      setToastType('success');
      setToast(`Student "${values.firstName} ${values.lastName}" created successfully with ID: ${studentId}`);

      // 5. Show the print view after short delay
      setTimeout(() => {
        setSubmittedData({
          student: { ...created, id: studentId },
          formValues: values,
        });
      }, 500);
    } catch (err: any) {
      console.error('Error creating student:', err);
      setToastType('error');
      setToast(err?.message || 'Failed to create student. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // When submission is complete, show the print view
  if (submittedData) {
    return <AdmissionPrintView student={submittedData.student} formValues={submittedData.formValues} onClose={() => setSubmittedData(null)} />;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-none d-sm-block">
          <h2 className="h5 mb-3">Add Student</h2>
        </div>
        <StudentForm mode="create" onSubmit={handleSubmit} />
        {submitting && (
          <div className="position-fixed bottom-0 end-0 m-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Submitting...</span>
            </div>
          </div>
        )}
        {toast && (
          <div
            className={`toast show position-fixed bottom-0 end-0 m-3 ${
              toastType === 'success' ? 'bg-success' : 'bg-danger'
            } text-white`}
            role="alert"
            style={{ zIndex: 9999 }}
          >
            <div className="toast-body d-flex justify-content-between align-items-center">
              {toast}
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                onClick={() => setToast('')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}