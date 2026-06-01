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
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Student Management</h1>
            <p className="mt-1 text-sm text-slate-500">Manage student records, admissions, and academic status.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Export CSV
            </button>
            <button type="button" className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
              Add Student
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <StudentSearchBar value={search} onChange={setSearch} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <StudentFilters value={filters} onChange={setFilters} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={filters.sortBy ?? 'name'}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                >
                  <option value="name">Name</option>
                  <option value="admissionDate">Admission Date</option>
                  <option value="rollNo">Roll Number</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={filters.sortOrder ?? 'asc'}
                  onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-700">Page Settings</div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-slate-500">Rows per page:</span>
              <select
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[5, 10, 25, 50].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <span>{toast}</span>
            <button type="button" className="rounded-full px-2 py-1 text-sm font-semibold text-emerald-700 hover:bg-emerald-100" onClick={() => setToast('')}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
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

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:hidden">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Mobile layout</h2>
        <div className="flex flex-col gap-4">
          {mobile.length ? (
            mobile.map((student) => <StudentCard key={student.id} student={student} />)
          ) : (
            <p className="text-sm text-slate-500">No students found.</p>
          )}
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
