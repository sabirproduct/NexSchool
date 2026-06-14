import { useMemo, useState } from 'react';
import { useFeeStore } from '../store/useFeeStore';

type SortKey = 'overdueDays' | 'dueAmount' | 'lateFee' | 'studentName';

export function StudentWiseFeeDelayAnalysis() {
  const { delayRecords } = useFeeStore();
  const [sortKey, setSortKey] = useState<SortKey>('overdueDays');
  const [sortAsc, setSortAsc] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const sortedDelays = useMemo(() => {
    const filtered = delayRecords.filter(d =>
      d.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.feeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.classId.includes(searchTerm)
    );
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [delayRecords, sortKey, sortAsc, searchTerm]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const getSeverityColor = (days: number) => {
    if (days >= 60) return 'bg-red-50 text-red-800 border-red-200';
    if (days >= 30) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-yellow-50 text-yellow-800 border-yellow-200';
  };

  const getSeverityBadge = (days: number) => {
    if (days >= 60) return '🔴 Critical';
    if (days >= 30) return '🟡 High';
    if (days >= 15) return '🟢 Medium';
    return '🔵 Low';
  };

  const totalOverdueAmount = useMemo(() => delayRecords.reduce((s, d) => s + d.dueAmount, 0), [delayRecords]);
  const totalLateFee = useMemo(() => delayRecords.reduce((s, d) => s + d.lateFee, 0), [delayRecords]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">⏰ Student-wise Fee Delay Analysis</h3>
            <p className="text-sm text-gray-500 mt-0.5">Overdue fee tracking with severity assessment</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none w-48"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <span className="font-semibold text-gray-700">{delayRecords.length}</span> delinquent
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
            <p className="text-xs text-red-600 font-medium uppercase tracking-wider">Total Overdue</p>
            <p className="text-xl font-bold text-red-700 mt-1">₹{totalOverdueAmount.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">Total Late Fee</p>
            <p className="text-xl font-bold text-amber-700 mt-1">₹{totalLateFee.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Avg Overdue/Student</p>
            <p className="text-xl font-bold text-blue-700 mt-1">
              ₹{delayRecords.length > 0 ? Math.round(totalOverdueAmount / delayRecords.length).toLocaleString() : 0}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: 'studentName' as SortKey, label: 'Student' },
                  { key: 'overdueDays' as SortKey, label: 'Overdue Days' },
                  { key: 'dueAmount' as SortKey, label: 'Due Amount' },
                  { key: 'lateFee' as SortKey, label: 'Late Fee' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                    onClick={() => toggleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {sortKey === key && (
                        <svg className={`w-3 h-3 transition-transform ${sortAsc ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedDelays.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    <span className="text-3xl block mb-2">✅</span>
                    No overdue fee records found
                  </td>
                </tr>
              ) : (
                sortedDelays.map((record, idx) => (
                  <tr key={`${record.studentId}-${record.feeName}-${idx}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                          {record.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{record.studentName}</p>
                          <p className="text-xs text-gray-500">Roll: {record.rollNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-gray-900">{record.overdueDays}</span>
                      <span className="text-xs text-gray-500 ml-1">days</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-red-600">₹{record.dueAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-amber-600">₹{record.lateFee.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-700">{record.feeName}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-700">Class {record.classId}-{record.sectionId}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${getSeverityColor(record.overdueDays)}`}>
                        {getSeverityBadge(record.overdueDays)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {sortedDelays.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing {sortedDelays.length} of {delayRecords.length} records</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">🔴 Critical (60+ days)</span>
              <span className="flex items-center gap-1">🟡 High (30-59 days)</span>
              <span className="flex items-center gap-1">🟢 Medium (15-29 days)</span>
              <span className="flex items-center gap-1">🔵 Low (1-14 days)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}