import { useExamStore } from '../store/useExamStore';

export function ExamScheduler() {
  const { schedules } = useExamStore();
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="h6 mb-3">Exam Schedule Management</h3>
        <div className="table-responsive">
          <table className="table table-sm table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Class</th>
                <th>Section</th>
                <th>Subject</th>
                <th>Exam Date</th>
                <th>Time</th>
                <th>Max/Pass</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((slot) => (
                <tr key={slot.id}>
                  <td>{slot.classId}</td>
                  <td>{slot.sectionId}</td>
                  <td>{slot.subjectName}</td>
                  <td>{slot.examDate}</td>
                  <td>{slot.startTime} - {slot.endTime}</td>
                  <td>{slot.maximumMarks}/{slot.passingMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
