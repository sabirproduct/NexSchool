import { Grid2, MenuItem, TextField } from '@mui/material';
import { StudentFilters as Filters } from '../types';
export function StudentFilters({ value, onChange }: { value: Filters; onChange: (v: Filters) => void }) {
  return <Grid2 container spacing={1.5}>
    {['classId','sectionId','gender','status','studentType'].map((k) => <Grid2 key={k} size={{ xs: 6, md: 2.4 }}><TextField select size="small" label={k} fullWidth value={(value as any)[k] ?? ''} onChange={(e)=>onChange({ ...value, [k]: e.target.value || undefined })}>
      <MenuItem value="">All</MenuItem><MenuItem value="9">9</MenuItem><MenuItem value="10">10</MenuItem><MenuItem value="A">A</MenuItem><MenuItem value="B">B</MenuItem><MenuItem value="male">Male</MenuItem><MenuItem value="female">Female</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem><MenuItem value="day_scholar">Day Scholar</MenuItem><MenuItem value="residential">Residential</MenuItem>
    </TextField></Grid2>)}
  </Grid2>;
}
