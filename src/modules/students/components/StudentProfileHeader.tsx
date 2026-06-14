import { Link } from 'react-router-dom';
import { Student } from '../types';

export function StudentProfileHeader({ student, photoBinary }: { student: Student; photoBinary?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {photoBinary ? (
            <img src={photoBinary} alt={student.fullName} className="rounded-full border border-slate-200" style={{ width: 72, height: 72, objectFit: 'cover' }} />
          ) : student.photoUrl ? (
            <img src={student.photoUrl} alt={student.fullName} className="rounded-full border border-slate-200" style={{ width: 72, height: 72, objectFit: 'cover' }} />
          ) : (
            <div className="rounded-full bg-blue-600 text-white flex items-center justify-center" style={{ width: 72, height: 72, fontSize: '1.25rem' }}>
              {student.firstName[0]}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">{student.fullName}</h3>
            <p className="text-sm text-slate-500 mb-1">Admission: {student.academic.admissionNo} • Roll: {student.academic.rollNo}</p>
            <p className="text-sm text-slate-500 mb-0">Class {student.academic.classId}-{student.academic.sectionId} • {student.mobile}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {student.academic.studentType === 'residential' ? 'Residential' : 'Day Scholar'}
              </span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                student.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {student.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to={`/students/${student.id}/edit`} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors">Edit</Link>
        </div>
      </div>
    </div>
  );
}