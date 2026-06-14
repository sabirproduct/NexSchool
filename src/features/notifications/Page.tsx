import { useState, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

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

// ── Types ──────────────────────────────────────────────────────
interface Notification {
  id: string;
  type: 'announcement' | 'alert' | 'reminder' | 'update' | 'event';
  title: string;
  message: string;
  sender: string;
  senderRole: string;
  recipientType: 'all' | 'students' | 'parents' | 'teachers' | 'staff';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  isPinned: boolean;
  createdAt: string;
  readAt?: string;
  link?: string;
  attachments?: string[];
}

interface NotificationStats {
  totalSent: number;
  unread: number;
  read: number;
  urgent: number;
  announcementCount: number;
  alertCount: number;
  weeklyTrend: { day: string; count: number }[];
  categoryBreakdown: { name: string; value: number; color: string }[];
  readRate: number;
}

// ── Mock Data ──────────────────────────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'N001', type: 'announcement', title: 'Summer Vacation Notice', message: 'School will remain closed from May 15 to June 30 for summer vacation. Regular classes will resume from July 1.', sender: 'Principal Office', senderRole: 'Admin', recipientType: 'all', priority: 'high', isRead: false, isPinned: true, createdAt: '2026-06-14T09:00:00Z' },
  { id: 'N002', type: 'alert', title: 'Fee Payment Deadline Extended', message: 'The last date for fee payment has been extended to June 20. Late fee will be applicable after that.', sender: 'Accounts Department', senderRole: 'Finance', recipientType: 'parents', priority: 'urgent', isRead: false, isPinned: false, createdAt: '2026-06-13T14:30:00Z' },
  { id: 'N003', type: 'reminder', title: 'PTA Meeting Tomorrow', message: 'Parent-Teacher meeting scheduled for tomorrow at 10:00 AM in the school auditorium. All parents are requested to attend.', sender: 'Academic Coordinator', senderRole: 'Teacher', recipientType: 'parents', priority: 'high', isRead: true, isPinned: true, createdAt: '2026-06-12T11:00:00Z', readAt: '2026-06-12T16:00:00Z' },
  { id: 'N004', type: 'update', title: 'Exam Schedule Published', message: 'The final examination schedule has been published. Check the academics section for detailed timetable.', sender: 'Examination Cell', senderRole: 'Admin', recipientType: 'students', priority: 'medium', isRead: false, isPinned: false, createdAt: '2026-06-11T08:00:00Z' },
  { id: 'N005', type: 'event', title: 'Annual Sports Day', message: 'Annual Sports Day will be held on June 25. Registration forms available at the sports office.', sender: 'Sports Department', senderRole: 'Staff', recipientType: 'all', priority: 'low', isRead: false, isPinned: false, createdAt: '2026-06-10T10:00:00Z' },
  { id: 'N006', type: 'announcement', title: 'New Library Timings', message: 'Library will now remain open from 7:00 AM to 7:00 PM on all working days.', sender: 'Librarian', senderRole: 'Staff', recipientType: 'all', priority: 'low', isRead: true, isPinned: false, createdAt: '2026-06-09T09:30:00Z', readAt: '2026-06-09T14:00:00Z' },
  { id: 'N007', type: 'alert', title: 'Bus Route Change', message: 'Due to road construction, bus route number 5 will be diverted via Gandhi Nagar for the next two weeks.', sender: 'Transport Department', senderRole: 'Staff', recipientType: 'parents', priority: 'high', isRead: false, isPinned: false, createdAt: '2026-06-08T07:00:00Z' },
  { id: 'N008', type: 'reminder', title: 'Science Exhibition Submission', message: 'Last date for science project submissions is June 18. All participants must submit their models to the lab.', sender: 'Science Department', senderRole: 'Teacher', recipientType: 'students', priority: 'medium', isRead: true, isPinned: false, createdAt: '2026-06-07T13:00:00Z', readAt: '2026-06-07T17:00:00Z' },
  { id: 'N009', type: 'update', title: 'Staff Meeting Rescheduled', message: 'The staff meeting scheduled for Friday has been moved to Thursday at 3:00 PM in the conference room.', sender: 'HR Department', senderRole: 'Admin', recipientType: 'teachers', priority: 'medium', isRead: false, isPinned: false, createdAt: '2026-06-06T15:00:00Z' },
  { id: 'N010', type: 'announcement', title: 'Holiday on June 20', message: 'The school will remain closed on June 20 on account of Eid-ul-Adha.', sender: 'Principal Office', senderRole: 'Admin', recipientType: 'all', priority: 'high', isRead: false, isPinned: false, createdAt: '2026-06-05T10:00:00Z' },
  { id: 'N011', type: 'alert', title: 'Suspicious Activity Warning', message: 'Please be vigilant. Report any suspicious individuals near the school premises to security immediately.', sender: 'Security Department', senderRole: 'Staff', recipientType: 'all', priority: 'urgent', isRead: true, isPinned: false, createdAt: '2026-06-04T08:30:00Z', readAt: '2026-06-04T09:15:00Z' },
  { id: 'N012', type: 'event', title: 'Cultural Fest Registration', message: 'Registrations for the annual cultural fest are now open. Showcase your talent in music, dance, and drama.', sender: 'Cultural Committee', senderRole: 'Teacher', recipientType: 'students', priority: 'low', isRead: false, isPinned: false, createdAt: '2026-06-03T11:00:00Z' },
];

const WEEKLY_TREND_DATA = [
  { day: 'Mon', count: 12 }, { day: 'Tue', count: 8 }, { day: 'Wed', count: 15 },
  { day: 'Thu', count: 10 }, { day: 'Fri', count: 20 }, { day: 'Sat', count: 5 }, { day: 'Sun', count: 3 },
];

const CATEGORY_BREAKDOWN = [
  { name: 'Announcements', value: 35, color: COLORS.primary },
  { name: 'Alerts', value: 20, color: COLORS.danger },
  { name: 'Reminders', value: 25, color: COLORS.warning },
  { name: 'Updates', value: 12, color: COLORS.info },
  { name: 'Events', value: 8, color: COLORS.success },
];

const UNREAD_TREND = [
  { day: 'Week 1', sent: 45, read: 30 },
  { day: 'Week 2', sent: 52, read: 38 },
  { day: 'Week 3', sent: 38, read: 28 },
  { day: 'Week 4', sent: 60, read: 45 },
];

// ── Helpers ────────────────────────────────────────────────────
const notificationStats: NotificationStats = {
  totalSent: MOCK_NOTIFICATIONS.length,
  unread: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length,
  read: MOCK_NOTIFICATIONS.filter(n => n.isRead).length,
  urgent: MOCK_NOTIFICATIONS.filter(n => n.priority === 'urgent').length,
  announcementCount: MOCK_NOTIFICATIONS.filter(n => n.type === 'announcement').length,
  alertCount: MOCK_NOTIFICATIONS.filter(n => n.type === 'alert').length,
  weeklyTrend: WEEKLY_TREND_DATA,
  categoryBreakdown: CATEGORY_BREAKDOWN,
  readRate: Math.round((MOCK_NOTIFICATIONS.filter(n => n.isRead).length / MOCK_NOTIFICATIONS.length) * 100),
};

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'urgent': return COLORS.danger;
    case 'high': return COLORS.warning;
    case 'medium': return COLORS.info;
    case 'low': return COLORS.success;
    default: return COLORS.gray;
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
    case 'high': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'announcement': return '📢';
    case 'alert': return '🚨';
    case 'reminder': return '⏰';
    case 'update': return '🔄';
    case 'event': return '🎉';
    default: return '📨';
  }
}

function getRecipientColor(recipient: string) {
  switch (recipient) {
    case 'all': return 'bg-indigo-100 text-indigo-700';
    case 'students': return 'bg-blue-100 text-blue-700';
    case 'parents': return 'bg-purple-100 text-purple-700';
    case 'teachers': return 'bg-emerald-100 text-emerald-700';
    case 'staff': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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

// ── Tab Config ─────────────────────────────────────────────────
type TabId = 'dashboard' | 'inbox' | 'send' | 'templates' | 'analytics';

interface TabConfig { id: TabId; label: string; icon: string; }

const TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'inbox', label: 'Inbox', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'send', label: 'Send', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
  { id: 'templates', label: 'Templates', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

// ── Dashboard Tab ──────────────────────────────────────────────
function DashboardTab() {
  const stats = notificationStats;
  const recentNotifications = MOCK_NOTIFICATIONS.slice(0, 5);

  const summaryCards = [
    { title: 'Total Sent', value: stats.totalSent, icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8', color: COLORS.primary },
    { title: 'Unread', value: stats.unread, icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', color: COLORS.warning },
    { title: 'Read', value: stats.read, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: COLORS.success },
    { title: 'Urgent', value: stats.urgent, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z', color: COLORS.danger },
    { title: 'Announcements', value: stats.announcementCount, icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', color: COLORS.purple },
    { title: 'Alerts', value: stats.alertCount, icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: COLORS.pink },
    { title: 'Read Rate', value: `${stats.readRate}%`, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: COLORS.secondary },
    { title: 'Categories', value: CATEGORY_BREAKDOWN.length, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', color: COLORS.info },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Weekly Notification Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Notifications sent per day this week</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={stats.weeklyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }}
                  formatter={(value: number) => [`${value} notifications`, 'Sent']}
                />
                <Bar dataKey="count" name="Notifications" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {stats.weeklyTrend.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Category Breakdown</h3>
          <p className="text-xs text-gray-500 mb-4">Notifications by type</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={stats.categoryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                  {stats.categoryBreakdown.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }}
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Notifications</h3>
          <span className="text-xs font-medium text-indigo-600 cursor-pointer hover:text-indigo-800">View All →</span>
        </div>
        <div className="divide-y divide-gray-50">
          {recentNotifications.map((n) => (
            <div key={n.id} className={`px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50/50 transition-colors ${!n.isRead ? 'bg-indigo-50/30' : ''}`}>
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-sm shrink-0">
                {getTypeIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</span>
                  {n.isPinned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">Pinned</span>}
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-400">{n.sender}</span>
                  <span className="text-[10px] text-gray-300">•</span>
                  <span className="text-[10px] text-gray-400">{timeAgo(n.createdAt)}</span>
                  <span className="text-[10px] text-gray-300">•</span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${getRecipientColor(n.recipientType)}`}>{n.recipientType}</span>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityBadge(n.priority)}`}>
                {n.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Inbox Tab ──────────────────────────────────────────────────
function InboxTab() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  const filteredNotifications = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter(n => {
      if (filter === 'unread' && n.isRead) return false;
      if (filter === 'read' && !n.isRead) return false;
      if (typeFilter !== 'all' && n.type !== typeFilter) return false;
      if (priorityFilter !== 'all' && n.priority !== priorityFilter) return false;
      if (searchTerm && !n.title.toLowerCase().includes(searchTerm.toLowerCase()) && !n.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [filter, typeFilter, priorityFilter, searchTerm]);

  const typesList = ['all', 'announcement', 'alert', 'reminder', 'update', 'event'];
  const priorities = ['all', 'low', 'medium', 'high', 'urgent'];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Search</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            {typesList.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Priority</label>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
        <div className="flex pt-5">
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {(['all', 'unread', 'read'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">
          {filteredNotifications.length} notifications
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-2.5">
        {filteredNotifications.map((n) => {
          const isExpanded = selectedNotification === n.id;
          return (
            <div key={n.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 ${
              !n.isRead ? 'border-indigo-200 bg-indigo-50/20' : 'border-gray-200'
            }`}>
              <button
                type="button"
                onClick={() => setSelectedNotification(isExpanded ? null : n.id)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg shrink-0">
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</span>
                      {n.isPinned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">Pinned</span>}
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gray-400">{n.sender}</span>
                      <span className="text-[11px] text-gray-300">•</span>
                      <span className="text-[11px] text-gray-400">{timeAgo(n.createdAt)}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${getRecipientColor(n.recipientType)}`}>
                        {n.recipientType}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityBadge(n.priority)}`}>
                    {n.priority}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-5 pb-4 pt-0 border-t border-gray-100">
                  <div className="mt-3 space-y-3 text-sm text-gray-600">
                    <p className="leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 pt-1 border-t border-gray-50">
                      <span>From: <strong className="text-gray-700">{n.sender}</strong></span>
                      <span>Role: <strong className="text-gray-700">{n.senderRole}</strong></span>
                      <span>Sent: <strong className="text-gray-700">{formatDate(n.createdAt)}</strong></span>
                      {n.readAt && <span>Read: <strong className="text-gray-700">{formatDate(n.readAt)}</strong></span>}
                    </div>
                    {n.link && (
                      <a href={n.link} className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium hover:text-indigo-800">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Details
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500 text-sm">No notifications match your filter criteria.</p>
        </div>
      )}
    </div>
  );
}

// ── Send Notification Tab ──────────────────────────────────────
function SendTab() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [priority, setPriority] = useState('medium');
  const [type, setType] = useState('announcement');
  const [showPreview, setShowPreview] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setTitle('');
      setMessage('');
      setShowPreview(false);
    }, 2000);
  };

  const recipients = [
    { value: 'all', label: 'All Users', icon: '👥', desc: 'Students, parents, teachers & staff' },
    { value: 'students', label: 'Students Only', icon: '🎓', desc: 'All enrolled students' },
    { value: 'parents', label: 'Parents Only', icon: '👪', desc: 'All parents/guardians' },
    { value: 'teachers', label: 'Teachers Only', icon: '👨‍🏫', desc: 'All teaching staff' },
    { value: 'staff', label: 'Staff Only', icon: '👔', desc: 'All non-teaching staff' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Form */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Compose Notification</h3>
        <p className="text-xs text-gray-500 mb-6">Create and send notifications to users</p>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Write your notification message..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
            />
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
                <option value="announcement">📢 Announcement</option>
                <option value="alert">🚨 Alert</option>
                <option value="reminder">⏰ Reminder</option>
                <option value="update">🔄 Update</option>
                <option value="event">🎉 Event</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
                <option value="low">🟢 Low</option>
                <option value="medium">🔵 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recipient</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipients.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRecipientType(r.value)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    recipientType === r.value
                      ? 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{r.icon}</span>
                  <div>
                    <span className="text-sm font-medium text-gray-900">{r.label}</span>
                    <p className="text-[11px] text-gray-500">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSend}
              disabled={!title.trim() || !message.trim() || sent}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                sent ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {sent ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sent Successfully!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Notification
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              {showPreview ? 'Hide Preview' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview & Tips */}
      <div className="lg:col-span-2 space-y-4">
        {showPreview && title.trim() && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</h4>
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{type === 'announcement' ? '📢' : type === 'alert' ? '🚨' : type === 'reminder' ? '⏰' : type === 'update' ? '🔄' : '🎉'}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase">{type}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityBadge(priority)}`}>
                  {priority}
                </span>
              </div>
              <h5 className="text-sm font-semibold text-gray-900 mb-1">{title}</h5>
              <p className="text-sm text-gray-600">{message}</p>
              <div className="mt-3 pt-2 border-t border-indigo-200 flex items-center justify-between text-[11px] text-gray-500">
                <span>To: {recipients.find(r => r.value === recipientType)?.label}</span>
                <span>Just now</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 shadow-lg text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💡</span>
            <h4 className="text-sm font-semibold">Pro Tips</h4>
          </div>
          <ul className="space-y-2 text-sm text-indigo-100">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 mt-0.5">•</span>
              <span>Keep titles concise and action-oriented</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 mt-0.5">•</span>
              <span>Use urgent priority only for time-critical alerts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 mt-0.5">•</span>
              <span>Target specific audience groups for better engagement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 mt-0.5">•</span>
              <span>Pin important announcements for visibility</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Recipients</span>
              <span className="text-sm font-semibold text-gray-900">
                {recipientType === 'all' ? '1,250' : recipientType === 'students' ? '650' : recipientType === 'parents' ? '580' : recipientType === 'teachers' ? '45' : '30'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected Read Rate</span>
              <span className="text-sm font-semibold text-emerald-600">~85%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sent Today</span>
              <span className="text-sm font-semibold text-gray-900">8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Templates Tab ──────────────────────────────────────────────
function TemplatesTab() {
  const templates = [
    { name: 'Holiday Notice', icon: '🏖️', desc: 'Announce school holidays and breaks', category: 'announcement' },
    { name: 'Fee Reminder', icon: '💰', desc: 'Remind parents about fee deadlines', category: 'reminder' },
    { name: 'Exam Schedule', icon: '📝', desc: 'Publish exam timetables', category: 'update' },
    { name: 'Event Invitation', icon: '🎪', desc: 'Invite to school events and functions', category: 'event' },
    { name: 'Emergency Alert', icon: '🚨', desc: 'Urgent safety and security alerts', category: 'alert' },
    { name: 'PTA Meeting', icon: '🤝', desc: 'Parent-teacher meeting schedules', category: 'reminder' },
    { name: 'Result Published', icon: '📊', desc: 'Notify when results are published', category: 'update' },
    { name: 'Transport Update', icon: '🚌', desc: 'Bus route and timing changes', category: 'alert' },
    { name: 'Sports Event', icon: '⚽', desc: 'Sports day and tournament details', category: 'event' },
    { name: 'Library Notice', icon: '📚', desc: 'Library timings and policy updates', category: 'announcement' },
    { name: 'Staff Meeting', icon: '👨‍🏫', desc: 'Staff meeting schedules and agendas', category: 'reminder' },
    { name: 'Cultural Fest', icon: '🎭', desc: 'Cultural event registrations and details', category: 'event' },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', 'announcement', 'alert', 'reminder', 'update', 'event'];

  const filteredTemplates = selectedCategory === 'all' ? templates : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 text-xs font-medium rounded-xl transition-all ${
              selectedCategory === c
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {c === 'all' ? 'All Templates' : c.charAt(0).toUpperCase() + c.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((t) => (
          <div key={t.name} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-2xl">
                {t.icon}
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity">
                Use →
              </span>
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">{t.name}</h4>
            <p className="text-xs text-gray-500">{t.desc}</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-[10px] font-medium text-gray-400 uppercase">{t.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Analytics Tab ──────────────────────────────────────────────
function AnalyticsTab() {
  const stats = notificationStats;

  // Read/Unread pie data
  const readUnreadData = [
    { name: 'Read', value: stats.read, color: COLORS.success },
    { name: 'Unread', value: stats.unread, color: COLORS.warning },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metric */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-100">Notification Analytics</p>
            <h3 className="text-xl font-bold mt-1">Read Rate: {stats.readRate}%</h3>
            <p className="text-sm text-indigo-100 mt-1">{stats.totalSent} Total • {stats.urgent} Urgent • {stats.unread} Unread</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            📊
          </div>
        </div>
        <div className="mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${stats.readRate}%` }} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Read vs Unread */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Read vs Unread</h3>
          <p className="text-xs text-gray-500 mb-4">Notification engagement overview</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={readUnreadData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {readUnreadData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Weekly Sent vs Read</h3>
          <p className="text-xs text-gray-500 mb-4">Notification delivery effectiveness</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={UNREAD_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }}
                />
                <Legend
                  verticalAlign="top"
                  height={30}
                  iconType="circle"
                  formatter={(value: string) => <span className="text-xs text-gray-600">{value === 'sent' ? 'Sent' : 'Read'}</span>}
                />
                <Bar dataKey="sent" name="sent" fill={COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="read" name="read" fill={COLORS.success} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Priority Distribution</h3>
        <p className="text-xs text-gray-500 mb-4">Notifications grouped by priority level</p>
        <div className="grid grid-cols-4 gap-4">
          {(['urgent', 'high', 'medium', 'low'] as const).map(p => {
            const count = MOCK_NOTIFICATIONS.filter(n => n.priority === p).length;
            const pct = Math.round((count / MOCK_NOTIFICATIONS.length) * 100);
            return (
              <div key={p} className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${getPriorityColor(p)}15` }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getPriorityColor(p) }} />
                </div>
                <span className="text-lg font-bold text-gray-900">{count}</span>
                <p className="text-xs text-gray-500 capitalize mt-0.5">{p}</p>
                <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: getPriorityColor(p) }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const stats = notificationStats;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'inbox': return <InboxTab />;
      case 'send': return <SendTab />;
      case 'templates': return <TemplatesTab />;
      case 'analytics': return <AnalyticsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
          <p className="text-sm text-gray-500 mt-1">Send announcements, manage alerts, and track notification engagement</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="font-medium text-gray-700">{stats.unread} Unread • {stats.totalSent} Total</span>
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
              activeTab === tab.id
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
            {tab.id === 'inbox' && stats.unread > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {stats.unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}