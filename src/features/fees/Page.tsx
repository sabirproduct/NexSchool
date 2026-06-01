type FeeSection = {
  title: string;
  items: string[];
};

const feeSections: FeeSection[] = [
  {
    title: 'Fee Management',
    items: ['Fee structure setup', 'Fee assignment', 'Due tracking', 'Fine management'],
  },
  {
    title: 'Supported Fees',
    items: ['Tuition fees', 'Hostel fees', 'Transport fees', 'Admission fees'],
  },
  {
    title: 'Payment Features',
    items: ['Payment history', 'Receipt generation', 'Online payment placeholder', 'Razorpay integration placeholder'],
  },
  {
    title: 'Reports',
    items: ['Collection reports', 'Pending dues', 'Revenue analytics'],
  },
];

export function FeesPage() {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="mb-3">
          <h2 className="h4 fw-bold">Fees & Payment Module</h2>
          <p className="text-muted mb-0">
            Manage school fee structures, track dues, and monitor collection performance across payment channels.
          </p>
        </div>
      </div>

      {feeSections.map((section) => (
        <div className="col-12 col-md-6" key={section.title}>
          <div className="card border rounded-4 shadow-sm h-100">
            <div className="card-body">
              <h3 className="h6 fw-semibold">{section.title}</h3>
              <ul className="list-unstyled mb-0 mt-3">
                {section.items.map((item) => (
                  <li key={item} className="d-flex align-items-start gap-2 mb-2">
                    <span className="text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
