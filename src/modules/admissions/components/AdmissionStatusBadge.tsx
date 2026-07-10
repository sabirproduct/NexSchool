import { AdmissionStatus } from '../types';

const colorMap: Record<AdmissionStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  'Waiting List': 'bg-purple-100 text-purple-700',
  Enrolled: 'bg-teal-100 text-teal-700'
};

export function AdmissionStatusBadge({ status }: { status: AdmissionStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[status]}`}>
      {status}
    </span>
  );
}