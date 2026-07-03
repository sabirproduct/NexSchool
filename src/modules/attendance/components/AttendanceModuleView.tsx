import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendanceStore, computeAnomalies, AnomalyRecord } from '../store/useAttendanceStore';
import { AttendanceAnalyticsChart } from './AttendanceAnalyticsChart';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceSummaryCard } from './AttendanceSummaryCard';
import { AttendanceStatusChip } from './AttendanceStatusChip';
import { AttendanceCalendar } from './AttendanceCalendar';
import { StudentAttendanceBreakdown } from './StudentAttendanceBreakdown';
import { useAttendanceAnalytics } from '../hooks/useAttendanceAnalytics';

type DashboardTab = 'dashboard' | 'calendar' | 'students';

function NotifyButton({ anomaly }: { anomaly: AnomalyRecord }) {
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    setTimeout(() => setNotified(false), 3000);
  };

  return (
    <button
      type="button"
      onClick={handleNotify}
      disabled={notified}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
        notified
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100 hover:border-amber-400'
      }`}
    >
      {notified ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Notified
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Notify Parent
        </>
      )}
    </button>
  );
}

export function AttendanceModuleView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const { studentRecords, hostelRecords, teacherRecords } = useAttendanceStore();
  const analytics = useAttendanceAnalytics();

  const anomalies = useMemo(() => computeAnomalies(studentRecords), [studentRecords]);

  const totalStudents = studentRecords.length;
  const absent = studentRecords.filter((r) => r.status === 'Absent').length;
  const late = studentRecords.filter((r) => r.status === 'Late').length;
  const present = studentRecords.filter((r) => r.status === 'Present').length;
  const halfDay = studentRecords.filter((r) => r.status === 'Half Day').length;
  const leave = studentRecords.filter((r) => r.status === 'Leave').length;
  const hostelMissing = hostelRecords.filter((r) => r.status === 'Missing').length;

  const summaryCards = [
    { title: "Today's Attendance %", value: `${analytics.presentPct}%` },
    { title: 'Present Students', value: present },
    { title: 'Absent Students', value: absent },
    { title: 'Late Entries', value: late },
    { title: 'Half Day / Leave', value: halfDay + leave },
    { title: 'Hostel Absent/Missing', value: hostelMissing },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Track attendance with daily, weekly & monthly views</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/attendance/qr')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            QR Attendance
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit">
        {[
          { id: 'dashboard' as const, label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
          { id: 'calendar' as const, label: 'Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { id: 'students' as const, label: 'Student Attendance', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {summaryCards.map((card) => (
              <AttendanceSummaryCard key={card.title} title={card.title} value={card.value} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AttendanceAnalyticsChart />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Today's Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="text-sm font-medium text-gray-900">{totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Teachers / Staff</span>
                  <span className="text-sm font-medium text-gray-900">{teacherRecords.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hostel Residents</span>
                  <span className="text-sm font-medium text-gray-900">{hostelRecords.length}</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Attending Today</span>
                  <span className="text-sm font-semibold text-green-600">{present}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Absent Today</span>
                  <span className="text-sm font-semibold text-red-600">{absent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Late Today</span>
                  <span className="text-sm font-semibold text-amber-600">{late}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Anomaly Detection Section */}
          {anomalies.length > 0 && (
            <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
              <div className="bg-red-50 border-b border-red-200 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <h3 className="text-sm font-semibold text-red-800">
                    Attendance Anomalies Detected ({anomalies.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    anomalies.forEach((a) => {
                      console.log('Notify parent of', a.studentName);
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notify All Parents
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Anomaly</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Occurrences</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {anomalies.slice(0, 10).map((anomaly, idx) => (
                      <tr key={`${anomaly.studentId}-${anomaly.anomalyType}-${idx}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                              {anomaly.studentName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{anomaly.studentName}</p>
                              <p className="text-xs text-gray-500">Roll: {anomaly.rollNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-sm text-gray-700">{anomaly.classId}-{anomaly.sectionId}</span>
                        </td>
                        <td className="px-5 py-3">
                          <AttendanceStatusChip status={anomaly.anomalyType} />
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-sm font-medium text-gray-900">{anomaly.occurrences}</span>
                          <span className="text-xs text-gray-500 ml-1">/ {anomaly.totalDays} days</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${anomaly.percentage > 50 ? 'bg-red-500' : anomaly.percentage > 25 ? 'bg-amber-500' : 'bg-yellow-500'}`}
                                style={{ width: `${Math.min(anomaly.percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-700">{anomaly.percentage}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <NotifyButton anomaly={anomaly} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {anomalies.length > 10 && (
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-center">
                  <span className="text-sm text-gray-500">+ {anomalies.length - 10} more anomalies</span>
                </div>
              )}
            </div>
          )}

          {/* Hostel & Staff Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Hostel Attendance Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr>
                      <th className="pb-2 text-xs font-semibold text-gray-500 uppercase text-left">Hostel</th>
                      <th className="pb-2 text-xs font-semibold text-gray-500 uppercase text-left">Present</th>
                      <th className="pb-2 text-xs font-semibold text-gray-500 uppercase text-left">Missing</th>
                      <th className="pb-2 text-xs font-semibold text-gray-500 uppercase text-left">Leave/Sick</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {Object.entries(
                      hostelRecords.reduce<Record<string, { present: number; missing: number; other: number }>>((acc, r) => {
                        const hostel = r.hostelId;
                        if (!acc[hostel]) acc[hostel] = { present: 0, missing: 0, other: 0 };
                        if (r.status === 'Present') acc[hostel].present++;
                        else if (r.status === 'Missing') acc[hostel].missing++;
                        else acc[hostel].other++;
                        return acc;
                      }, {})
                    ).map(([hostel, counts]) => (
                      <tr key={hostel} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 text-sm text-gray-900 font-medium">{hostel}</td>
                        <td className="py-2.5 text-sm text-green-600 font-medium">{counts.present}</td>
                        <td className="py-2.5 text-sm text-red-600 font-medium">{counts.missing}</td>
                        <td className="py-2.5 text-sm text-gray-500">{counts.other}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Staff Attendance Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr>
                      <th className="pb-2 text-xs font-semibold text-gray-500 uppercase text-left">Type</th>
                      <th className="pb-2 text-xs font-semibold text-gray-500 uppercase text-left">Present</th>
                      <th className="pb-2 text-xs font-semibold text-gray-500 uppercase text-left">Absent/Late</th>
                      <th className="pb-2 text-xs font-semibold text-gray-500 uppercase text-left">On Leave</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(['Teacher', 'Staff'] as const).map((type) => {
                      const typeRecords = teacherRecords.filter((r) => r.staffType === type);
                      const presentCount = typeRecords.filter((r) => r.status === 'Present').length;
                      const absentLate = typeRecords.filter((r) => r.status === 'Absent' || r.status === 'Late').length;
                      const onLeave = typeRecords.filter((r) => r.status === 'On Leave' || r.status === 'Half Day').length;
                      return (
                        <tr key={type} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2.5 text-sm text-gray-900 font-medium">{type}s</td>
                          <td className="py-2.5 text-sm text-green-600 font-medium">{presentCount}</td>
                          <td className="py-2.5 text-sm text-red-600 font-medium">{absentLate}</td>
                          <td className="py-2.5 text-sm text-gray-500">{onLeave}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Filter Attendance Data</h3>
            </div>
            <div className="p-5">
              <AttendanceFilters />
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR TAB */}
      {activeTab === 'calendar' && <AttendanceCalendar />}

      {/* STUDENT ATTENDANCE TAB */}
      {activeTab === 'students' && <StudentAttendanceBreakdown />}
    </div>
  );
}