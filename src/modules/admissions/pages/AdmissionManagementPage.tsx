import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useAdmissionsStore } from '../store/useAdmissionsStore';
import { AdmissionStatusBadge } from '../components/AdmissionStatusBadge';
import { AdmissionFilters } from '../components/AdmissionFilters';
import {
  subscribeToAdmissionApplications,
  subscribeToAdmissionEnquiries,
  subscribeToAdmissionFees,
  updateApplicationStatus,
  approveAdmissionTransaction,
  rejectAdmissionApplication,
  updateAdmissionEnquiry,
  acknowledgeEnquiry,
  sendMessage,
  generateApplicationNo,
  submitAdmissionApplication,
  createAdmissionEnquiry,
  formatDate,
  formatDateTime,
} from '../services/admissionService';
import { AdmissionApplication, AdmissionEnquiry, PaymentMethod } from '../types';

export function AdmissionManagementPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    applications, setApplications,
    enquiries, setEnquiries,
    feeRecords, setFeeRecords,
    setLoading, setError, loading,
  } = useAdmissionsStore();

  const [tab, setTab] = useState(0);
  const [filters, setFiltersState] = useState({ search: '' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [messageModal, setMessageModal] = useState<{ id: string; name: string; mobile: string } | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<'sms' | 'email'>('sms');
  const [detailView, setDetailView] = useState<AdmissionApplication | null>(null);
  const [enquiryForm, setEnquiryForm] = useState(false);
  const [newEnquiry, setNewEnquiry] = useState({ studentName: '', guardianName: '', mobile: '', email: '', applyingClassId: '', message: '' });
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [printApp, setPrintApp] = useState<AdmissionApplication | null>(null);

  const tenantId = user?.schoolId || 'school_001';

  // Subscribe to Firestore collections
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubApps = subscribeToAdmissionApplications(
      tenantId,
      (data) => { setApplications(data); setLoading(false); },
      (err) => { setError(err.message); setLoading(false); }
    );

    const unsubEnqs = subscribeToAdmissionEnquiries(
      tenantId,
      (data) => { setEnquiries(data); },
      (err) => { console.error('Enquiry subscription error:', err); }
    );

    const unsubFees = subscribeToAdmissionFees(
      tenantId,
      (data) => { setFeeRecords(data); },
      (err) => { console.error('Fee subscription error:', err); }
    );

    return () => {
      unsubApps();
      unsubEnqs();
      unsubFees();
    };
  }, [tenantId, setApplications, setEnquiries, setFeeRecords, setLoading, setError]);

  // Filters
  const filtered = applications.filter((a) => {
    const matchSearch =
      !filters.search ||
      a.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      a.mobile?.includes(filters.search);
    return matchSearch;
  });

  const filteredEnquiries = enquiries.filter((e) => {
    const matchSearch =
      !filters.search ||
      e.studentName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      e.mobile?.includes(filters.search);
    return matchSearch;
  });

  const openReject = (id: string) => {
    setSelectedId(id);
    setRejectReason('');
  };

  const confirmReject = async () => {
    if (selectedId && rejectReason.trim()) {
      await rejectAdmissionApplication(selectedId, rejectReason, user?.uid || 'admin');
    }
    setSelectedId(null);
  };

  // Approve - just updates status, no student record created (that happens on Enroll)
  const handleApprove = async (application: AdmissionApplication) => {
    try {
      setLoading(true);
      await updateApplicationStatus(application.id, 'Approved', {
        reviewedBy: user?.uid || 'admin',
        reviewedAt: new Date().toISOString(),
      });
      // Send approval message to guardian
      await sendMessage({
        recipient: application.mobile,
        type: 'sms',
        message: `Dear ${application.guardianName}, your ward ${application.fullName}'s admission has been approved! You can now proceed with enrollment. - School Admin`,
      });
      setSendSuccess(`Application approved! Message sent to guardian. Proceed to Enroll when ready.`);
      setTimeout(() => setSendSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Send message to guardian
  const handleSendMessage = async () => {
    if (!messageModal || !messageText.trim()) return;
    await sendMessage({
      recipient: messageModal.mobile,
      type: messageType,
      subject: 'Admission Update',
      message: messageText,
    });
    setSendSuccess(`Message sent to ${messageModal.name}`);
    setTimeout(() => setSendSuccess(null), 5000);
    setMessageModal(null);
    setMessageText('');
  };

  // Enroll student - update status to Enrolled and navigate to student form
  const handleEnroll = async (application: AdmissionApplication) => {
    // Update status to Enrolled in Firestore
    await updateApplicationStatus(application.id, 'Enrolled');
    // Then navigate to student form with pre-populated data
    const params = new URLSearchParams({
      firstName: application.studentFirstName,
      lastName: application.studentLastName,
      gender: application.gender.toLowerCase(),
      dob: application.dob,
      mobile: application.mobile,
      email: application.email,
      guardianName: application.guardianName,
      guardianMobile: application.guardianMobile || application.mobile,
      bloodGroup: application.bloodGroup || '',
      religion: application.religion || '',
      category: application.category || '',
      address: application.address || '',
      city: application.city || '',
      state: application.state || '',
      district: application.district || '',
      pincode: application.pincode || '',
      classId: application.applyingClassId,
      studentType: application.studentType === 'Residential' ? 'residential' : 'day_scholar',
      admissionNo: application.applicationNo,
    });
    navigate(`/students/new?${params.toString()}`);
  };

  // Waiting list
  const handleWaitingList = async (id: string) => {
    await updateApplicationStatus(id, 'Waiting List');
  };

  // Enquiry: Convert to Application - navigate to form, status gets updated on form submission
  const handleConvertEnquiry = (enquiry: AdmissionEnquiry) => {
    const params = new URLSearchParams({
      enquiryId: enquiry.id,
      studentName: enquiry.studentName,
      guardianName: enquiry.guardianName,
      mobile: enquiry.mobile,
      email: enquiry.email || '',
      classId: enquiry.applyingClassId,
    });
    navigate(`/admissions/form?${params.toString()}`);
  };

  // Enquiry: Acknowledge - open message modal with acknowledgement template
  const handleAcknowledgeEnquiry = async (enquiry: AdmissionEnquiry) => {
    // First mark as acknowledged
    await acknowledgeEnquiry(enquiry.id);
    // Then open message modal to send communication
    setMessageModal({
      id: enquiry.id,
      name: enquiry.guardianName,
      mobile: enquiry.mobile,
    });
    setMessageText(`Dear ${enquiry.guardianName}, your enquiry for ${enquiry.studentName} has been received and acknowledged. We will contact you soon. - School Admin`);
  };

  // Enquiry: Send Message
  const handleEnquirySendMessage = (enquiry: AdmissionEnquiry) => {
    setMessageModal({
      id: enquiry.id,
      name: enquiry.guardianName,
      mobile: enquiry.mobile,
    });
    setMessageText(`Dear ${enquiry.guardianName}, regarding your enquiry for ${enquiry.studentName}'s admission...`);
  };

  // Enquiry: Add new
  const handleAddEnquiry = async () => {
    if (!newEnquiry.studentName || !newEnquiry.guardianName || !newEnquiry.mobile) return;
    const result = await createAdmissionEnquiry({
      id: '',
      tenantId,
      ...newEnquiry,
      status: 'New',
      acknowledged: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any);
    // Update local state with the Firestore-generated ID
    if (result?.id) {
      const newEnq = { ...result, id: result.id } as AdmissionEnquiry;
      setEnquiries([newEnq, ...enquiries]);
    }
    setNewEnquiry({ studentName: '', guardianName: '', mobile: '', email: '', applyingClassId: '', message: '' });
    setEnquiryForm(false);
    setSendSuccess('Enquiry submitted successfully');
    setTimeout(() => setSendSuccess(null), 5000);
  };

  // Print admission document
  const handlePrint = (application: AdmissionApplication) => {
    const html = `<!DOCTYPE html><html><head><title>Admission Document - ${application.fullName}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; }
  .header { text-align: center; border-bottom: 3px double #1d4ed8; padding-bottom: 20px; margin-bottom: 30px; }
  .header h1 { color: #1d4ed8; margin: 0; font-size: 28px; }
  .header p { color: #64748b; margin: 5px 0 0; }
  .section { margin-bottom: 25px; }
  .section h2 { font-size: 16px; color: #1d4ed8; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .field { margin-bottom: 8px; }
  .field label { font-size: 12px; color: #64748b; display: block; }
  .field span { font-size: 14px; font-weight: 500; color: #1e293b; }
  .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
  .status-Approved { background: #dcfce7; color: #166534; }
  .status-Submitted { background: #dbeafe; color: #1e40af; }
  .status-Rejected { background: #fee2e2; color: #991b1b; }
  .status-Waiting\\ List { background: #fef3c7; color: #92400e; }
  .payment-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-top: 10px; }
  .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  @media print { body { margin: 20px; } .no-print { display: none; } }
</style></head><body>
<div class="no-print" style="text-align:right;margin-bottom:20px"><button onclick="window.print()" style="padding:10px 20px;background:#1d4ed8;color:white;border:none;border-radius:6px;cursor:pointer">Print</button></div>
<div class="header">
  <h1>Admission Application</h1>
  <p>Application No: <strong>${application.applicationNo}</strong></p>
  <p><span class="status-badge status-${application.applicationStatus.replace(/\s/g, '\\\\ ')}">${application.applicationStatus}</span></p>
</div>
<div class="section">
  <h2>Student Information</h2>
  <div class="grid">
    <div class="field"><label>Full Name</label><span>${application.fullName}</span></div>
    <div class="field"><label>Gender</label><span>${application.gender}</span></div>
    <div class="field"><label>Date of Birth</label><span>${application.dob || 'N/A'}</span></div>
    <div class="field"><label>Blood Group</label><span>${application.bloodGroup || 'N/A'}</span></div>
    <div class="field"><label>Religion</label><span>${application.religion || 'N/A'}</span></div>
    <div class="field"><label>Category</label><span>${application.category || 'N/A'}</span></div>
    <div class="field"><label>Student Type</label><span>${application.studentType}</span></div>
    <div class="field"><label>Applying Class</label><span>Class ${application.applyingClassId}</span></div>
  </div>
</div>
<div class="section">
  <h2>Contact Information</h2>
  <div class="grid">
    <div class="field"><label>Guardian Name</label><span>${application.guardianName}</span></div>
    <div class="field"><label>Guardian Mobile</label><span>${application.guardianMobile || application.mobile}</span></div>
    <div class="field"><label>Mobile</label><span>${application.mobile}</span></div>
    <div class="field"><label>Email</label><span>${application.email}</span></div>
  </div>
</div>
<div class="section">
  <h2>Address</h2>
  <p>${application.address || 'N/A'}<br/>${application.city || ''}${application.city && application.state ? ', ' : ''}${application.state || ''} - ${application.pincode || ''}</p>
</div>
<div class="section">
  <h2>Payment Details</h2>
  <div class="payment-box">
    <div class="grid">
      <div class="field"><label>Fee Amount</label><span>₹${application.admissionFeeAmount || 0}</span></div>
      <div class="field"><label>Fee Status</label><span style="color:${application.admissionFeeStatus === 'Paid' ? '#166534' : '#92400e'}">${application.admissionFeeStatus}</span></div>
      <div class="field"><label>Payment Method</label><span>${application.paymentMethod || 'N/A'}</span></div>
      <div class="field"><label>Transaction ID</label><span>${application.paymentReference || 'N/A'}</span></div>
      <div class="field"><label>Paid At</label><span>${application.paymentDetails?.paidAt ? new Date(application.paymentDetails.paidAt).toLocaleString('en-IN') : 'N/A'}</span></div>
    </div>
  </div>
</div>
<div class="footer">
  <p>Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
  <p>This is a system-generated document</p>
</div>
<script>window.onload=function(){setTimeout(function(){window.print()},500)}</script>
</body></html>`;
    const win = window.open('', '_blank', 'width=800,height=600');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
  };

  const stats = [
    { label: 'Total Applications', value: applications.length, color: 'bg-blue-500' },
    { label: 'Pending Review', value: applications.filter((a) => a.applicationStatus === 'Submitted' || a.applicationStatus === 'Under Review').length, color: 'bg-yellow-500' },
    { label: 'Approved', value: applications.filter((a) => a.applicationStatus === 'Approved').length, color: 'bg-green-500' },
    { label: 'Rejected', value: applications.filter((a) => a.applicationStatus === 'Rejected').length, color: 'bg-red-500' },
    { label: 'Waiting List', value: applications.filter((a) => a.applicationStatus === 'Waiting List').length, color: 'bg-purple-500' },
    { label: 'Enrolled', value: applications.filter((a) => a.applicationStatus === 'Enrolled').length, color: 'bg-teal-500' },
  ];

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admission Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage student applications, approvals, enquiries, and payments</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admissions/form')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Application
        </button>
      </div>

      {/* Success Banner */}
      {sendSuccess && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {sendSuccess}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color} shrink-0`} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6 -mb-px overflow-x-auto">
          {[
            { id: 0, label: 'Applications', icon: '📋' },
            { id: 1, label: 'Admin Review', icon: '🛡️' },
            { id: 2, label: 'Enquiries', icon: '📞' },
            { id: 3, label: 'Fees', icon: '💰' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          <span className="ml-3 text-sm text-gray-500">Loading data from Firestore...</span>
        </div>
      )}

      {/* Tab: Applications */}
      {tab === 0 && (
        <div>
          <AdmissionFilters
            search={filters.search}
            onSearch={(search) => setFiltersState({ ...filters, search })}
            onStatus={() => {}}
            onType={() => {}}
          />
          <div className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">No applications found matching your filters.</p>
              </div>
            ) : (
              filtered.map((application) => (
                <div key={application.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-900 truncate">{application.fullName}</h3>
                          <AdmissionStatusBadge status={application.applicationStatus} />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                            {application.applicationNo}
                          </span>
                          <span>Class {application.applyingClassId}</span>
                          <span>{application.mobile}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            application.studentType === 'Residential' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
                          }`}>
                            {application.studentType}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                          <span className={`inline-flex items-center gap-1 ${
                            application.admissionFeeStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'
                          }`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                            </svg>
                            Fee: {application.admissionFeeStatus}
                          </span>
                          <span>•</span>
                          <span>{formatDate(application.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setDetailView(application)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePrint(application)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Print"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                          </svg>
                          Print
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Admin Review */}
      {tab === 1 && (
        <div>
          <AdmissionFilters
            search={filters.search}
            onSearch={(search) => setFiltersState({ ...filters, search })}
            onStatus={() => {}}
            onType={() => {}}
          />
          <div className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">No applications to review.</p>
              </div>
            ) : (
              filtered.map((application) => (
                <div key={application.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-900">{application.fullName}</h3>
                          <AdmissionStatusBadge status={application.applicationStatus} />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                          <span>{application.applicationNo}</span>
                          <span>Class {application.applyingClassId}</span>
                          <span>{application.mobile}</span>
                          <span>{application.email}</span>
                          <span>Guardian: {application.guardianName}</span>
                        </div>
                        {application.rejectionReason && (
                          <div className="mt-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                            <span className="font-medium">Rejected: </span>{application.rejectionReason}
                          </div>
                        )}
                        {application.applicationStatus === 'Approved' && (
                          <div className="mt-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                            ✓ Approved and student record created in the database.
                          </div>
                        )}
                        {application.applicationStatus === 'Enrolled' && (
                          <div className="mt-2 text-sm text-teal-600 bg-teal-50 rounded-lg px-3 py-2">
                            ✓ Enrolled successfully.
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handlePrint(application)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                          </svg>
                          Print
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailView(application)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          View
                        </button>
                        {application.applicationStatus === 'Submitted' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(application)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleWaitingList(application.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Waiting List
                            </button>
                            <button
                              type="button"
                              onClick={() => openReject(application.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject
                            </button>
                          </>
                        )}
                        {application.applicationStatus === 'Approved' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEnroll(application)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Enroll
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMessageModal({
                                  id: application.id,
                                  name: application.guardianName,
                                  mobile: application.mobile,
                                });
                                setMessageText(`Dear ${application.guardianName}, your ward ${application.fullName}'s admission has been approved. Please complete the remaining formalities. - School Admin`);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                              </svg>
                              Send Message
                            </button>
                          </>
                        )}
                        {application.applicationStatus === 'Waiting List' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(application)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMessageModal({
                                  id: application.id,
                                  name: application.guardianName,
                                  mobile: application.mobile,
                                });
                                setMessageText(`Dear ${application.guardianName}, your ward ${application.fullName} is on the waiting list. We will update you as soon as a seat becomes available. - School Admin`);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Send Message
                            </button>
                          </>
                        )}
                        {/* For Enrolled status, only show Print and View (already rendered above) */}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Enquiries */}
      {tab === 2 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Admission Enquiries</h3>
            <button
              type="button"
              onClick={() => setEnquiryForm(!enquiryForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {enquiryForm ? 'Cancel' : 'New Enquiry'}
            </button>
          </div>

          {/* New Enquiry Form */}
          {enquiryForm && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">New Admission Enquiry</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newEnquiry.studentName}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, studentName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newEnquiry.guardianName}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, guardianName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Enter guardian name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newEnquiry.mobile}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, mobile: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEnquiry.email}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Applying Class</label>
                  <select
                    value={newEnquiry.applyingClassId}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, applyingClassId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="">Select Class</option>
                    {['1','2','3','4','5','6','7','8','9','10','11','12'].map((c) => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={newEnquiry.message}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, message: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                    rows={2}
                    placeholder="Any additional message"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddEnquiry}
                  disabled={!newEnquiry.studentName || !newEnquiry.guardianName || !newEnquiry.mobile}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Enquiry
                </button>
              </div>
            </div>
          )}

          {/* Enquiry List */}
          <div className="space-y-3">
            {filteredEnquiries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-3xl mb-2">📞</p>
                <p className="text-gray-500 text-sm">No enquiries found.</p>
              </div>
            ) : (
              filteredEnquiries.map((enquiry, idx) => (
                <div key={enquiry.id || `enq-${idx}-${enquiry.mobile}`} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-900">{enquiry.studentName}</h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            enquiry.status === 'New' ? 'bg-blue-50 text-blue-700' :
                            enquiry.status === 'Contacted' ? 'bg-yellow-50 text-yellow-700' :
                            enquiry.status === 'Converted' ? 'bg-green-50 text-green-700' :
                            enquiry.status === 'Admission' ? 'bg-indigo-50 text-indigo-700' :
                            'bg-gray-50 text-gray-700'
                          }`}>
                            {enquiry.status}
                          </span>
                          {enquiry.acknowledged && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                              ✓ Acknowledged
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                          <span>{enquiry.guardianName}</span>
                          <span>{enquiry.mobile}</span>
                          {enquiry.email && <span>{enquiry.email}</span>}
                          <span>Class {enquiry.applyingClassId}</span>
                        </div>
                        {enquiry.message && (
                          <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                            "{enquiry.message}"
                          </div>
                        )}
                        {enquiry.convertedToApplicationId && (
                          <div className="mt-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                            ✓ Converted to application
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {enquiry.status !== 'Converted' && enquiry.status !== 'Admission' && enquiry.status !== 'Closed' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleConvertEnquiry(enquiry)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Convert to Admission
                            </button>
                            {!enquiry.acknowledged && (
                              <button
                                type="button"
                                onClick={() => handleAcknowledgeEnquiry(enquiry)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Acknowledge
                              </button>
                            )}
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEnquirySendMessage(enquiry)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Fees */}
      {tab === 3 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admission Fee Records</h3>
          {feeRecords.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-3xl mb-2">💰</p>
              <p className="text-gray-500 text-sm">No fee records found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Application No</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Student Name</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Payment Method</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Transaction ID</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {feeRecords.map((fee) => (
                      <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{fee.applicationNo}</td>
                        <td className="px-4 py-3 text-gray-700">{fee.studentName}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">₹{fee.feeAmount}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            fee.paymentMethod === 'UPI' ? 'bg-purple-50 text-purple-700' :
                            fee.paymentMethod === 'Cash' ? 'bg-green-50 text-green-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {fee.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{fee.paymentReference || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            fee.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                          }`}>
                            {fee.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {formatDate(fee.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                Total Records: {feeRecords.length} | Total Collected: ₹{feeRecords.reduce((sum, f) => sum + (f.status === 'Paid' ? f.feeAmount : 0), 0)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail View Modal */}
      {detailView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDetailView(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
              <button
                type="button"
                onClick={() => setDetailView(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Application No</p>
                  <p className="text-base font-semibold text-gray-900">{detailView.applicationNo}</p>
                </div>
                <AdmissionStatusBadge status={detailView.applicationStatus} />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Student Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Name:</span> <span className="font-medium">{detailView.fullName}</span></div>
                  <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{detailView.gender}</span></div>
                  <div><span className="text-gray-500">DOB:</span> <span className="font-medium">{detailView.dob || 'N/A'}</span></div>
                  <div><span className="text-gray-500">Blood Group:</span> <span className="font-medium">{detailView.bloodGroup || 'N/A'}</span></div>
                  <div><span className="text-gray-500">Religion:</span> <span className="font-medium">{detailView.religion || 'N/A'}</span></div>
                  <div><span className="text-gray-500">Category:</span> <span className="font-medium">{detailView.category || 'N/A'}</span></div>
                  <div><span className="text-gray-500">Student Type:</span> <span className="font-medium">{detailView.studentType}</span></div>
                  <div><span className="text-gray-500">Class:</span> <span className="font-medium">Class {detailView.applyingClassId}</span></div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Guardian:</span> <span className="font-medium">{detailView.guardianName}</span></div>
                  <div><span className="text-gray-500">Guardian Mobile:</span> <span className="font-medium">{detailView.guardianMobile || detailView.mobile}</span></div>
                  <div><span className="text-gray-500">Mobile:</span> <span className="font-medium">{detailView.mobile}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="font-medium">{detailView.email}</span></div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Address</h4>
                <p className="text-sm text-gray-700">
                  {detailView.address || 'N/A'}
                  {detailView.city && <><br/>{detailView.city}</>}
                  {detailView.state && <><br/>{detailView.state}</>}
                  {detailView.pincode && <> - {detailView.pincode}</>}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Fee Amount:</span> <span className="font-medium">₹{detailView.admissionFeeAmount || 0}</span></div>
                  <div><span className="text-gray-500">Fee Status:</span> <span className={`font-medium ${detailView.admissionFeeStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>{detailView.admissionFeeStatus}</span></div>
                  <div><span className="text-gray-500">Payment Method:</span> <span className="font-medium">{detailView.paymentMethod || 'N/A'}</span></div>
                  <div><span className="text-gray-500">Transaction ID:</span> <span className="font-medium">{detailView.paymentReference || 'N/A'}</span></div>
                  {detailView.paymentDetails?.paidAt && (
                    <div className="col-span-2"><span className="text-gray-500">Paid At:</span> <span className="font-medium">{new Date(detailView.paymentDetails.paidAt).toLocaleString('en-IN')}</span></div>
                  )}
                </div>
              </div>

              {detailView.rejectionReason && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-red-600 mb-2">Rejection Reason</h4>
                  <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{detailView.rejectionReason}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => handlePrint(detailView)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                </svg>
                Print Document
              </button>
              <button
                type="button"
                onClick={() => setDetailView(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Reject Application</h3>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rejection Reason</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                rows={3}
                placeholder="Provide a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="mt-3 text-xs text-gray-500">
                A rejection message will be sent to the guardian's mobile.
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await confirmReject();
                  // Send rejection message
                  if (selectedId && rejectReason.trim()) {
                    const app = applications.find(a => a.id === selectedId);
                    if (app) {
                      await sendMessage({
                        recipient: app.mobile,
                        type: 'sms',
                        message: `Dear ${app.guardianName}, your ward ${app.fullName}'s admission application has been rejected. Reason: ${rejectReason}. - School Admin`,
                      });
                    }
                  }
                }}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {messageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Send Message</h3>
              <button
                type="button"
                onClick={() => setMessageModal(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                Send message to: <span className="font-medium text-gray-900">{messageModal.name}</span> ({messageModal.mobile})
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMessageType('sms')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      messageType === 'sms'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageType('email')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      messageType === 'email'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Email
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setMessageModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}