import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StudentProfileHeader } from '../components/StudentProfileHeader';
import { getStudentById } from '../services/studentService';
import { Student } from '../types';

/** Extended student data with binary fields stored from admission form */
interface StudentWithBinaries extends Student {
  photoBinary?: string;
  documentsBinary?: Record<string, string>;
}

export function StudentDetailsPage() {
  const { id = '' } = useParams();
  const [student, setStudent] = useState<StudentWithBinaries | null>(null);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  useEffect(() => {
    getStudentById(id).then((s) => {
      if (s) {
        // Cast to include binary fields that may have been saved to Firestore
        setStudent(s as StudentWithBinaries);
      } else {
        setStudent(null);
      }
    });
  }, [id]);

  // Extract document labels from binary data
  const documents = useMemo(() => {
    if (!student) return [];
    const docs: { label: string; src?: string }[] = [];
    const binaries = (student as any).documentsBinary as Record<string, string> | undefined;
    if (binaries) {
      if (binaries.birthCertificate) docs.push({ label: 'Birth Certificate', src: binaries.birthCertificate });
      if (binaries.transferCertificate) docs.push({ label: 'Transfer Certificate', src: binaries.transferCertificate });
      if (binaries.aadhaar) docs.push({ label: 'Aadhaar Card', src: binaries.aadhaar });
      if (binaries.previousMarksheet) docs.push({ label: 'Previous Marksheet', src: binaries.previousMarksheet });
      if (binaries.otherDocuments) docs.push({ label: 'Other Documents', src: binaries.otherDocuments });
    }
    // Always show placeholder entries if no binaries
    if (docs.length === 0) {
      ['Birth Certificate', 'Transfer Certificate', 'Aadhaar Card', 'Previous Marksheet', 'Other Documents'].forEach((label) => {
        docs.push({ label });
      });
    }
    return docs;
  }, [student]);

  const photoBinary = student ? (student as any).photoBinary as string | undefined : undefined;

  if (!student) return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Loading student data...</p>
      </div>
    </div>
  );

  return (
    <div className="container-fluid p-0">
      <StudentProfileHeader student={student} photoBinary={photoBinary} />
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
            ['Section', student.academic.sectionId], ['Session', student.academic.session], ['Previous School', student.academic.previousSchool || '-'], ['Student Type', student.academic.studentType === 'residential' ? 'Residential' : 'Day Scholar'],
          ]} />
        </div>
        <div className="col-12 col-md-6">
          <InfoCard title="Aadhaar & Contact" rows={[
            ['Aadhaar No', student.aadhaarNo || '-'],
            ['Address', student.address.addressLine],
            ['State', student.address.state],
            ['District', student.address.district],
            ['City', student.address.city],
            ['Pin Code', student.address.pinCode],
          ]} />
        </div>
        <div className="col-12 col-md-6">
          <InfoCard title="Attendance Summary" rows={[['Present Days', 'Placeholder'], ['Absent Days', 'Placeholder'], ['Attendance %', 'Placeholder']]} />
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
              <div className="row g-3">
                {documents.map((doc) => (
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={doc.label}>
                    <div className="border rounded-2 p-2 text-center">
                      {doc.src ? (
                        <img
                          src={doc.src}
                          alt={doc.label}
                          className="img-fluid rounded mb-2 cursor-pointer"
                          style={{ maxHeight: 150, objectFit: 'contain', cursor: 'pointer' }}
                          onClick={() => setPreviewDoc(doc.src!)}
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center bg-light rounded mb-2" style={{ height: 120 }}>
                          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <p className="small mb-0 text-truncate">{doc.label}</p>
                      {!doc.src && <span className="badge bg-secondary mt-1">Not uploaded</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => setPreviewDoc(null)}
        >
          <div className="position-relative" style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            <button
              type="button"
              className="position-absolute top-0 end-0 btn btn-sm btn-dark rounded-circle m-2"
              onClick={() => setPreviewDoc(null)}
              style={{ zIndex: 1 }}
            >
              ×
            </button>
            <img src={previewDoc} alt="Document Preview" className="img-fluid" style={{ maxHeight: '85vh' }} />
          </div>
        </div>
      )}
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
