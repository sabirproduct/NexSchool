import { Student } from '../types';

export function StudentCard({ student }: { student: Student }) {
  return (
    <div className="card border rounded-4 shadow-sm">
      <div className="card-body p-3 d-flex align-items-center gap-3">
        <div
          className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
          style={{ width: 42, height: 42, overflow: 'hidden' }}
        >
          {student.photoUrl ? (
            <img src={student.photoUrl} alt={student.fullName} className="w-100 h-100" style={{ objectFit: 'cover' }} />
          ) : (
            <span className="fs-5">{student.firstName[0]}</span>
          )}
        </div>

        <div className="flex-fill">
          <div className="fw-semibold">{student.fullName}</div>
          <div className="text-muted small">
            {student.academic.classId}-{student.academic.sectionId} • {student.mobile}
          </div>
        </div>

        <span className={`badge ${student.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{student.status}</span>
      </div>
    </div>
  );
}
