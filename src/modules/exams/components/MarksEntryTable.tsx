import { useMemo, useState } from 'react';
import { useExamStore } from '../store/useExamStore';
import { GradeBadge } from './GradeBadge';

export function MarksEntryTable() {
  const { marks } = useExamStore();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const subjects = useMemo(() => [...new Set(marks.map(m => m.subjectName))], [marks]);

  const filtered = selectedSubject === 'all' ? marks : marks.filter(m => m.subjectName === selectedSubject);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">📝 Marks Entry</h3>
            <p className="text-sm text-gray-500 mt-0.5">{marks.length} total entries</p>
          </div>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Student</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Roll</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Subject</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Score</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Grade</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">No marks entries found</td>
                </tr>
              ) : (
                filtered.map((mark) => (
                  <tr key={mark.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-2">
                      <span className="text-sm font-semibold text-gray-900">{mark.studentName}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-500">{mark.rollNumber}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-600">{mark.subjectName}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`text-sm font-bold ${
                          mark.obtainedMarks >= mark.passingMarks ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {mark.obtainedMarks}
                        </span>
                        <span className="text-xs text-gray-400">/ {mark.maximumMarks}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex justify-center">
                        <GradeBadge grade={mark.grade} size="sm" />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        mark.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          mark.status === 'Present' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        {mark.status}
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