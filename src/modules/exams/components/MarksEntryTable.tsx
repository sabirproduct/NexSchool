import { Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useExamStore } from '../store/useExamStore';

export function MarksEntryTable() {
  const { marks } = useExamStore();
  return <Paper sx={{ p: 2 }}><Typography variant='h6' mb={1}>Marks Entry</Typography><Table size='small'><TableHead><TableRow><TableCell>Student</TableCell><TableCell>Roll</TableCell><TableCell>Subject</TableCell><TableCell>Marks</TableCell><TableCell>Grade</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>{marks.map((mark)=><TableRow key={mark.id}><TableCell>{mark.studentName}</TableCell><TableCell>{mark.rollNumber}</TableCell><TableCell>{mark.subjectName}</TableCell><TableCell>{mark.obtainedMarks}/{mark.maximumMarks}</TableCell><TableCell>{mark.grade}</TableCell><TableCell><Chip size='small' label={mark.status} color={mark.status==='Present'?'success':'warning'} /></TableCell></TableRow>)}</TableBody></Table></Paper>;
}
