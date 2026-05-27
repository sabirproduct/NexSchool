import { StudentForm } from '../components/StudentForm';

export function EditStudentPage() {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5 mb-3">Edit Student</h2>
        <StudentForm mode="edit" onSubmit={async () => {}} />
      </div>
    </div>
  );
}
