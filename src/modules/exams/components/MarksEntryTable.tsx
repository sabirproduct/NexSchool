import { useExamStore } from '../store/useExamStore';

export function MarksEntryTable() {
  const { marks } = useExamStore();
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="h6 mb-3">Marks Entry</h3>
        <div className="table-responsive">
          <table className="table table-sm table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Roll</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark) => (
                <tr key={mark.id}>
                  <td>{mark.studentName}</td>
                  <td>{mark.rollNumber}</td>
                  <td>{mark.subjectName}</td>
                  <td>{mark.obtainedMarks}/{mark.maximumMarks}</td>
                  <td>{mark.grade}</td>
                  <td>
                    <span className={`badge ${mark.status === 'Present' ? 'bg-success' : 'bg-warning text-dark'}`}>{mark.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
