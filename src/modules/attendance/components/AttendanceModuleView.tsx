import { Alert, Box, Button, Grid2 as Grid, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { AttendanceAnalyticsChart } from './AttendanceAnalyticsChart';
import { AttendanceCalendar } from './AttendanceCalendar';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceReportGenerator } from './AttendanceReportGenerator';
import { AttendanceSummaryCard } from './AttendanceSummaryCard';
import { AttendanceTable } from './AttendanceTable';
import { HostelAttendanceTable } from './HostelAttendanceTable';
import { TeacherAttendanceTable } from './TeacherAttendanceTable';
import { useAttendanceStore } from '../store/useAttendanceStore';

export function AttendanceModuleView() {
  const [tab, setTab] = useState(0);
  const { studentRecords, hostelRecords, teacherRecords, markAllPresent, setStudentStatus } = useAttendanceStore();
  const absent = studentRecords.filter((x) => x.status === 'Absent').length;
  const late = studentRecords.filter((x) => x.status === 'Late').length;
  return (
    <Box className="space-y-4">
      <Typography variant="h4" fontWeight={700}>Attendance Management</Typography>
      <Grid container spacing={2}>{[['Today\'s Attendance %','92%'],['Present Students',studentRecords.length-absent],['Absent Students',absent],['Late Entries',late],['Hostel Attendance','96%'],['Teacher Attendance','94%']].map(([title,value])=> <Grid size={{xs:12,md:4,lg:2}} key={String(title)}><AttendanceSummaryCard title={String(title)} value={value as string | number} /></Grid>)}</Grid>
      <AttendanceAnalyticsChart />
      <Paper className="p-4"><AttendanceFilters /><Stack direction="row" spacing={1} className="mb-3"><Button variant="contained" onClick={markAllPresent}>Quick Present-All</Button><Button variant="outlined">Save Draft (placeholder)</Button><Button variant="outlined">Lock Attendance</Button></Stack><Tabs value={tab} onChange={(_,v)=>setTab(v)}><Tab label="Student"/><Tab label="Hostel"/><Tab label="Teacher & Staff"/><Tab label="Reports"/><Tab label="Student Details"/><Tab label="Integrations"/></Tabs><Box className="mt-4">{tab===0 && <AttendanceTable rows={studentRecords} onStatusChange={setStudentStatus} />}{tab===1 && <HostelAttendanceTable rows={hostelRecords} />}{tab===2 && <TeacherAttendanceTable rows={teacherRecords} />}{tab===3 && <AttendanceReportGenerator />}{tab===4 && <AttendanceCalendar />}{tab===5 && <Alert severity="info">QR/RFID/Biometric, GPS, Offline Sync, Parent SMS/WhatsApp integrations are architecture-ready placeholders.</Alert>}</Box></Paper>
    </Box>
  );
}
