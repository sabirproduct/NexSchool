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

function titleCase(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ');
}

export function StudentDetailsPage() {
  const { id = '' } = useParams();
  const [student, setStudent] = useState<StudentWithBinaries | null>(null);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getStudentById(id).then((s) => {
      if (s) {
        setStudent(s as StudentWithBinaries);
      } else {
        setStudent(null);
      }
    }).catch(() => {
      setStudent(null);
    }).finally(() => setLoading(false));
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

  const handleSendNotice = () => {
    if (!student) return;
    const phone = student.parent.guardianMobile;
    // Clean the phone number (remove any non-digit characters except leading +)
    const cleanedPhone = phone.replace(/[^0-9+]/g, '');
    const message = encodeURIComponent(noticeMessage);
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setShowNoticeModal(false);
    setNoticeMessage('');
  };

  const handlePrintProfile = () => {
    if (!student) return;

    const schoolName = 'NexSchool';
    const photoSrc = photoBinary || student.photoUrl || '';

    const personalInfo: [string, string][] = [
      ['First Name', student.firstName],
      ['Last Name', student.lastName],
      ['Gender', student.gender],
      ['Date of Birth', student.dob],
      ['Blood Group', student.bloodGroup || '-'],
      ['Religion', student.religion || '-'],
      ['Category', student.category || '-'],
      ['Email', student.email || '-'],
      ['Mobile', student.mobile],
    ];

    const parentInfo: [string, string][] = [
      ['Father Name', student.parent.fatherName],
      ['Mother Name', student.parent.motherName],
      ['Guardian Name', student.parent.guardianName],
      ['Guardian Mobile', student.parent.guardianMobile],
      ['Guardian Email', student.parent.guardianEmail || '-'],
      ['Occupation', student.parent.occupation || '-'],
      ['Annual Income', student.parent.annualIncome || '-'],
    ];

    const academicInfo: [string, string][] = [
      ['Admission Number', student.academic.admissionNo],
      ['Roll Number', student.academic.rollNo],
      ['Admission Date', student.academic.admissionDate],
      ['Class', student.academic.classId],
      ['Section', student.academic.sectionId],
      ['Session', student.academic.session],
      ['Previous School', student.academic.previousSchool || '-'],
      ['Student Type', student.academic.studentType === 'residential' ? 'Residential' : 'Day Scholar'],
    ];

    const addressInfo: [string, string][] = [
      ['Address', student.address.addressLine],
      ['State', student.address.state],
      ['District', student.address.district],
      ['City', student.address.city],
      ['Pin Code', student.address.pinCode],
    ];

    const hostelInfo: [string, string][] = student.hostel
      ? [
          ['Hostel Name', student.hostel.hostelName],
          ['Room Number', student.hostel.roomNo],
          ['Bed Number', student.hostel.bedNo],
          ['Warden Name', student.hostel.wardenName],
          ['Joining Date', student.hostel.joiningDate],
        ]
      : [['Hostel', 'Not applicable']];

    const aadhaarInfo: [string, string][] = [['Aadhaar No', student.aadhaarNo || '-']];

    const renderTable = (title: string, rows: Array<[string, string]>) => `
      <h3 style="font-size:14px;margin:16px 0 8px;color:#1e3a5f;border-bottom:2px solid #1d4ed8;padding-bottom:4px;">${title}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:8px;">
        ${rows.map(([key, value]) => `
          <tr>
            <td style="padding:4px 8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;width:180px;color:#475569;">${key}</td>
            <td style="padding:4px 8px;border:1px solid #e2e8f0;color:#1e293b;">${value}</td>
          </tr>
        `).join('')}
      </table>
    `;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Student Profile - ${student.fullName}</title>
        <style>
          @page { margin: 15mm; }
          body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 20px;
            color: #1e293b;
            background: #fff;
          }
          .header {
            display: flex;
            align-items: center;
            gap: 20px;
            padding-bottom: 16px;
            border-bottom: 3px solid #1d4ed8;
            margin-bottom: 20px;
          }
          .photo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 2px solid #e2e8f0;
            object-fit: cover;
          }
          .photo-placeholder {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #1d4ed8;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: 700;
          }
          .student-name {
            font-size: 22px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 4px;
          }
          .student-meta {
            font-size: 13px;
            color: #64748b;
            margin: 0;
          }
          .school-name {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #1d4ed8;
            margin: 0 0 4px;
          }
          .status-badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            margin-top: 4px;
          }
          .status-active { background: #dcfce7; color: #166534; }
          .table-section { margin-bottom: 8px; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${photoSrc ? `<img src="${photoSrc}" alt="Photo" class="photo" />` : `<div class="photo-placeholder">${student.firstName[0]}</div>`}
          <div>
            <p class="school-name">${schoolName}</p>
            <h1 class="student-name">${titleCase(student.fullName)}</h1>
            <p class="student-meta">Admission: ${student.academic.admissionNo} • Roll: ${student.academic.rollNo}</p>
            <p class="student-meta">Class ${student.academic.classId}-${student.academic.sectionId} • ${student.mobile}</p>
            <span class="status-badge ${student.status === 'active' ? 'status-active' : ''}">${titleCase(student.status)}</span>
          </div>
        </div>

        ${renderTable('Personal Information', personalInfo)}
        ${renderTable('Parent / Guardian Information', parentInfo)}
        ${renderTable('Academic Information', academicInfo)}
        ${renderTable('Address Details', addressInfo)}
        ${renderTable('Aadhaar Details', aadhaarInfo)}
        ${renderTable('Hostel Information', hostelInfo)}

        <div style="margin-top:24px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;text-align:center;">
          Generated by NexSchool on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    const win = window.open('', '_blank', 'width=800,height=600');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-3" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="text-slate-500">Loading student data...</p>
      </div>
    </div>
  );

  if (!student) return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <p className="text-red-700">Student not found or could not be loaded.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <StudentProfileHeader student={student} photoBinary={photoBinary} />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShowNoticeModal(true)}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          Send Notice
        </button>
        <button
          type="button"
          onClick={handlePrintProfile}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          Print Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Personal Info" rows={[
          ['First Name', student.firstName], ['Last Name', student.lastName], ['Gender', student.gender], ['Date of Birth', student.dob],
          ['Blood Group', student.bloodGroup || '-'], ['Religion', student.religion || '-'], ['Category', student.category || '-'], ['Email', student.email || '-'], ['Mobile', student.mobile],
        ]} />
        <InfoCard title="Parent Info" rows={[
          ['Father Name', student.parent.fatherName], ['Mother Name', student.parent.motherName], ['Guardian Name', student.parent.guardianName], ['Guardian Mobile', student.parent.guardianMobile],
          ['Guardian Email', student.parent.guardianEmail || '-'], ['Occupation', student.parent.occupation || '-'], ['Annual Income', student.parent.annualIncome || '-'],
        ]} />
        <InfoCard title="Academic Info" rows={[
          ['Admission Number', student.academic.admissionNo], ['Roll Number', student.academic.rollNo], ['Admission Date', student.academic.admissionDate], ['Class', student.academic.classId],
          ['Section', student.academic.sectionId], ['Session', student.academic.session], ['Previous School', student.academic.previousSchool || '-'], ['Student Type', student.academic.studentType === 'residential' ? 'Residential' : 'Day Scholar'],
        ]} />
        <InfoCard title="Aadhaar & Contact" rows={[
          ['Aadhaar No', student.aadhaarNo || '-'],
          ['Address', student.address.addressLine],
          ['State', student.address.state],
          ['District', student.address.district],
          ['City', student.address.city],
          ['Pin Code', student.address.pinCode],
        ]} />
        <InfoCard title="Attendance Summary" rows={[['Present Days', 'Placeholder'], ['Absent Days', 'Placeholder'], ['Attendance %', 'Placeholder']]} />
        <InfoCard title="Hostel Info" rows={student.hostel ? [
          ['Hostel Name', student.hostel.hostelName], ['Room Number', student.hostel.roomNo], ['Bed Number', student.hostel.bedNo], ['Warden Name', student.hostel.wardenName], ['Joining Date', student.hostel.joiningDate],
        ] : [['Student Type', 'Day Scholar'], ['Hostel', 'Not applicable']]} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Uploaded Documents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <div className="rounded-xl border border-slate-200 p-3 text-center" key={doc.label}>
              {doc.src ? (
                <img
                  src={doc.src}
                  alt={doc.label}
                  className="w-full rounded-lg mb-2 cursor-pointer"
                  style={{ maxHeight: 150, objectFit: 'contain' }}
                  onClick={() => setPreviewDoc(doc.src!)}
                />
              ) : (
                <div className="flex items-center justify-center bg-slate-100 rounded-lg mb-2" style={{ height: 120 }}>
                  <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <p className="text-xs text-slate-600 truncate mb-1">{doc.label}</p>
              {!doc.src && <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">Not uploaded</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Send Notice Modal */}
      {showNoticeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => { setShowNoticeModal(false); setNoticeMessage(''); }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Send Notice via WhatsApp</h3>

            <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Guardian:</span> {student.parent.guardianName}
              </p>
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Mobile:</span> {student.parent.guardianMobile}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                rows={5}
                placeholder="Type your notice message here..."
                value={noticeMessage}
                onChange={(e) => setNoticeMessage(e.target.value)}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => { setShowNoticeModal(false); setNoticeMessage(''); }}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendNotice}
                disabled={!noticeMessage.trim()}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => setPreviewDoc(null)}
        >
          <div className="relative" style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            <button
              type="button"
              className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-sm hover:bg-slate-700"
              onClick={() => setPreviewDoc(null)}
            >
              ×
            </button>
            <img src={previewDoc} alt="Document Preview" className="max-h-[85vh] w-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-full">
      <h3 className="text-base font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {rows.map(([key, value]) => (
          <div className="flex justify-between items-center" key={key}>
            <span className="text-sm text-slate-500">{key}</span>
            <span className="text-sm font-semibold text-slate-800 ml-2 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}