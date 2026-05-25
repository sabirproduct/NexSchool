import { Chip } from '@mui/material';

export function GradeBadge({ grade }: { grade: string }) {
  const color = grade.startsWith('A') ? 'success' : grade.startsWith('B') ? 'primary' : grade === 'F' ? 'error' : 'warning';
  return <Chip size='small' color={color} label={grade} />;
}
