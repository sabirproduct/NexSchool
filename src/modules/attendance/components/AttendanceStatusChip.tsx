const colorMap: Record<string, string> = {
  Present: 'bg-green-100 text-green-700 border-green-200',
  Absent: 'bg-red-100 text-red-700 border-red-200',
  Late: 'bg-amber-100 text-amber-700 border-amber-200',
  'Half Day': 'bg-blue-100 text-blue-700 border-blue-200',
  Leave: 'bg-gray-100 text-gray-700 border-gray-200',
  Missing: 'bg-red-100 text-red-700 border-red-200',
  Sick: 'bg-amber-100 text-amber-700 border-amber-200',
  'On Leave': 'bg-gray-100 text-gray-700 border-gray-200',
  'Frequent Absent': 'bg-red-50 text-red-700 border-red-200',
  'Frequent Late': 'bg-amber-50 text-amber-700 border-amber-200',
  'Consecutive Missing': 'bg-orange-50 text-orange-700 border-orange-200',
};

export function AttendanceStatusChip({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${
        colorMap[status] ?? 'bg-gray-50 text-gray-600 border-gray-200'
      }`}
    >
      {status}
    </span>
  );
}