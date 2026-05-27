import { useState } from 'react';
import { StudentForm, StudentAdmissionFormValues } from '../components/StudentForm';

export function AddStudentPage() {
  const [toast, setToast] = useState('');

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5 mb-3">Add Student</h2>
        <div className="alert alert-info">This form is production-structured. Connect submission to Firebase Auth/Firestore/Storage service methods.</div>
        <StudentForm mode="create" onSubmit={async (_values: StudentAdmissionFormValues) => { setToast('Student admission submitted (placeholder).'); }} />
        {toast && <div className="toast show position-fixed bottom-0 end-0 m-3 bg-primary text-white" role="alert">{toast}</div>}
      </div>
    </div>
  );
}
