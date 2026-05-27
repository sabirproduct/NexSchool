import { useForm } from 'react-hook-form';
import { useAttendanceStore } from '../store/useAttendanceStore';

export function AttendanceFilters() {
  const filters = useAttendanceStore((s) => s.filters);
  const setFilters = useAttendanceStore((s) => s.setFilters);
  const { register, handleSubmit } = useForm({ defaultValues: filters });

  return (
    <form onSubmit={handleSubmit((v) => setFilters(v))}>
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-2">
          <label className="form-label">Class</label>
          <select className="form-select form-select-sm" {...register('classId')}>
            <option value="">All</option>
            <option value="10">10</option>
            <option value="11">11</option>
          </select>
        </div>
        <div className="col-12 col-md-2">
          <label className="form-label">Section</label>
          <select className="form-select form-select-sm" {...register('sectionId')}>
            <option value="">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>
        <div className="col-12 col-md-2">
          <label className="form-label">Date</label>
          <input className="form-control form-control-sm" type="date" {...register('date', { required: true })} />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Subject (placeholder)</label>
          <input className="form-control form-control-sm" {...register('subject')} />
        </div>
        <div className="col-12 col-md-2 d-flex align-items-end">
          <button type="submit" className="btn btn-primary w-100 btn-sm">
            Apply
          </button>
        </div>
      </div>
    </form>
  );
}
