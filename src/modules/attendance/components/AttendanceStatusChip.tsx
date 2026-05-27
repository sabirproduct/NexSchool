const colorMap: Record<string, string> = {
  Present: 'bg-success',
  Absent: 'bg-danger',
  Late: 'bg-warning text-dark',
  'Half Day': 'bg-info text-dark',
  Leave: 'bg-secondary',
  Missing: 'bg-danger',
  Sick: 'bg-warning text-dark',
  'On Leave': 'bg-secondary',
};

export function AttendanceStatusChip({ status }: { status: string }) {
  return <span className={`badge ${colorMap[status] ?? 'bg-secondary'}`}>{status}</span>;
}
