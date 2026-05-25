import { Stack, Typography } from '@mui/material';
import { ExamModuleView } from '../components/ExamModuleView';
import { GPAChart } from '../components/GPAChart';
import { ReportCardGenerator } from '../components/ReportCardGenerator';

export function ExaminationManagementPage() {
  return (
    <Stack spacing={2}>
      <Typography variant='h4' fontWeight={700}>Examination & Result Management</Typography>
      <GPAChart data={[{ exam: 'UT1', gpa: 7.4 }, { exam: 'Quarterly', gpa: 8.1 }, { exam: 'Half Yearly', gpa: 8.5 }]} />
      <ExamModuleView />
      <ReportCardGenerator />
    </Stack>
  );
}
