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
    <div className="row g-3">
      {fields.map((field) => (
        <div key={field} className="col-12 col-sm-6 col-lg-2">
          <label className="form-label text-capitalize">{field}</label>
          <select
            className="form-select form-select-sm"
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
