import { useMemo, useState } from 'react';
import { useExamStore } from '../store/useExamStore';
import { GradeBadge } from './GradeBadge';

export function RankTable() {
  const { results, exams } = useExamStore();
  const [selectedExam, setSelectedExam] = useState<string>('all');

  const publishedExams = exams.filter(e => e.status === 'Published');

  const rankedResults = useMemo(() => {
    let filtered = results;
    if (selectedExam !== 'all') {
      filtered = filtered.filter(r => r.examId === selectedExam);
    }
    return filtered.slice().sort((a, b) => {
      // First by percentage descending
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      // Then by GPA descending
      return b.gpa - a.gpa;
    });
  }, [results, selectedExam]);

  const topThree = rankedResults.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">🏆 Rankings</h3>
            <p className="text-sm text-gray-500 mt-0.5">Student ranking & leaderboard</p>
          </div>
          <select
            value={selectedExam}
            onChange={e => setSelectedExam(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
          >
            <option value="all">All Exams</option>
            {publishedExams.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.examName}</option>
            ))}
          </select>
        </div>

        {/* Podium */}
        {rankedResults.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-6">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mx-auto mb-1 shadow-lg">
                <span className="text-2xl">🥈</span>
              </div>
              <p className="text-xs font-bold text-gray-800">{topThree[1]?.studentName?.split(' ')[0]}</p>
              <p className="text-xs text-gray-500">{topThree[1]?.percentage.toFixed(1)}%</p>
              <div className="w-16 h-20 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg mx-auto mt-1 flex items-end justify-center pb-2">
                <span className="text-sm font-bold text-gray-700">#2</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center mx-auto mb-1 shadow-lg ring-4 ring-yellow-200">
                <span className="text-3xl">👑</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{topThree[0]?.studentName?.split(' ')[0]}</p>
              <p className="text-xs text-yellow-600 font-semibold">{topThree[0]?.percentage.toFixed(1)}%</p>
              <div className="w-20 h-24 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-lg mx-auto mt-1 flex items-end justify-center pb-2">
                <span className="text-lg font-bold text-white">#1</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center mx-auto mb-1 shadow-lg">
                <span className="text-2xl">🥉</span>
              </div>
              <p className="text-xs font-bold text-gray-800">{topThree[2]?.studentName?.split(' ')[0]}</p>
              <p className="text-xs text-gray-500">{topThree[2]?.percentage.toFixed(1)}%</p>
              <div className="w-16 h-16 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-lg mx-auto mt-1 flex items-end justify-center pb-2">
                <span className="text-sm font-bold text-white">#3</span>
              </div>
            </div>
          </div>
        )}

        {/* Rankings Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Rank</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Student</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Percentage</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">GPA</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {rankedResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">No results to rank</td>
                </tr>
              ) : (
                rankedResults.map((result, idx) => {
                  const isTop3 = idx < 3;
                  const rowBg = isTop3 ? 'bg-gradient-to-r from-yellow-50/30 to-transparent' : '';

                  return (
                    <tr key={result.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${rowBg}`}>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {idx === 0 ? (
                            <span className="text-lg">🥇</span>
                          ) : idx === 1 ? (
                            <span className="text-lg">🥈</span>
                          ) : idx === 2 ? (
                            <span className="text-lg">🥉</span>
                          ) : (
                            <span className="text-sm font-bold text-gray-500">#{idx + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{result.studentName}</span>
                          <span className="text-xs text-gray-400 ml-2">Rank #{result.classRank} in class</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                result.percentage >= 70 ? 'bg-emerald-500' : result.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(result.percentage, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold ${
                            result.percentage >= 70 ? 'text-emerald-600' : result.percentage >= 50 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {result.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="text-sm font-semibold text-gray-700">{result.gpa.toFixed(1)}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex justify-center">
                          <GradeBadge grade={result.finalGrade} size="sm" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}