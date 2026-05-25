import { Paper, Stack, Typography } from '@mui/material';
import { StudentResult } from '../types';

export function ResultCard({ result }: { result: StudentResult }) {
  return <Paper sx={{ p: 2 }}><Stack direction='row' justifyContent='space-between'><Typography fontWeight={700}>{result.studentName}</Typography><Typography>{result.status}</Typography></Stack><Typography variant='body2'>Percentage: {result.percentage}%</Typography><Typography variant='body2'>GPA: {result.gpa}</Typography><Typography variant='body2'>Final Grade: {result.finalGrade}</Typography><Typography variant='body2'>Rank: #{result.classRank}</Typography></Paper>;
}
