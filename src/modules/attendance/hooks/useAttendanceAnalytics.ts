import { useMemo } from 'react';
import { useAttendanceStore } from '../store/useAttendanceStore';

export function useAttendanceAnalytics() {
  const records = useAttendanceStore((s) => s.studentRecords);
  return useMemo(() => {
    const total = records.length || 1;
    const present = records.filter((r) => r.status === 'Present').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const late = records.filter((r) => r.status === 'Late').length;
    return { presentPct: Math.round((present / total) * 100), absentPct: Math.round((absent / total) * 100), latePct: Math.round((late / total) * 100) };
  }, [records]);
}
