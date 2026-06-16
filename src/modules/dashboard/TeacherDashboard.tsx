import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

const COLORS = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#3b82f6', purple: '#8b5cf6', pink: '#ec4899', teal: '#14b8a6' };

const MY_CLASSES = [
  { name: 'Std 10-A', subject: 'Mathematics', students: 45, avgScore: 82, passRate: 88, attendance: 90, pendingAssignments: 3 },
  { name: 'Std 9-B', subject: 'Mathematics', students: 42, avgScore: 78, passRate: 85, attendance: 86, pendingAssignments: 5 },
  { name: 'Std 8-A', subject: 'Mathematics', students: 40, avgScore: 85, passRate: 92, attendance: 92, pendingAssignments: 2 },
];

const TODAY_TIMETABLE = [
  { period: 1, time: '08:00-08:45', className: 'Std 10-A', topic: 'Quadratic Equations' },
  { period: 2, time: '08:45-09:30', className: 'Std 9-B', topic: 'Linear Algebra' },
  { period: 3, time: '09:45-10:30', className: 'Std 8-A', topic: 'Geometry Basics' },
  { period: 5, time: '11:30-12:15', className: 'Std 10-A', topic: 'Practice Session' },
];

const RECENT_GRADES = [
  { student: 'Aarav Sharma', subject: 'Mathematics', score: 92, grade: 'A+', status: 'top' },
  { student: 'Priya Singh', subject: 'Mathematics', score: 78, grade: 'B+', status: 'average' },
  { student: 'Rohan Verma', subject: 'Mathematics', score: 65, grade: 'C', status: 'needs_help' },
  { student: 'Sneha Patel', subject: 'Mathematics', score: 88, grade: 'A', status: 'good' },
  { student: 'Kunal Gupta', subject: 'Mathematics', score: 45, grade: 'D', status: 'needs_help' },
];

const MONTHLY_PROGRESS = [
  { month: 'Jan', avgScore: 76, attendance: 88 },
  { month: 'Feb', avgScore: 79, attendance: 85 },
  { month: 'Mar', avgScore: 82, attendance: 90 },
  { month: 'Apr', avgScore: 80, attendance: 86 },
  { month: 'May', avgScore: 85, attendance: 92 },
  { month: 'Jun', avgScore: 83, attendance: 89 },
];

export function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Classroom Dashboard</h2>
            <p className="text-violet-100 mt-1">Mr. Verma • Mathematics Department • Track class performance & engagement</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium">3 Active Classes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: '127', icon: '👨‍🎓', trend: '+5 this term', color: COLORS.primary },
          { label: 'Avg Score', value: '82%', icon: '📊', trend: '+4% vs last term', color: COLORS.success },
          { label: 'Pass Rate', value: '88%', icon: '🎯', trend: 'Target: 90%', color: COLORS.warning },
          { label: 'Pending Work', value: '10', icon: '📝', trend: '3 need grading', color: COLORS.pink },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{kpi.icon}</span>
              <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{kpi.trend}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Classes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">My Classes Overview</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {MY_CLASSES.map((cls) => (
                <div key={cls.name} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{cls.name}</p>
                      <p className="text-[10px] text-gray-500">{cls.subject} • {cls.students} students</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-900">{cls.avgScore}% avg</span>
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        cls.passRate >= 90 ? 'bg-emerald-100 text-emerald-700' : cls.passRate >= 80 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>{cls.passRate}% pass</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>Attendance</span>
                        <span>{cls.attendance}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${cls.attendance}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>Performance</span>
                        <span>{cls.avgScore}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${cls.avgScore}%` }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-medium text-amber-600">{cls.pendingAssignments} pending</span>
                      <p className="text-[10px] text-gray-400">assignments</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Academic Progress</h3>
            <p className="text-xs text-gray-500 mb-4">Average scores & attendance trend</p>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={MONTHLY_PROGRESS} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                  <Line type="monotone" dataKey="avgScore" name="Avg Score" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="attendance" name="Attendance" stroke={COLORS.success} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Today's Schedule</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {TODAY_TIMETABLE.map((slot) => (
                <div key={slot.period} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-10 text-center">
                    <p className="text-xs font-bold text-indigo-600">{slot.period}</p>
                    <p className="text-[8px] text-gray-400">period</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">{slot.className}</p>
                    <p className="text-[10px] text-gray-500">{slot.topic}</p>
                  </div>
                  <span className="text-[10px] text-gray-400">{slot.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Recent Grades</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {RECENT_GRADES.map((g, idx) => (
                <div key={idx} className="px-5 py-2.5 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    g.status === 'top' ? 'bg-emerald-500' : g.status === 'good' ? 'bg-blue-500' : g.status === 'average' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-900">{g.student}</p>
                    <p className="text-[10px] text-gray-400">{g.subject}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{g.score}</span>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    g.grade === 'A+' ? 'bg-emerald-100 text-emerald-700' : g.grade === 'A' ? 'bg-blue-100 text-blue-700' :
                    g.grade === 'B+' ? 'bg-indigo-100 text-indigo-700' : g.grade === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>{g.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}