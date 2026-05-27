export function GradeBadge({ grade }: { grade: string }) {
  const colorClass = grade.startsWith('A') ? 'bg-success' : grade.startsWith('B') ? 'bg-primary' : grade === 'F' ? 'bg-danger' : 'bg-warning text-dark';
  return <span className={`badge ${colorClass}`}>{grade}</span>;
}
