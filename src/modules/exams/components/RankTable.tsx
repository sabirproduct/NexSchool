import { useExamStore } from '../store/useExamStore';

export function RankTable() {
  const { results } = useExamStore();
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="h6 mb-3">Ranking System</h3>
        <div className="table-responsive">
          <table className="table table-sm table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Class Rank</th>
                <th>Section Rank</th>
                <th>Percentage</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              {results.slice().sort((a, b) => a.classRank - b.classRank).map((result) => (
                <tr key={result.id}>
                  <td>{result.studentName}</td>
                  <td>{result.classRank}</td>
                  <td>{result.sectionRank}</td>
                  <td>{result.percentage}%</td>
                  <td>{result.gpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
