import { Paper, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useExamStore } from '../store/useExamStore';

export function ResultAnalyticsChart() {
  const { results } = useExamStore();
  return <Paper sx={{ p: 2, height: 280 }}><Typography variant='h6' mb={1}>Result Analytics</Typography><ResponsiveContainer width='100%' height='85%'><BarChart data={results}><CartesianGrid strokeDasharray='3 3' /><XAxis dataKey='studentName' hide /><YAxis /><Tooltip /><Bar dataKey='percentage' fill='#0ea5a5' /><Bar dataKey='gpa' fill='#2563eb' /></BarChart></ResponsiveContainer></Paper>;
}
