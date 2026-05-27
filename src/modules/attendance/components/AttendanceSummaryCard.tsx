export function AttendanceSummaryCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="card border rounded-4 shadow-sm h-100">
      <div className="card-body">
        <p className="text-muted small mb-1">{title}</p>
        <h3 className="h5 mb-0">{value}</h3>
      </div>
    </div>
  );
}
