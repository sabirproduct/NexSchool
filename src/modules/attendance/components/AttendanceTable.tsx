import { MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { AttendanceStatusChip } from './AttendanceStatusChip';
import { StudentAttendanceRecord } from '../types';

const statuses: StudentAttendanceRecord['status'][] = ['Present', 'Absent', 'Late', 'Half Day', 'Leave'];

interface Props {
  rows: StudentAttendanceRecord[];
  onStatusChange: (id: string, status: StudentAttendanceRecord['status'], remarks?: string) => void;
}

export function AttendanceTable({ rows, onStatusChange }: Props) {
  return <Table stickyHeader size="small"><TableHead><TableRow><TableCell>Roll</TableCell><TableCell>Name</TableCell><TableCell>Status</TableCell><TableCell>Quick Edit</TableCell><TableCell>Remarks</TableCell></TableRow></TableHead><TableBody>{rows.map((r) => <TableRow key={r.attendanceId}><TableCell>{r.rollNumber}</TableCell><TableCell>{r.studentName}</TableCell><TableCell><AttendanceStatusChip status={r.status} /></TableCell><TableCell><Select size="small" value={r.status} onChange={(e) => onStatusChange(r.attendanceId, e.target.value as StudentAttendanceRecord['status'], r.remarks)}>{statuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}</Select></TableCell><TableCell><TextField size="small" value={r.remarks ?? ''} onChange={(e) => onStatusChange(r.attendanceId, r.status, e.target.value)} /></TableCell></TableRow>)}</TableBody></Table>;
}
