import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { TeacherAttendanceRecord } from '../types';
import { AttendanceStatusChip } from './AttendanceStatusChip';

export function TeacherAttendanceTable({ rows }: { rows: TeacherAttendanceRecord[] }) {
  return <Table size="small"><TableHead><TableRow><TableCell>Name</TableCell><TableCell>Type</TableCell><TableCell>Status</TableCell><TableCell>Check-in</TableCell><TableCell>Check-out</TableCell></TableRow></TableHead><TableBody>{rows.map((r)=><TableRow key={r.attendanceId}><TableCell>{r.teacherName}</TableCell><TableCell>{r.staffType}</TableCell><TableCell><AttendanceStatusChip status={r.status} /></TableCell><TableCell>{r.checkIn ?? '-'}</TableCell><TableCell>{r.checkOut ?? '-'}</TableCell></TableRow>)}</TableBody></Table>;
}
