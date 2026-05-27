import { AttendanceStatusChip } from './AttendanceStatusChip';
import { StudentAttendanceRecord } from '../types';

const statuses: StudentAttendanceRecord['status'][] = ['Present', 'Absent', 'Late', 'Half Day', 'Leave'];

interface Props {
  rows: StudentAttendanceRecord[];
  onStatusChange: (id: string, status: StudentAttendanceRecord['status'], remarks?: string) => void;
}

export function AttendanceTable({ rows, onStatusChange }: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-sm table-bordered align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Roll</th>
            <th>Name</th>
            <th>Status</th>
            <th>Quick Edit</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.attendanceId}>
              <td>{r.rollNumber}</td>
              <td>{r.studentName}</td>
              <td><AttendanceStatusChip status={r.status} /></td>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={r.status}
                  onChange={(e) => onStatusChange(r.attendanceId, e.target.value as StudentAttendanceRecord['status'], r.remarks)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  className="form-control form-control-sm"
                  value={r.remarks ?? ''}
                  onChange={(e) => onStatusChange(r.attendanceId, r.status, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
