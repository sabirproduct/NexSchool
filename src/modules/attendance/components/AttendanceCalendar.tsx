import { useState, useMemo, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { AttendanceStatusChip } from './AttendanceStatusChip';
import { StudentAttendanceRecord } from '../types';
import { getAllDocuments } from '../../../services/firestoreService';
import { db } from '../../../config/firebase';

type ViewMode = 'daily' | 'weekly' | 'monthly';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekDates(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  for (let i = 0; i < startPad; i++) week.push(null);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

export function AttendanceCalendar() {
  const user = useAuthStore((s) => s.user);
  const schoolId = user?.schoolId || 'default-school';
  const { studentRecords, setFilters, fetchAttendanceData } = useAttendanceStore();
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [allRecords, setAllRecords] = useState<StudentAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all attendance records from Firestore
  useEffect(() => {
    fetchAttendanceData(schoolId);
  }, [fetchAttendanceData, schoolId]);

  useEffect(() => {
    const loadAllRecords = async () => {
      if (!db) return;
      setLoading(true);
      try {
        const records = await getAllDocuments<StudentAttendanceRecord>('studentAttendance');
        setAllRecords(records);
      } catch (error) {
        console.error('Error loading attendance records:', error);
      }
      setLoading(false);
    };
    loadAllRecords();
  }, []);

  const allDates = useMemo(() => {
    const dates = new Set(allRecords.map(r => r.attendanceDate));
    return Array.from(dates).sort();
  }, [allRecords]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    setFilters({ date: dateStr });
    setViewMode('daily');
  };

  const navigate = (direction: -1 | 1) => {
    const d = new Date(selectedDate);
    if (viewMode === 'daily') d.setDate(d.getDate() + direction);
    else if (viewMode === 'weekly') d.setDate(d.getDate() + direction * 7);
    else d.setMonth(d.getMonth() + direction);
    setSelectedDate(d);
  };

  const goToToday = () => setSelectedDate(new Date());

  const recordsForDate = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return allRecords.filter(r => r.attendanceDate === dateStr);
  }, [allRecords, selectedDate]);

  const statsForDate = useMemo(() => {
    const total = recordsForDate.length;
    const present = recordsForDate.filter(r => r.status === 'Present').length;
    const absent = recordsForDate.filter(r => r.status === 'Absent').length;
    const late = recordsForDate.filter(r => r.status === 'Late').length;
    const other = recordsForDate.filter(r => r.status === 'Half Day' || r.status === 'Leave').length;
    return { total, present, absent, late, other, pct: total > 0 ? Math.round((present / total) * 100) : 0 };
  }, [recordsForDate]);

  const weeklyDates = getWeekDates(selectedDate);

  const monthGrid = useMemo(() => {
    return getMonthGrid(selectedDate.getFullYear(), selectedDate.getMonth());
  }, [selectedDate]);

  const hasRecords = (date: Date) => {
    const ds = date.toISOString().split('T')[0];
    return allDates.includes(ds);
  };

  const getDateRecords = (date: Date) => {
    const ds = date.toISOString().split('T')[0];
    return allRecords.filter(r => r.attendanceDate === ds);
  };

  const dateStatusSummary = (date: Date) => {
    const records = getDateRecords(date);
    const present = records.filter(r => r.status === 'Present').length;
    const total = records.length;
    if (total === 0) return null;
    const pct = Math.round((present / total) * 100);
    if (pct >= 90) return 'bg-green-400';
    if (pct >= 75) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Calendar Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-gray-900">Attendance Calendar</h3>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {(['daily', 'weekly', 'monthly'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-900 min-w-[140px] text-center">
              {viewMode === 'monthly'
                ? `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
                : selectedDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              onClick={() => navigate(1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="ml-2 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="px-5 py-2 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-2 text-xs text-blue-700">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
              Loading attendance records...
            </div>
          </div>
        )}

        {/* Daily View */}
        {viewMode === 'daily' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-600 font-medium">Present: {statsForDate.present}</span>
                <span className="text-red-600 font-medium">Absent: {statsForDate.absent}</span>
                <span className="text-amber-600 font-medium">Late: {statsForDate.late}</span>
                <span className="text-blue-600 font-medium">Other: {statsForDate.other}</span>
                <span className={`font-semibold ${statsForDate.pct >= 90 ? 'text-green-600' : statsForDate.pct >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                  {statsForDate.pct}%
                </span>
              </div>
            </div>

            {recordsForDate.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Roll</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Class</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recordsForDate.map((r) => (
                      <tr key={r.attendanceId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5 text-sm text-gray-700">{r.rollNumber}</td>
                        <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{r.studentName}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-500">{r.classId}-{r.sectionId}</td>
                        <td className="px-4 py-2.5"><AttendanceStatusChip status={r.status} /></td>
                        <td className="px-4 py-2.5 text-sm text-gray-500">{r.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">No attendance records for this date</div>
            )}
          </div>
        )}

        {/* Weekly View */}
        {viewMode === 'weekly' && (
          <div className="p-5">
            <p className="text-sm font-medium text-gray-500 mb-4">
              Week of {weeklyDates[0].toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })} - {weeklyDates[6].toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="grid grid-cols-7 gap-2">
              {weeklyDates.map((date) => {
                const ds = date.toISOString().split('T')[0];
                const records = allRecords.filter(r => r.attendanceDate === ds);
                const present = records.filter(r => r.status === 'Present').length;
                const total = records.length;
                const pct = total > 0 ? Math.round((present / total) * 100) : 0;
                const dayOff = date.getDay() === 0 || date.getDay() === 6;

                return (
                  <button
                    key={ds}
                    type="button"
                    onClick={() => handleDateClick(date)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isSelected(date) ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    } ${dayOff ? 'opacity-40' : ''}`}
                  >
                    <p className="text-xs text-gray-500 font-medium">{DAYS[date.getDay()]}</p>
                    <p className={`text-lg font-bold mt-0.5 ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
                      {date.getDate()}
                    </p>
                    {total > 0 && (
                      <div className="mt-1.5 space-y-0.5">
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 90 ? 'bg-green-500' : pct >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">{pct}%</p>
                      </div>
                    )}
                    {total === 0 && !dayOff && <p className="text-xs text-gray-300 mt-1">No data</p>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Monthly View */}
        {viewMode === 'monthly' && (
          <div className="p-5">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {monthGrid.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1">
                  {week.map((date, di) => {
                    if (!date) return <div key={`empty-${wi}-${di}`} />;
                    const ds = date.toISOString().split('T')[0];
                    const records = allRecords.filter(r => r.attendanceDate === ds);
                    const present = records.filter(r => r.status === 'Present').length;
                    const total = records.length;
                    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
                    const dayOff = date.getDay() === 0 || date.getDay() === 6;

                    return (
                      <button
                        key={ds}
                        type="button"
                        onClick={() => handleDateClick(date)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isSelected(date) ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                        } ${dayOff ? 'opacity-30' : ''}`}
                      >
                        <p className={`text-sm font-semibold ${isToday(date) ? 'text-blue-600' : 'text-gray-700'}`}>
                          {date.getDate()}
                        </p>
                        {total > 0 && (
                          <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${pct >= 90 ? 'bg-green-500' : pct >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{statsForDate.present}</p>
          <p className="text-xs text-gray-500 mt-1">Present</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{statsForDate.absent}</p>
          <p className="text-xs text-gray-500 mt-1">Absent</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-amber-600">{statsForDate.late}</p>
          <p className="text-xs text-gray-500 mt-1">Late</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className={`text-2xl font-bold ${statsForDate.pct >= 90 ? 'text-green-600' : statsForDate.pct >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
            {statsForDate.pct}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Attendance %</p>
        </div>
      </div>
    </div>
  );
}