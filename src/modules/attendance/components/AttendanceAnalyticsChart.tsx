import { Card, CardContent, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function AttendanceAnalyticsChart() {
  const data = [{name:'Mon', attendance:96},{name:'Tue',attendance:91},{name:'Wed',attendance:93},{name:'Thu',attendance:88},{name:'Fri',attendance:95}];
  return <Card><CardContent><Typography variant="h6">Weekly Attendance Trend</Typography><div style={{ width: '100%', height: 220 }}><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="attendance" fill="#0284c7"/></BarChart></ResponsiveContainer></div></CardContent></Card>;
}
