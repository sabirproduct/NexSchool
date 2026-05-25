import { Paper, Typography } from '@mui/material';
import { StudentForm } from '../components/StudentForm';
export function AddStudentPage() { return <Paper sx={{ p: 2 }}><Typography variant="h5" mb={2}>Add Student</Typography><StudentForm mode="create" onSubmit={async () => {}} /></Paper>; }
