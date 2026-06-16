import { useState, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Area, AreaChart } from 'recharts';

// ── Colour Palette ─────────────────────────────────────────────
const COLORS = {
  primary: '#6366f1',
  primaryLight: '#eef2ff',
  secondary: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  gray: '#6b7280',
  grayBg: '#f8fafc',
  border: '#e2e8f0',
};

const CHART_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

// ── Mock Data ──────────────────────────────────────────────────
const MOCK_STUDENT = {
  id: 'STU001',
  fullName: 'Aarav Sharma',
  rollNo: '2026001',
  class: 'Standard 10',
  section: 'A',
  gender: 'male',
  dob: '2010-05-15',
  bloodGroup: 'B+',
  email: 'aarav.sharma@example.com',
  mobile: '9876543210',
  address: '123, Green Valley Apartments, Mumbai',
  photoUrl: '',
};

const MOCK_SUBJECTS = [
  { name: 'Mathematics', code: 'MTH101', teacher: 'Mr. Verma', totalClasses: 25, attendedClasses: 23, attendancePercentage: 92 },
  { name: 'Science', code: 'SCI101', teacher: 'Ms. Gupta', totalClasses: 25, attendedClasses: 22, attendancePercentage: 88 },
  { name: 'English', code: 'ENG101', teacher: 'Mrs. Singh', totalClasses: 24, attendedClasses: 20, attendancePercentage: 83 },
  { name: 'Hindi', code: 'HIN101', teacher: 'Mr. Sharma', totalClasses: 22, attendedClasses: 19, attendancePercentage: 86 },
  { name: 'Social Studies', code: 'SST101', teacher: 'Ms. Patel', totalClasses: 20, attendedClasses: 18, attendancePercentage: 90 },
  { name: 'Computer Science', code: 'CSC101', teacher: 'Mr. Kumar', totalClasses: 18, attendedClasses: 17, attendancePercentage: 94 },
];

const MOCK_TIMETABLE: any[] = [
  { id: 'TT1', day: 'Monday', period: 1, startTime: '08:00', endTime: '08:45', subject: 'Mathematics', teacher: 'Mr. Verma', room: '101' },
  { id: 'TT2', day: 'Monday', period: 2, startTime: '08:45', endTime: '09:30', subject: 'Science', teacher: 'Ms. Gupta', room: '102' },
  { id: 'TT3', day: 'Monday', period: 3, startTime: '09:45', endTime: '10:30', subject: 'English', teacher: 'Mrs. Singh', room: '103' },
  { id: 'TT4', day: 'Monday', period: 4, startTime: '10:30', endTime: '11:15', subject: 'Hindi', teacher: 'Mr. Sharma', room: '104' },
  { id: 'TT5', day: 'Monday', period: 5, startTime: '11:30', endTime: '12:15', subject: 'Computer Science', teacher: 'Mr. Kumar', room: 'Lab 1' },
  { id: 'TT6', day: 'Tuesday', period: 1, startTime: '08:00', endTime: '08:45', subject: 'English', teacher: 'Mrs. Singh', room: '103' },
  { id: 'TT7', day: 'Tuesday', period: 2, startTime: '08:45', endTime: '09:30', subject: 'Mathematics', teacher: 'Mr. Verma', room: '101' },
  { id: 'TT8', day: 'Tuesday', period: 3, startTime: '09:45', endTime: '10:30', subject: 'Social Studies', teacher: 'Ms. Patel', room: '105' },
  { id: 'TT9', day: 'Tuesday', period: 4, startTime: '10:30', endTime: '11:15', subject: 'Science', teacher: 'Ms. Gupta', room: '102' },
  { id: 'TT10', day: 'Tuesday', period: 5, startTime: '11:30', endTime: '12:15', subject: 'Hindi', teacher: 'Mr. Sharma', room: '104' },
  { id: 'TT11', day: 'Wednesday', period: 1, startTime: '08:00', endTime: '08:45', subject: 'Science', teacher: 'Ms. Gupta', room: '102' },
  { id: 'TT12', day: 'Wednesday', period: 2, startTime: '08:45', endTime: '09:30', subject: 'English', teacher: 'Mrs. Singh', room: '103' },
  { id: 'TT13', day: 'Wednesday', period: 3, startTime: '09:45', endTime: '10:30', subject: 'Mathematics', teacher: 'Mr. Verma', room: '101' },
  { id: 'TT14', day: 'Wednesday', period: 4, startTime: '10:30', endTime: '11:15', subject: 'Computer Science', teacher: 'Mr. Kumar', room: 'Lab 1' },
  { id: 'TT15', day: 'Wednesday', period: 5, startTime: '11:30', endTime: '12:15', subject: 'Social Studies', teacher: 'Ms. Patel', room: '105' },
  { id: 'TT16', day: 'Thursday', period: 1, startTime: '08:00', endTime: '08:45', subject: 'Hindi', teacher: 'Mr. Sharma', room: '104' },
  { id: 'TT17', day: 'Thursday', period: 2, startTime: '08:45', endTime: '09:30', subject: 'Mathematics', teacher: 'Mr. Verma', room: '101' },
  { id: 'TT18', day: 'Thursday', period: 3, startTime: '09:45', endTime: '10:30', subject: 'Science', teacher: 'Ms. Gupta', room: '102' },
  { id: 'TT19', day: 'Thursday', period: 4, startTime: '10:30', endTime: '11:15', subject: 'English', teacher: 'Mrs. Singh', room: '103' },
  { id: 'TT20', day: 'Thursday', period: 5, startTime: '11:30', endTime: '12:15', subject: 'Social Studies', teacher: 'Ms. Patel', room: '105' },
  { id: 'TT21', day: 'Friday', period: 1, startTime: '08:00', endTime: '08:45', subject: 'Social Studies', teacher: 'Ms. Patel', room: '105' },
  { id: 'TT22', day: 'Friday', period: 2, startTime: '08:45', endTime: '09:30', subject: 'Computer Science', teacher: 'Mr. Kumar', room: 'Lab 1' },
  { id: 'TT23', day: 'Friday', period: 3, startTime: '09:45', endTime: '10:30', subject: 'Hindi', teacher: 'Mr. Sharma', room: '104' },
  { id: 'TT24', day: 'Friday', period: 4, startTime: '10:30', endTime: '11:15', subject: 'Science', teacher: 'Ms. Gupta', room: '102' },
  { id: 'TT25', day: 'Friday', period: 5, startTime: '11:30', endTime: '12:15', subject: 'Mathematics', teacher: 'Mr. Verma', room: '101' },
  { id: 'TT26', day: 'Saturday', period: 1, startTime: '08:00', endTime: '08:45', subject: 'Sports', teacher: 'Coach Ramesh', room: 'Ground' },
  { id: 'TT27', day: 'Saturday', period: 2, startTime: '08:45', endTime: '09:30', subject: 'Library', teacher: 'Mrs. Mehta', room: 'Library' },
];

const MOCK_ATTENDANCE_MONTHLY = [
  { month: 'Jan', percentage: 92 },
  { month: 'Feb', percentage: 88 },
  { month: 'Mar', percentage: 95 },
  { month: 'Apr', percentage: 85 },
  { month: 'May', percentage: 90 },
  { month: 'Jun', percentage: 87 },
];

const MOCK_NOTIFICATIONS: any[] = [
  { id: 'SN001', title: 'Homework Assignment', message: 'Mathematics homework on Quadratic Equations due tomorrow.', type: 'academic', priority: 'medium', isRead: false, createdAt: '2026-06-14T09:00:00Z', from: 'Mr. Verma' },
  { id: 'SN002', title: 'Exam Schedule Published', message: 'Final examination schedule has been published. Check the exams section.', type: 'academic', priority: 'high', isRead: false, createdAt: '2026-06-13T14:30:00Z', from: 'Examination Cell' },
  { id: 'SN003', title: 'Science Project Submission', message: 'Science project submissions due by June 20. Submit to lab.', type: 'academic', priority: 'medium', isRead: false, createdAt: '2026-06-12T11:00:00Z', from: 'Ms. Gupta' },
  { id: 'SN004', title: 'Sports Day Registration', message: 'Annual Sports Day registrations are open. Register by June 18.', type: 'event', priority: 'low', isRead: true, createdAt: '2026-06-11T08:00:00Z', from: 'Sports Department' },
  { id: 'SN005', title: 'Fee Payment Due', message: 'Your tuition fee payment is due by June 20. Pay online to avoid late fee.', type: 'fee', priority: 'high', isRead: false, createdAt: '2026-06-10T10:00:00Z', from: 'Accounts Department' },
];

const MOCK_EXAM_RESULTS = [
  { id: 'SER1', examName: 'Mid Term 2026', term: 'Term 1', year: '2026', subjects: [
    { name: 'Mathematics', marksObtained: 92, totalMarks: 100, percentage: 92, grade: 'A+' },
    { name: 'Science', marksObtained: 88, totalMarks: 100, percentage: 88, grade: 'A' },
    { name: 'English', marksObtained: 85, totalMarks: 100, percentage: 85, grade: 'A' },
    { name: 'Hindi', marksObtained: 90, totalMarks: 100, percentage: 90, grade: 'A+' },
    { name: 'Social Studies', marksObtained: 82, totalMarks: 100, percentage: 82, grade: 'A' },
    { name: 'Computer Science', marksObtained: 96, totalMarks: 100, percentage: 96, grade: 'A+' },
  ], totalMarks: 600, obtainedMarks: 533, percentage: 88.8, grade: 'A', rank: 3 },
  { id: 'SER2', examName: 'Monthly Test - May', term: 'Term 2', year: '2026', subjects: [
    { name: 'Mathematics', marksObtained: 45, totalMarks: 50, percentage: 90, grade: 'A+' },
    { name: 'Science', marksObtained: 42, totalMarks: 50, percentage: 84, grade: 'A' },
    { name: 'English', marksObtained: 40, totalMarks: 50, percentage: 80, grade: 'A' },
    { name: 'Hindi', marksObtained: 44, totalMarks: 50, percentage: 88, grade: 'A' },
    { name: 'Social Studies', marksObtained: 38, totalMarks: 50, percentage: 76, grade: 'B+' },
    { name: 'Computer Science', marksObtained: 48, totalMarks: 50, percentage: 96, grade: 'A+' },
  ], totalMarks: 300, obtainedMarks: 257, percentage: 85.7, grade: 'A', rank: 5 },
  { id: 'SER3', examName: 'Quarterly Exam', term: 'Term 1', year: '2026', subjects: [
    { name: 'Mathematics', marksObtained: 88, totalMarks: 100, percentage: 88, grade: 'A' },
    { name: 'Science', marksObtained: 85, totalMarks: 100, percentage: 85, grade: 'A' },
    { name: 'English', marksObtained: 82, totalMarks: 100, percentage: 82, grade: 'A' },
    { name: 'Hindi', marksObtained: 86, totalMarks: 100, percentage: 86, grade: 'A' },
    { name: 'Social Studies', marksObtained: 78, totalMarks: 100, percentage: 78, grade: 'B+' },
    { name: 'Computer Science', marksObtained: 92, totalMarks: 100, percentage: 92, grade: 'A+' },
  ], totalMarks: 600, obtainedMarks: 511, percentage: 85.2, grade: 'A', rank: 4 },
];

const MOCK_FEES: any[] = [
  { id: 'SF1', feeName: 'Tuition Fee', category: 'Tuition', amount: 15000, paidAmount: 15000, dueAmount: 0, dueDate: '2026-06-10', status: 'Paid', paymentDate: '2026-06-05', transactionId: 'TXN001' },
  { id: 'SF2', feeName: 'Library Fee', category: 'Library', amount: 1000, paidAmount: 1000, dueAmount: 0, dueDate: '2026-06-10', status: 'Paid', paymentDate: '2026-06-05', transactionId: 'TXN002' },
  { id: 'SF3', feeName: 'Sports Fee', category: 'Sports', amount: 2000, paidAmount: 0, dueAmount: 2000, dueDate: '2026-06-20', status: 'Unpaid' },
  { id: 'SF4', feeName: 'Laboratory Fee', category: 'Lab', amount: 1500, paidAmount: 500, dueAmount: 1000, dueDate: '2026-06-15', status: 'Partial' },
];

const PERFORMANCE_OVER_TIME = [
  { exam: 'Quarterly', percentage: 85.2 },
  { exam: 'Mid Term', percentage: 88.8 },
  { exam: 'Monthly Test', percentage: 85.7 },
];

const SUBJECT_PERFORMANCE = MOCK_SUBJECTS.map(s => ({ subject: s.name, percentage: s.attendancePercentage }));

// ── Helper Functions ────────────────────────────────────────────
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Paid': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'Partial': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'Unpaid': return 'text-red-600 bg-red-50 border-red-200';
    case 'Overdue': return 'text-rose-600 bg-rose-50 border-rose-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

function getGradeBadge(grade: string) {
  switch (grade?.replace('+', 'plus')) {
    case 'A+': return 'bg-emerald-100 text-emerald-700';
    case 'A': return 'bg-blue-100 text-blue-700';
    case 'B+': return 'bg-indigo-100 text-indigo-700';
    case 'B': return 'bg-purple-100 text-purple-700';
    case 'C': return 'bg-amber-100 text-amber-700';
    case 'D': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const PERIODS = [1, 2, 3, 4, 5];

// ── Tab Config ─────────────────────────────────────────────────
type TabId = 'dashboard' | 'timetable' | 'attendance' | 'exams' | 'fees' | 'profile';

interface TabConfig { id: TabId; label: string; icon: string; }

const TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'timetable', label: 'Timetable', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'attendance', label: 'Attendance', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'exams', label: 'Exams & Results', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'fees', label: 'Fees', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

// ── Dashboard Tab ──────────────────────────────────────────────
function DashboardTab() {
  const totalFeesPaid = MOCK_FEES.reduce((s, f) => s + f.paidAmount, 0);
  const totalFeesDue = MOCK_FEES.reduce((s, f) => s + f.dueAmount, 0);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
  const overallAttendance = Math.round(MOCK_SUBJECTS.reduce((s, sub) => s + sub.attendancePercentage, 0) / MOCK_SUBJECTS.length);
  const latestResult = MOCK_EXAM_RESULTS[0];

  const summaryCards = [
    { title: 'Attendance', value: `${overallAttendance}%`, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: COLORS.success },
    { title: 'Current Rank', value: latestResult.rank ? `#${latestResult.rank}` : '-', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: COLORS.primary },
    { title: 'Avg Score', value: `${latestResult.percentage}%`, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: COLORS.purple },
    { title: 'Fees Paid', value: `₹${(totalFeesPaid / 1000).toFixed(1)}K`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: COLORS.success },
    { title: 'Fees Due', value: `₹${(totalFeesDue / 1000).toFixed(1)}K`, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z', color: COLORS.danger },
    { title: 'Notifications', value: unreadCount, icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', color: COLORS.warning },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {summaryCards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{card.title}</span>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <svg className="w-3.5 h-3.5" style={{ color: card.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Performance Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Exam-wise percentage scores</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={PERFORMANCE_OVER_TIME} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="exam" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
                <Line type="monotone" dataKey="percentage" name="Percentage" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 6, fill: COLORS.primary, strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Attendance</h3>
          <p className="text-xs text-gray-500 mb-4">Attendance percentage by month</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={MOCK_ATTENDANCE_MONTHLY} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
                <Bar dataKey="percentage" name="Attendance %" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {MOCK_ATTENDANCE_MONTHLY.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.percentage >= 85 ? COLORS.success : entry.percentage >= 75 ? COLORS.warning : COLORS.danger} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Subject-wise Attendance</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_SUBJECTS.map((sub) => (
            <div key={sub.code} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium text-gray-900">{sub.name}</span>
                  <p className="text-[10px] text-gray-500">{sub.teacher}</p>
                </div>
                <span className={`text-sm font-bold ${sub.attendancePercentage >= 85 ? 'text-emerald-600' : sub.attendancePercentage >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                  {sub.attendancePercentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${sub.attendancePercentage >= 85 ? 'bg-emerald-500' : sub.attendancePercentage >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${sub.attendancePercentage}%` }} />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
                <span>{sub.attendedClasses}/{sub.totalClasses} classes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Updates</h3>
          <span className="text-xs font-medium text-indigo-600 cursor-pointer hover:text-indigo-800">View All →</span>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_NOTIFICATIONS.slice(0, 4).map((n) => (
            <div key={n.id} className={`px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50/50 transition-colors ${!n.isRead ? 'bg-indigo-50/30' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${n.type === 'academic' ? 'bg-blue-100' : n.type === 'fee' ? 'bg-red-100' : 'bg-gray-100'}`}>
                {n.type === 'academic' ? '📚' : n.type === 'fee' ? '💰' : n.type === 'event' ? '🎉' : '📢'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</span>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-400">{n.from}</span>
                  <span className="text-[10px] text-gray-300">•</span>
                  <span className="text-[10px] text-gray-400">{timeAgo(n.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Timetable Tab ───────────────────────────────────────────────
function TimetableTab() {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const dayPeriods = MOCK_TIMETABLE.filter(t => t.day === selectedDay).sort((a, b) => a.period - b.period);

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'from-indigo-500 to-indigo-600',
      'Science': 'from-emerald-500 to-emerald-600',
      'English': 'from-blue-500 to-blue-600',
      'Hindi': 'from-purple-500 to-purple-600',
      'Social Studies': 'from-amber-500 to-amber-600',
      'Computer Science': 'from-cyan-500 to-cyan-600',
      'Sports': 'from-red-500 to-red-600',
      'Library': 'from-pink-500 to-pink-600',
    };
    return colors[subject] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedDay === day ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {dayPeriods.map((entry) => (
          <div key={entry.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200">
            <div className={`bg-gradient-to-r ${getSubjectColor(entry.subject)} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium opacity-80">Period {entry.period}</span>
                <span className="text-xs font-medium opacity-80">{entry.startTime} - {entry.endTime}</span>
              </div>
              <h4 className="text-base font-bold mt-2">{entry.subject}</h4>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs text-gray-600">{entry.teacher}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-xs text-gray-600">Room {entry.room}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Week View */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Full Week Timetable</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-20">Period</th>
                {DAYS.map(day => (
                  <th key={day} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PERIODS.map(period => (
                <tr key={period} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-medium text-gray-500">Period {period}</td>
                  {DAYS.map(day => {
                    const entry = MOCK_TIMETABLE.find(t => t.day === day && t.period === period);
                    return (
                      <td key={`${day}-${period}`} className="px-4 py-3">
                        {entry ? (
                          <div className="bg-indigo-50 rounded-xl p-2 border border-indigo-100">
                            <span className="text-xs font-semibold text-indigo-700 block">{entry.subject}</span>
                            <span className="text-[10px] text-gray-500">{entry.startTime}-{entry.endTime}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Attendance Tab ──────────────────────────────────────────────
function StudentAttendanceTab() {
  const overallAttendance = Math.round(MOCK_SUBJECTS.reduce((s, sub) => s + sub.attendancePercentage, 0) / MOCK_SUBJECTS.length);
  const totalClasses = MOCK_SUBJECTS.reduce((s, sub) => s + sub.totalClasses, 0);
  const attendedClasses = MOCK_SUBJECTS.reduce((s, sub) => s + sub.attendedClasses, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 shadow-lg text-white">
          <p className="text-sm text-emerald-100">Overall Attendance</p>
          <h3 className="text-2xl font-bold mt-1">{overallAttendance}%</h3>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Total Classes</span>
          <p className="text-xl font-bold text-gray-900 mt-1">{totalClasses}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Attended</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{attendedClasses}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Missed</span>
          <p className="text-xl font-bold text-red-600 mt-1">{totalClasses - attendedClasses}</p>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Subject-wise Attendance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Classes</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Attended</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_SUBJECTS.map((sub) => (
                <tr key={sub.code} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{sub.name}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{sub.teacher}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-900 text-center">{sub.totalClasses}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-900 text-center">{sub.attendedClasses}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`text-sm font-semibold ${sub.attendancePercentage >= 85 ? 'text-emerald-600' : sub.attendancePercentage >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                      {sub.attendancePercentage}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      sub.attendancePercentage >= 85 ? 'bg-emerald-100 text-emerald-700' : sub.attendancePercentage >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {sub.attendancePercentage >= 85 ? 'Good' : sub.attendancePercentage >= 75 ? 'Average' : 'Poor'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Exams Tab ───────────────────────────────────────────────────
function StudentExamsTab() {
  const [selectedExamId, setSelectedExamId] = useState(MOCK_EXAM_RESULTS[0].id);

  const selectedExam = MOCK_EXAM_RESULTS.find(e => e.id === selectedExamId) || MOCK_EXAM_RESULTS[0];

  return (
    <div className="space-y-6">
      {/* Exam Selector */}
      <div className="flex flex-wrap gap-2">
        {MOCK_EXAM_RESULTS.map((exam) => (
          <button
            key={exam.id}
            type="button"
            onClick={() => setSelectedExamId(exam.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedExamId === exam.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {exam.examName}
          </button>
        ))}
      </div>

      {/* Exam Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 shadow-lg text-white">
          <p className="text-sm text-indigo-100">Total Percentage</p>
          <h3 className="text-2xl font-bold mt-1">{selectedExam.percentage}%</h3>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Obtained</span>
          <p className="text-xl font-bold text-gray-900 mt-1">{selectedExam.obtainedMarks}/{selectedExam.totalMarks}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Grade</span>
          <p className="text-xl font-bold mt-1">
            <span className={`inline-flex px-2 py-0.5 rounded text-sm font-semibold ${getGradeBadge(selectedExam.grade)}`}>{selectedExam.grade}</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Rank</span>
          <p className="text-xl font-bold text-gray-900 mt-1">{selectedExam.rank ? `#${selectedExam.rank}` : '-'}</p>
        </div>
      </div>

      {/* Subject-wise Marks */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Subject-wise Marks - {selectedExam.examName}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Total Marks</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {selectedExam.subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{sub.name}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 text-center">{sub.marksObtained}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 text-center">{sub.totalMarks}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`text-sm font-semibold ${sub.percentage >= 80 ? 'text-emerald-600' : sub.percentage >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {sub.percentage}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${getGradeBadge(sub.grade)}`}>{sub.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marks Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Subject-wise Performance</h3>
        <p className="text-xs text-gray-500 mb-4">Marks comparison across subjects</p>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={selectedExam.subjects} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
              <Bar dataKey="percentage" name="Percentage" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {selectedExam.subjects.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.percentage >= 80 ? COLORS.success : entry.percentage >= 60 ? COLORS.warning : COLORS.danger} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Fees Tab ────────────────────────────────────────────────────
function StudentFeesTab() {
  const totalPaid = MOCK_FEES.reduce((s, f) => s + f.paidAmount, 0);
  const totalDue = MOCK_FEES.reduce((s, f) => s + f.dueAmount, 0);
  const totalAmount = MOCK_FEES.reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 shadow-lg text-white">
          <p className="text-sm text-emerald-100">Total Paid</p>
          <h3 className="text-2xl font-bold mt-1">₹{totalPaid.toLocaleString()}</h3>
          <p className="text-xs text-emerald-100 mt-1">of ₹{totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 shadow-lg text-white">
          <p className="text-sm text-red-100">Total Due</p>
          <h3 className="text-2xl font-bold mt-1">₹{totalDue.toLocaleString()}</h3>
          <p className="text-xs text-red-100 mt-1">Pending payments</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 shadow-lg text-white">
          <p className="text-sm text-indigo-100">Payment Status</p>
          <h3 className="text-2xl font-bold mt-1">
            {totalAmount > 0 ? `${Math.round((totalPaid / totalAmount) * 100)}%` : '100%'}
          </h3>
          <div className="mt-2 w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-white" style={{ width: `${totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 100}%` }} />
          </div>
        </div>
      </div>

      {/* Fee Details */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Fee Structure & Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Fee Name</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Due</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_FEES.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{fee.feeName}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{fee.category}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-900 text-right font-medium">₹{fee.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-emerald-600 text-right font-medium">₹{fee.paidAmount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-red-600 text-right font-medium">₹{fee.dueAmount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(fee.status)}`}>{fee.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 text-center">{formatDate(fee.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Profile Tab ─────────────────────────────────────────────────
function ProfileTab() {
  const latestResult = MOCK_EXAM_RESULTS[0];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
              {MOCK_STUDENT.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold">{MOCK_STUDENT.fullName}</h2>
              <p className="text-indigo-100 text-sm">Roll No: {MOCK_STUDENT.rollNo} | Class {MOCK_STUDENT.class}-{MOCK_STUDENT.section}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Date of Birth</span>
              <p className="text-sm text-gray-900 mt-1">{formatDate(MOCK_STUDENT.dob)}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Blood Group</span>
              <p className="text-sm text-gray-900 mt-1 font-semibold">{MOCK_STUDENT.bloodGroup}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Gender</span>
              <p className="text-sm text-gray-900 mt-1 capitalize">{MOCK_STUDENT.gender}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Email</span>
              <p className="text-sm text-gray-900 mt-1">{MOCK_STUDENT.email}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Mobile</span>
              <p className="text-sm text-gray-900 mt-1">{MOCK_STUDENT.mobile}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Current Rank</span>
              <p className="text-sm text-gray-900 mt-1 font-bold">{latestResult.rank ? `#${latestResult.rank}` : '-'}</p>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Address</span>
              <p className="text-sm text-gray-900 mt-1">{MOCK_STUDENT.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Academic Summary</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <span className="block text-2xl font-bold text-indigo-600">{MOCK_SUBJECTS.length}</span>
              <span className="text-xs text-gray-500">Subjects</span>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <span className="block text-2xl font-bold text-emerald-600">
                {Math.round(MOCK_SUBJECTS.reduce((s, sub) => s + sub.attendancePercentage, 0) / MOCK_SUBJECTS.length)}%
              </span>
              <span className="text-xs text-gray-500">Attendance</span>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <span className="block text-2xl font-bold text-purple-600">{latestResult.percentage}%</span>
              <span className="text-xs text-gray-500">Avg Score</span>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <span className="block text-2xl font-bold text-amber-600">{MOCK_EXAM_RESULTS.length}</span>
              <span className="text-xs text-gray-500">Exams Taken</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export function StudentPortalPage() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
  const overallAttendance = Math.round(MOCK_SUBJECTS.reduce((s, sub) => s + sub.attendancePercentage, 0) / MOCK_SUBJECTS.length);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'timetable': return <TimetableTab />;
      case 'attendance': return <StudentAttendanceTab />;
      case 'exams': return <StudentExamsTab />;
      case 'fees': return <StudentFeesTab />;
      case 'profile': return <ProfileTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Portal</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {MOCK_STUDENT.fullName}! Track your academics, attendance, and more</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-gray-700">{overallAttendance}% Attendance • {unreadCount} Unread</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap bg-gray-100 rounded-xl p-1 gap-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}