import { useState } from 'react';

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

// ── Empty State Component ──────────────────────────────────────
function EmptyState({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-md">{description}</p>
    </div>
  );
}

// ── Dashboard Tab ──────────────────────────────────────────────
function DashboardTab() {
  return (
    <div className="space-y-6">
      <EmptyState
        title="No Data Available"
        description="Your academic dashboard will show attendance, scores, fees, and updates once data is available from the school administration."
        icon="📚"
      />
    </div>
  );
}

// ── Timetable Tab ───────────────────────────────────────────────
function TimetableTab() {
  return (
    <div className="space-y-6">
      <EmptyState
        title="No Timetable Loaded"
        description="Your class timetable will appear here once published by the school administration."
        icon="📅"
      />
    </div>
  );
}

// ── Attendance Tab ──────────────────────────────────────────────
function StudentAttendanceTab() {
  return (
    <div className="space-y-6">
      <EmptyState
        title="No Attendance Records"
        description="Your attendance records will be displayed here once marked by your teachers."
        icon="📊"
      />
    </div>
  );
}

// ── Exams Tab ───────────────────────────────────────────────────
function StudentExamsTab() {
  return (
    <div className="space-y-6">
      <EmptyState
        title="No Exam Results Yet"
        description="Your exam results and performance analytics will appear here once published."
        icon="📝"
      />
    </div>
  );
}

// ── Fees Tab ────────────────────────────────────────────────────
function StudentFeesTab() {
  return (
    <div className="space-y-6">
      <EmptyState
        title="No Fee Records"
        description="Your fee structure, payment history, and dues will be displayed here once configured."
        icon="💰"
      />
    </div>
  );
}

// ── Profile Tab ─────────────────────────────────────────────────
function ProfileTab() {
  return (
    <div className="space-y-6">
      <EmptyState
        title="Profile Not Configured"
        description="Your student profile information will appear here once set up by the school administration."
        icon="👤"
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export function StudentPortalPage() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

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
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Portal</h2>
          <p className="text-sm text-gray-500 mt-1">Track your academics, attendance, and more</p>
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