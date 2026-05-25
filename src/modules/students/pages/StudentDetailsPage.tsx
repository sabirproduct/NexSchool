import { Card, CardContent, Grid2, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StudentProfileHeader } from '../components/StudentProfileHeader';
import { getStudentById } from '../services/studentService';
import { Student } from '../types';

export function StudentDetailsPage() {
  const { id = '' } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  useEffect(() => { getStudentById(id).then((s) => setStudent(s ?? null)); }, [id]);
  if (!student) return <Typography>Student not found.</Typography>;
  return <><StudentProfileHeader student={student} /><Grid2 container spacing={2}>{['Personal Info','Parent Info','Academic Info','Attendance Summary','Fees Summary','Hostel Info','Uploaded Documents'].map((s)=><Grid2 key={s} size={{ xs: 12, md: 6 }}><Card><CardContent><Typography variant="h6">{s}</Typography><Typography variant="body2">Placeholder content</Typography></CardContent></Card></Grid2>)}</Grid2></>;
}
