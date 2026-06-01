import { Student } from '../types';

export function StudentTable({
  rows,
  total,
  loading,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onDelete,
}: {
  rows: Student[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (v: number) => void;
  onPageSizeChange: (v: number) => void;
  onDelete: (id: string) => void;
}) {
  if (loading) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-12 rounded-3xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        No students found. Try changing search/filter.
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-600 uppercase tracking-[0.08em] text-left text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Admission</th>
              <th className="px-4 py-3">Roll</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                      {r.photoUrl ? (
                        <img src={r.photoUrl} alt={r.fullName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm font-semibold">{r.firstName[0]}</span>
                      )}
                    </div>
                    <span className="text-slate-800">{r.fullName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top text-slate-700">{r.academic.admissionNo}</td>
                <td className="px-4 py-3 align-top text-slate-700">{r.academic.rollNo}</td>
                <td className="px-4 py-3 align-top text-slate-700">{r.fullName}</td>
                <td className="px-4 py-3 align-top text-slate-700">{r.academic.classId}</td>
                <td className="px-4 py-3 align-top text-slate-700">{r.academic.sectionId}</td>
                <td className="px-4 py-3 align-top text-slate-700">{r.gender}</td>
                <td className="px-4 py-3 align-top text-slate-700">{r.mobile}</td>
                <td className="px-4 py-3 align-top text-slate-700">{r.academic.studentType}</td>
                <td className="px-4 py-3 align-top">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    r.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">
                      View
                    </button>
                    <button type="button" className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">
                      Edit
                    </button>
                    <button type="button" className="rounded-2xl border border-red-300 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100" onClick={() => onDelete(r.id)}>
                      Delete
                    </button>
                    <button type="button" className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">
                      Promote
                    </button>
                    <button type="button" className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">
                      Print ID
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-600">
          Showing {Math.min(total, page * pageSize + 1)} - {Math.min(total, (page + 1) * pageSize)} of {total}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page <= 0}
              onClick={() => onPageChange(page - 1)}
            >
              Prev
            </button>
            <button
              type="button"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page >= pageCount - 1}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
