import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { RouteGuard } from './RouteGuard';
import { LoginPage } from '../features/auth/LoginPage';
import { DashboardPage } from '../features/dashboard/Page';
import { StudentsPage } from '../features/students/Page';
import { AddStudentPage, EditStudentPage, StudentDetailsPage, StudentPromotionPage } from '../modules/students/pages';
import { AdmissionsPage } from '../features/admissions/Page';
import { AttendancePage } from '../features/attendance/Page';
import { QRAttendancePage } from '../modules/attendance/pages';
import { AcademicsPage } from '../features/academics/Page';
import { ExamsPage } from '../features/exams/Page';
import { FeesPage } from '../features/fees/Page';
import { HostelPage } from '../features/hostel/Page';
import { SafetyPage } from '../features/safety/Page';
import { HealthPage } from '../features/health/Page';
import { ScholarshipPage } from '../features/scholarship/Page';
import { NotificationsPage } from '../features/notifications/Page';
import { ParentPage } from '../features/parent/Page';
import { StudentPage } from '../features/student/Page';
import { SystemPage } from '../features/system/Page';
import { initializeFirestore } from '../services/firestoreSeed';
import { useAuthStore } from '../store/authStore';

export function App() {
  const initialize = useAuthStore((s) => s.initialize);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    // Initialize Firestore & Auth on app startup
    initializeFirestore().catch((err) => console.error('Firestore initialization error:', err));
    initialize();
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RouteGuard />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/new" element={<AddStudentPage />} />
          <Route path="/students/:id" element={<StudentDetailsPage />} />
          <Route path="/students/:id/edit" element={<EditStudentPage />} />
          <Route path="/students/promotions" element={<StudentPromotionPage />} />
          <Route path="/admissions/*" element={<AdmissionsPage />} />
          <Route path="/attendance/*" element={<AttendancePage />} />
          <Route path="/qr-attendance" element={<QRAttendancePage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/hostel" element={<HostelPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/scholarship" element={<ScholarshipPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/parent" element={<ParentPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/system" element={<SystemPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}