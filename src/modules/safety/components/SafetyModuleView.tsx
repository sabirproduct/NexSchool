import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { mockSafetyCheckIns, mockVisitorLogs, mockNightAttendance } from '../mocks/seed';

const COLORS = {
  primary: '#6366f1', primaryLight: '#eef2ff', secondary: '#06b6d4', success: '#10b981',
  warning: '#f59e0b', danger: '#ef4444', info: '#3b82f6', purple: '#8b5cf6', pink: '#ec4899', gray: '#6b7280',
};
const CHART_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

type TabId = 'dashboard' | 'checkins' | 'visitors' | 'night-attendance';
const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Safety Dashboard', icon: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'checkins', label: 'In/Out Tracking', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' },
  { id: 'visitors', label: 'Visitor Management', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'night-attendance', label: 'Night Attendance', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
];

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    Safe: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Alert: 'bg-amber-100 text-amber-700 border-amber-200',
    Critical: 'bg-red-100 text-red-700 border-red-200',
    Resolved: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return map[status] || 'bg-gray-100 text-gray-600 border-gray-200';
}

function DashboardTab() {
  const checkIns = mockSafetyCheckIns;
  const visitors = mockVisitorLogs;
  const nightAtt = mockNightAttendance;

  const totalStudents = 8;
  const inHostel = checkIns.filter(c => c.eventType === 'Gate Entry' && c.status === 'Safe').length;
  const outOfHostel = checkIns.filter(c => c.eventType === 'Gate Exit').length;
  const lateReturns = checkIns.filter(c => c.eventType === 'Late Return').length;
  const visitorsToday = visitors.filter(v => v.checkIn.startsWith('2026-06-16')).length;
  const pendingAlerts = checkIns.filter(c => c.status === 'Alert' || c.status === 'Critical').length;
  const nightPending = nightAtt.filter(n => !n.present && !n.parentNotified).length;

  const monthlyData = [
    { month: 'Jan', alerts: 2, emergencies: 0 },
    { month: 'Feb', alerts: 3, emergencies: 1 },
    { month: 'Mar', alerts: 1, emergencies: 0 },
    { month: 'Apr', alerts: 4, emergencies: 0 },
    { month: 'May', alerts: 2, emergencies: 1 },
    { month: 'Jun', alerts: 3, emergencies: 1 },
  ];

  const statusDist = [
    { name: 'Safe', value: checkIns.filter(c => c.status === 'Safe').length, color: COLORS.success },
    { name: 'Alert', value: checkIns.filter(c => c.status === 'Alert').length, color: COLORS.warning },
    { name: 'Critical', value: checkIns.filter(c => c.status === 'Critical').length, color: COLORS.danger },
    { name: 'Resolved', value: checkIns.filter(c => c.status === 'Resolved').length, color: COLORS.gray },
  ];

  const summaryCards = [
    { title: 'Total Students Tracked', value: totalStudents, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: COLORS.primary },
    { title: 'In Hostel', value: inHostel, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: COLORS.success },
    { title: 'Out of Hostel', value: outOfHostel, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: COLORS.secondary },
    { title: 'Late Returns (Today)', value: lateReturns, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: COLORS.warning },
    { title: 'Visitors (Today)', value: visitorsToday, icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', color: COLORS.info },
    { title: 'Pending Alerts', value: pendingAlerts, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z', color: pendingAlerts > 0 ? COLORS.danger : COLORS.success },
    { title: 'Night Att. Pending', value: nightPending, icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z', color: COLORS.purple },
  ];

  return (
    <div className="space-y-6">
      {/* Premium Badge */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 shadow-lg text-white flex items-center gap-3">
        <span className="text-2xl">⭐</span>
        <div>
          <p className="text-sm font-semibold text-amber-100 uppercase tracking-wider">Premium Feature</p>
          <p className="text-lg font-bold">Girls' Safety Dashboard — Every girl accounted for at all times</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Safety Incidents</h3>
          <p className="text-xs text-gray-500 mb-4">Alerts & emergencies over the year</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
                <Legend verticalAlign="top" height={30} iconType="circle" formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>} />
                <Bar dataKey="alerts" name="Alerts" fill={COLORS.warning} radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="emergencies" name="Emergencies" fill={COLORS.danger} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Event Status</h3>
          <p className="text-xs text-gray-500 mb-4">Current safety status distribution</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                  {statusDist.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
                <Legend verticalAlign="bottom" height={36} formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Safety Events</h3>
          <span className="text-xs text-gray-500">Last 7 days</span>
        </div>
        <div className="divide-y divide-gray-50">
          {checkIns.slice(0, 5).map((c) => (
            <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${c.status === 'Safe' ? 'bg-emerald-500' : c.status === 'Alert' ? 'bg-amber-500' : 'bg-red-500'}`} />
                <div>
                  <span className="text-sm font-medium text-gray-900">{c.studentName}</span>
                  <span className="text-xs text-gray-400 ml-2">{c.eventType}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{new Date(c.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(c.status)}`}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckInsTab() {
  const [filterEvent, setFilterEvent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const eventTypes = ['Gate Entry', 'Gate Exit', 'Late Return', 'Unauthorized Leave', 'Emergency', 'Night Attendance'];

  const filtered = useMemo(() => {
    return mockSafetyCheckIns.filter(c =>
      (!filterEvent || c.eventType === filterEvent) &&
      (!filterStatus || c.status === filterStatus)
    );
  }, [filterEvent, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Event Type</label>
          <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            <option value="">All Events</option>
            {eventTypes.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            <option value="">All Status</option>
            {['Safe', 'Alert', 'Critical', 'Resolved'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">
          {filtered.length} records
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">{c.studentName.charAt(0)}</div>
                      <span className="text-sm font-medium text-gray-900">{c.studentName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{c.eventType}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{c.location}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{new Date(c.timestamp).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(c.status)}`}>{c.status}</span></td>
                  <td className="px-5 py-3 text-sm text-gray-500 max-w-[200px] truncate">{c.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function VisitorsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = mockVisitorLogs.filter(v =>
    v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Search</label>
          <input type="text" placeholder="Search by visitor or student name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">{filtered.length} visits</div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visitor</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Purpose</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{v.visitorName}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{v.visitorType}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{v.studentName || '—'}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{v.purpose}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{new Date(v.checkIn).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{v.checkOut ? new Date(v.checkOut).toLocaleString('en-IN') : 'In Campus'}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{v.verifiedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NightAttendanceTab() {
  const [selectedDate, setSelectedDate] = useState('2026-06-15');
  const attendance = mockNightAttendance.filter(n => n.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">
          {attendance.filter(a => a.present).length} Present • {attendance.filter(a => !a.present).length} Absent
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Block</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bed</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll Call</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Present</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified By</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attendance.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">{n.studentName.charAt(0)}</div>
                      <span className="text-sm font-medium text-gray-900">{n.studentName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{n.blockName}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{n.roomNumber}</td>
                  <td className="px-5 py-3 text-sm font-mono text-gray-700">{n.bedNumber}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{n.rollCallTime}</td>
                  <td className="px-5 py-3 text-center">
                    {n.present ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Present</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200">Absent</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{n.verifiedBy}</td>
                  <td className="px-5 py-3 text-sm text-gray-500 max-w-[150px] truncate">{n.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function SafetyModuleView() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const pendingAlerts = mockSafetyCheckIns.filter(c => c.status === 'Alert' || c.status === 'Critical').length;

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'checkins': return <CheckInsTab />;
      case 'visitors': return <VisitorsTab />;
      case 'night-attendance': return <NightAttendanceTab />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Girls' Safety Dashboard</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">⭐ Premium</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Real-time student safety monitoring, visitor management, and night attendance verification</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <div className={`w-2 h-2 rounded-full ${pendingAlerts > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="font-medium text-gray-700">{pendingAlerts > 0 ? `${pendingAlerts} alert(s) active` : 'All Clear'}</span>
        </div>
      </div>

      <div className="flex flex-wrap bg-gray-100 rounded-xl p-1 gap-1 w-fit">
        {TABS.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}