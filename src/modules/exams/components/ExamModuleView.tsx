import { Box, Grid2 as Grid, Paper, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useExamStore } from '../store/useExamStore';
import { ExamTable } from './ExamTable';
import { ExamScheduler } from './ExamScheduler';
import { MarksEntryTable } from './MarksEntryTable';
import { RankTable } from './RankTable';
import { ResultAnalyticsChart } from './ResultAnalyticsChart';
import { ResultCard } from './ResultCard';

export function ExamModuleView() {
  const { exams, marks, results } = useExamStore();
  const averagePerformance = useMemo(() => results.reduce((a, c) => a + c.percentage, 0) / Math.max(results.length, 1), [results]);

  const statCards = [
    { label: 'Total Exams', value: exams.length },
    { label: 'Upcoming Exams', value: exams.filter((x) => x.status === 'Scheduled').length },
    { label: 'Published Results', value: results.filter((x) => x.status === 'Published').length },
    { label: 'Pending Marks Entry', value: marks.filter((x) => x.status !== 'Present').length },
    { label: 'Average School Performance', value: `${averagePerformance.toFixed(1)}%` },
    { label: 'Top Performing Class', value: 'Class 10-A' }
  ];

  return <Stack spacing={2}>{/* dashboard */}
    <Grid container spacing={2}>{statCards.map((card) => <Grid size={{xs:12, md:4}} key={card.label}><Paper sx={{p:2}}><Typography color='text.secondary'>{card.label}</Typography><Typography variant='h5' fontWeight={700}>{card.value}</Typography></Paper></Grid>)}</Grid>
    <ResultAnalyticsChart />
    <ExamTable />
    <ExamScheduler />
    <MarksEntryTable />
    <Box><Typography variant='h6' mb={1}>Published Result Cards</Typography><Grid container spacing={2}>{results.map((r)=><Grid size={{xs:12, md:6}} key={r.id}><ResultCard result={r} /></Grid>)}</Grid></Box>
    <RankTable />
  </Stack>;
}
