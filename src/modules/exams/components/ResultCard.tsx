import { StudentResult } from '../types';

export function ResultCard({ result }: { result: StudentResult }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
          <h3 className="h6 mb-0">{result.studentName}</h3>
          <span className={`badge ${result.status === 'Published' ? 'bg-success' : 'bg-secondary'}`}>{result.status}</span>
        </div>
        <p className="mb-1 small">Percentage: {result.percentage}%</p>
        <p className="mb-1 small">GPA: {result.gpa}</p>
        <p className="mb-0 small">Final Grade: {result.finalGrade}</p>
        <p className="mb-0 small">Rank: #{result.classRank}</p>
      </div>
    </div>
  );
}
