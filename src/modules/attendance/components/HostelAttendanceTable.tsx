import { AttendanceStatusChip } from './AttendanceStatusChip';
import { HostelAttendanceRecord } from '../types';

export function HostelAttendanceTable({ rows }: { rows: HostelAttendanceRecord[] }) {
  return (
    <div className="table-responsive">
      <table className="table table-sm table-bordered align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Student</th>
            <th>Hostel</th>
            <th>Room</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.recordId}>
              <td>{r.studentName}</td>
              <td>{r.hostelId}</td>
              <td>{r.roomId}</td>
              <td>{r.attendanceType}</td>
              <td><AttendanceStatusChip status={r.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
