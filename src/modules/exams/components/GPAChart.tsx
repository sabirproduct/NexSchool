import { Paper, Typography } from '@mui/material';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function GPAChart({ data }: { data: { exam: string; gpa: number }[] }) {
  return <Paper sx={{ p: 2, height: 260 }}><Typography variant='h6'>GPA Trend</Typography><ResponsiveContainer width='100%' height='85%'><LineChart data={data}><XAxis dataKey='exam' /><YAxis domain={[0, 10]} /><Tooltip /><Line type='monotone' dataKey='gpa' stroke='#2563eb' /></LineChart></ResponsiveContainer></Paper>;
}
