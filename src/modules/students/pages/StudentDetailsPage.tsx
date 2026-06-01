import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StudentProfileHeader } from '../components/StudentProfileHeader';
import { getStudentById } from '../services/studentService';
import { Student } from '../types';

export function StudentDetailsPage() {
  const { id = '' } = useParams();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    getStudentById(id).then((s) => setStudent(s ?? null));
  }, [id]);

  const documents = useMemo(
    () => [
      { label: 'Birth Certificate', url: '#' },
      { label: 'Transfer Certificate', url: '#' },
      { label: 'Aadhaar (placeholder)', url: '#' },
      { label: 'Previous Marksheet', url: '#' },
      { label: 'Other Documents', url: '#' },
    ],
    []
  );

  if (!student) return <div className="p-3">Student not found.</div>;

  return (
    <div className="container-fluid p-0">
      <StudentProfileHeader student={student} />
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <InfoCard title="Personal Info" rows={[
            ['First Name', student.firstName], ['Last Name', student.lastName], ['Gender', student.gender], ['Date of Birth', student.dob],
            ['Blood Group', student.bloodGroup || '-'], ['Religion', student.religion || '-'], ['Category', student.category || '-'], ['Email', student.email || '-'], ['Mobile', student.mobile],
          ]} />
        </div>
        <div className="col-12 col-md-6">
          <InfoCard title="Parent Info" rows={[
            ['Father Name', student.parent.fatherName], ['Mother Name', student.parent.motherName], ['Guardian Name', student.parent.guardianName], ['Guardian Mobile', student.parent.guardianMobile],
            ['Guardian Email', student.parent.guardianEmail || '-'], ['Occupation', student.parent.occupation || '-'], ['Annual Income', student.parent.annualIncome || '-'],
          ]} />
        </div>
        <div className="col-12 col-md-6">
          <InfoCard title="Academic Info" rows={[
            ['Admission Number', student.academic.admissionNo], ['Roll Number', student.academic.rollNo], ['Admission Date', student.academic.admissionDate], ['Class', student.academic.classId],
            ['Section', student.academic.sectionId], ['Session', student.academic.session], ['Previous School', student.academic.previousSchool || '-'], ['Student Type', student.academic.studentType],
          ]} />
        </div>
        <div className="col-12 col-md-6">
          <InfoCard title="Attendance Summary" rows={[['Present Days', 'Placeholder'], ['Absent Days', 'Placeholder'], ['Attendance %', 'Placeholder']]} />
        </div>
        <div className="col-12 col-md-6">
          <InfoCard title="Fees Summary" rows={[['Outstanding', 'Placeholder'], ['Last Payment', 'Placeholder'], ['Status', 'Placeholder']]} />
        </div>
        <div className="col-12 col-md-6">
          <InfoCard title="Hostel Info" rows={student.hostel ? [
            ['Hostel Name', student.hostel.hostelName], ['Room Number', student.hostel.roomNo], ['Bed Number', student.hostel.bedNo], ['Warden Name', student.hostel.wardenName], ['Joining Date', student.hostel.joiningDate],
          ] : [['Student Type', 'Day Scholar'], ['Hostel', 'Not applicable']]} />
        </div>
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="h6 mb-3">Uploaded Documents</h3>
              <ul className="list-group list-group-flush">
                {documents.map((doc) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={doc.label}>
                    <span>{doc.label}</span>
                    <Link to={doc.url} className="btn btn-sm btn-link">View</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h3 className="h6 mb-3">{title}</h3>
        <div className="row g-2">
          {rows.map(([key, value]) => (
            <div className="col-12" key={key}>
              <div className="d-flex justify-content-between">
                <span className="text-muted small">{key}</span>
                <span className="fw-semibold">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
