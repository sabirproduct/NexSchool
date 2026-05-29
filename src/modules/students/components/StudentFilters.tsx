import { StudentFilters as Filters } from '../types';

const options = [
  { value: '', label: 'All' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'day_scholar', label: 'Day Scholar' },
  { value: 'residential', label: 'Residential' },
];

export function StudentFilters({ value, onChange }: { value: Filters; onChange: (v: Filters) => void }) {
  const fields = ['classId', 'sectionId', 'gender', 'status', 'studentType'] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {fields.map((field) => (
        <div key={field} className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 capitalize">{field}</label>
          <select
            className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={(value as any)[field] ?? ''}
            onChange={(e) => onChange({ ...value, [field]: e.target.value || undefined })}
          >
            {options.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
