import { Route, Routes } from 'react-router-dom';
import { AttendanceManagementPage, QRAttendancePage } from '../../modules/attendance/pages';

export function AttendancePage() {
  return (
    <Routes>
      <Route index element={<AttendanceManagementPage />} />
      <Route path="qr" element={<QRAttendancePage />} />
    </Routes>
  );
}