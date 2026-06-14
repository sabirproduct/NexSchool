import { AdmissionStatus, StudentType } from '../types';

interface Props {
  search: string;
  onSearch: (value: string) => void;
  onStatus: (value: AdmissionStatus | '') => void;
  onType: (value: StudentType | '') => void;
}

const statusOptions: Array<AdmissionStatus | ''> = ['', 'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Waiting List', 'Enrolled'];

export function AdmissionFilters({ search, onSearch, onStatus, onType }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Search</label>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Name or mobile..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
        <select
          defaultValue=""
          onChange={(e) => onStatus(e.target.value as AdmissionStatus | '')}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          {statusOptions.map((status) => (
            <option key={status || 'all'} value={status}>
              {status || 'All Statuses'}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Student Type</label>
        <select
          defaultValue=""
          onChange={(e) => onType(e.target.value as StudentType | '')}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          <option value="">All Types</option>
          <option value="Day Scholar">Day Scholar</option>
          <option value="Residential">Residential</option>
        </select>
      </div>
    </div>
  );
}