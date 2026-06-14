import { useState } from 'react';
import { useExamStore } from '../store/useExamStore';

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700 border-gray-200',
  Scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  Ongoing: 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-green-50 text-green-700 border-green-200',
  Published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function ExamTable() {
  const { exams } = useExamStore();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? exams : exams.filter(e => e.status === filter);
  const statuses = ['Draft', 'Scheduled', 'Ongoing', 'Completed', 'Published'];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">📋 Exam Management</h3>
            <p className="text-sm text-gray-500 mt-0.5">{exams.length} exams scheduled</p>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  filter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Type</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Session</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Duration</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">No exams found</td>
                </tr>
              ) : (
                filtered.map((exam, idx) => (
                  <tr key={exam.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-2">
                      <span className="text-sm font-semibold text-gray-900">{exam.examName}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-600">{exam.examType}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-600">{exam.academicSessionId}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {new Date(exam.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        {' → '}
                        {new Date(exam.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[exam.status] || 'bg-gray-100 text-gray-700'}`}>
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}