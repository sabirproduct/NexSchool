import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Area, AreaChart } from 'recharts';

const COLORS = {
  primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
  info: '#3b82f6', purple: '#8b5cf6', pink: '#ec4899', teal: '#14b8a6',
};

const DEPARTMENT_DATA = [
  { name: 'Science', students: 520, teachers: 28, avgScore: 86, attendance: 91 },
  { name: 'Commerce', students: 380, teachers: 18, avgScore: 82, attendance: 88 },
  { name: 'Arts', students: 290, teachers: 15, avgScore: 79, attendance: 85 },
  { name: 'Primary', students: 680, teachers: 32, avgScore: 88, attendance: 94 },
  { name: 'Middle School', students: 580, teachers: 27, avgScore: 84, attendance: 90 },
];

const MONTHLY_TREND = [
  { month: 'Jan', revenue: 1250000, expenses: 920000, admissions: 38 },
  { month: 'Feb', revenue: 1280000, expenses: 950000, admissions: 44 },
  { month: 'Mar', revenue: 1320000, expenses: 980000, admissions: 55 },
  { month: 'Apr', revenue: 1450000, expenses: 1100000, admissions: 98 },
  { month: 'May', revenue: 1380000, expenses: 1020000, admissions: 72 },
  { month: 'Jun', revenue: 1420000, expenses: 1050000, admissions: 50 },
];

const CLASS_WISE = [
  { class: 'Std 10', students: 180, passRate: 92, avgPct: 85 },
  { class: 'Std 9', students: 165, passRate: 88, avgPct: 78 },
  { class: 'Std 8', students: 170, passRate: 90, avgPct: 82 },
  { class: 'Std 7', students: 155, passRate: 85, avgPct: 76 },
  { class: 'Std 6', students: 160, passRate: 87, avgPct: 80 },
  { class: 'Std 5', students: 145, passRate: 93, avgPct: 86 },
  { class: 'Std 1-4', students: 520, passRate: 95, avgPct: 88 },
];

const TOP_PERFORMERS = [
  { name: 'Aarav Sharma', class: 'Std 10-A', score: 98, subject: 'Mathematics' },
  { name: 'Anaya Kapoor', class: 'Std 8-B', score: 97, subject: 'Science' },
  { name: 'Vihaan Singh', class: 'Std 10-A', score: 96, subject: 'Computer Science' },
  { name: 'Ishita Gupta', class: 'Std 9-A', score: 95, subject: 'English' },
  { name: 'Arjun Patel', class: 'Std 7-A', score: 94, subject: 'Social Studies' },
];

export function SuperAdminDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<'students' | 'teachers' | 'avgScore' | 'attendance'>('students');

  const totalStudents = DEPARTMENT_DATA.reduce((s, d) => s + d.students, 0);
  const totalTeachers = DEPARTMENT_DATA.reduce((s, d) => s + d.teachers, 0);
  const avgAttendance = Math.round(DEPARTMENT_DATA.reduce((s, d) => s + d.attendance, 0) / DEPARTMENT_DATA.length);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Super Admin Command Center</h2>
            <p className="text-indigo-100 mt-1">Complete oversight of your institution's operations & performance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-lg font-bold">{totalStudents}</p>
              <p className="text-[10px] text-indigo-100">Total Students</p>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-lg font-bold">{totalTeachers}</p>
              <p className="text-[10px] text-indigo-100">Total Teachers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mega KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: totalStudents.toLocaleString(), icon: '👨‍🎓', change: '+8%', color: COLORS.primary },
          { label: 'Total Teachers', value: totalTeachers.toString(), icon: '👨‍🏫', change: '+5%', color: COLORS.success },
          { label: 'Pass Rate', value: '89%', icon: '🎯', change: '+6%', color: COLORS.warning },
          { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: '📊', change: '+3%', color: COLORS.teal },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{kpi.icon}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{kpi.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue & Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Revenue vs Expenses</h3>
          <p className="text-xs text-gray-500 mb-4">Monthly financial performance</p>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={MONTHLY_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="top" height={30} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS.success} fill="#10b98120" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke={COLORS.danger} fill="#ef444410" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Department-wise Comparison</h3>
              <p className="text-xs text-gray-500">Select metric to compare across departments</p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {(['students', 'teachers', 'avgScore', 'attendance'] as const).map(m => (
                <button key={m} onClick={() => setSelectedMetric(m)}
                  className={`px-2 py-1 text-[10px] font-medium rounded-md transition-all ${selectedMetric === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {m === 'avgScore' ? 'Score' : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={DEPARTMENT_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Bar dataKey={selectedMetric} name={selectedMetric === 'avgScore' ? 'Avg Score' : selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} radius={[6, 6, 0, 0]}>
                  {DEPARTMENT_DATA.map((_, idx) => (
                    <Cell key={idx} fill={[COLORS.primary, COLORS.success, COLORS.warning, COLORS.pink, COLORS.teal][idx]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Class-wise Performance */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Class-wise Performance</h3>
        <p className="text-xs text-gray-500 mb-4">Pass rate, average percentage & student strength across classes</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Class</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase">Students</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase">Pass Rate</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase">Avg %</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {CLASS_WISE.map((cls) => (
                <tr key={cls.class} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{cls.class}</td>
                  <td className="px-5 py-3 text-sm text-gray-700 text-center">{cls.students}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-sm font-semibold ${cls.passRate >= 90 ? 'text-emerald-600' : cls.passRate >= 85 ? 'text-blue-600' : 'text-amber-600'}`}>{cls.passRate}%</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-sm font-semibold ${cls.avgPct >= 85 ? 'text-emerald-600' : cls.avgPct >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>{cls.avgPct}%</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="w-full max-w-[120px] mx-auto h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cls.avgPct >= 85 ? 'bg-emerald-500' : cls.avgPct >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
                        style={{ width: `${cls.avgPct}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers & Admissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">🎓 Top Performing Students</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_PERFORMERS.map((s, idx) => (
              <div key={idx} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{s.name}</p>
                  <p className="text-[10px] text-gray-400">{s.class} • {s.subject}</p>
                </div>
                <span className="text-sm font-bold text-emerald-600">{s.score}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Admissions Trend</h3>
          <p className="text-xs text-gray-500 mb-4">New admissions over the year</p>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={MONTHLY_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="admissions" name="New Admissions" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 5, fill: COLORS.primary }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hostel Occupancy Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">🏠 Hostel Occupancy Overview</h3>
        <p className="text-xs text-gray-500 mb-4">Block-wise occupancy & capacity utilization</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={[
                { name: 'Aryabhatta', capacity: 120, occupied: 98 },
                { name: 'Vikramshila', capacity: 105, occupied: 85 },
                { name: 'Nalanda', capacity: 90, occupied: 88 },
                { name: 'Takshila', capacity: 75, occupied: 72 },
                { name: 'Chanakya', capacity: 40, occupied: 38 },
              ]} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="top" height={30} />
                <Bar dataKey="capacity" name="Total Capacity" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="occupied" name="Occupied" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {[
              { block: 'Aryabhatta Bhavan', occupancy: 82, gender: 'Boys', color: 'from-blue-500 to-blue-600' },
              { block: 'Vikramshila Nilayam', occupancy: 81, gender: 'Boys', color: 'from-indigo-500 to-indigo-600' },
              { block: 'Nalanda Vihar', occupancy: 98, gender: 'Girls', color: 'from-pink-500 to-pink-600' },
              { block: 'Takshila Sadan', occupancy: 96, gender: 'Girls', color: 'from-purple-500 to-purple-600' },
              { block: 'Chanakya Cottages', occupancy: 95, gender: 'Boys', color: 'from-cyan-500 to-cyan-600' },
            ].map((block) => (
              <div key={block.block} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${block.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">{block.block}</span>
                    <span className="text-xs font-semibold text-gray-900">{block.occupancy}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${block.color}`} style={{ width: `${block.occupancy}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400">{block.gender}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}