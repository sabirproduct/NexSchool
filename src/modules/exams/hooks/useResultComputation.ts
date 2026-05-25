import { useMemo } from 'react';
import { useExamStore } from '../store/useExamStore';

export function useResultComputation() {
  const { marks, gradeRules } = useExamStore();
  return useMemo(() => marks.map((mark) => {
    const percentage = (mark.obtainedMarks / mark.maximumMarks) * 100;
    const matchedGrade = gradeRules.find((rule) => percentage >= rule.minPercentage && percentage <= rule.maxPercentage);
    return { ...mark, percentage, grade: matchedGrade?.grade ?? mark.grade, gradePoint: matchedGrade?.gradePoint ?? 0 };
  }), [marks, gradeRules]);
}
