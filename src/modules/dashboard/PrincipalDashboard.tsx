import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

const COLORS = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#3b82f6', purple: '#8b5cf6', pink: '#ec4899', teal: '#14b8a6' };

const CLASS_PERFORMANCE = [
  { class: 'Std 10', avgPct: 85, passRate: 92, attendance: 90 },
  { class: 'Std 9', avgPct: 78, passRate: 88, attendance: 85 },
  { class: 'Std 8', avgPct: 82, passRate: 90, attendance: 92 },
  { class: 'Std 7', avgPct: 76, passRate: 85, attendance: 88 },
  { class: 'Std 6', avgPct: 80, passRate: 87, attendance: 86 },
];

const TEACHER_EFFECTIVENESS = [
  { name: 'Mr. Verma', subject: 'Mathematics', rating: 4.8, students: 45, avgScore: 88 },
  { name: 'Ms. Gupta', subject: 'Science', rating: 4.6, students: 42, avgScore: 85 },
  { name: 'Mrs. Singh', subject: 'English', rating: 4.5, students: 40, avgScore: 82 },
  { name: 'Mr. Sharma', subject: 'Hindi', rating: 4.3, students: 38, avgScore: 79 },
  { name: 'Ms. Patel', subject: 'Social Studies', rating: 4.4, students: 35, avgScore: 81 },
];

const WEEKLY_ATTENDANCE = [
  { day: 'Mon', present: 420, absent: 12, late: 8 },
  { day: 'Tue', present: 415, absent: 15, late: 10 },
  { day: 'Wed', present: 425, absent: 8, late: 7 },
  { day: 'Thu', present: 418, absent: 14, late: 8 },
  { day: 'Fri', present: 410, absent: 18, late: 12 },
];

const ALERTS = [
  { msg: 'Std 10-A attendance below 75% this week', severity: 'high', time: '1 hour ago' },
  { msg: 'Fee defaulters list: 15 students pending >30 days', severity: 'medium', time: '3 hours ago' },
  { msg: 'Staff meeting tomorrow at 3 PM in conference room', severity: 'info', time: '5 hours ago' },
  { msg: 'Annual Sports Day preparations underway', severity: 'info', time: '1 day ago' },
];

export function PrincipalDashboard() {
  const sortedTeachers = [...TEACHER_EFFECTIVENESS].sort((a, b) => b.rating - a.rating);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Academic Leadership Dashboard</h2>
            <p className="text-blue-100 mt-1">Performance-driven insights for academic excellence</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-lg font-bold">92%</p>
              <p className="text-[10px] text-blue-100">Overall Pass</p>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-lg font-bold">88%</p>
              <p className="text-[10px] text-blue-100">Attendance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Class-wise Performance</h3>
          <p className="text-xs text-gray-500 mb-4">Average percentage, pass rate & attendance by class</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={CLASS_PERFORMANCE} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="class" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="top" height={30} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                <Bar dataKey="avgPct" name="Avg %" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="passRate" name="Pass Rate" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendance" name="Attendance" fill={COLORS.warning} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Teacher Effectiveness Rating</h3>
          <div className="space-y-3">
            {sortedTeachers.map((t, idx) => (
              <div key={t.name} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl hover:bg-blue-50/50 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{t.name}</span>
                    <span className="text-[10px] text-gray-400">({t.subject})</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-gray-500">{t.students} students</span>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className="text-[10px] text-gray-500">Avg: {t.avgScore}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-500">{t.rating}</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`text-[8px] ${star <= Math.round(t.rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Weekly Attendance Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Daily attendance across the school</p>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={WEEKLY_ATTENDANCE} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                <Line type="monotone" dataKey="present" stroke={COLORS.success} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="absent" stroke={COLORS.danger} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="late" stroke={COLORS.warning} strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Priority Alerts</h3>
            <span className="text-[10px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{ALERTS.filter(a => a.severity === 'high').length} Critical</span>
          </div>
          <div className="divide-y divide-gray-50">
            {ALERTS.map((alert, idx) => (
              <div key={idx} className="px-5 py-3 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                  alert.severity === 'high' ? 'bg-red-100' : alert.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  {alert.severity === 'high' ? '🔴' : alert.severity === 'medium' ? '🟡' : '🔵'}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-900">{alert.msg}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}