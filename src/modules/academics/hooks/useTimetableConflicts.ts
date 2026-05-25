import { useMemo } from 'react';
import { TimetableEntry } from '../types';
export function useTimetableConflicts(entries: TimetableEntry[]) {
  return useMemo(() => entries.filter((e, i) => entries.findIndex((x) => x.day===e.day && x.teacherId===e.teacherId && x.startTime===e.startTime) !== i), [entries]);
}
