import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { HostelAttendanceRecord } from '../types';
import { AttendanceStatusChip } from './AttendanceStatusChip';

export function HostelAttendanceTable({ rows }: { rows: HostelAttendanceRecord[] }) {
  return <Table size="small"><TableHead><TableRow><TableCell>Student</TableCell><TableCell>Hostel</TableCell><TableCell>Room</TableCell><TableCell>Type</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>{rows.map((r)=><TableRow key={r.recordId}><TableCell>{r.studentName}</TableCell><TableCell>{r.hostelId}</TableCell><TableCell>{r.roomId}</TableCell><TableCell>{r.attendanceType}</TableCell><TableCell><AttendanceStatusChip status={r.status} /></TableCell></TableRow>)}</TableBody></Table>;
}
