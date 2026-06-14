import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmissionsStore } from '../store/useAdmissionsStore';
import { AdmissionStatusBadge } from '../components/AdmissionStatusBadge';
import { AdmissionFilters } from '../components/AdmissionFilters';

export function AdmissionManagementPage() {
  const navigate = useNavigate();
  const { applications, filters, setFilters, updateStatus } = useAdmissionsStore();
  const [tab, setTab] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = applications.filter((a) => {
    const matchSearch =
      !filters.search ||
      a.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
      a.mobile.includes(filters.search);
    const matchStatus = !filters.status || a.applicationStatus === filters.status;
    const matchType = !filters.studentType || a.studentType === filters.studentType;
    return matchSearch && matchStatus && matchType;
  });

  const openReject = (id: string) => {
    setSelectedId(id);
    setRejectReason('');
  };

  const confirmReject = () => {
    if (selectedId && rejectReason.trim()) {
      updateStatus(selectedId, 'Rejected', rejectReason);
    }
    setSelectedId(null);
  };

  const stats = [
    { label: 'Total Applications', value: applications.length, color: 'bg-blue-500' },
    { label: 'Pending Review', value: applications.filter((a) => a.applicationStatus === 'Submitted' || a.applicationStatus === 'Under Review').length, color: 'bg-yellow-500' },
    { label: 'Approved', value: applications.filter((a) => a.applicationStatus === 'Approved').length, color: 'bg-green-500' },
    { label: 'Rejected', value: applications.filter((a) => a.applicationStatus === 'Rejected').length, color: 'bg-red-500' },
    { label: 'Waiting List', value: applications.filter((a) => a.applicationStatus === 'Waiting List').length, color: 'bg-purple-500' },
    { label: 'Revenue', value: `₹${applications.filter((a) => a.admissionFeeStatus === 'Paid').length * 2500}`, color: 'bg-indigo-500' },
  ];

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admission Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage student applications, approvals, and payments</p>
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
        <nav className="flex gap-6 -mb-px">
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
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
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

      {/* Tab: Applications */}
      {tab === 0 && (
        <div>
          <AdmissionFilters
            search={filters.search}
            onSearch={(search) => setFilters({ ...filters, search })}
            onStatus={(status) => setFilters({ ...filters, status: status || undefined })}
            onType={(studentType) => setFilters({ ...filters, studentType: studentType || undefined })}
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
                          <span>{new Date(application.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
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
            onSearch={(search) => setFilters({ ...filters, search })}
            onStatus={(status) => setFilters({ ...filters, status: status || undefined })}
            onType={(studentType) => setFilters({ ...filters, studentType: studentType || undefined })}
          />
          <div className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">No applications pending review.</p>
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
                        {application.applicationStatus === 'Rejected' && application.rejectionReason && (
                          <div className="mt-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                            <span className="font-medium">Reason: </span>{application.rejectionReason}
                          </div>
                        )}
                        {application.applicationStatus === 'Approved' && (
                          <div className="mt-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                            ✓ This application has been approved.
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {application.applicationStatus !== 'Approved' && (
                          <button
                            type="button"
                            onClick={() => { updateStatus(application.id, 'Approved'); }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Approve
                          </button>
                        )}
                        {application.applicationStatus !== 'Waiting List' && (
                          <button
                            type="button"
                            onClick={() => { updateStatus(application.id, 'Waiting List'); }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Waiting List
                          </button>
                        )}
                        {application.applicationStatus !== 'Rejected' && (
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
                        )}
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
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-3xl mb-3">📞</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Admission Enquiries</h3>
          <p className="text-sm text-gray-500">Enquiry form with follow-up and convert-to-application workflow will appear here.</p>
        </div>
      )}

      {/* Tab: Fees */}
      {tab === 3 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-3xl mb-3">💰</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Admission Fees</h3>
          <p className="text-sm text-gray-500">Fee management with payment tracking, receipts, and gateway integration will appear here.</p>
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
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}