import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { RouteGuard } from './RouteGuard';
import { LoginPage } from '../features/auth/LoginPage';
import { DashboardPage } from '../features/dashboard/Page';
import { StudentsPage } from '../features/students/Page';
import { AdmissionsPage } from '../features/admissions/Page';
import { AttendancePage } from '../features/attendance/Page';
import { AcademicsPage } from '../features/academics/Page';
import { ExamsPage } from '../features/exams/Page';
import { FeesPage } from '../features/fees/Page';
import { HostelPage } from '../features/hostel/Page';
import { NotificationsPage } from '../features/notifications/Page';
import { ParentPage } from '../features/parent/Page';
import { StudentPage } from '../features/student/Page';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RouteGuard />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/hostel" element={<HostelPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/parent" element={<ParentPage />} />
          <Route path="/student" element={<StudentPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
