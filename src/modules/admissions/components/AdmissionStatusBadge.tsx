import { Chip } from '@mui/material';
import { AdmissionStatus } from '../types';

const colorMap: Record<AdmissionStatus, 'default' | 'success' | 'error' | 'warning' | 'info'> = {
  Draft: 'default',
  Submitted: 'info',
  'Under Review': 'warning',
  Approved: 'success',
  Rejected: 'error',
  'Waiting List': 'warning',
  Enrolled: 'success'
};

export function AdmissionStatusBadge({ status }: { status: AdmissionStatus }) {
  return <Chip size="small" label={status} color={colorMap[status]} />;
}
