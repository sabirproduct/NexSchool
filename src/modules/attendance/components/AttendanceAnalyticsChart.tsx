import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function AttendanceAnalyticsChart() {
  const data = [
    { name: 'Mon', attendance: 96 },
    { name: 'Tue', attendance: 91 },
    { name: 'Wed', attendance: 93 },
    { name: 'Thu', attendance: 88 },
    { name: 'Fri', attendance: 95 },
  ];

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h3 className="h6 mb-3">Weekly Attendance Trend</h3>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#0284c7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
