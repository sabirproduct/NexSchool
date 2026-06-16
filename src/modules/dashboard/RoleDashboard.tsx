import { useAuthStore } from '../../store/authStore';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { SchoolAdminDashboard } from './SchoolAdminDashboard';
import { PrincipalDashboard } from './PrincipalDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { AccountantDashboard } from './AccountantDashboard';
import { HostelWardenDashboard } from './HostelWardenDashboard';
import { UserRole } from '../../types';

const DASHBOARD_LABELS: Record<UserRole, { title: string; subtitle: string; gradient: string }> = {
  super_admin: {
    title: 'Super Admin Command Center',
    subtitle: 'Multi-school ecosystem health & performance monitoring',
    gradient: 'from-indigo-600 via-purple-600 to-pink-500',
  },
  school_admin: {
    title: 'School Operations Dashboard',
    subtitle: 'Complete oversight & control center for your institution',
    gradient: 'from-emerald-500 to-teal-600',
  },
  principal: {
    title: 'Academic Leadership Dashboard',
    subtitle: 'Performance-driven insights for academic excellence',
    gradient: 'from-blue-600 to-indigo-600',
  },
  teacher: {
    title: 'My Classroom Dashboard',
    subtitle: 'Track class performance, engagement & student progress',
    gradient: 'from-violet-500 to-purple-600',
  },
  accountant: {
    title: 'Finance & Accounts Dashboard',
    subtitle: 'Real-time fee collection, revenue tracking & financial analytics',
    gradient: 'from-emerald-500 to-teal-600',
  },
  hostel_warden: {
    title: 'Hostel Management Dashboard',
    subtitle: 'Track occupancy, maintenance, student welfare & block-wise operations',
    gradient: 'from-orange-500 to-rose-600',
  },
  student: {
    title: 'Student Portal',
    subtitle: 'Track your academics, attendance, timetable and more',
    gradient: 'from-indigo-500 to-purple-600',
  },
  parent: {
    title: 'Parent Portal',
    subtitle: 'Track your children\'s academic progress, attendance, fees, and more',
    gradient: 'from-emerald-500 to-teal-600',
  },
};

export function RoleDashboard() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role || 'school_admin';

  const renderDashboard = () => {
    switch (role) {
      case 'super_admin': return <SuperAdminDashboard />;
      case 'school_admin': return <SchoolAdminDashboard />;
      case 'principal': return <PrincipalDashboard />;
      case 'teacher': return <TeacherDashboard />;
      case 'accountant': return <AccountantDashboard />;
      case 'hostel_warden': return <HostelWardenDashboard />;
      case 'student':
      case 'parent':
        // Students and parents have their own portals, so dashboard redirects to them
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <div className="text-5xl mb-4">
              {role === 'student' ? '👨‍🎓' : '👨‍👩‍👧‍👦'}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Welcome to {role === 'student' ? 'Student' : 'Parent'} Portal
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Use the sidebar navigation to access your {role === 'student' ? 'Student Portal' : 'Parent Portal'} for complete details on academics, attendance, fees, and more.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <span className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium">
                → Go to {role === 'student' ? 'Student Portal' : 'Parent Portal'}
              </span>
            </div>
          </div>
        );
      default: return <SchoolAdminDashboard />;
    }
  };

  const labels = DASHBOARD_LABELS[role];

  return (
    <div className="space-y-6">
      {renderDashboard()}
    </div>
  );
}