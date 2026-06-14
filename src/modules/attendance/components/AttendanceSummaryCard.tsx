interface Props {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
}

export function AttendanceSummaryCard({ title, value, trend }: Props) {
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : null;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : '';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold text-gray-900">{value}</span>
        {trendIcon && <span className={`text-sm font-semibold ${trendColor}`}>{trendIcon}</span>}
      </div>
    </div>
  );
}