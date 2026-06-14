import { useMemo, useState } from 'react';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { AttendanceStatusChip } from './AttendanceStatusChip';
import { getStudentList } from '../mocks/seed';

export function StudentAttendanceBreakdown() {
  const { studentRecords } = useAttendanceStore();
  const students = useMemo(() => getStudentList(studentRecords), [studentRecords]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'percentage' | 'absent'>('percentage');

  const studentStats = useMemo(() => {
    return students
      .map((student) => {
        const records = studentRecords.filter((r) => r.studentId === student.studentId);
        const totalDays = records.length;
        const present = records.filter((r) => r.status === 'Present').length;
        const absent = records.filter((r) => r.status === 'Absent').length;
        const late = records.filter((r) => r.status === 'Late').length;
        const halfDay = records.filter((r) => r.status === 'Half Day').length;
        const leave = records.filter((r) => r.status === 'Leave').length;
        const percentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;
        return { ...student, totalDays, present, absent, late, halfDay, leave, percentage };
      })
      .filter((s) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.studentName.toLowerCase().includes(q) ||
          s.rollNumber.includes(q) ||
          s.studentId.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.studentName.localeCompare(b.studentName);
        if (sortBy === 'absent') return b.absent - a.absent;
        return a.percentage - b.percentage; // ascending (worst first)
      });
  }, [students, studentRecords, searchQuery, sortBy]);

  const summaryStats = useMemo(() => {
    const total = studentStats.length;
    const above90 = studentStats.filter((s) => s.percentage >= 90).length;
    const above75 = studentStats.filter((s) => s.percentage >= 75 && s.percentage < 90).length;
    const below75 = studentStats.filter((s) => s.percentage < 75).length;
    const atRisk = studentStats.filter((s) => s.percentage < 75).length;
    return { total, above90, above75, below75, atRisk };
  }, [studentStats]);

  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-900">{summaryStats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Total Students</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{summaryStats.above90}</p>
          <p className="text-xs text-gray-500 mt-1">Above 90%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-amber-600">{summaryStats.above75}</p>
          <p className="text-xs text-gray-500 mt-1">75-90%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{summaryStats.atRisk}</p>
          <p className="text-xs text-gray-500 mt-1">{'At Risk (<75%)'}</p>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-900">Session Attendance</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="percentage">Lowest % first</option>
              <option value="absent">Most Absent first</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Days</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Present</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Absent</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Late</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">%</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {studentStats.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                        {student.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                        <p className="text-xs text-gray-500">Roll: {student.rollNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">
                    {student.classId}-{student.sectionId}
                  </td>
                  <td className="px-5 py-3 text-sm text-center text-gray-700">{student.totalDays}</td>
                  <td className="px-5 py-3 text-sm text-center text-green-600 font-medium">{student.present}</td>
                  <td className="px-5 py-3 text-sm text-center text-red-600 font-medium">{student.absent}</td>
                  <td className="px-5 py-3 text-sm text-center text-amber-600 font-medium">{student.late}</td>
                  <td className="px-5 py-3 text-sm text-center text-gray-500">{student.halfDay + student.leave}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.percentage >= 90 ? 'bg-green-500' : student.percentage >= 75 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.percentage}%` }}
                        />
                      </div>
                      <span className={`text-sm font-semibold ${
                        student.percentage >= 90 ? 'text-green-600' : student.percentage >= 75 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {student.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {student.percentage >= 90 ? (
                      <AttendanceStatusChip status="Present" />
                    ) : student.percentage >= 75 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                        Needs Improvement
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border bg-red-50 text-red-700 border-red-200">
                        At Risk
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {studentStats.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No students found matching your search</div>
        )}
      </div>
    </div>
  );
}