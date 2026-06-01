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
    <div className="row g-3">
      <div className="col-12 col-md-4">
        <label className="form-label">Search</label>
        <input
          className="form-control form-control-sm"
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="col-12 col-md-4">
        <label className="form-label">Status</label>
        <select className="form-select form-select-sm" defaultValue="" onChange={(e) => onStatus(e.target.value as AdmissionStatus | '')}>
          {statusOptions.map((status) => (
            <option key={status || 'all'} value={status}> {status || 'All'} </option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-4">
        <label className="form-label">Student Type</label>
        <select className="form-select form-select-sm" defaultValue="" onChange={(e) => onType(e.target.value as StudentType | '')}>
          <option value="">All</option>
          <option value="Day Scholar">Day Scholar</option>
          <option value="Residential">Residential</option>
        </select>
      </div>
    </div>
  );
}
