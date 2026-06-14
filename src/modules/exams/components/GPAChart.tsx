import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface GPAChartProps {
  data: { exam: string; gpa: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 p-4">
        <p className="text-sm font-bold text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-gray-600">
          GPA: <span className="font-bold text-indigo-600">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function GPAChart({ data }: GPAChartProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">📈 GPA Trend</h3>
            <p className="text-sm text-gray-500 mt-0.5">Performance trajectory across exams</p>
          </div>
          {data.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl px-4 py-2 border border-indigo-100">
              <p className="text-xs text-indigo-600 font-medium">Latest GPA</p>
              <p className="text-lg font-bold text-indigo-800">{data[data.length - 1].gpa.toFixed(1)}</p>
            </div>
          )}
        </div>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="exam" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="gpa"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#gpaGradient)"
                dot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}