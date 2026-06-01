import { AttendanceStatusChip } from './AttendanceStatusChip';
import { TeacherAttendanceRecord } from '../types';

export function TeacherAttendanceTable({ rows }: { rows: TeacherAttendanceRecord[] }) {
  return (
    <div className="table-responsive">
      <table className="table table-sm table-bordered align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Check-in</th>
            <th>Check-out</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.attendanceId}>
              <td>{r.teacherName}</td>
              <td>{r.staffType}</td>
              <td><AttendanceStatusChip status={r.status} /></td>
              <td>{r.checkIn ?? '-'}</td>
              <td>{r.checkOut ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
