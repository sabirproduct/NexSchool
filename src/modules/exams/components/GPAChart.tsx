import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function GPAChart({ data }: { data: { exam: string; gpa: number }[] }) {
  return (
    <div className="card shadow-sm" style={{ height: 260 }}>
      <div className="card-body">
        <h3 className="h6 mb-3">GPA Trend</h3>
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="exam" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="gpa" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
