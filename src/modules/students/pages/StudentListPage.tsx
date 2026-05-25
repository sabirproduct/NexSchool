import { Alert, Button, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { StudentFilters } from '../components/StudentFilters';
import { StudentSearchBar } from '../components/StudentSearchBar';
import { StudentTable } from '../components/StudentTable';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useStudentsStore } from '../store/useStudentsStore';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';

export function StudentListPage() {
  const { rows, total, loading, page, pageSize, filters, setFilters, setPage, setPageSize, fetch, remove } = useStudentsStore();
  const [search, setSearch] = useState(filters.search ?? '');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const debounced = useDebouncedValue(search, 500);

  useEffect(() => { setFilters({ ...filters, search: debounced || undefined }); }, [debounced]);
  useEffect(() => { fetch(); }, [filters, page, pageSize]);
  const mobile = useMemo(() => rows.slice(0, 5), [rows]);

  return <Stack spacing={2}><Typography variant="h4">Student Management</Typography><StudentSearchBar value={search} onChange={setSearch} /><StudentFilters value={filters} onChange={setFilters} />
    <Stack direction="row" spacing={1}><Button variant="outlined">Export CSV</Button><Button variant="contained">Add Student</Button></Stack>
    <Paper sx={{ p: 1 }}><StudentTable rows={rows} total={total} loading={loading} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} onDelete={setDeleteId} /></Paper>
    <Paper sx={{ p: 2, display: { xs: 'block', md: 'none' } }}><Typography variant="subtitle2">Mobile quick list</Typography>{mobile.map((s)=><Typography key={s.id}>{s.fullName}</Typography>)}</Paper>
    <ConfirmDeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { if (deleteId) { await remove(deleteId); setToast('Student set to inactive'); } setDeleteId(null); }} />
    <Snackbar open={!!toast} autoHideDuration={3000} onClose={()=>setToast('')}><Alert severity="success">{toast}</Alert></Snackbar>
  </Stack>;
}
