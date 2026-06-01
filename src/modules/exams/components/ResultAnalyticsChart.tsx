import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useExamStore } from '../store/useExamStore';

export function ResultAnalyticsChart() {
  const { results } = useExamStore();
  return (
    <div className="card shadow-sm">
      <div className="card-body" style={{ height: 280 }}>
        <h3 className="h6 mb-3">Result Analytics</h3>
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={results}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="studentName" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#0ea5a5" />
              <Bar dataKey="gpa" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
