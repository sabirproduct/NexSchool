import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAttendanceStore } from '../store/useAttendanceStore';

export function AttendanceFilters() {
  const filters = useAttendanceStore((s) => s.filters);
  const setFilters = useAttendanceStore((s) => s.setFilters);
  const { register, handleSubmit } = useForm({ defaultValues: filters });
  return (
    <form onSubmit={handleSubmit((v) => setFilters(v))}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} className="mb-4">
        <TextField select label="Class" {...register('classId')}><MenuItem value="10">10</MenuItem><MenuItem value="11">11</MenuItem></TextField>
        <TextField select label="Section" {...register('sectionId')}><MenuItem value="A">A</MenuItem><MenuItem value="B">B</MenuItem></TextField>
        <TextField type="date" label="Date" InputLabelProps={{ shrink: true }} {...register('date', { required: true })} />
        <TextField label="Subject (placeholder)" {...register('subject')} />
        <Button variant="contained" type="submit">Apply</Button>
      </Stack>
    </form>
  );
}
