import { Student } from '../types';

export function StudentTable({
  rows,
  total,
  loading,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onDelete,
}: {
  rows: Student[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (v: number) => void;
  onPageSizeChange: (v: number) => void;
  onDelete: (id: string) => void;
}) {
  if (loading) {
    return (
      <div className="d-grid gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="placeholder-glow rounded-3" style={{ height: 42, backgroundColor: '#e9ecef' }} />
        ))}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">No students found. Try changing search/filter.</div>
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="card shadow-sm">
      <div className="table-responsive">
        <table className="table table-sm mb-0">
          <thead className="table-light">
            <tr>
              <th>Student Photo</th>
              <th>Admission Number</th>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Gender</th>
              <th>Mobile</th>
              <th>Student Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center" style={{ width: 34, height: 34, overflow: 'hidden' }}>
                    {r.photoUrl ? (
                      <img src={r.photoUrl} alt={r.fullName} style={{ width: 34, height: 34, objectFit: 'cover' }} />
                    ) : (
                      <span>{r.firstName[0]}</span>
                    )}
                  </div>
                </td>
                <td>{r.academic.admissionNo}</td>
                <td>{r.academic.rollNo}</td>
                <td>{r.fullName}</td>
                <td>{r.academic.classId}</td>
                <td>{r.academic.sectionId}</td>
                <td>{r.gender}</td>
                <td>{r.mobile}</td>
                <td>{r.academic.studentType}</td>
                <td>
                  <span className={`badge ${r.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{r.status}</span>
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    <button type="button" className="btn btn-sm btn-outline-secondary">
                      View
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-secondary">
                      Edit
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(r.id)}>
                      Delete
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-secondary">
                      Promote
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-secondary">
                      Print ID
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-footer d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div>
          Showing {Math.min(total, page * pageSize + 1)} - {Math.min(total, (page + 1) * pageSize)} of {total}
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <select
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="btn-group btn-group-sm">
            <button type="button" className="btn btn-outline-secondary" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
              Prev
            </button>
            <button type="button" className="btn btn-outline-secondary" disabled={page >= pageCount - 1} onClick={() => onPageChange(page + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
