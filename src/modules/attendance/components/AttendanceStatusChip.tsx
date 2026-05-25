import { Chip } from '@mui/material';

const colorMap: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  Present: 'success',
  Absent: 'error',
  Late: 'warning',
  'Half Day': 'info',
  Leave: 'default',
  Missing: 'error',
  Sick: 'warning',
  'On Leave': 'default'
};

export function AttendanceStatusChip({ status }: { status: string }) {
  return <Chip label={status} color={colorMap[status] ?? 'default'} size="small" />;
}
