import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StudentForm, StudentAdmissionFormValues } from '../components/StudentForm';
import { getStudentById, updateStudent } from '../services/studentService';
import { uploadStudentDocuments } from '../services/storageService';
import { useAuthStore } from '../../../store/authStore';
import { HostelInfo, Student } from '../types';

export function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);
  const schoolId = useAuthStore((s) => s.user?.schoolId);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getStudentById(id)
      .then((data) => {
        setStudent(data || null);
      })
      .catch((err) => {
        console.error('Error loading student:', err);
        setToastType('error');
        setToast('Failed to load student data.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const mapStudentToFormValues = (s: Student): StudentAdmissionFormValues => ({
    firstName: s.firstName,
    lastName: s.lastName,
    gender: s.gender,
    dob: s.dob,
    bloodGroup: s.bloodGroup,
    religion: s.religion,
    category: s.category,
    aadhaarNo: s.aadhaarNo,
    mobile: s.mobile,
    email: s.email,
    parent: s.parent,
    academic: s.academic,
    address: s.address,
    hostel: s.hostel
      ? {
          hostelName: s.hostel.hostelName || '',
          roomNo: s.hostel.roomNo || '',
          bedNo: s.hostel.bedNo || '',
          wardenName: s.hostel.wardenName || '',
          joiningDate: s.hostel.joiningDate || '',
        }
      : undefined,
  });

  const handleSubmit = async (values: StudentAdmissionFormValues) => {
    if (!id) return;
    setSubmitting(true);
    setToast('');

    try {
      const patch: Partial<Student> = {
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
        schoolId: schoolId || student?.schoolId,
      };

      await updateStudent(id, patch);

      // Upload files if any
      if (values.photo && values.photo.length > 0) {
        await uploadStudentDocuments(id, { photo: values.photo });
      }
      if (values.documents) {
        const docFiles: Record<string, FileList | undefined> = {};
        if (values.documents.birthCertificate?.length) docFiles.birthCertificate = values.documents.birthCertificate;
        if (values.documents.transferCertificate?.length) docFiles.transferCertificate = values.documents.transferCertificate;
        if (values.documents.aadhaar?.length) docFiles.aadhaar = values.documents.aadhaar;
        if (values.documents.previousMarksheet?.length) docFiles.previousMarksheet = values.documents.previousMarksheet;
        if (values.documents.otherDocuments?.length) docFiles.otherDocuments = values.documents.otherDocuments;
        if (Object.keys(docFiles).length > 0) {
          await uploadStudentDocuments(id, docFiles);
        }
      }

      setToastType('success');
      setToast(`Student "${values.firstName} ${values.lastName}" updated successfully.`);
    } catch (err: any) {
      console.error('Error updating student:', err);
      setToastType('error');
      setToast(err?.message || 'Failed to update student. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-slate-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            Student not found or could not be loaded.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5 mb-3">Edit Student: {student.firstName} {student.lastName}</h2>
        <StudentForm
          mode="edit"
          defaultValues={mapStudentToFormValues(student)}
          onSubmit={handleSubmit}
        />
        {submitting && (
          <div className="position-fixed bottom-0 end-0 m-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Saving...</span>
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