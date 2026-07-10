import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAttendanceStore } from '../store/useAttendanceStore';

export function AttendanceAnalyticsChart() {
  const studentRecords = useAttendanceStore((s) => s.studentRecords);

  const data = useMemo(() => {
    // Group records by attendanceDate and compute daily percentages
    const dailyMap = new Map<string, { present: number; total: number }>();
    
    studentRecords.forEach(r => {
      if (!dailyMap.has(r.attendanceDate)) {
        dailyMap.set(r.attendanceDate, { present: 0, total: 0 });
      }
      const day = dailyMap.get(r.attendanceDate)!;
      day.total++;
      if (r.status === 'Present') day.present++;
    });

    // Convert to chart data format, get last 7 days
    const days = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([date, stats]) => {
        const d = new Date(date + 'T00:00:00');
        const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
        const pct = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
        return { name: dayName, attendance: pct, date };
      });

    // If no data, return defaults
    if (days.length === 0) {
      const today = new Date();
      return Array.from({ length: 5 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (4 - i));
        return {
          name: d.toLocaleDateString('en-IN', { weekday: 'short' }),
          attendance: 0,
          date: d.toISOString().split('T')[0],
        };
      });
    }

    return days;
  }, [studentRecords]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Weekly Attendance Trend</h3>
        {data.length > 0 && data.every(d => d.attendance === 0) && (
          <p className="text-xs text-gray-400 mt-0.5">No attendance data available for the last 7 days</p>
        )}
      </div>
      <div className="p-5">
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [`${value}%`, 'Attendance']}
                labelFormatter={(label: string) => {
                  const item = data.find(d => d.name === label);
                  return item?.date ? `${label} (${item.date})` : label;
                }}
              />
              <Bar dataKey="attendance" fill="#0284c7" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}