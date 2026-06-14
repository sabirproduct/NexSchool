import { useMemo } from 'react';
import { useFeeStore } from '../store/useFeeStore';
import { FeeCollectionTrend } from './FeeCollectionTrend';
import { StudentWiseFeeDelayAnalysis } from './StudentWiseFeeDelayAnalysis';
import { FeeCollectionStatus } from './FeeCollectionStatus';
import { AIFeeReport } from './AIFeeReport';

export function FeeModuleView() {
  const { assignments, delayRecords, classData } = useFeeStore();

  const statCards = useMemo(() => {
    const totalDue = assignments.reduce((s, a) => s + a.dueAmount, 0);
    const totalPaid = assignments.reduce((s, a) => s + a.paidAmount, 0);
    const totalAmount = assignments.reduce((s, a) => s + a.totalAmount, 0);
    const collectionPct = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
    const paidCount = assignments.filter(a => a.status === 'Paid').length;
    const overdueCount = assignments.filter(a => a.status === 'Overdue').length;
    const totalStudents = assignments.length;

    return [
      { label: 'Total Students', value: totalStudents.toString(), icon: '👨‍🎓', color: 'from-blue-500 to-indigo-600', detail: `${classData.length} classes` },
      { label: 'Collection Rate', value: `${collectionPct}%`, icon: '📊', color: 'from-emerald-500 to-green-600', detail: `₹${(totalPaid / 100000).toFixed(1)}L collected` },
      { label: 'Pending Dues', value: `₹${(totalDue / 1000).toFixed(0)}k`, icon: '⏳', color: 'from-amber-500 to-orange-600', detail: `${assignments.filter(a => a.status === 'Unpaid' || a.status === 'Partial').length} students` },
      { label: 'Overdue Count', value: overdueCount.toString(), icon: '🔴', color: 'from-red-500 to-rose-600', detail: `${delayRecords.length} delayed payments` },
      { label: 'Fully Paid', value: paidCount.toString(), icon: '✅', color: 'from-purple-500 to-violet-600', detail: `${Math.round((paidCount / Math.max(totalStudents, 1)) * 100)}% of students` },
      { label: 'Fee Structures', value: '8', icon: '📋', color: 'from-cyan-500 to-teal-600', detail: 'Tuition, Hostel, Transport, etc.' },
    ];
  }, [assignments, delayRecords, classData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fees & Payment Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Track fee collection, manage dues, and monitor financial health</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Session 2025-26</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
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
              <p className="text-xs text-gray-400 mt-0.5">{card.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row - Trend & Collection Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeeCollectionTrend />
        <FeeCollectionStatus />
      </div>

      {/* Fee Delay Analysis */}
      <StudentWiseFeeDelayAnalysis />

      {/* AI Report */}
      <AIFeeReport />
    </div>
  );
}