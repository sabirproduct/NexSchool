import { Avatar, Button, Paper, Stack, Typography } from '@mui/material';
import { Student } from '../types';
export function StudentProfileHeader({ student }: { student: Student }) {
  return <Paper sx={{ p: 2, mb: 2 }}><Stack direction="row" alignItems="center" justifyContent="space-between"><Stack direction="row" spacing={2} alignItems="center"><Avatar src={student.photoUrl} sx={{ width: 60, height: 60 }}>{student.firstName[0]}</Avatar><div><Typography variant="h6">{student.fullName}</Typography><Typography variant="body2">{student.academic.admissionNo} • {student.academic.classId}-{student.academic.sectionId}</Typography></div></Stack><Stack direction="row" spacing={1}><Button variant="outlined">Print Profile</Button><Button variant="contained">Edit</Button></Stack></Stack></Paper>;
}
