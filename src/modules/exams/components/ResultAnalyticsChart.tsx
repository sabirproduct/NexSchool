import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useExamStore } from '../store/useExamStore';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 p-4">
        <p className="text-sm font-bold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ResultAnalyticsChart() {
  const { results } = useExamStore();
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const chartData = useMemo(() => {
    return results
      .filter(r => r.status === 'Published')
      .sort((a, b) => b.percentage - a.percentage)
      .map(r => ({
        name: r.studentName,
        percentage: r.percentage,
        gpa: r.gpa,
        grade: r.finalGrade,
      }));
  }, [results]);

  const stats = useMemo(() => {
    const published = results.filter(r => r.status === 'Published');
    const percentages = published.map(r => r.percentage);
    const avg = percentages.reduce((a, b) => a + b, 0) / Math.max(percentages.length, 1);
    const max = Math.max(...percentages, 0);
    const min = Math.min(...percentages, 0);
    const passCount = published.filter(r => r.percentage >= 33).length;
    return { avg: avg.toFixed(1), max, min, passRate: ((passCount / Math.max(published.length, 1)) * 100).toFixed(0) };
  }, [results]);

  if (chartData.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-8 text-center border border-gray-200">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-gray-500 font-medium">No published results to analyze</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">📈 Performance Analytics</h3>
            <p className="text-sm text-gray-500 mt-0.5">Student performance overview across all exams</p>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                chartType === 'bar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                chartType === 'line' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Line
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-100">
            <p className="text-xs text-emerald-600 font-medium">Average</p>
            <p className="text-lg font-bold text-emerald-800">{stats.avg}%</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
            <p className="text-xs text-blue-600 font-medium">Highest</p>
            <p className="text-lg font-bold text-blue-800">{stats.max}%</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
            <p className="text-xs text-amber-600 font-medium">Lowest</p>
            <p className="text-lg font-bold text-amber-800">{stats.min}%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-3 border border-purple-100">
            <p className="text-xs text-purple-600 font-medium">Pass Rate</p>
            <p className="text-lg font-bold text-purple-800">{stats.passRate}%</p>
          </div>
        </div>

        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="percentage" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="gpa" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}