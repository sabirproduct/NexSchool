export function StudentPromotionPage() {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5 mb-3">Student Promotion</h2>
        <form className="row g-3">
          <div className="col-12 col-md-4">
            <label className="form-label">Target Class</label>
            <input className="form-control" />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Target Section</label>
            <input className="form-control" />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Session</label>
            <input className="form-control" />
          </div>
          <div className="col-12">
            <button type="button" className="btn btn-primary">Bulk Promote</button>
          </div>
        </form>
      </div>
    </div>
  );
}
