import { TextField } from '@mui/material';
export function StudentSearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <TextField size="small" label="Search student" value={value} onChange={(e) => onChange(e.target.value)} fullWidth />;
}
