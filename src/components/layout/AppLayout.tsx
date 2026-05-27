import { Link, Outlet, useLocation } from 'react-router-dom';

const items = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Students', to: '/students' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Attendance', to: '/attendance' },
  { label: 'Academics', to: '/academics' },
  { label: 'Exams', to: '/exams' },
  { label: 'Fees', to: '/fees' },
  { label: 'Hostel', to: '/hostel' },
  { label: 'Notifications', to: '/notifications' },
  { label: 'Parent Portal', to: '/parent' },
  { label: 'Student Portal', to: '/student' },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="d-flex min-vh-100 bg-light">
      <nav className="d-none d-lg-flex flex-column bg-white border-end p-3" style={{ width: 280 }}>
        <div className="mb-4">
          <div className="fs-5 fw-bold">Modules</div>
        </div>
        <div className="list-group">
          {items.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`list-group-item list-group-item-action ${active ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="flex-grow-1">
        <header className="navbar navbar-light bg-white border-bottom px-3 py-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center" style={{ width: 34, height: 34 }}>
              N
            </div>
            <div>
              <div className="h6 mb-0">NexSchool SMS</div>
              <small className="text-muted">School management workspace</small>
            </div>
          </div>
        </header>

        <main className="container-fluid py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
