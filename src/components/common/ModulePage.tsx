export function ModulePage({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="mb-3">
          <h2 className="h4 fw-bold">{title}</h2>
          <p className="text-muted mb-0">Track day-to-day operations with role-aware workflows and actionable insights.</p>
        </div>
      </div>

      {bullets.map((item) => (
        <div className="col-12 col-md-6" key={item}>
          <div className="card border rounded-4 h-100 shadow-sm">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="text-primary fs-4">✓</div>
              <div className="fw-semibold">{item}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="col-12">
        <div className="d-flex flex-wrap gap-2">
          <span className="badge border border-primary text-primary bg-white">Bootstrap</span>
          <span className="badge border border-secondary text-secondary bg-white">MVP Ready</span>
          <span className="badge border border-secondary text-secondary bg-white">Role-based</span>
        </div>
      </div>
    </div>
  );
}
