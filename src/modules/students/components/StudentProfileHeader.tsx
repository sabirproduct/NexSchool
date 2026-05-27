import { Link } from 'react-router-dom';
import { Student } from '../types';

export function StudentProfileHeader({ student }: { student: Student }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt={student.fullName} className="rounded-circle border" style={{ width: 72, height: 72, objectFit: 'cover' }} />
            ) : (
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 72, height: 72, fontSize: '1.25rem' }}>
                {student.firstName[0]}
              </div>
            )}
            <div>
              <h3 className="h5 mb-1">{student.fullName}</h3>
              <p className="mb-1 small text-muted">Admission: {student.academic.admissionNo} • Roll: {student.academic.rollNo}</p>
              <p className="mb-0 small text-muted">Class {student.academic.classId}-{student.academic.sectionId} • {student.mobile}</p>
              <div className="mt-2 d-flex flex-wrap gap-2">
                <span className="badge bg-secondary">{student.academic.studentType === 'residential' ? 'Residential' : 'Day Scholar'}</span>
                <span className={`badge ${student.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{student.status}</span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm">Send Notice</button>
            <button type="button" className="btn btn-outline-secondary btn-sm">Mark Attendance</button>
            <button type="button" className="btn btn-outline-secondary btn-sm">Print Profile</button>
            <Link to={`/students/${student.id}/edit`} className="btn btn-primary btn-sm">Edit</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
