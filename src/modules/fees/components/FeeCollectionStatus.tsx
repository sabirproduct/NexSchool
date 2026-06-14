import { useMemo } from 'react';
import { useFeeStore } from '../store/useFeeStore';

export function FeeCollectionStatus() {
  const { classData, assignments } = useFeeStore();

  const totalStudents = useMemo(() => assignments.length, [assignments]);
  const totalDue = useMemo(() => assignments.reduce((s, a) => s + a.totalAmount, 0), [assignments]);
  const totalPaid = useMemo(() => assignments.reduce((s, a) => s + a.paidAmount, 0), [assignments]);
  const totalPending = useMemo(() => assignments.reduce((s, a) => s + a.dueAmount, 0), [assignments]);
  const overallPct = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;

  const statusBreakdown = useMemo(() => {
    const paid = assignments.filter(a => a.status === 'Paid').length;
    const partial = assignments.filter(a => a.status === 'Partial').length;
    const unpaid = assignments.filter(a => a.status === 'Unpaid').length;
    const overdue = assignments.filter(a => a.status === 'Overdue').length;
    const waived = assignments.filter(a => a.status === 'Waived').length;
    return { paid, partial, unpaid, overdue, waived };
  }, [assignments]);

  const getStatusColor = (pct: number) => {
    if (pct >= 80) return { bg: 'from-emerald-500 to-green-600', text: 'text-emerald-600', light: 'bg-emerald-50' };
    if (pct >= 60) return { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-600', light: 'bg-blue-50' };
    if (pct >= 40) return { bg: 'from-amber-500 to-orange-600', text: 'text-amber-600', light: 'bg-amber-50' };
    return { bg: 'from-red-500 to-rose-600', text: 'text-red-600', light: 'bg-red-50' };
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">📊 Fee Collection Status</h3>
            <p className="text-sm text-gray-500 mt-0.5">Class-wise collection and overall status overview</p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-700">{classData.length}</span> classes
          </div>
        </div>

        {/* Overall Progress Ring */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="currentColor" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallPct / 100)}`}
                className={`text-transparent ${getStatusColor(overallPct).bg.replace('from-', '').split(' to-')[0] ? 'text-emerald-500' : ''}`}
                style={{ stroke: overallPct >= 80 ? '#10b981' : overallPct >= 60 ? '#3b82f6' : overallPct >= 40 ? '#f59e0b' : '#ef4444' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900">{overallPct}%</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Students</p>
              <p className="text-lg font-bold text-gray-900">{totalStudents}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Collected</p>
              <p className="text-lg font-bold text-emerald-600">₹{(totalPaid / 100000).toFixed(2)}L</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Pending</p>
              <p className="text-lg font-bold text-amber-600">₹{(totalPending / 100000).toFixed(2)}L</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Due</p>
              <p className="text-lg font-bold text-blue-600">₹{(totalDue / 100000).toFixed(2)}L</p>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {[
            { label: 'Paid', count: statusBreakdown.paid, color: 'bg-emerald-500' },
            { label: 'Partial', count: statusBreakdown.partial, color: 'bg-blue-500' },
            { label: 'Unpaid', count: statusBreakdown.unpaid, color: 'bg-amber-500' },
            { label: 'Overdue', count: statusBreakdown.overdue, color: 'bg-red-500' },
            { label: 'Waived', count: statusBreakdown.waived, color: 'bg-gray-400' },
          ].map(({ label, count, color }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className={`w-2 h-2 rounded-full ${color} mx-auto mb-1.5`} />
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>

        {/* Class-wise Collection Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Due</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Collected</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Collection %</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classData.map((cls) => {
                const statusColor = getStatusColor(cls.collectionPct);
                return (
                  <tr key={cls.classId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-gray-900">Class {cls.classId}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-700">{cls.totalStudents}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-700">₹{(cls.totalDue / 1000).toFixed(0)}k</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-emerald-600">₹{(cls.totalCollected / 1000).toFixed(0)}k</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-bold ${statusColor.text}`}>{cls.collectionPct}%</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-amber-600 font-medium">{cls.pendingCount} students</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${statusColor.bg}`}
                            style={{ width: `${cls.collectionPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Overall collection rate: <span className="font-semibold text-gray-700">{overallPct}%</span></span>
          <span>
            Classes above 80%: <span className="font-semibold text-emerald-600">{classData.filter(c => c.collectionPct >= 80).length}</span>
            {' | '}Below 60%: <span className="font-semibold text-red-600">{classData.filter(c => c.collectionPct < 60).length}</span>
          </span>
        </div>
      </div>
    </div>
  );
}