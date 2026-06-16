import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Area, AreaChart } from 'recharts';

const COLORS = {
  primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
  info: '#3b82f6', purple: '#8b5cf6', pink: '#ec4899', teal: '#14b8a6',
};

const STATS = {
  totalStudents: 2450, totalTeachers: 120, totalStaff: 45, totalClasses: 60,
  attendanceRate: 92, feeCollection: 87, newAdmissions: 48, pendingApprovals: 12,
};

const MONTHLY_ADMISSIONS = [
  { month: 'Jan', applications: 45, enrolled: 38, rejected: 7 },
  { month: 'Feb', applications: 52, enrolled: 44, rejected: 8 },
  { month: 'Mar', applications: 68, enrolled: 55, rejected: 13 },
  { month: 'Apr', applications: 120, enrolled: 98, rejected: 22 },
  { month: 'May', applications: 85, enrolled: 72, rejected: 13 },
  { month: 'Jun', applications: 60, enrolled: 50, rejected: 10 },
];

const CLASS_OCCUPANCY = [
  { class: 'Std 1', capacity: 120, enrolled: 115 },
  { class: 'Std 2', capacity: 120, enrolled: 108 },
  { class: 'Std 3', capacity: 120, enrolled: 118 },
  { class: 'Std 4', capacity: 120, enrolled: 95 },
  { class: 'Std 5', capacity: 120, enrolled: 112 },
  { class: 'Std 6', capacity: 120, enrolled: 105 },
  { class: 'Std 7', capacity: 120, enrolled: 120 },
  { class: 'Std 8', capacity: 120, enrolled: 98 },
  { class: 'Std 9', capacity: 120, enrolled: 88 },
  { class: 'Std 10', capacity: 120, enrolled: 92 },
];

const RECENT_ACTIVITY = [
  { action: 'New admission - Aarav Sharma', type: 'admission', time: '2 hours ago', status: 'completed' },
  { action: 'Fee payment received - ₹15,000', type: 'fee', time: '3 hours ago', status: 'completed' },
  { action: 'Teacher leave request - Ms. Gupta', type: 'hr', time: '5 hours ago', status: 'pending' },
  { action: 'Exam schedule updated for Std 10', type: 'academic', time: '1 day ago', status: 'completed' },
  { action: 'Parent complaint registered', type: 'complaint', time: '1 day ago', status: 'pending' },
  { action: 'New staff onboarding - Mr. Kumar', type: 'hr', time: '2 days ago', status: 'completed' },
];

export function SchoolAdminDashboard() {
  const [view, setView] = useState<'occupancy' | 'admissions'>('admissions');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">School Operations Dashboard</h2>
            <p className="text-emerald-100 mt-1">Delhi Public School • Complete oversight & control center</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-lg font-bold">{STATS.pendingApprovals}</p>
              <p className="text-[10px] text-emerald-100">Pending</p>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-lg font-bold">{STATS.newAdmissions}</p>
              <p className="text-[10px] text-emerald-100">New This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {[
          { label: 'Students', value: STATS.totalStudents, icon: '👨‍🎓', color: COLORS.primary, trend: '+5%' },
          { label: 'Teachers', value: STATS.totalTeachers, icon: '👨‍🏫', color: COLORS.success, trend: '+2%' },
          { label: 'Staff', value: STATS.totalStaff, icon: '👔', color: COLORS.purple, trend: '0%' },
          { label: 'Classes', value: STATS.totalClasses, icon: '🏫', color: COLORS.teal, trend: '0%' },
          { label: 'Attendance', value: `${STATS.attendanceRate}%`, icon: '📋', color: COLORS.success, trend: '+3%' },
          { label: 'Fee Collection', value: `${STATS.feeCollection}%`, icon: '💰', color: COLORS.warning, trend: '+8%' },
          { label: 'Admissions', value: STATS.newAdmissions, icon: '📝', color: COLORS.pink, trend: '+12%' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg">{kpi.icon}</span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{kpi.trend}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
            <p className="text-[10px] text-gray-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admissions Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Admissions Pipeline</h3>
              <p className="text-xs text-gray-500">Monthly application vs enrollment trends</p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {(['admissions', 'occupancy'] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {view === 'admissions' ? (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={MONTHLY_ADMISSIONS} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Legend verticalAlign="top" height={30} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                  <Bar dataKey="applications" name="Applications" fill={COLORS.info} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="enrolled" name="Enrolled" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected" fill={COLORS.danger} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={CLASS_OCCUPANCY} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="class" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                  <Bar dataKey="capacity" name="Capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="enrolled" name="Enrolled" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-50 max-h-[340px] overflow-y-auto">
            {RECENT_ACTIVITY.map((act, idx) => (
              <div key={idx} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50/50">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                  act.type === 'admission' ? 'bg-blue-100' : act.type === 'fee' ? 'bg-emerald-100' : act.type === 'hr' ? 'bg-purple-100' : act.type === 'academic' ? 'bg-amber-100' : 'bg-red-100'
                }`}>
                  {act.type === 'admission' ? '📝' : act.type === 'fee' ? '💰' : act.type === 'hr' ? '👤' : act.type === 'academic' ? '📚' : '⚠️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900">{act.action}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{act.time}</p>
                </div>
                <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  act.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>{act.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Add Student', icon: '➕', desc: 'Enroll new student', color: 'from-indigo-500 to-indigo-600' },
          { label: 'Fee Reminder', icon: '📨', desc: 'Send payment alerts', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Generate Report', icon: '📊', desc: 'School performance', color: 'from-purple-500 to-purple-600' },
          { label: 'Staff Meeting', icon: '📅', desc: 'Schedule meeting', color: 'from-amber-500 to-amber-600' },
        ].map(action => (
          <div key={action.label} className={`bg-gradient-to-r ${action.color} rounded-2xl p-4 shadow-lg text-white cursor-pointer hover:scale-[1.02] transition-transform`}>
            <span className="text-2xl">{action.icon}</span>
            <p className="text-sm font-semibold mt-2">{action.label}</p>
            <p className="text-xs text-white/70">{action.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}