import { Student } from '../types';

export function StudentCard({ student }: { student: Student }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-lg font-semibold">
          {student.photoUrl ? (
            <img src={student.photoUrl} alt={student.fullName} className="h-full w-full object-cover" />
          ) : (
            <span>{student.firstName[0]}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-slate-900 truncate">{student.fullName}</div>
          <div className="text-sm text-slate-500">
            {student.academic.classId}-{student.academic.sectionId} • {student.mobile}
          </div>
        </div>

        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
          student.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {student.status}
        </span>
      </div>
    </div>
  );
}
