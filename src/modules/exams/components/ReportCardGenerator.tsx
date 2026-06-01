export function ReportCardGenerator() {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="h6 mb-3">Report Card Generator</h3>
        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary btn-sm">Generate PDF</button>
          <button type="button" className="btn btn-outline-secondary btn-sm">Print</button>
          <button type="button" className="btn btn-link btn-sm">QR Verify (Placeholder)</button>
        </div>
      </div>
    </div>
  );
}
