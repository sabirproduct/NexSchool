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

  useEffect(() => {
    setFilters({ ...filters, search: debounced || undefined });
  }, [debounced]);

  useEffect(() => {
    fetch();
  }, [filters, page, pageSize]);

  const mobile = useMemo(() => rows.slice(0, 6), [rows]);

  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h1 className="h4 mb-0">Student Management</h1>
      </div>

      <div className="mb-4">
        <StudentSearchBar value={search} onChange={setSearch} />
      </div>

      <div className="mb-4">
        <StudentFilters value={filters} onChange={setFilters} />
      </div>

      <div className="row g-3 align-items-end mb-4">
        <div className="col-12 col-md-4">
          <label className="form-label visually-hidden">Sort By</label>
          <select
            className="form-select form-select-sm"
            value={filters.sortBy ?? 'name'}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
          >
            <option value="name">Name</option>
            <option value="admissionDate">Admission Date</option>
            <option value="rollNo">Roll Number</option>
          </select>
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label visually-hidden">Order</label>
          <select
            className="form-select form-select-sm"
            value={filters.sortOrder ?? 'asc'}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div className="col-12 col-md-5 d-flex flex-wrap gap-2 justify-content-start">
          <button type="button" className="btn btn-outline-secondary btn-sm">
            Export CSV
          </button>
          <button type="button" className="btn btn-primary btn-sm">
            Add Student
          </button>
        </div>
      </div>

      {toast ? (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {toast}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setToast('')} />
        </div>
      ) : null}

      <div className="mb-4 d-none d-md-block">
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <StudentTable
              rows={rows}
              total={total}
              loading={loading}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onDelete={setDeleteId}
            />
          </div>
        </div>
      </div>

      <div className="mb-4 d-md-none">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h6 mb-3">Mobile layout</h2>
            <div className="d-flex flex-column gap-3">
              {mobile.length ? (
                mobile.map((student) => <StudentCard key={student.id} student={student} />)
              ) : (
                <p className="mb-0 text-muted">No students found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await remove(deleteId);
            setToast('Student set to inactive');
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
