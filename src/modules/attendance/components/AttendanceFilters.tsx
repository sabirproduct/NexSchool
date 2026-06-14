import { useForm } from 'react-hook-form';
import { useAttendanceStore } from '../store/useAttendanceStore';

export function AttendanceFilters() {
  const filters = useAttendanceStore((s) => s.filters);
  const setFilters = useAttendanceStore((s) => s.setFilters);
  const { register, handleSubmit } = useForm({ defaultValues: filters });

  return (
    <form onSubmit={handleSubmit((v) => setFilters(v))}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" {...register('classId')}>
            <option value="">All</option>
            <option value="10">10</option>
            <option value="11">11</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Section</label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" {...register('sectionId')}>
            <option value="">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="date"
            {...register('date', { required: true })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register('subject')}
            placeholder="Any subject"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply
          </button>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              setFilters({ classId: '', sectionId: '', date: '', subject: '', hostelId: '', roomId: '' });
            }}
            className="w-full rounded-lg border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}