import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useExamStore } from '../store/useExamStore';

export function ExamScheduler() {
  const { schedules } = useExamStore();
  return <Paper sx={{ p: 2 }}><Typography variant='h6' mb={1}>Exam Schedule Management</Typography><Table size='small'><TableHead><TableRow><TableCell>Class</TableCell><TableCell>Section</TableCell><TableCell>Subject</TableCell><TableCell>Exam Date</TableCell><TableCell>Time</TableCell><TableCell>Max/Pass</TableCell></TableRow></TableHead><TableBody>{schedules.map((slot)=><TableRow key={slot.id}><TableCell>{slot.classId}</TableCell><TableCell>{slot.sectionId}</TableCell><TableCell>{slot.subjectName}</TableCell><TableCell>{slot.examDate}</TableCell><TableCell>{slot.startTime} - {slot.endTime}</TableCell><TableCell>{slot.maximumMarks}/{slot.passingMarks}</TableCell></TableRow>)}</TableBody></Table></Paper>;
}
