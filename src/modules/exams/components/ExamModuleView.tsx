import { useMemo } from 'react';
import { useExamStore } from '../store/useExamStore';
import { ExamTable } from './ExamTable';
import { ExamScheduler } from './ExamScheduler';
import { MarksEntryTable } from './MarksEntryTable';
import { RankTable } from './RankTable';
import { ResultAnalyticsChart } from './ResultAnalyticsChart';
import { ResultCard } from './ResultCard';

export function ExamModuleView() {
  const { exams, marks, results, schedules } = useExamStore();
  const averagePerformance = useMemo(
    () => results.reduce((sum, item) => sum + item.percentage, 0) / Math.max(results.length, 1),
    [results]
  );
  const statCards = [
    { label: 'Total Exams', value: exams.length },
    { label: 'Upcoming Exams', value: exams.filter((x) => x.status === 'Scheduled').length },
    { label: 'Published Results', value: results.filter((x) => x.status === 'Published').length },
    { label: 'Pending Marks Entry', value: marks.filter((x) => x.status !== 'Present').length },
    { label: 'Average School Performance', value: `${averagePerformance.toFixed(1)}%` },
    { label: 'Top Performing Class', value: 'Class 10-A' },
  ];

  return (
    <div className="row g-4">
      {statCards.map((card) => (
        <div className="col-12 col-md-6 col-xl-4" key={card.label}>
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted small mb-1">{card.label}</p>
              <h3 className="h5 mb-0">{card.value}</h3>
            </div>
          </div>
        </div>
      ))}

      <div className="col-12">
        <ResultAnalyticsChart />
      </div>

      <div className="col-12">
        <ExamTable />
      </div>

      <div className="col-12">
        <ExamScheduler />
      </div>

      <div className="col-12">
        <MarksEntryTable />
      </div>

      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="h6 mb-3">Published Result Cards</h3>
            <div className="row g-3">
              {results.map((result) => (
                <div className="col-12 col-md-6" key={result.id}>
                  <ResultCard result={result} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <RankTable />
      </div>
    </div>
  );
}
