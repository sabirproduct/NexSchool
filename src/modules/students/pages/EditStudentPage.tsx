import { Paper, Typography } from '@mui/material';
import { StudentForm } from '../components/StudentForm';
export function EditStudentPage() { return <Paper sx={{ p: 2 }}><Typography variant="h5" mb={2}>Edit Student</Typography><StudentForm mode="edit" onSubmit={async () => {}} /></Paper>; }
