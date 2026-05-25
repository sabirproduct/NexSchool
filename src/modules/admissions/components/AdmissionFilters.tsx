import { MenuItem, Stack, TextField } from '@mui/material';
import { AdmissionStatus, StudentType } from '../types';

interface Props {
  search: string;
  onSearch: (value: string) => void;
  onStatus: (value: AdmissionStatus | '') => void;
  onType: (value: StudentType | '') => void;
}

export function AdmissionFilters({ search, onSearch, onStatus, onType }: Props) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      <TextField size="small" fullWidth label="Search" value={search} onChange={(e) => onSearch(e.target.value)} />
      <TextField size="small" select label="Status" defaultValue="" onChange={(e) => onStatus(e.target.value as AdmissionStatus | '')}>
        <MenuItem value="">All</MenuItem>
        {['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Waiting List', 'Enrolled'].map((status) => (
          <MenuItem key={status} value={status}>{status}</MenuItem>
        ))}
      </TextField>
      <TextField size="small" select label="Student Type" defaultValue="" onChange={(e) => onType(e.target.value as StudentType | '')}>
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Day Scholar">Day Scholar</MenuItem>
        <MenuItem value="Residential">Residential</MenuItem>
      </TextField>
    </Stack>
  );
}
