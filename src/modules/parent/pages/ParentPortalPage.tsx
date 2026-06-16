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
const MOCK_CHILDREN = [
  { id: 'S001', fullName: 'Aarav Sharma', rollNo: '2026001', class: 'Standard 10', section: 'A', gender: 'male', attendanceRate: 92, feesPaid: 15000, feesDue: 0, lastExamRank: 3, lastExamPercentage: 88.5, status: 'active', photoUrl: '' },
  { id: 'S002', fullName: 'Anaya Sharma', rollNo: '2026002', class: 'Standard 8', section: 'B', gender: 'female', attendanceRate: 95, feesPaid: 12000, feesDue: 3000, lastExamRank: 1, lastExamPercentage: 94.2, status: 'active', photoUrl: '' },
  { id: 'S003', fullName: 'Vihaan Sharma', rollNo: '2026003', class: 'Standard 5', section: 'A', gender: 'male', attendanceRate: 88, feesPaid: 8000, feesDue: 2000, lastExamRank: 5, lastExamPercentage: 78.0, status: 'active', photoUrl: '' },
];

const MOCK_NOTIFICATIONS: any[] = [
  { id: 'PN001', title: 'PTA Meeting Tomorrow', message: 'Parent-Teacher meeting scheduled for Standard 10-A at 10:00 AM in the auditorium.', type: 'event', priority: 'high', isRead: false, createdAt: '2026-06-14T09:00:00Z', from: 'Principal Office' },
  { id: 'PN002', title: 'Fee Payment Reminder', message: 'Fee payment deadline for Standard 8 is approaching. Pay by June 20 to avoid late fee.', type: 'fee', priority: 'high', isRead: false, createdAt: '2026-06-13T14:30:00Z', from: 'Accounts Department' },
  { id: 'PN003', title: 'Aarav - Low Attendance Alert', message: 'Your ward Aarav has below 75% attendance this month. Please ensure regular attendance.', type: 'attendance', priority: 'medium', isRead: false, createdAt: '2026-06-12T11:00:00Z', from: 'Class Teacher' },
  { id: 'PN004', title: 'Exam Schedule Published', message: 'Final examination schedule has been published for all classes.', type: 'academic', priority: 'medium', isRead: true, createdAt: '2026-06-11T08:00:00Z', from: 'Examination Cell' },
  { id: 'PN005', title: 'Summer Vacation Notice', message: 'School will remain closed from May 15 to June 30 for summer break.', type: 'general', priority: 'low', isRead: true, createdAt: '2026-06-10T10:00:00Z', from: 'Principal Office' },
  { id: 'PN006', title: 'Annual Sports Day', message: 'Annual Sports Day will be held on June 25. Register your ward by June 20.', type: 'event', priority: 'low', isRead: false, createdAt: '2026-06-09T09:30:00Z', from: 'Sports Department' },
  { id: 'PN007', title: 'Anaya - Science Quiz Winner', message: 'Congratulations! Anaya Sharma secured 1st position in the inter-school Science Quiz.', type: 'academic', priority: 'medium', isRead: false, createdAt: '2026-06-08T07:00:00Z', from: 'Science Department' },
  { id: 'PN008', title: 'Bus Route Change', message: 'Bus route 5 will be diverted via Gandhi Nagar due to road construction for 2 weeks.', type: 'general', priority: 'high', isRead: true, createdAt: '2026-06-07T13:00:00Z', from: 'Transport Department' },
];

const MOCK_FEES: any[] = [
  { id: 'F001', studentName: 'Aarav Sharma', studentId: 'S001', feeName: 'Tuition Fee', amount: 15000, paidAmount: 15000, dueAmount: 0, dueDate: '2026-06-10', status: 'Paid' },
  { id: 'F002', studentName: 'Anaya Sharma', studentId: 'S002', feeName: 'Tuition Fee', amount: 12000, paidAmount: 9000, dueAmount: 3000, dueDate: '2026-06-10', status: 'Partial' },
  { id: 'F003', studentName: 'Anaya Sharma', studentId: 'S002', feeName: 'Transport Fee', amount: 3000, paidAmount: 0, dueAmount: 3000, dueDate: '2026-06-15', status: 'Unpaid' },
  { id: 'F004', studentName: 'Vihaan Sharma', studentId: 'S003', feeName: 'Tuition Fee', amount: 8000, paidAmount: 6000, dueAmount: 2000, dueDate: '2026-06-10', status: 'Partial' },
  { id: 'F005', studentName: 'Vihaan Sharma', studentId: 'S003', feeName: 'Library Fee', amount: 1000, paidAmount: 1000, dueAmount: 0, dueDate: '2026-06-05', status: 'Paid' },
];

const MOCK_EXAM_RESULTS: any[] = [
  { id: 'ER001', studentName: 'Aarav Sharma', studentId: 'S001', examName: 'Mid Term 2026', subject: 'Mathematics', marksObtained: 92, totalMarks: 100, percentage: 92, grade: 'A+', rank: 2, term: 'Term 1', year: '2026' },
  { id: 'ER002', studentName: 'Aarav Sharma', studentId: 'S001', examName: 'Mid Term 2026', subject: 'Science', marksObtained: 88, totalMarks: 100, percentage: 88, grade: 'A', rank: 3, term: 'Term 1', year: '2026' },
  { id: 'ER003', studentName: 'Aarav Sharma', studentId: 'S001', examName: 'Mid Term 2026', subject: 'English', marksObtained: 85, totalMarks: 100, percentage: 85, grade: 'A', rank: 4, term: 'Term 1', year: '2026' },
  { id: 'ER004', studentName: 'Anaya Sharma', studentId: 'S002', examName: 'Mid Term 2026', subject: 'Mathematics', marksObtained: 98, totalMarks: 100, percentage: 98, grade: 'A+', rank: 1, term: 'Term 1', year: '2026' },
  { id: 'ER005', studentName: 'Anaya Sharma', studentId: 'S002', examName: 'Mid Term 2026', subject: 'Science', marksObtained: 95, totalMarks: 100, percentage: 95, grade: 'A+', rank: 1, term: 'Term 1', year: '2026' },
  { id: 'ER006', studentName: 'Anaya Sharma', studentId: 'S002', examName: 'Mid Term 2026', subject: 'English', marksObtained: 90, totalMarks: 100, percentage: 90, grade: 'A+', rank: 2, term: 'Term 1', year: '2026' },
  { id: 'ER007', studentName: 'Vihaan Sharma', studentId: 'S003', examName: 'Mid Term 2026', subject: 'Mathematics', marksObtained: 80, totalMarks: 100, percentage: 80, grade: 'A', rank: 5, term: 'Term 1', year: '2026' },
  { id: 'ER008', studentName: 'Vihaan Sharma', studentId: 'S003', examName: 'Mid Term 2026', subject: 'Science', marksObtained: 76, totalMarks: 100, percentage: 76, grade: 'B+', rank: 6, term: 'Term 1', year: '2026' },
  { id: 'ER009', studentName: 'Vihaan Sharma', studentId: 'S003', examName: 'Mid Term 2026', subject: 'English', marksObtained: 78, totalMarks: 100, percentage: 78, grade: 'B+', rank: 4, term: 'Term 1', year: '2026' },
];

const MOCK_ATTENDANCE: any[] = [
  { id: 'A001', studentName: 'Aarav Sharma', studentId: 'S001', date: '2026-06-01', status: 'present', subject: 'Mathematics', teacher: 'Mr. Verma' },
  { id: 'A002', studentName: 'Aarav Sharma', studentId: 'S001', date: '2026-06-02', status: 'present', subject: 'Science', teacher: 'Ms. Gupta' },
  { id: 'A003', studentName: 'Aarav Sharma', studentId: 'S001', date: '2026-06-03', status: 'absent', subject: 'English', teacher: 'Mrs. Singh' },
  { id: 'A004', studentName: 'Anaya Sharma', studentId: 'S002', date: '2026-06-01', status: 'present', subject: 'Mathematics', teacher: 'Mr. Verma' },
  { id: 'A005', studentName: 'Anaya Sharma', studentId: 'S002', date: '2026-06-02', status: 'present', subject: 'Science', teacher: 'Ms. Gupta' },
  { id: 'A006', studentName: 'Anaya Sharma', studentId: 'S002', date: '2026-06-03', status: 'present', subject: 'English', teacher: 'Mrs. Singh' },
  { id: 'A007', studentName: 'Vihaan Sharma', studentId: 'S003', date: '2026-06-01', status: 'present', subject: 'Mathematics', teacher: 'Mr. Verma' },
  { id: 'A008', studentName: 'Vihaan Sharma', studentId: 'S003', date: '2026-06-02', status: 'absent', subject: 'Science', teacher: 'Ms. Gupta' },
  { id: 'A009', studentName: 'Vihaan Sharma', studentId: 'S003', date: '2026-06-03', status: 'half-day', subject: 'English', teacher: 'Mrs. Singh' },
];

const ATTENDANCE_WEEKLY = [
  { day: 'Mon', present: 3, absent: 0, halfDay: 0 },
  { day: 'Tue', present: 2, absent: 1, halfDay: 0 },
  { day: 'Wed', present: 2, absent: 0, halfDay: 1 },
  { day: 'Thu', present: 3, absent: 0, halfDay: 0 },
  { day: 'Fri', present: 1, absent: 1, halfDay: 1 },
  { day: 'Sat', present: 1, absent: 0, halfDay: 0 },
];

const MONTHLY_FEE_TREND = [
  { month: 'Jan', collected: 35000, pending: 5000 },
  { month: 'Feb', collected: 32000, pending: 8000 },
  { month: 'Mar', collected: 38000, pending: 2000 },
  { month: 'Apr', collected: 30000, pending: 10000 },
  { month: 'May', collected: 36000, pending: 4000 },
  { month: 'Jun', collected: 28000, pending: 12000 },
];

const PERFORMANCE_TREND = [
  { term: 'Term 1', Aarav: 88, Anaya: 94, Vihaan: 78 },
  { term: 'Term 2', Aarav: 85, Anaya: 92, Vihaan: 76 },
  { term: 'Term 3', Aarav: 90, Anaya: 96, Vihaan: 80 },
];

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

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

function getNotifIcon(type: string) {
  switch (type) {
    case 'academic': return '📚';
    case 'fee': return '💰';
    case 'event': return '🎉';
    case 'attendance': return '📋';
    case 'general': return '📢';
    default: return '📨';
  }
}

function getGradeBadge(grade: string) {
  const g = grade?.replace('+', 'plus');
  switch (g) {
    case 'A+': return 'bg-emerald-100 text-emerald-700';
    case 'A': return 'bg-blue-100 text-blue-700';
    case 'B+': return 'bg-indigo-100 text-indigo-700';
    case 'B': return 'bg-purple-100 text-purple-700';
    case 'C': return 'bg-amber-100 text-amber-700';
    case 'D': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

// ── Tab Config ─────────────────────────────────────────────────
type TabId = 'dashboard' | 'children' | 'attendance' | 'fees' | 'exams' | 'notifications';

interface TabConfig { id: TabId; label: string; icon: string; }

const TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'children', label: 'My Children', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'attendance', label: 'Attendance', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'fees', label: 'Fees', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'exams', label: 'Exams & Results', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
];

// ── Dashboard Tab ──────────────────────────────────────────────
function DashboardTab() {
  const totalFeesPaid = MOCK_FEES.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalFeesDue = MOCK_FEES.reduce((sum, f) => sum + f.dueAmount, 0);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
  const upcomingExams = 3;

  const summaryCards = [
    { title: 'Children', value: MOCK_CHILDREN.length, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0', color: COLORS.primary },
    { title: 'Avg Attendance', value: `${Math.round(MOCK_CHILDREN.reduce((s, c) => s + c.attendanceRate, 0) / MOCK_CHILDREN.length)}%`, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: COLORS.success },
    { title: 'Fees Paid', value: `₹${(totalFeesPaid / 1000).toFixed(1)}K`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: COLORS.success },
    { title: 'Fees Due', value: `₹${(totalFeesDue / 1000).toFixed(1)}K`, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z', color: COLORS.danger },
    { title: 'Upcoming Exams', value: upcomingExams, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2', color: COLORS.warning },
    { title: 'Notifications', value: unreadCount, icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', color: COLORS.purple },
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
        {/* Performance Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Academic Performance Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Term-wise performance of your children</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={PERFORMANCE_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="term" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
                <Legend verticalAlign="top" height={30} iconType="circle" formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>} />
                <Line type="monotone" dataKey="Aarav" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Anaya" stroke={COLORS.success} strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Vihaan" stroke={COLORS.warning} strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Fee Overview</h3>
          <p className="text-xs text-gray-500 mb-4">Collected vs Pending fees this year</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={MONTHLY_FEE_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
                <Legend verticalAlign="top" height={30} iconType="circle" formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>} />
                <Bar dataKey="collected" name="Collected" fill={COLORS.success} radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="pending" name="Pending" fill={COLORS.danger} radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-sm shrink-0">{getNotifIcon(n.type)}</div>
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
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityColor(n.priority)}`}>{n.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Children Tab ────────────────────────────────────────────────
function ChildrenTab() {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_CHILDREN.map((child) => {
          const isExpanded = selectedChild === child.id;
          const childResults = MOCK_EXAM_RESULTS.filter(r => r.studentId === child.id);
          const avgPercentage = childResults.length > 0
            ? Math.round(childResults.reduce((s, r) => s + r.percentage, 0) / childResults.length)
            : 0;

          return (
            <div key={child.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200">
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {child.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{child.fullName}</h4>
                    <p className="text-xs text-gray-500">Class {child.class}-{child.section} | Roll No: {child.rollNo}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${child.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <span className="block text-lg font-bold text-gray-900">{child.attendanceRate}%</span>
                    <span className="text-[10px] text-gray-500">Attendance</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <span className={`block text-lg font-bold ${child.lastExamRank && child.lastExamRank <= 3 ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {child.lastExamRank ? `#${child.lastExamRank}` : '-'}
                    </span>
                    <span className="text-[10px] text-gray-500">Rank</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <span className="block text-lg font-bold text-gray-900">{avgPercentage}%</span>
                    <span className="text-[10px] text-gray-500">Avg Score</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Fees Paid</span>
                    <span className="text-xs font-semibold text-emerald-600">₹{child.feesPaid.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${child.feesDue > 0 ? (child.feesPaid / (child.feesPaid + child.feesDue)) * 100 : 100}%` }} />
                  </div>
                  {child.feesDue > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Fees Due</span>
                      <span className="text-xs font-semibold text-red-500">₹{child.feesDue.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedChild(isExpanded ? null : child.id)}
                className="w-full px-5 py-2.5 text-xs font-medium text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
              >
                {isExpanded ? 'Hide Details' : 'View Details'}
                <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Exam Results</h5>
                  <div className="space-y-2">
                    {childResults.slice(0, 3).map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-700">{r.subject}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400">{r.examName}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{r.marksObtained}/{r.totalMarks}</span>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${getGradeBadge(r.grade)}`}>{r.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Attendance Tab ───────────────────────────────────────────────
function AttendanceTab() {
  const [selectedChildId, setSelectedChildId] = useState(MOCK_CHILDREN[0].id);

  const selectedChild = MOCK_CHILDREN.find(c => c.id === selectedChildId);
  const childAttendance = MOCK_ATTENDANCE.filter(a => a.studentId === selectedChildId);
  const presentCount = childAttendance.filter(a => a.status === 'present').length;
  const absentCount = childAttendance.filter(a => a.status === 'absent').length;
  const halfDayCount = childAttendance.filter(a => a.status === 'half-day').length;
  const totalCount = childAttendance.length;
  const attendancePct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Child Selector */}
      <div className="flex flex-wrap gap-2">
        {MOCK_CHILDREN.map((child) => (
          <button
            key={child.id}
            type="button"
            onClick={() => setSelectedChildId(child.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedChildId === child.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {child.fullName}
          </button>
        ))}
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Present</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xl font-bold text-gray-900">{presentCount}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Absent</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xl font-bold text-gray-900">{absentCount}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Half Day</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xl font-bold text-gray-900">{halfDayCount}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Attendance %</span>
          <div className={`flex items-center gap-2 mt-1 ${attendancePct >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>
            <span className="text-xl font-bold">{attendancePct}%</span>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Weekly Attendance</h3>
        <p className="text-xs text-gray-500 mb-4">Attendance breakdown for {selectedChild?.fullName}</p>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={ATTENDANCE_WEEKLY} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
              <Legend verticalAlign="top" height={30} iconType="circle" formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>} />
              <Bar dataKey="present" name="Present" fill={COLORS.success} radius={[4, 4, 0, 0]} maxBarSize={25} />
              <Bar dataKey="absent" name="Absent" fill={COLORS.danger} radius={[4, 4, 0, 0]} maxBarSize={25} />
              <Bar dataKey="halfDay" name="Half Day" fill={COLORS.warning} radius={[4, 4, 0, 0]} maxBarSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Attendance Records</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {childAttendance.map((a) => (
            <div key={a.id} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                  a.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                  a.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {a.status === 'present' ? 'P' : a.status === 'absent' ? 'A' : 'H'}
                </div>
                <div>
                  <span className="text-sm text-gray-900">{formatDate(a.date)}</span>
                  <p className="text-xs text-gray-500">{a.subject} - {a.teacher}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold capitalize ${
                a.status === 'present' ? 'text-emerald-600' :
                a.status === 'absent' ? 'text-red-600' : 'text-amber-600'
              }`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Fees Tab ────────────────────────────────────────────────────
function FeesTab() {
  const [selectedChildId, setSelectedChildId] = useState('all');

  const filteredFees = selectedChildId === 'all'
    ? MOCK_FEES
    : MOCK_FEES.filter(f => f.studentId === selectedChildId);

  const totalPaid = filteredFees.reduce((s, f) => s + f.paidAmount, 0);
  const totalDue = filteredFees.reduce((s, f) => s + f.dueAmount, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 shadow-lg text-white">
          <p className="text-sm text-emerald-100">Total Paid</p>
          <h3 className="text-2xl font-bold mt-1">₹{totalPaid.toLocaleString()}</h3>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 shadow-lg text-white">
          <p className="text-sm text-red-100">Total Due</p>
          <h3 className="text-2xl font-bold mt-1">₹{totalDue.toLocaleString()}</h3>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 shadow-lg text-white">
          <p className="text-sm text-indigo-100">Clearance</p>
          <h3 className="text-2xl font-bold mt-1">
            {totalPaid + totalDue > 0 ? `${Math.round((totalPaid / (totalPaid + totalDue)) * 100)}%` : '100%'}
          </h3>
        </div>
      </div>

      {/* Child Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedChildId('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedChildId === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}>All Children</button>
        {MOCK_CHILDREN.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedChildId(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedChildId === c.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>{c.fullName}</button>
        ))}
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Fee Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Fee Name</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Due</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-gray-900">{fee.studentName}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{fee.feeName}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-900 text-right font-medium">₹{fee.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-emerald-600 text-right font-medium">₹{fee.paidAmount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-red-600 text-right font-medium">₹{fee.dueAmount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(fee.status)}`}>{fee.status}</span>
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

// ── Exams Tab ────────────────────────────────────────────────────
function ExamsTab() {
  const [selectedChildId, setSelectedChildId] = useState(MOCK_CHILDREN[0].id);
  const [selectedExam, setSelectedExam] = useState('all');

  const selectedChild = MOCK_CHILDREN.find(c => c.id === selectedChildId);
  const childResults = MOCK_EXAM_RESULTS.filter(r => r.studentId === selectedChildId);
  const examNames = [...new Set(childResults.map(r => r.examName))];

  const filteredResults = selectedExam === 'all' ? childResults : childResults.filter(r => r.examName === selectedExam);
  const avgPct = filteredResults.length > 0 ? Math.round(filteredResults.reduce((s, r) => s + r.percentage, 0) / filteredResults.length) : 0;

  return (
    <div className="space-y-6">
      {/* Child Selector */}
      <div className="flex flex-wrap gap-2">
        {MOCK_CHILDREN.map((child) => (
          <button
            key={child.id}
            type="button"
            onClick={() => { setSelectedChildId(child.id); setSelectedExam('all'); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedChildId === child.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>{child.fullName}</button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Average Score</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xl font-bold ${avgPct >= 80 ? 'text-emerald-600' : avgPct >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{avgPct}%</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Best Subject</span>
          <div className="mt-1">
            <span className="text-sm font-bold text-gray-900">
              {childResults.length > 0
                ? childResults.reduce((best, r) => r.percentage > (best?.percentage || 0) ? r : best, childResults[0])?.subject
                : '-'}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Best Grade</span>
          <div className="mt-1">
            <span className="text-sm font-bold text-gray-900">
              {childResults.length > 0
                ? childResults.reduce((best, r) => {
                    const gradeOrder = ['A+', 'A', 'B+', 'B', 'C', 'D'];
                    return gradeOrder.indexOf(r.grade) < gradeOrder.indexOf(best?.grade || 'D') ? r : best;
                  }, childResults[0])?.grade
                : '-'}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Exams Taken</span>
          <div className="mt-1">
            <span className="text-xl font-bold text-gray-900">{examNames.length}</span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Exam Results for {selectedChild?.fullName}</h3>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Exams</option>
            {examNames.map(en => <option key={en} value={en}>{en}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Marks</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Exam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredResults.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{r.subject}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 text-center">{r.marksObtained}/{r.totalMarks}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`text-sm font-semibold ${
                      r.percentage >= 80 ? 'text-emerald-600' : r.percentage >= 60 ? 'text-amber-600' : 'text-red-600'
                    }`}>{r.percentage}%</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${getGradeBadge(r.grade)}`}>{r.grade}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 text-center">{r.examName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance by Subject Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Subject-wise Performance</h3>
        <p className="text-xs text-gray-500 mb-4">Percentage by subject for {selectedChild?.fullName}</p>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart
              data={childResults.reduce((acc: any[], r) => {
                const existing = acc.find(a => a.subject === r.subject);
                if (existing) {
                  existing.percentage = Math.round((existing.percentage + r.percentage) / 2);
                } else {
                  acc.push({ subject: r.subject, percentage: r.percentage, marks: r.marksObtained });
                }
                return acc;
              }, [])}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} width={80} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
              <Bar dataKey="percentage" name="Percentage" radius={[0, 6, 6, 0]} maxBarSize={30}>
                {childResults.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Notifications Tab ────────────────────────────────────────────
function ParentNotificationsTab() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifs = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter(n => {
      if (filter === 'unread' && n.isRead) return false;
      if (filter === 'read' && !n.isRead) return false;
      if (typeFilter !== 'all' && n.type !== typeFilter) return false;
      if (searchTerm && !n.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [filter, typeFilter, searchTerm]);

  const types = ['all', 'academic', 'fee', 'event', 'attendance', 'general'];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Search</label>
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div className="flex pt-5">
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {(['all', 'unread', 'read'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-2.5">
        {filteredNotifs.map((n) => (
          <div key={n.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
            !n.isRead ? 'border-indigo-200 bg-indigo-50/20' : 'border-gray-200'
          }`}>
            <div className="px-5 py-3.5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg shrink-0">{getNotifIcon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</span>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-400">{n.from}</span>
                  <span className="text-[10px] text-gray-300">•</span>
                  <span className="text-[10px] text-gray-400">{timeAgo(n.createdAt)}</span>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityColor(n.priority)}`}>{n.priority}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifs.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500 text-sm">No notifications match your filter criteria.</p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export function ParentPortalPage() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'children': return <ChildrenTab />;
      case 'attendance': return <AttendanceTab />;
      case 'fees': return <FeesTab />;
      case 'exams': return <ExamsTab />;
      case 'notifications': return <ParentNotificationsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parent Portal</h2>
          <p className="text-sm text-gray-500 mt-1">Track your children's academic progress, attendance, fees, and more</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-gray-700">{MOCK_CHILDREN.length} Children • {unreadCount} Unread</span>
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
            {tab.id === 'notifications' && unreadCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}