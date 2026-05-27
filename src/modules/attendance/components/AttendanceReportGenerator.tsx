export function AttendanceReportGenerator() {
  return (
    <div className="d-flex flex-wrap gap-2">
      <button type="button" className="btn btn-outline-secondary btn-sm">Export PDF</button>
      <button type="button" className="btn btn-outline-secondary btn-sm">Export Excel (placeholder)</button>
      <button type="button" className="btn btn-outline-secondary btn-sm">Print</button>
    </div>
  );
}
