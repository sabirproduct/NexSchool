import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { StudentFilters } from '../components/StudentFilters';
import { StudentSearchBar } from '../components/StudentSearchBar';
import { StudentTable } from '../components/StudentTable';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useStudentsStore } from '../store/useStudentsStore';
import { StudentCard } from '../components/StudentCard';

export function StudentListPage() {
  const navigate = useNavigate();
  const { rows, total, loading, page, pageSize, filters, setFilters, setPage, setPageSize, fetch } = useStudentsStore();
  const [search, setSearch] = useState(filters.search ?? '');
  const debounced = useDebouncedValue(search, 500);

  const openView = (id: string) => navigate(`/students/${id}`);
  const openEdit = (id: string) => navigate(`/students/${id}/edit`);
  const printStudentIdCard = (student: Student) => {
    const titleCase = (value: string) => value
      .split(' ')
      .filter(Boolean)
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
      .join(' ');
    const schoolName = 'NexSchool';
    const html = `<!DOCTYPE html><html><head><title>ID Card - ${student.fullName}</title><style>body{margin:0;padding:0;font-family:system-ui,sans-serif;background:#f3f4f6;} .id-card{width:360px;margin:24px auto;padding:20px;background:#1d4ed8;color:#fff;border-radius:18px;box-shadow:0 16px 40px rgba(15,23,42,.15);} .id-card header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;} .school-name{font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#bfdbfe;} .id-title{font-size:20px;font-weight:700;margin-top:6px;} .photo{width:88px;height:108px;border:2px solid rgba(255,255,255,.8);border-radius:14px;overflow:hidden;background:#fff;} .photo img{width:100%;height:100%;object-fit:cover;} .student-info{margin-top:16px;} .student-info p{margin:8px 0 0;font-size:14px;line-height:1.4;} .student-info strong{display:block;font-size:12px;color:#dbeafe;margin-bottom:4px;} .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px;} .grid span{display:block;font-size:12px;color:#dbeafe;} .grid strong{display:block;color:#fff;font-size:14px;margin-top:4px;} .footer{margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.18);font-size:10px;color:#bfdbfe;text-transform:uppercase;letter-spacing:.15em;}.action{margin:16px auto 0;text-align:center;} .action button{padding:10px 20px;border:none;border-radius:9999px;background:#f8fafc;color:#1d4ed8;font-weight:700;cursor:pointer;}</style></head><body><div class="id-card"><header><div><div class="school-name">${schoolName}</div><div class="id-title">Student ID Card</div></div><div class="photo"><img src="${student.photoUrl ?? ''}" alt="${student.fullName}" onerror="this.style.display='none'" /></div></header><div class="student-info"><p><strong>Name</strong>${titleCase(student.fullName)}</p><p><strong>Class</strong>${titleCase(student.academic.classId)}</p></div><div class="grid"><span>Role No<strong>${student.academic.rollNo}</strong></span><span>ID No<strong>${student.academic.admissionNo}</strong></span><span>Blood Group<strong>${student.bloodGroup ?? 'N/A'}</strong></span><span>Section<strong>${titleCase(student.academic.sectionId)}</strong></span></div><div class="footer">Printed ${new Date().toLocaleDateString()}</div></div><script>window.onload=function(){window.print();};</script></body></html>`;
    const win = window.open('', '_blank', 'width=420,height=620');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
  };

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
            <button type="button" onClick={() => navigate('/students/new')} className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
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

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <StudentTable
          rows={rows}
          total={total}
          loading={loading}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onView={openView}
          onEdit={openEdit}
          onPrint={printStudentIdCard}
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
    </div>
  );
}
