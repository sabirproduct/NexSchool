import { useEffect, useState } from 'react';
import { StudentFilters as Filters } from '../types';
import { fetchDropdownData, ClassOption, SectionOption, SessionOption } from '../services/dropdownService';
import { useAuthStore } from '../../../store/authStore';

export function StudentFilters({ value, onChange }: { value: Filters; onChange: (v: Filters) => void }) {
  const schoolId = useAuthStore((s) => s.user?.schoolId);
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);

  useEffect(() => {
    fetchDropdownData(schoolId).then((data) => {
      setClassOptions(data.classes);
    });
  }, [schoolId]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 capitalize">Class</label>
        <select
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={value.classId ?? ''}
          onChange={(e) => onChange({ ...value, classId: e.target.value || undefined })}
        >
          <option value="">All</option>
          {classOptions.map((cls) => (
            <option key={cls.id} value={cls.className}>{cls.className}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 capitalize">Section</label>
        <select
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={value.sectionId ?? ''}
          onChange={(e) => onChange({ ...value, sectionId: e.target.value || undefined })}
        >
          <option value="">All</option>
          {['A', 'B', 'C', 'D'].map((sec) => (
            <option key={sec} value={sec}>Section {sec}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 capitalize">Gender</label>
        <select
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={value.gender ?? ''}
          onChange={(e) => onChange({ ...value, gender: e.target.value || undefined })}
        >
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 capitalize">Status</label>
        <select
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={value.status ?? ''}
          onChange={(e) => onChange({ ...value, status: (e.target.value || undefined) as any })}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="graduated">Graduated</option>
          <option value="transferred">Transferred</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 capitalize">Student Type</label>
        <select
          className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={value.studentType ?? ''}
          onChange={(e) => onChange({ ...value, studentType: (e.target.value || undefined) as any })}
        >
          <option value="">All</option>
          <option value="day_scholar">Day Scholar</option>
          <option value="residential">Residential</option>
        </select>
      </div>
    </div>
  );
}