import { Alert, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { StudentForm, StudentAdmissionFormValues } from '../components/StudentForm';

export function AddStudentPage() {
  const [toast, setToast] = useState('');
  return <Paper sx={{ p: 2.5 }}><Stack spacing={2}><Typography variant="h5">Add Student</Typography><Alert severity="info">This form is production-structured. Connect submission to Firebase Auth/Firestore/Storage service methods.</Alert><StudentForm mode="create" onSubmit={async (_values: StudentAdmissionFormValues) => { setToast('Student admission submitted (placeholder).'); }} /></Stack><Snackbar open={!!toast} autoHideDuration={3000} onClose={()=>setToast('')} message={toast} /></Paper>;
}
