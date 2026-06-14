import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAcademicsStore } from '../store/useAcademicsStore';

// ── Types ──────────────────────────────────────────────────────
type TabId = 'dashboard' | 'timetable' | 'syllabus' | 'mapping';

interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'timetable', label: 'Timetable', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'syllabus', label: 'Syllabus Tracker', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'mapping', label: 'Teacher Mapping', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
];

// ── Colour palette ─────────────────────────────────────────────
const COLORS = {
  primary: '#6366f1',
  primaryLight: '#eef2ff',
  secondary: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  gray: '#6b7280',
  grayBg: '#f8fafc',
  border: '#e2e8f0',
};

const SUBJECT_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

// ── Helpers ────────────────────────────────────────────────────
function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
    case 'active':
      return COLORS.success;
    case 'in-progress':
    case 'inactive':
      return COLORS.warning;
    case 'not-started':
    case 'locked':
      return COLORS.gray;
    default:
      return COLORS.gray;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in-progress':
      return 'In Progress';
    case 'not-started':
      return 'Not Started';
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'locked':
      return 'Locked';
    default:
      return status;
  }
}

// ── Dashboard Tab ──────────────────────────────────────────────
function DashboardTab() {
  const { classes, sections, subjects, assignments, timetable, sessions, syllabuses } = useAcademicsStore();
  const activeSession = sessions.find((x) => x.status === 'active');
  const uniqueTeachers = new Set(assignments.map((a) => a.teacherId)).size;
  const timetableCompletion = useMemo(
    () => Math.min(100, Math.round((timetable.length / Math.max(1, classes.length * 6)) * 100)),
    [timetable.length, classes.length],
  );

  // Syllabus completion data for pie chart
  const syllabusCompletionData = useMemo(() => {
    const allTopics = syllabuses.flatMap((s) => s.topics);
    const completed = allTopics.filter((t) => t.status === 'completed').length;
    const inProgress = allTopics.filter((t) => t.status === 'in-progress').length;
    const notStarted = allTopics.filter((t) => t.status === 'not-started').length;
    const total = allTopics.length || 1;
    return [
      { name: 'Completed', value: completed, color: COLORS.success },
      { name: 'In Progress', value: inProgress, color: COLORS.warning },
      { name: 'Not Started', value: notStarted, color: '#e2e8f0' },
    ];
  }, [syllabuses]);

  const syllabusOverallPct = useMemo(
    () => Math.round(((syllabuses.flatMap((s) => s.topics).filter((t) => t.status === 'completed').length) / Math.max(1, syllabuses.flatMap((s) => s.topics).length)) * 100),
    [syllabuses],
  );

  // Syllabus per subject bar data
  const subjectSyllabusData = useMemo(() => {
    return syllabuses.map((syl) => {
      const sub = subjects.find((s) => s.id === syl.subjectId);
      const total = syl.topics.length || 1;
      const completed = syl.topics.filter((t) => t.status === 'completed').length;
      const inProgress = syl.topics.filter((t) => t.status === 'in-progress').length;
      return {
        subject: sub?.subjectName ?? syl.subjectId,
        completed: Math.round((completed / total) * 100),
        inProgress: Math.round((inProgress / total) * 100),
        remaining: 100 - Math.round((completed / total) * 100) - Math.round((inProgress / total) * 100),
      };
    });
  }, [syllabuses, subjects]);

  const summaryCards = [
    { title: 'Total Classes', value: classes.length, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: COLORS.primary },
    { title: 'Sections', value: sections.length, icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', color: COLORS.secondary },
    { title: 'Subjects', value: subjects.length, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 4.5 7.5 4.5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 17.5 7.5 17.5s3.332.977 4.5 1.753m0-13C13.168 5.477 14.754 4.5 16.5 4.5c1.747 0 3.332.977 4.5 1.753v13C19.832 18.477 18.247 17.5 16.5 17.5c-1.746 0-3.332.977-4.5 1.753', color: COLORS.success },
    { title: 'Teachers Assigned', value: uniqueTeachers, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: COLORS.warning },
    { title: 'Active Session', value: activeSession?.academicYear ?? 'N/A', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: COLORS.info },
    { title: 'Timetable Fill', value: `${timetableCompletion}%`, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', color: COLORS.gray },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <svg className="w-4 h-4" style={{ color: card.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Syllabus Completion Pie */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm row-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Syllabus Completion</h3>
          <p className="text-xs text-gray-500 mb-4">Overall progress across all subjects</p>
          <div className="flex flex-col items-center">
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={syllabusCompletionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                    {syllabusCompletionData.map((entry, idx) => (
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
            <div className="mt-4 text-center">
              <span className="text-4xl font-bold text-gray-900">{syllabusOverallPct}%</span>
              <p className="text-xs text-gray-500 mt-1">Overall Completed</p>
            </div>
          </div>
        </div>

        {/* Syllabus per Subject Bar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Syllabus Progress by Subject</h3>
          <p className="text-xs text-gray-500 mb-4">Completion breakdown per subject</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={subjectSyllabusData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }}
                  formatter={(value: number) => `${value}%`}
                />
                <Legend
                  verticalAlign="top"
                  height={30}
                  iconType="circle"
                  formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>}
                />
                <Bar dataKey="completed" name="Completed" stackId="a" fill={COLORS.success} radius={[2, 2, 0, 0]} maxBarSize={40} />
                <Bar dataKey="inProgress" name="In Progress" stackId="a" fill={COLORS.warning} radius={[2, 2, 0, 0]} maxBarSize={40} />
                <Bar dataKey="remaining" name="Remaining" stackId="a" fill="#e2e8f0" radius={[2, 2, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Topics</span>
              <span className="text-sm font-semibold text-gray-900">{syllabuses.flatMap((s) => s.topics).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Syllabuses Created</span>
              <span className="text-sm font-semibold text-gray-900">{syllabuses.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Timetable Entries</span>
              <span className="text-sm font-semibold text-gray-900">{timetable.length}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Timetable Filled</span>
              <span className="text-sm font-semibold text-gray-900">{timetableCompletion}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${timetableCompletion}%`, backgroundColor: timetableCompletion > 70 ? COLORS.success : timetableCompletion > 40 ? COLORS.warning : COLORS.danger }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Sessions</span>
              <span className="text-sm font-semibold text-gray-900">{sessions.filter((s) => s.status === 'active').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Upcoming Events</span>
              <span className="text-sm font-semibold text-gray-900">{useAcademicsStore.getState().events.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Timetable Tab ──────────────────────────────────────────────
function TimetableTab() {
  const { timetable, classes, sections, subjects, periods } = useAcademicsStore();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  const regularPeriods = periods.filter((p) => p.type === 'Regular');
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id ?? '');
  const [selectedSection, setSelectedSection] = useState('');

  const filteredEntries = useMemo(
    () => timetable.filter((t) => t.classId === selectedClass && (!selectedSection || t.sectionId === selectedSection)),
    [timetable, selectedClass, selectedSection],
  );

  const getEntry = (day: string, periodId: string) =>
    filteredEntries.find((t) => t.day === day && t.periodId === periodId);

  const sectionOptions = sections.filter((s) => s.classId === selectedClass);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setSelectedSection(''); }}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.className}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          >
            <option value="">All Sections</option>
            {sectionOptions.map((s) => (
              <option key={s.id} value={s.id}>{s.sectionName}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {filteredEntries.length} entries
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr>
                <th className="bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Period</th>
                {days.map((day) => (
                  <th key={day} className="bg-gray-50 px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">
                    {day.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {regularPeriods.map((period) => (
                <tr key={period.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-medium text-gray-700 whitespace-nowrap">
                    {period.periodName}
                    <span className="block text-[10px] text-gray-400 font-normal">{period.startTime}-{period.endTime}</span>
                  </td>
                  {days.map((day) => {
                    const entry = getEntry(day, period.id);
                    const subject = entry ? subjects.find((s) => s.id === entry.subjectId) : null;
                    return (
                      <td key={`${day}-${period.id}`} className="px-2 py-1.5 text-center">
                        {entry && subject ? (
                          <div className="inline-flex flex-col items-center px-2 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 min-w-[80px]">
                            <span className="text-xs font-semibold text-indigo-700">{subject.subjectName}</span>
                            <span className="text-[10px] text-indigo-400 mt-0.5">{entry.startTime}-{entry.endTime}</span>
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

// ── Syllabus Tab ───────────────────────────────────────────────
function SyllabusTab() {
  const { syllabuses, subjects, classes } = useAcademicsStore();
  const [selectedSyllabus, setSelectedSyllabus] = useState(syllabuses[0]?.id ?? '');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const currentSyllabus = syllabuses.find((s) => s.id === selectedSyllabus);
  const classInfo = currentSyllabus ? classes.find((c) => c.id === currentSyllabus.classId) : null;
  const subjectInfo = currentSyllabus ? subjects.find((s) => s.id === currentSyllabus.subjectId) : null;

  const total = currentSyllabus?.topics.length ?? 0;
  const completedTopics = currentSyllabus?.topics.filter((t) => t.status === 'completed').length ?? 0;
  const inProgressTopics = currentSyllabus?.topics.filter((t) => t.status === 'in-progress').length ?? 0;
  const completionPct = total > 0 ? Math.round((completedTopics / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header with selector */}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Select Syllabus</label>
          <select
            value={selectedSyllabus}
            onChange={(e) => { setSelectedSyllabus(e.target.value); setExpandedTopic(null); }}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 min-w-[200px]"
          >
            {syllabuses.map((s) => {
              const sub = subjects.find((sb) => sb.id === s.subjectId);
              const cls = classes.find((c) => c.id === s.classId);
              return (
                <option key={s.id} value={s.id}>{sub?.subjectName ?? s.subjectId} — {cls?.className ?? s.classId}</option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Progress Overview */}
      {currentSyllabus && (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{subjectInfo?.subjectName ?? 'Subject'}</h3>
                <p className="text-xs text-gray-500">{classInfo?.className ?? 'Class'} • {completedTopics}/{total} topics completed</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{completionPct}%</span>
                <p className="text-xs text-gray-500">complete</p>
              </div>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${completionPct}%`, backgroundColor: completionPct > 70 ? COLORS.success : completionPct > 40 ? COLORS.warning : COLORS.danger }} />
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.success }} />
                <span className="text-xs text-gray-500">{completedTopics} Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.warning }} />
                <span className="text-xs text-gray-500">{inProgressTopics} In Progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                <span className="text-xs text-gray-500">{total - completedTopics - inProgressTopics} Not Started</span>
              </div>
            </div>
          </div>

          {/* Topics List */}
          <div className="space-y-2.5">
            {currentSyllabus.topics.map((topic) => {
              const pct = topic.totalClasses > 0 ? Math.round((topic.completedClasses / topic.totalClasses) * 100) : 0;
              const isExpanded = expandedTopic === topic.id;
              return (
                <div key={topic.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                  <button
                    type="button"
                    onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getStatusColor(topic.status) }} />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{topic.topicName}</span>
                        <span className="text-xs text-gray-400 ml-2">({topic.completedClasses}/{topic.totalClasses} classes)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                        style={{
                          backgroundColor: `${getStatusColor(topic.status)}15`,
                          color: getStatusColor(topic.status),
                        }}
                      >
                        {getStatusLabel(topic.status)}
                      </span>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-48' : 'max-h-0'}`}>
                    <div className="px-5 pb-4 pt-0 border-t border-gray-100">
                      <div className="mt-3 space-y-2">
                        {/* Class progress bar */}
                        <div>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Class Progress</span>
                            <span className="font-medium text-gray-700">{topic.completedClasses}/{topic.totalClasses} ({pct}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: pct === 100 ? COLORS.success : pct > 50 ? COLORS.warning : COLORS.info }} />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>📅 {topic.startDate} → {topic.endDate}</span>
                          <span>📚 {topic.subtopics.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!currentSyllabus && (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <p className="text-gray-500 text-sm">No syllabus data available. Create a syllabus to get started.</p>
        </div>
      )}
    </div>
  );
}

// ── Teacher Mapping Tab ────────────────────────────────────────
function MappingTab() {
  const { assignments, subjects, classes, sections } = useAcademicsStore();

  const teacherWorkload = useMemo(() => {
    const map = new Map<string, { name: string; totalPeriods: number; subjects: string[]; classes: string[] }>();
    assignments.forEach((a) => {
      if (!map.has(a.teacherId)) {
        map.set(a.teacherId, { name: a.teacherName, totalPeriods: 0, subjects: [], classes: [] });
      }
      const entry = map.get(a.teacherId)!;
      entry.totalPeriods += a.weeklyPeriodCount;
      const sub = subjects.find((s) => s.id === a.subjectId);
      if (sub && !entry.subjects.includes(sub.subjectName)) entry.subjects.push(sub.subjectName);
      const cls = classes.find((c) => c.id === a.classId);
      const sec = sections.find((s) => s.id === a.sectionId);
      const label = cls ? `${cls.className}${sec ? `-${sec.sectionName}` : ''}` : a.classId;
      if (!entry.classes.includes(label)) entry.classes.push(label);
    });
    return Array.from(map.values());
  }, [assignments, subjects, classes, sections]);

  const workloadData = useMemo(
    () => teacherWorkload.map((t) => ({ name: t.name, periods: t.totalPeriods })),
    [teacherWorkload],
  );

  return (
    <div className="space-y-6">
      {/* Teacher Workload Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Teacher Workload Distribution</h3>
        <p className="text-xs text-gray-500 mb-4">Weekly period allocation per teacher</p>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={workloadData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }}
              />
              <Bar dataKey="periods" name="Weekly Periods" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {workloadData.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={SUBJECT_COLORS[idx % SUBJECT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Teacher Assignment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teacherWorkload.map((teacher) => (
          <div key={teacher.name} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                {teacher.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{teacher.name}</h4>
                <p className="text-xs text-gray-500">{teacher.totalPeriods} periods / week</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Subjects</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {teacher.subjects.map((sub) => (
                    <span key={sub} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Classes</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {teacher.classes.map((cls) => (
                    <span key={cls} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-green-50 text-green-700 border border-green-100">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Assignment Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">All Teacher Assignments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Periods/Week</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {assignments.map((a) => {
                const sub = subjects.find((s) => s.id === a.subjectId);
                const cls = classes.find((c) => c.id === a.classId);
                const sec = sections.find((s) => s.id === a.sectionId);
                return (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                          {a.teacherName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{a.teacherName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-700">{sub?.subjectName ?? a.subjectId}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-700">{cls?.className ?? a.classId}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-700">{sec?.sectionName ?? a.sectionId}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {a.weeklyPeriodCount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export function AcademicModuleView() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { sessions } = useAcademicsStore();
  const activeSession = sessions.find((x) => x.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Academic Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage timetable, syllabus, and teacher assignments</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-medium text-gray-700">{activeSession?.academicYear ?? 'No active session'}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
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
      <div className="min-h-[400px]">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'timetable' && <TimetableTab />}
        {activeTab === 'syllabus' && <SyllabusTab />}
        {activeTab === 'mapping' && <MappingTab />}
      </div>
    </div>
  );
}