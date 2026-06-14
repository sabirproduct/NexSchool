import { useMemo, useState } from 'react';
import { useExamStore } from '../store/useExamStore';
import { ExamTable } from './ExamTable';
import { ExamScheduler } from './ExamScheduler';
import { MarksEntryTable } from './MarksEntryTable';
import { RankTable } from './RankTable';
import { ResultAnalyticsChart } from './ResultAnalyticsChart';
import { ResultCard } from './ResultCard';
import { ClassWiseResult } from './ClassWiseResult';
import { AIReportCard } from './AIReportCard';
import { StudentResult } from '../types';

export function ExamModuleView() {
  const { exams, marks, results, schedules } = useExamStore();
  const [selectedAIResult, setSelectedAIResult] = useState<StudentResult | null>(null);

  const averagePerformance = useMemo(
    () => results.reduce((sum, item) => sum + item.percentage, 0) / Math.max(results.length, 1),
    [results]
  );

  const publishedResults = results.filter(r => r.status === 'Published');

  const statCards = [
    { label: 'Total Exams', value: exams.length, icon: '📋', color: 'from-blue-500 to-indigo-600' },
    { label: 'Upcoming Exams', value: exams.filter((x) => x.status === 'Scheduled').length, icon: '📅', color: 'from-emerald-500 to-green-600' },
    { label: 'Published Results', value: publishedResults.length, icon: '✅', color: 'from-purple-500 to-violet-600' },
    { label: 'Students Assessed', value: [...new Set(marks.map(m => m.studentId))].length, icon: '👨‍🎓', color: 'from-amber-500 to-orange-600' },
    { label: 'Avg Performance', value: `${averagePerformance.toFixed(1)}%`, icon: '📊', color: 'from-rose-500 to-pink-600' },
    { label: 'Active Exams', value: exams.filter((x) => x.status === 'Ongoing' || x.status === 'Scheduled').length, icon: '🎯', color: 'from-cyan-500 to-teal-600' },
  ];

  const handlePrint = (result: StudentResult) => {
    // For AI Report Card print, we open the AI report
    setSelectedAIResult(result);
  };

  const handleViewAI = (result: StudentResult) => {
    setSelectedAIResult(result);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className={`h-1.5 bg-gradient-to-r ${card.color}`} />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</span>
                <span className="text-lg group-hover:scale-110 transition-transform">{card.icon}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-1">
          <ResultAnalyticsChart />
        </div>
        <div className="col-span-1">
          <ExamScheduler />
        </div>
      </div>

      {/* Class Wise Results */}
      <ClassWiseResult />

      {/* Exams & Marks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExamTable />
        <MarksEntryTable />
      </div>

      {/* Result Cards */}
      <div className="col-span-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">📜 Published Result Cards</h3>
                <p className="text-sm text-gray-500 mt-0.5">View, print report cards and AI-powered analysis</p>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {publishedResults.length} results
              </span>
            </div>

            {publishedResults.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl">📭</span>
                <p className="text-gray-400 mt-3 font-medium">No published results yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {publishedResults.map((result) => (
                  <ResultCard
                    key={result.id}
                    result={result}
                    onPrint={handlePrint}
                    onViewAI={handleViewAI}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rank Table */}
      <RankTable />

      {/* AI Report Card Modal */}
      {selectedAIResult && (
        <AIReportCard
          result={selectedAIResult}
          marks={marks.filter(m => m.examId === selectedAIResult.examId)}
          onClose={() => setSelectedAIResult(null)}
        />
      )}
    </div>
  );
}