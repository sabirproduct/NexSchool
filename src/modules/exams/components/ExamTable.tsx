import { useExamStore } from '../store/useExamStore';

export function ExamTable() {
  const { exams } = useExamStore();
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="h6 mb-3">Exam Management</h3>
        <div className="table-responsive">
          <table className="table table-sm table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Session</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.examName}</td>
                  <td>{exam.examType}</td>
                  <td>{exam.academicSessionId}</td>
                  <td>{exam.startDate} → {exam.endDate}</td>
                  <td>
                    <span className={`badge ${exam.status === 'Published' ? 'bg-success' : 'bg-secondary'}`}>{exam.status}</span>
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
