import { useEffect, useState, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import NexSchoolLogo from './NexSchoolLogo';
import { Icons } from './SidebarIcons';
import { fetchAllRoles } from '../../modules/system/services/systemService';
import { roleModules } from '../../config/roles';
import { UserRole } from '../../types';

const sidebarWidth = 280;

interface MenuItem {
  label: string;
  to: string;
  icon: () => JSX.Element;
  module: string;
}

const ALL_MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: Icons.Dashboard, module: 'dashboard' },
  { label: 'Students', to: '/students', icon: Icons.Students, module: 'students' },
  { label: 'Admissions', to: '/admissions', icon: Icons.Admissions, module: 'admissions' },
  { label: 'Attendance', to: '/attendance', icon: Icons.Attendance, module: 'attendance' },
  { label: 'Academics', to: '/academics', icon: Icons.Academics, module: 'academics' },
  { label: 'Exams', to: '/exams', icon: Icons.Exams, module: 'exams' },
  { label: 'Fees', to: '/fees', icon: Icons.Fees, module: 'fees' },
  { label: 'Hostel', to: '/hostel', icon: Icons.Hostel, module: 'hostel' },
  { label: 'Safety Dashboard', to: '/safety', icon: Icons.Safety, module: 'safety' },
  { label: 'Health & Wellness', to: '/health', icon: Icons.Health, module: 'health' },
  { label: 'Scholarships', to: '/scholarship', icon: Icons.Scholarship, module: 'scholarship' },
  { label: 'Notifications', to: '/notifications', icon: Icons.Notifications, module: 'notifications' },
  { label: 'Parent Portal', to: '/parent', icon: Icons.ParentPortal, module: 'parent' },
  { label: 'Student Portal', to: '/student', icon: Icons.StudentPortal, module: 'student' },
  { label: 'QR Attendance', to: '/qr-attendance', icon: Icons.QRAttendance, module: 'qr_attendance' },
  { label: 'System Config', to: '/system', icon: Icons.SystemConfig, module: 'system' },
];

/**
 * Check if a module is allowed for the given role permissions
 */
function isModuleAllowed(module: string, permissions: string[]): boolean {
  if (permissions.includes('all')) return true;
  return permissions.includes(module);
}

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  // Use hardcoded role config as fallback so permissions work even before Firestore roles are seeded
  const fallbackPermissions = useMemo(() => {
    if (!user) return ['dashboard'];
    return roleModules[user.role as UserRole] || ['dashboard'];
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    // Load role permissions from Firestore
    async function loadPermissions() {
      try {
        const roles = await fetchAllRoles();
        const currentRole = roles.find((r) => r.key === user!.role);
        if (currentRole) {
          setRolePermissions(currentRole.permissions);
        } else {
          // Fallback: use hardcoded config from roles.ts which always has the correct permissions
          setRolePermissions(fallbackPermissions);
        }
      } catch (err) {
        console.error('Failed to load role permissions:', err);
        // Fallback: use hardcoded config from roles.ts
        setRolePermissions(fallbackPermissions);
      } finally {
        setLoadingMenu(false);
      }
    }
    loadPermissions();
  }, [user, fallbackPermissions]);

  const items = useMemo(() => {
    return ALL_MENU_ITEMS.filter((item: MenuItem) =>
      isModuleAllowed(item.module, rolePermissions)
    );
  }, [rolePermissions]);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navList = (
    <>
      <div className="mb-6 flex items-center justify-between w-full">
        <div className="text-lg font-bold text-gray-900 flex items-center gap-3">
          <NexSchoolLogo />
        </div>
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
        >
          ×
        </button>
      </div>
      {loadingMenu ? (
        <nav className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </nav>
      ) : (
        <nav className="space-y-1">
          {items.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileNavOpen(false)}
              >
                <span className={`flex-shrink-0 ${active ? 'text-white' : 'text-gray-500'}`}>{item.icon()}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar — fixed, scrollable independently */}
      <nav
        className="hidden lg:flex flex-col flex-shrink-0 bg-white border-r border-gray-200 p-6 shadow-sm overflow-y-auto"
        style={{ width: sidebarWidth }}
      >
        {navList}
      </nav>

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <>
          <div
            className="fixed top-0 left-0 h-screen bg-white border-r border-gray-200 p-6 shadow-xl lg:hidden flex-shrink-0 z-50 overflow-y-auto"
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

      {/* Right side: top bar + scrollable content */}
      <div className="flex flex-col flex-grow min-w-0">
        {/* Top bar — sticky within its column */}
        <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white gap-3">
          <h1 className="text-2xl font-bold text-gray-900">NexSchool ERP</h1>
          <div className="flex items-center gap-4">
            {/* User info */}
            {user && (
              <div className="hidden lg:flex items-center gap-3 pr-4 border-r border-gray-200">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900">{user.name || user.email}</span>
                  <span className="text-xs text-gray-500 capitalize">{user.role.replace(/_/g, ' ')}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
              </div>
            )}
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

        {/* Scrollable main content */}
        <main className="flex-grow p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}