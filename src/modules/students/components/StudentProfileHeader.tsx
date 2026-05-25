import { Avatar, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Student } from '../types';

export function StudentProfileHeader({ student }: { student: Student }) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={student.photoUrl} sx={{ width: 72, height: 72 }}>{student.firstName[0]}</Avatar>
          <Stack spacing={0.5}>
            <Typography variant="h6">{student.fullName}</Typography>
            <Typography variant="body2">Admission: {student.academic.admissionNo} • Roll: {student.academic.rollNo}</Typography>
            <Typography variant="body2">Class {student.academic.classId}-{student.academic.sectionId} • {student.mobile}</Typography>
            <Stack direction="row" spacing={1}><Chip size="small" label={student.academic.studentType === 'residential' ? 'Residential' : 'Day Scholar'} /><Chip size="small" color={student.status === 'active' ? 'success' : 'default'} label={student.status} /></Stack>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button variant="outlined">Send Notice</Button>
          <Button variant="outlined">Mark Attendance</Button>
          <Button variant="outlined">Print Profile</Button>
          <Button component={Link} to={`/students/${student.id}/edit`} variant="contained">Edit</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
