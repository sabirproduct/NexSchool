import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useExamStore } from '../store/useExamStore';

export function RankTable() {
  const { results } = useExamStore();
  return <Paper sx={{ p: 2 }}><Typography variant='h6' mb={1}>Ranking System</Typography><Table size='small'><TableHead><TableRow><TableCell>Student</TableCell><TableCell>Class Rank</TableCell><TableCell>Section Rank</TableCell><TableCell>Percentage</TableCell><TableCell>GPA</TableCell></TableRow></TableHead><TableBody>{results.sort((a,b)=>a.classRank-b.classRank).map((result)=><TableRow key={result.id}><TableCell>{result.studentName}</TableCell><TableCell>{result.classRank}</TableCell><TableCell>{result.sectionRank}</TableCell><TableCell>{result.percentage}%</TableCell><TableCell>{result.gpa}</TableCell></TableRow>)}</TableBody></Table></Paper>;
}
