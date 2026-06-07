import { useRef, useCallback, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Student } from '../types';
import { StudentAdmissionFormValues } from './StudentForm';

interface AdmissionPrintViewProps {
  student: Student;
  formValues: StudentAdmissionFormValues;
  onClose: () => void;
}

export function AdmissionPrintView({ student, formValues, onClose }: AdmissionPrintViewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = useCallback(async () => {
    if (!printRef.current) return;
    setDownloading(true);

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 794, // A4 width at 96dpi
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Admission_Form_${student.academic.admissionNo}_${student.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback to window print
      window.print();
    } finally {
      setDownloading(false);
    }
  }, [student]);

  return (
    <>
      {/* Action bar - hidden when printing */}
      <div className="no-print sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Admission Form - {student.fullName}
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Back to Form
          </button>
        </div>
      </div>

      {/* A4 Print Content - this gets captured by html2canvas */}
      <div ref={printRef} className="flex justify-center bg-slate-100 py-8" style={{ minHeight: '297mm' }}>
        <div className="w-[210mm] bg-white shadow-xl" style={{ padding: '10mm' }}>
          {/* ===== PAGE 1: Main Details ===== */}
          <div className="mb-8 pb-8" style={{ borderBottom: '2px solid #1d4ed8' }}>
            <div className="text-center mb-6" style={{ borderBottom: '2px solid #1d4ed8', paddingBottom: '4mm' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e3a5f', margin: 0 }}>STUDENT ADMISSION FORM</h1>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Admission No: {student.academic.admissionNo}</p>
            </div>

            {/* Photo & Basic Info Row */}
            <div style={{ display: 'flex', gap: '6mm', marginBottom: '6mm' }}>
              {formValues.photoBinary && (
                <div style={{ flexShrink: 0 }}>
                  <img src={formValues.photoBinary} alt="Student Photo" style={{ width: '24mm', height: '28mm', objectFit: 'cover', border: '1px solid #cbd5e1', borderRadius: '2mm' }} />
                  <p style={{ fontSize: '9px', color: '#64748b', textAlign: 'center', margin: '1mm 0 0' }}>Student Photo</p>
                </div>
              )}
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Full Name', student.fullName],
                    ['Gender', student.gender.charAt(0).toUpperCase() + student.gender.slice(1)],
                    ['Date of Birth', student.dob],
                    ['Blood Group', student.bloodGroup || 'N/A'],
                    ['Religion', student.religion || 'N/A'],
                    ['Category', student.category || 'N/A'],
                    ['Aadhaar No', student.aadhaarNo || 'N/A'],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td style={{ fontWeight: 600, color: '#334155', width: '40mm', padding: '1mm 0' }}>{label}</td>
                      <td style={{ color: '#0f172a', padding: '1mm 0' }}>: {value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section helper */}
            {renderSection('Contact Information', [
              ['Mobile Number', student.mobile],
              ['Email', student.email || 'N/A'],
            ])}
            {renderSection('Parent / Guardian Information', [
              ["Father's Name", student.parent.fatherName],
              ["Mother's Name", student.parent.motherName],
              ['Guardian Name', student.parent.guardianName],
              ['Guardian Mobile', student.parent.guardianMobile],
              ['Guardian Email', student.parent.guardianEmail || 'N/A'],
              ['Occupation', student.parent.occupation || 'N/A'],
              ['Annual Income', student.parent.annualIncome || 'N/A'],
            ])}
            {renderSection('Academic Information', [
              ['Admission No', student.academic.admissionNo],
              ['Roll Number', student.academic.rollNo],
              ['Admission Date', student.academic.admissionDate],
              ['Class', student.academic.classId],
              ['Section', `Section ${student.academic.sectionId}`],
              ['Session', student.academic.session],
              ['Student Type', student.academic.studentType === 'residential' ? 'Residential' : 'Day Scholar'],
            ])}
            {renderSection('Address Information', [
              ['Address', student.address.addressLine],
              ['State', student.address.state],
              ['District', student.address.district],
              ['City', student.address.city],
              ['Pin Code', student.address.pinCode],
            ])}
            {student.hostel && renderSection('Hostel Information', [
              ['Hostel Name', student.hostel.hostelName],
              ['Room No', student.hostel.roomNo],
              ['Bed No', student.hostel.bedNo],
              ['Warden', student.hostel.wardenName],
              ['Joining Date', student.hostel.joiningDate],
            ])}

            {/* Footer */}
            <div style={{ marginTop: '8mm', paddingTop: '4mm', borderTop: '1px solid #e2e8f0', fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
              Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              <br />
              This is a computer-generated admission form.
            </div>
          </div>

          {/* ===== PAGE 2: Documents ===== */}
          <div>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #1d4ed8', paddingBottom: '4mm', marginBottom: '6mm' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a5f', margin: 0 }}>ATTACHED DOCUMENTS</h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Student: {student.fullName} ({student.academic.admissionNo})</p>
            </div>

            {formValues.documentsBinary && Object.keys(formValues.documentsBinary).length > 0 ? (
              <div>
                {renderDocImage('Birth Certificate', formValues.documentsBinary.birthCertificate)}
                {renderDocImage('Transfer Certificate', formValues.documentsBinary.transferCertificate)}
                {renderDocImage('Aadhaar Card', formValues.documentsBinary.aadhaar)}
                {renderDocImage('Previous Marksheet', formValues.documentsBinary.previousMarksheet)}
                {renderDocImage('Other Documents', formValues.documentsBinary.otherDocuments)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '12mm 0', color: '#64748b' }}>
                <p>No documents were uploaded with this admission.</p>
              </div>
            )}

            {/* Photo again */}
            {formValues.photoBinary && (
              <div style={{ marginTop: '8mm', paddingTop: '6mm', borderTop: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: 600, fontSize: '12px', color: '#334155', marginBottom: '2mm' }}>Student Photo</h4>
                <img src={formValues.photoBinary} alt="Student Photo" style={{ maxWidth: '150px', border: '1px solid #cbd5e1', borderRadius: '2mm' }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** Render a labeled section with rows */
function renderSection(title: string, rows: [string, string][]) {
  return (
    <div style={{ marginBottom: '5mm' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1d4ed8', borderBottom: '1px solid #bfdbfe', paddingBottom: '1mm', marginBottom: '3mm' }}>{title}</h3>
      <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td style={{ fontWeight: 600, color: '#334155', width: '40mm', padding: '0.8mm 0', verticalAlign: 'top' }}>{label}</td>
              <td style={{ color: '#0f172a', padding: '0.8mm 0' }}>: {value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Render a document image with label */
function renderDocImage(label: string, src?: string) {
  if (!src) return null;
  return (
    <div style={{ marginBottom: '6mm', pageBreakInside: 'avoid' }}>
      <h4 style={{ fontWeight: 600, fontSize: '12px', color: '#334155', marginBottom: '2mm' }}>{label}</h4>
      <img src={src} alt={label} style={{ maxWidth: '100%', maxHeight: '80mm', objectFit: 'contain', border: '1px solid #cbd5e1', borderRadius: '2mm' }} />
    </div>
  );
}