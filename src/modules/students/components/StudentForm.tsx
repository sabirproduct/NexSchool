import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { validateStudentPayload } from '../schemas/studentSchema';
import { isValidEmail, isValidMobile } from '../utils/validation';

const steps = ['Basic Information', 'Parent Information', 'Academic Information', 'Address Information', 'Hostel Information', 'Document Upload'];

export type StudentAdmissionFormValues = {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  bloodGroup?: string;
  religion?: string;
  category?: string;
  aadhaarNo?: string;
  mobile: string;
  email?: string;
  photo?: FileList;
  parent: {
    fatherName: string;
    motherName: string;
    guardianName: string;
    guardianMobile: string;
    guardianEmail?: string;
    occupation?: string;
    annualIncome?: string;
  };
  academic: {
    admissionNo: string;
    rollNo: string;
    admissionDate: string;
    classId: string;
    sectionId: string;
    session: string;
    previousSchool?: string;
    studentType: 'day_scholar' | 'residential';
  };
  address: {
    addressLine: string;
    state: string;
    district: string;
    city: string;
    pinCode: string;
  };
  hostel?: {
    hostelName?: string;
    roomNo?: string;
    bedNo?: string;
    wardenName?: string;
    joiningDate?: string;
  };
  documents?: {
    birthCertificate?: FileList;
    transferCertificate?: FileList;
    aadhaar?: FileList;
    previousMarksheet?: FileList;
    otherDocuments?: FileList;
  };
};

export function StudentForm({ defaultValues, onSubmit, mode }: { defaultValues?: Partial<StudentAdmissionFormValues>; onSubmit: (v: StudentAdmissionFormValues) => Promise<void> | void; mode: 'create' | 'edit' }) {
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState('');
  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm<StudentAdmissionFormValues>({ defaultValues: defaultValues as StudentAdmissionFormValues });
  const studentType = watch('academic.studentType', defaultValues?.academic?.studentType ?? 'day_scholar');

  const stepFields = useMemo(
    () => [
      ['firstName', 'lastName', 'gender', 'dob', 'mobile', 'email'],
      ['parent.fatherName', 'parent.motherName', 'parent.guardianName', 'parent.guardianMobile', 'parent.guardianEmail'],
      ['academic.admissionNo', 'academic.rollNo', 'academic.admissionDate', 'academic.classId', 'academic.sectionId', 'academic.session', 'academic.studentType'],
      ['address.addressLine', 'address.state', 'address.district', 'address.city', 'address.pinCode'],
      ['hostel.hostelName', 'hostel.roomNo', 'hostel.bedNo', 'hostel.wardenName', 'hostel.joiningDate'],
      ['documents.birthCertificate', 'documents.transferCertificate', 'documents.aadhaar', 'documents.previousMarksheet', 'documents.otherDocuments'],
    ],
    []
  );

  const onNext = async () => {
    if (step === 4 && studentType !== 'residential') {
      setStep((s) => s + 1);
      return;
    }

    const ok = await trigger(stepFields[step] as any);
    if (ok) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleFormSubmit = async (values: StudentAdmissionFormValues) => {
    const check = validateStudentPayload(values as any);
    if (!isValidMobile(values.mobile)) {
      setFormError('Mobile number must be 10 digits.');
      return;
    }
    if (values.email && !isValidEmail(values.email)) {
      setFormError('Please enter a valid email.');
      return;
    }
    if (!check.valid) {
      setFormError('Please fill all required fields.');
      return;
    }
    setFormError('');
    await onSubmit(values);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <ul className="nav nav-pills flex-wrap mb-3">
          {steps.map((label, index) => (
            <li className="nav-item" key={label}>
              <button type="button" className={`nav-link ${index === step ? 'active' : ''}`} onClick={() => setStep(index)}>
                {label}
              </button>
            </li>
          ))}
        </ul>

        {formError && <div className="alert alert-danger">{formError}</div>}

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          {step === 0 && (
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">First Name</label>
                <input className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} {...register('firstName', { required: true })} />
                {errors.firstName && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Last Name</label>
                <input className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} {...register('lastName', { required: true })} />
                {errors.lastName && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Gender</label>
                <select className="form-select" defaultValue="male" {...register('gender', { required: true })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Date of Birth</label>
                <input type="date" className={`form-control ${errors.dob ? 'is-invalid' : ''}`} {...register('dob', { required: true })} />
                {errors.dob && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Blood Group</label>
                <input className="form-control" {...register('bloodGroup')} />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Religion</label>
                <input className="form-control" {...register('religion')} />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Category</label>
                <input className="form-control" {...register('category')} />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Aadhaar Number (placeholder)</label>
                <input className="form-control" {...register('aadhaarNo')} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Mobile Number</label>
                <input className={`form-control ${errors.mobile ? 'is-invalid' : ''}`} {...register('mobile', { required: true, validate: (v) => isValidMobile(v) || 'Invalid mobile' })} />
                {errors.mobile && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Email</label>
                <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...register('email', { validate: (v) => !v || isValidEmail(v) || 'Invalid email' })} />
                {errors.email && <div className="invalid-feedback">Invalid email</div>}
              </div>
              <div className="col-12">
                <label className="btn btn-outline-secondary btn-sm">
                  Student Photo Upload
                  <input hidden type="file" accept="image/*" {...register('photo')} />
                </label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Father Name</label>
                <input className={`form-control ${errors.parent?.fatherName ? 'is-invalid' : ''}`} {...register('parent.fatherName', { required: true })} />
                {errors.parent?.fatherName && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Mother Name</label>
                <input className={`form-control ${errors.parent?.motherName ? 'is-invalid' : ''}`} {...register('parent.motherName', { required: true })} />
                {errors.parent?.motherName && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Guardian Name</label>
                <input className={`form-control ${errors.parent?.guardianName ? 'is-invalid' : ''}`} {...register('parent.guardianName', { required: true })} />
                {errors.parent?.guardianName && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Guardian Mobile</label>
                <input className={`form-control ${errors.parent?.guardianMobile ? 'is-invalid' : ''}`} {...register('parent.guardianMobile', { required: true })} />
                {errors.parent?.guardianMobile && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Guardian Email</label>
                <input className="form-control" {...register('parent.guardianEmail')} />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">Occupation</label>
                <input className="form-control" {...register('parent.occupation')} />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">Annual Income (placeholder)</label>
                <input className="form-control" {...register('parent.annualIncome')} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Admission Number</label>
                <input className="form-control" disabled={mode === 'edit'} {...register('academic.admissionNo', { required: true })} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Roll Number</label>
                <input className={`form-control ${errors.academic?.rollNo ? 'is-invalid' : ''}`} {...register('academic.rollNo', { required: true })} />
                {errors.academic?.rollNo && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Admission Date</label>
                <input type="date" className={`form-control ${errors.academic?.admissionDate ? 'is-invalid' : ''}`} {...register('academic.admissionDate', { required: true })} />
                {errors.academic?.admissionDate && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Class</label>
                <input className={`form-control ${errors.academic?.classId ? 'is-invalid' : ''}`} {...register('academic.classId', { required: true })} />
                {errors.academic?.classId && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Section</label>
                <input className={`form-control ${errors.academic?.sectionId ? 'is-invalid' : ''}`} {...register('academic.sectionId', { required: true })} />
                {errors.academic?.sectionId && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Session</label>
                <input className={`form-control ${errors.academic?.session ? 'is-invalid' : ''}`} {...register('academic.session', { required: true })} />
                {errors.academic?.session && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Previous School</label>
                <input className="form-control" {...register('academic.previousSchool')} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Student Type</label>
                <select className="form-select" defaultValue={studentType} {...register('academic.studentType', { required: true })}>
                  <option value="day_scholar">Day Scholar</option>
                  <option value="residential">Residential</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Address Line</label>
                <input className={`form-control ${errors.address?.addressLine ? 'is-invalid' : ''}`} {...register('address.addressLine', { required: true })} />
                {errors.address?.addressLine && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">State</label>
                <input className={`form-control ${errors.address?.state ? 'is-invalid' : ''}`} {...register('address.state', { required: true })} />
                {errors.address?.state && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">District</label>
                <input className={`form-control ${errors.address?.district ? 'is-invalid' : ''}`} {...register('address.district', { required: true })} />
                {errors.address?.district && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">City</label>
                <input className={`form-control ${errors.address?.city ? 'is-invalid' : ''}`} {...register('address.city', { required: true })} />
                {errors.address?.city && <div className="invalid-feedback">Required</div>}
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">Pin Code</label>
                <input className={`form-control ${errors.address?.pinCode ? 'is-invalid' : ''}`} {...register('address.pinCode', { required: true })} />
                {errors.address?.pinCode && <div className="invalid-feedback">Required</div>}
              </div>
            </div>
          )}

          {step === 4 && (
            studentType === 'residential' ? (
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Hostel Name</label>
                  <input className={`form-control ${errors.hostel?.hostelName ? 'is-invalid' : ''}`} {...register('hostel.hostelName', { required: true })} />
                  {errors.hostel?.hostelName && <div className="invalid-feedback">Required</div>}
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label">Room Number</label>
                  <input className={`form-control ${errors.hostel?.roomNo ? 'is-invalid' : ''}`} {...register('hostel.roomNo', { required: true })} />
                  {errors.hostel?.roomNo && <div className="invalid-feedback">Required</div>}
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label">Bed Number</label>
                  <input className={`form-control ${errors.hostel?.bedNo ? 'is-invalid' : ''}`} {...register('hostel.bedNo', { required: true })} />
                  {errors.hostel?.bedNo && <div className="invalid-feedback">Required</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Warden Name</label>
                  <input className={`form-control ${errors.hostel?.wardenName ? 'is-invalid' : ''}`} {...register('hostel.wardenName', { required: true })} />
                  {errors.hostel?.wardenName && <div className="invalid-feedback">Required</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Joining Date</label>
                  <input type="date" className={`form-control ${errors.hostel?.joiningDate ? 'is-invalid' : ''}`} {...register('hostel.joiningDate', { required: true })} />
                  {errors.hostel?.joiningDate && <div className="invalid-feedback">Required</div>}
                </div>
              </div>
            ) : (
              <div className="alert alert-info">Hostel section is only required for Residential students.</div>
            )
          )}

          {step === 5 && (
            <div className="d-grid gap-2">
              <div>
                <label className="form-label">Birth Certificate</label>
                <input type="file" className="form-control" {...register('documents.birthCertificate')} />
              </div>
              <div>
                <label className="form-label">Transfer Certificate</label>
                <input type="file" className="form-control" {...register('documents.transferCertificate')} />
              </div>
              <div>
                <label className="form-label">Aadhaar (placeholder)</label>
                <input type="file" className="form-control" {...register('documents.aadhaar')} />
              </div>
              <div>
                <label className="form-label">Previous Marksheet</label>
                <input type="file" className="form-control" {...register('documents.previousMarksheet')} />
              </div>
              <div>
                <label className="form-label">Other Documents</label>
                <input type="file" className="form-control" multiple {...register('documents.otherDocuments')} />
              </div>
              <div className="alert alert-info">Files should be uploaded to Firebase Storage and document URLs saved in Firestore during submission integration.</div>
            </div>
          )}

          <div className="d-flex flex-wrap gap-2 mt-4">
            <button type="button" className="btn btn-outline-secondary btn-sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm" disabled={step === steps.length - 1} onClick={onNext}>
              Next
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {mode === 'create' ? 'Create Student' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
