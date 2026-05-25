import { Avatar, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Student } from '../types';
export function StudentCard({ student }: { student: Student }) {
  return <Card variant="outlined"><CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar src={student.photoUrl}>{student.firstName[0]}</Avatar><Stack><Typography fontWeight={700}>{student.fullName}</Typography><Typography variant="body2">{student.academic.classId}-{student.academic.sectionId} • {student.mobile}</Typography></Stack><Chip label={student.status} color={student.status==='active'?'success':'default'} /></Stack></CardContent></Card>;
}
