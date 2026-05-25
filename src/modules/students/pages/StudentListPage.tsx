import { Alert, Button, MenuItem, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { StudentFilters } from '../components/StudentFilters';
import { StudentSearchBar } from '../components/StudentSearchBar';
import { StudentTable } from '../components/StudentTable';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useStudentsStore } from '../store/useStudentsStore';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { StudentCard } from '../components/StudentCard';

export function StudentListPage() {
  const { rows, total, loading, page, pageSize, filters, setFilters, setPage, setPageSize, fetch, remove } = useStudentsStore();
  const [search, setSearch] = useState(filters.search ?? '');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const debounced = useDebouncedValue(search, 500);

  useEffect(() => { setFilters({ ...filters, search: debounced || undefined }); }, [debounced]);
  useEffect(() => { fetch(); }, [filters, page, pageSize]);
  const mobile = useMemo(() => rows.slice(0, 6), [rows]);

  return <Stack spacing={2}><Typography variant="h4">Student Management</Typography><StudentSearchBar value={search} onChange={setSearch} /><StudentFilters value={filters} onChange={setFilters} />
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
      <TextField select size="small" label="Sort By" value={filters.sortBy ?? 'name'} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })} sx={{ minWidth: 180 }}><MenuItem value="name">Name</MenuItem><MenuItem value="admissionDate">Admission Date</MenuItem><MenuItem value="rollNo">Roll Number</MenuItem></TextField>
      <TextField select size="small" label="Order" value={filters.sortOrder ?? 'asc'} onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })} sx={{ minWidth: 120 }}><MenuItem value="asc">Ascending</MenuItem><MenuItem value="desc">Descending</MenuItem></TextField>
      <Button variant="outlined">Export CSV</Button><Button variant="contained">Add Student</Button>
    </Stack>
    <BoxResponsiveDesktop><StudentTable rows={rows} total={total} loading={loading} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} onDelete={setDeleteId} /></BoxResponsiveDesktop>
    <Paper sx={{ p: 2, display: { xs: 'block', md: 'none' } }}><Typography variant="subtitle2" mb={1}>Mobile layout</Typography><Stack spacing={1.2}>{mobile.length ? mobile.map((s)=><StudentCard key={s.id} student={s} />) : <Typography>No students found.</Typography>}</Stack></Paper>
    <ConfirmDeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { if (deleteId) { await remove(deleteId); setToast('Student set to inactive'); } setDeleteId(null); }} />
    <Snackbar open={!!toast} autoHideDuration={3000} onClose={()=>setToast('')}><Alert severity="success">{toast}</Alert></Snackbar>
  </Stack>;
}

function BoxResponsiveDesktop({ children }: { children: ReactNode }) {
  return <Paper sx={{ p: 1, display: { xs: 'none', md: 'block' } }}>{children}</Paper>;
}
