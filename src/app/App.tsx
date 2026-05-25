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
import { AcademicsPage } from '../features/academics/Page';
import { ExamsPage } from '../features/exams/Page';
import { FeesPage } from '../features/fees/Page';
import { HostelPage } from '../features/hostel/Page';
import { NotificationsPage } from '../features/notifications/Page';
import { ParentPage } from '../features/parent/Page';
import { StudentPage } from '../features/student/Page';
import { initializeFirestore } from '../services/firestoreSeed';

export function App() {
  useEffect(() => {
    // Initialize Firestore on app startup
    initializeFirestore().catch((err) => console.error('Firestore initialization error:', err));
  }, []);

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
