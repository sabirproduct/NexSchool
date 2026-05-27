import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAdmissionsStore } from '../store/useAdmissionsStore';
import { AdmissionApplication, AdmissionStatus } from '../types';
import { AdmissionFilters } from './AdmissionFilters';
import { AdmissionStatusBadge } from './AdmissionStatusBadge';

type FormValues = Pick<AdmissionApplication, 'studentFirstName' | 'studentLastName' | 'gender' | 'mobile' | 'email' | 'studentType' | 'applyingClassId' | 'guardianName'>;

function metric(label: string, value: string | number) {
  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <p className="text-muted small mb-1">{label}</p>
          <h3 className="h5 mb-0">{value}</h3>
        </div>
      </div>
    </div>
  );
}

export function AdmissionModuleView() {
  const { applications, filters, setFilters, upsertApplication, updateStatus } = useAdmissionsStore();
  const [tab, setTab] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const filtered = useMemo(
    () =>
      applications.filter((a) => {
        const matchSearch =
          !filters.search ||
          a.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
          a.mobile.includes(filters.search);
        const matchStatus = !filters.status || a.applicationStatus === filters.status;
        const matchType = !filters.studentType || a.studentType === filters.studentType;
        return matchSearch && matchStatus && matchType;
      }),
    [applications, filters]
  );

  const onSubmit = handleSubmit((values) => {
    const id = `app-${Date.now()}`;
    upsertApplication({
      id,
      applicationNo: `NS-2026-${String(applications.length + 1).padStart(4, '0')}`,
      fullName: `${values.studentFirstName} ${values.studentLastName}`,
      dob: '2012-01-01',
      hostelRequired: values.studentType === 'Residential',
      applicationStatus: 'Submitted',
      admissionFeeStatus: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...values,
    } as AdmissionApplication);
    reset();
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

  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h2 className="h4">Admission Management</h2>
      </div>

      <div className="row g-3 mb-4">
        {metric('Total Applications', applications.length)}
        {metric('Pending Applications', applications.filter((a) => a.applicationStatus === 'Submitted' || a.applicationStatus === 'Under Review').length)}
        {metric('Approved Admissions', applications.filter((a) => a.applicationStatus === 'Approved').length)}
        {metric('Rejected Applications', applications.filter((a) => a.applicationStatus === 'Rejected').length)}
        {metric('Waiting List', applications.filter((a) => a.applicationStatus === 'Waiting List').length)}
        {metric('Admission Revenue', `₹${applications.filter((a) => a.admissionFeeStatus === 'Paid').length * 2500}`)}
      </div>

      <ul className="nav nav-tabs mb-4">
        {['Online Form', 'Applications', 'Enquiries', 'Fees'].map((label, index) => (
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

      {tab === 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="h5 mb-3">Online Admission Form</h3>
            <div className="alert alert-info">Multi-step stepper, document uploads, draft save, and preview are scaffolded as module placeholders for API/Firebase wiring.</div>

            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">First Name</label>
                  <input className="form-control" {...register('studentFirstName', { required: true })} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Last Name</label>
                  <input className="form-control" {...register('studentLastName', { required: true })} />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Gender</label>
                  <select className="form-select" defaultValue="Male" {...register('gender')}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Mobile</label>
                  <input className="form-control" {...register('mobile', { required: true, minLength: 10 })} />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" {...register('email', { required: true })} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Guardian Name</label>
                  <input className="form-control" {...register('guardianName', { required: true })} />
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label">Applying Class</label>
                  <input className="form-control" {...register('applyingClassId', { required: true })} />
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label">Student Type</label>
                  <select className="form-select" defaultValue="Day Scholar" {...register('studentType')}>
                    <option value="Day Scholar">Day Scholar</option>
                    <option value="Residential">Residential</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-4">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="mb-4">
          <AdmissionFilters
            search={filters.search}
            onSearch={(search) => setFilters({ ...filters, search })}
            onStatus={(status) => setFilters({ ...filters, status: status || undefined })}
            onType={(studentType) => setFilters({ ...filters, studentType: studentType || undefined })}
          />
          <div className="row g-3 mt-3">
            {filtered.map((application) => (
              <div className="col-12" key={application.id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                      <div>
                        <h3 className="h6 mb-1">{application.fullName}</h3>
                        <p className="mb-0 text-muted">
                          {application.applicationNo} • Class {application.applyingClassId} • {application.mobile}
                        </p>
                      </div>
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        <AdmissionStatusBadge status={application.applicationStatus} />
                        <button type="button" className="btn btn-sm btn-outline-success" onClick={() => updateStatus(application.id, 'Approved')}>
                          Approve
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-warning" onClick={() => updateStatus(application.id, 'Waiting List')}>
                          Waiting
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => openReject(application.id)}>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 2 && <div className="alert alert-success">Admission enquiry form + follow-up and convert-to-application workflow placeholder is included in architecture plan.</div>}
      {tab === 3 && <div className="alert alert-warning">Admission fee module with Razorpay integration placeholder, receipt generation, and payment status tracking is scaffolded.</div>}

      {selectedId ? (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Application</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedId(null)} />
              </div>
              <div className="modal-body">
                <label className="form-label">Rejection reason</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedId(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmReject} disabled={!rejectReason.trim()}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
