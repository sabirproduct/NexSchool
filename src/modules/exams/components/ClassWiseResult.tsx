import { useMemo, useState } from 'react';
import { useExamStore } from '../store/useExamStore';
import { GradeBadge } from './GradeBadge';
import { classData } from '../mocks/seed';

export function ClassWiseResult() {
  const { results, marks, exams } = useExamStore();
  const [selectedClass, setSelectedClass] = useState<string>('10');
  const [selectedExam, setSelectedExam] = useState<string>('all');

  const publishedExams = exams.filter(e => e.status === 'Published');

  const filteredResults = useMemo(() => {
    let filtered = results.filter(r => r.status === 'Published');
    if (selectedExam !== 'all') {
      filtered = filtered.filter(r => r.examId === selectedExam);
    }
    return filtered;
  }, [results, selectedExam]);

  const classPerformance = useMemo(() => {
    return classData.map(cls => {
      const classResults = filteredResults.filter(r => {
        const studentMarks = marks.filter(m => m.studentId === r.studentId);
        return studentMarks.some(m => m.classId === cls.id);
      });

      const avgPercentage = classResults.length > 0
        ? classResults.reduce((sum, r) => sum + r.percentage, 0) / classResults.length
        : 0;
      const passCount = classResults.filter(r => r.percentage >= 33).length;
      const topStudent = classResults.reduce((best, r) => r.percentage > (best?.percentage || 0) ? r : best, classResults[0]);

      return {
        ...cls,
        studentCount: classResults.length,
        avgPercentage: Math.round(avgPercentage * 10) / 10,
        passRate: classResults.length > 0 ? Math.round((passCount / classResults.length) * 100) : 0,
        topStudent: topStudent?.studentName || 'N/A',
        topScore: topStudent?.percentage || 0,
      };
    });
  }, [filteredResults, marks]);

  const selectedClassData = classPerformance.find(c => c.id === selectedClass);

  const studentResults = useMemo(() => {
    return filteredResults
      .filter(r => {
        const studentMarks = marks.filter(m => m.studentId === r.studentId);
        return studentMarks.some(m => m.classId === selectedClass);
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [filteredResults, marks, selectedClass]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">🏆 Class Wise Results</h3>
            <p className="text-sm text-gray-500 mt-0.5">Performance breakdown by class</p>
          </div>
          <div className="flex gap-3">
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
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
            >
              {classData.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name} - {cls.section}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Class Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {classPerformance.map(cls => {
            const avgColor = cls.avgPercentage >= 70 ? 'from-emerald-50 to-green-50 border-emerald-200' :
              cls.avgPercentage >= 50 ? 'from-amber-50 to-yellow-50 border-amber-200' :
              'from-red-50 to-rose-50 border-red-200';
            const textColor = cls.avgPercentage >= 70 ? 'text-emerald-800' :
              cls.avgPercentage >= 50 ? 'text-amber-800' : 'text-red-800';

            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`bg-gradient-to-br ${avgColor} rounded-xl p-4 border-2 text-left transition-all ${
                  selectedClass === cls.id ? 'ring-2 ring-indigo-400 scale-[1.02]' : 'hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">{cls.name}-{cls.section}</span>
                  <span className="text-xs text-gray-500">{cls.studentCount} students</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className={`text-2xl font-bold ${textColor}`}>{cls.avgPercentage}%</p>
                    <p className="text-xs text-gray-500">Average Score</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{cls.passRate}%</p>
                    <p className="text-xs text-gray-500">Pass Rate</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/50">
                  <p className="text-xs text-gray-500">
                    Top: <span className="font-semibold text-gray-700">{cls.topStudent}</span> ({cls.topScore}%)
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Student List for Selected Class */}
        {selectedClassData && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-700">
                {selectedClassData.name} - {selectedClassData.section} Rankings
              </h4>
              <span className="text-xs text-gray-400">{studentResults.length} students</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Rank</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Student</th>
                    <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Score</th>
                    <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Percentage</th>
                    <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">Grade</th>
                    <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 px-2">GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {studentResults.map((r, idx) => {
                    const rankColor = idx === 0 ? 'text-yellow-600' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-700' : 'text-gray-500';
                    const rowBg = idx === 0 ? 'bg-gradient-to-r from-yellow-50/50 to-transparent' : '';

                    return (
                      <tr key={r.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${rowBg}`}>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {idx === 0 ? (
                              <span className="text-lg">🥇</span>
                            ) : idx === 1 ? (
                              <span className="text-lg">🥈</span>
                            ) : idx === 2 ? (
                              <span className="text-lg">🥉</span>
                            ) : (
                              <span className={`text-sm font-bold ${rankColor}`}>#{idx + 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm font-semibold text-gray-900">{r.studentName}</span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="text-sm text-gray-600">{r.obtainedMarks}/{r.totalMarks}</span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-gray-100 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  r.percentage >= 70 ? 'bg-emerald-500' : r.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(r.percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{r.percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex justify-center">
                            <GradeBadge grade={r.finalGrade} size="sm" />
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="text-sm font-semibold text-gray-700">{r.gpa.toFixed(1)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}