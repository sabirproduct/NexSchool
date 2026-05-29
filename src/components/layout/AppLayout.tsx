import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const sidebarWidth = 280;

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
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const navList = (
    <>
      <div className="mb-6 flex items-center justify-between w-full">
        <div className="text-lg font-bold text-gray-900">NexSchool</div>
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
        >
          ×
        </button>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileNavOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        className="mt-6 w-full rounded-lg bg-red-600 text-white py-3 text-sm font-semibold hover:bg-red-700 transition-colors"
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <nav className="hidden lg:flex flex-col flex-shrink-0 bg-white border-r border-gray-200 p-6 shadow-sm" style={{ width: sidebarWidth }}>
        {navList}
      </nav>

      {mobileNavOpen && (
        <>
          <div
            className="fixed top-0 left-0 h-screen bg-white border-r border-gray-200 p-6 shadow-xl lg:hidden flex-shrink-0 z-50"
            style={{ width: sidebarWidth }}
          >
            {navList}
          </div>
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/25 lg:hidden z-40"
            onClick={() => setMobileNavOpen(false)}
          />
        </>
      )}

      <div className="flex-grow">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white gap-3">
          <h1 className="text-2xl font-bold text-gray-900">NexSchool SMS</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden lg:inline-flex items-center justify-center rounded-lg bg-red-50 text-red-700 border border-red-200 px-4 py-2 text-sm font-medium hover:bg-red-100 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label="Open navigation"
            >
              ☰
            </button>
          </div>
        </div>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
