import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

const COLORS = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#3b82f6', purple: '#8b5cf6', pink: '#ec4899', teal: '#14b8a6' };

const MONTHLY_COLLECTION = [
  { month: 'Jan', target: 1250000, collected: 1150000, pending: 100000 },
  { month: 'Feb', target: 1250000, collected: 1200000, pending: 50000 },
  { month: 'Mar', target: 1250000, collected: 1100000, pending: 150000 },
  { month: 'Apr', target: 1250000, collected: 1180000, pending: 70000 },
  { month: 'May', target: 1250000, collected: 1220000, pending: 30000 },
  { month: 'Jun', target: 1250000, collected: 1080000, pending: 170000 },
];

const FEE_BREAKDOWN = [
  { name: 'Tuition Fee', amount: 850000, paid: 780000, pending: 70000 },
  { name: 'Transport Fee', amount: 180000, paid: 150000, pending: 30000 },
  { name: 'Hostel Fee', amount: 120000, paid: 100000, pending: 20000 },
  { name: 'Library Fee', amount: 45000, paid: 40000, pending: 5000 },
  { name: 'Sports Fee', amount: 35000, paid: 25000, pending: 10000 },
  { name: 'Lab Fee', amount: 25000, paid: 20000, pending: 5000 },
];

const TOP_DEFAULTERS = [
  { student: 'Rohan Verma', class: 'Std 10-A', amount: 25000, overdueDays: 45, status: 'critical' },
  { student: 'Priya Singh', class: 'Std 9-B', amount: 18000, overdueDays: 30, status: 'warning' },
  { student: 'Kunal Gupta', class: 'Std 8-A', amount: 15000, overdueDays: 25, status: 'warning' },
  { student: 'Sneha Patel', class: 'Std 10-B', amount: 12000, overdueDays: 20, status: 'moderate' },
  { student: 'Anjali Sharma', class: 'Std 7-A', amount: 8000, overdueDays: 15, status: 'moderate' },
];

const RECENT_TRANSACTIONS = [
  { id: 'TXN001', student: 'Aarav Sharma', amount: 15000, mode: 'UPI', date: 'Today', status: 'success' },
  { id: 'TXN002', student: 'Anaya Kapoor', amount: 12000, mode: 'Cheque', date: 'Yesterday', status: 'success' },
  { id: 'TXN003', student: 'Vihaan Singh', amount: 8000, mode: 'Cash', date: 'Yesterday', status: 'success' },
  { id: 'TXN004', student: 'Ishita Gupta', amount: 20000, mode: 'Online', date: '2 days ago', status: 'failed' },
  { id: 'TXN005', student: 'Arjun Patel', amount: 5000, mode: 'UPI', date: '2 days ago', status: 'success' },
];

export function AccountantDashboard() {
  const totalTarget = MONTHLY_COLLECTION.reduce((s, m) => s + m.target, 0);
  const totalCollected = MONTHLY_COLLECTION.reduce((s, m) => s + m.collected, 0);
  const totalPending = MONTHLY_COLLECTION.reduce((s, m) => s + m.pending, 0);
  const collectionRate = Math.round((totalCollected / totalTarget) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Finance & Accounts Dashboard</h2>
            <p className="text-emerald-100 mt-1">Real-time fee collection, revenue tracking & financial analytics</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Collection', value: `₹${(totalCollected / 100000).toFixed(1)}L`, icon: '💰', sub: `of ₹${(totalTarget / 100000).toFixed(1)}L target`, color: COLORS.success },
          { label: 'Collection Rate', value: `${collectionRate}%`, icon: '🎯', sub: `${totalPending > 0 ? `₹${(totalPending / 1000).toFixed(0)}K pending` : 'On track'}`, color: COLORS.primary },
          { label: 'Monthly Average', value: `₹${(totalCollected / MONTHLY_COLLECTION.length / 1000).toFixed(0)}K`, icon: '📈', sub: 'Per month average', color: COLORS.purple },
          { label: 'Defaulters', value: TOP_DEFAULTERS.filter(d => d.status === 'critical').length.toString(), icon: '⚠️', sub: 'Critical >30 days', color: COLORS.danger },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{kpi.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{kpi.label}</p>
            <p className="text-[10px] text-gray-400">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Collection vs Target</h3>
          <p className="text-xs text-gray-500 mb-4">Fee collection performance across months</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={MONTHLY_COLLECTION} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="top" height={30} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill={COLORS.danger} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Defaulters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Top Defaulters</h3>
            <span className="text-[10px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{TOP_DEFAULTERS.length} pending</span>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_DEFAULTERS.map((d, idx) => (
              <div key={idx} className="px-5 py-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  d.status === 'critical' ? 'bg-red-500' : d.status === 'warning' ? 'bg-amber-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{d.student}</p>
                  <p className="text-[10px] text-gray-400">{d.class} • {d.overdueDays} days overdue</p>
                </div>
                <span className="text-xs font-bold text-red-600">₹{d.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Fee Category Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase">Total</th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase">Collected</th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase">Pending</th>
                  <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {FEE_BREAKDOWN.map((fee) => (
                  <tr key={fee.name} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-sm text-gray-900">{fee.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-900 text-right">₹{fee.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-emerald-600 text-right font-medium">₹{fee.paid.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-red-600 text-right font-medium">₹{fee.pending.toLocaleString()}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs font-semibold ${(fee.paid / fee.amount) >= 0.85 ? 'text-emerald-600' : (fee.paid / fee.amount) >= 0.7 ? 'text-amber-600' : 'text-red-600'}`}>
                        {Math.round((fee.paid / fee.amount) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_TRANSACTIONS.map((txn) => (
              <div key={txn.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                  txn.mode === 'UPI' ? 'bg-blue-100' : txn.mode === 'Cheque' ? 'bg-purple-100' : txn.mode === 'Cash' ? 'bg-emerald-100' : 'bg-amber-100'
                }`}>
                  {txn.mode === 'UPI' ? '📱' : txn.mode === 'Cheque' ? '📄' : txn.mode === 'Cash' ? '💵' : '🌐'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{txn.student}</p>
                  <p className="text-[10px] text-gray-400">{txn.mode} • {txn.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">₹{txn.amount.toLocaleString()}</p>
                  <span className={`text-[10px] font-medium ${txn.status === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>{txn.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}