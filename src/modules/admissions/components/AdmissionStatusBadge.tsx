import { AdmissionStatus } from '../types';

const colorMap: Record<AdmissionStatus, string> = {
  Draft: 'bg-secondary',
  Submitted: 'bg-info text-dark',
  'Under Review': 'bg-warning text-dark',
  Approved: 'bg-success',
  Rejected: 'bg-danger',
  'Waiting List': 'bg-warning text-dark',
  Enrolled: 'bg-success'
};

export function AdmissionStatusBadge({ status }: { status: AdmissionStatus }) {
  return <span className={`badge ${colorMap[status]}`}>{status}</span>;
}
