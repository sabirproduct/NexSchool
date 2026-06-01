import { useState } from 'react';
import { AttendanceAnalyticsChart } from './AttendanceAnalyticsChart';
import { AttendanceCalendar } from './AttendanceCalendar';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceReportGenerator } from './AttendanceReportGenerator';
import { AttendanceSummaryCard } from './AttendanceSummaryCard';
import { AttendanceTable } from './AttendanceTable';
import { HostelAttendanceTable } from './HostelAttendanceTable';
import { TeacherAttendanceTable } from './TeacherAttendanceTable';
import { useAttendanceStore } from '../store/useAttendanceStore';

export function AttendanceModuleView() {
  const [tab, setTab] = useState(0);
  const { studentRecords, hostelRecords, teacherRecords, markAllPresent, setStudentStatus } = useAttendanceStore();
  const absent = studentRecords.filter((x) => x.status === 'Absent').length;
  const late = studentRecords.filter((x) => x.status === 'Late').length;
  const summaryData = [
    ["Today's Attendance %", '92%'],
    ['Present Students', studentRecords.length - absent],
    ['Absent Students', absent],
    ['Late Entries', late],
    ['Hostel Attendance', '96%'],
    ['Teacher Attendance', '94%'],
  ];

  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h2 className="h4 fw-bold">Attendance Management</h2>
      </div>

      <div className="row g-3 mb-4">
        {summaryData.map(([title, value]) => (
          <div className="col-12 col-md-4 col-lg-2" key={String(title)}>
            <AttendanceSummaryCard title={String(title)} value={value as string | number} />
          </div>
        ))}
      </div>

      <AttendanceAnalyticsChart />

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <AttendanceFilters />

          <div className="d-flex flex-wrap gap-2 mb-3">
            <button type="button" className="btn btn-primary" onClick={markAllPresent}>
              Quick Present-All
            </button>
            <button type="button" className="btn btn-outline-secondary">Save Draft (placeholder)</button>
            <button type="button" className="btn btn-outline-secondary">Lock Attendance</button>
          </div>

          <ul className="nav nav-tabs mb-3">
            {['Student', 'Hostel', 'Teacher & Staff', 'Reports', 'Student Details', 'Integrations'].map((label, index) => (
              <li className="nav-item" key={label}>
                <button
                  type="button"
                  className={`nav-link ${tab === index ? 'active' : ''}`}
                  onClick={() => setTab(index)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            {tab === 0 && <AttendanceTable rows={studentRecords} onStatusChange={setStudentStatus} />}
            {tab === 1 && <HostelAttendanceTable rows={hostelRecords} />}
            {tab === 2 && <TeacherAttendanceTable rows={teacherRecords} />}
            {tab === 3 && <AttendanceReportGenerator />}
            {tab === 4 && <AttendanceCalendar />}
            {tab === 5 && <div className="alert alert-info">QR/RFID/Biometric, GPS, Offline Sync, Parent SMS/WhatsApp integrations are architecture-ready placeholders.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
