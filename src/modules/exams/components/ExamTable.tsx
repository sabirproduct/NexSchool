import { Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useExamStore } from '../store/useExamStore';

export function ExamTable() {
  const { exams } = useExamStore();
  return <Paper sx={{ p: 2 }}><Typography variant='h6' mb={1}>Exam Management</Typography><Table size='small'><TableHead><TableRow><TableCell>Name</TableCell><TableCell>Type</TableCell><TableCell>Session</TableCell><TableCell>Duration</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>{exams.map((exam)=><TableRow key={exam.id}><TableCell>{exam.examName}</TableCell><TableCell>{exam.examType}</TableCell><TableCell>{exam.academicSessionId}</TableCell><TableCell>{exam.startDate} → {exam.endDate}</TableCell><TableCell><Chip size='small' label={exam.status} color={exam.status === 'Published' ? 'success' : 'default'} /></TableCell></TableRow>)}</TableBody></Table></Paper>;
}
