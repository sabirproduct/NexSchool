import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAdmissionsStore } from '../store/useAdmissionsStore';
import { AdmissionApplication, PaymentMethod } from '../types';

interface FormData {
  studentFirstName: string;
  studentLastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  mobile: string;
  email: string;
  guardianName: string;
  guardianMobile: string;
  applyingClassId: string;
  studentType: 'Day Scholar' | 'Residential';
  address: string;
  city: string;
  state: string;
  pincode: string;
  bloodGroup: string;
  religion: string;
  category: string;
}

const classOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ADMISSION_FORM_FEE = 500;

export function AdmissionFormPage() {
  const navigate = useNavigate();
  const { upsertApplication } = useAdmissionsStore();
  const [step, setStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paymentDone, setPaymentDone] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  const watchStudentType = watch('studentType');

  const submitForm = handleSubmit((data) => {
    setFormData(data);
    setShowPayment(true);
  });

  const handlePaymentComplete = () => {
    if (!formData) return;
    setIsSubmitting(true);

    const id = `app-${Date.now()}`;
    const transactionId = `TXN${Date.now()}`;

    upsertApplication({
      id,
      applicationNo: `NS-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      studentFirstName: formData.studentFirstName,
      studentLastName: formData.studentLastName,
      fullName: `${formData.studentFirstName} ${formData.studentLastName}`,
      gender: formData.gender,
      dob: formData.dob,
      bloodGroup: formData.bloodGroup || undefined,
      religion: formData.religion || undefined,
      category: formData.category || undefined,
      studentType: formData.studentType,
      applyingClassId: formData.applyingClassId,
      guardianName: formData.guardianName,
      mobile: formData.mobile,
      email: formData.email,
      address: formData.address || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      pincode: formData.pincode || undefined,
      hostelRequired: formData.studentType === 'Residential',
      applicationStatus: 'Submitted',
      admissionFeeStatus: 'Paid',
      admissionFeeAmount: ADMISSION_FORM_FEE,
      paymentMethod,
      paymentReference: transactionId,
      paymentDetails: {
        transactionId,
        upiId: paymentMethod === 'UPI' ? 'school@upi' : undefined,
        qrScanned: paymentMethod === 'QR',
        paidAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    } as AdmissionApplication);

    setPaymentDone(true);
    setIsSubmitting(false);
  };

  if (paymentDone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your admission application has been submitted successfully. Your application number will be sent to your registered email.
          </p>
          <button
            type="button"
            onClick={() => navigate('/admissions')}
            className="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Complete Payment</h2>
            <p className="text-sm text-gray-500 mt-1">Pay the admission form fee to submit your application</p>
          </div>

          <div className="px-6 py-4">
            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Admission Form Fee</span>
                <span className="text-lg font-bold text-indigo-700">₹{ADMISSION_FORM_FEE}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">📱</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">UPI Payment</p>
                  <p className="text-xs text-gray-500">GPay, PhonePe, Paytm</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QR')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    paymentMethod === 'QR'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">📷</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">QR Code</p>
                  <p className="text-xs text-gray-500">Scan & Pay</p>
                </button>
              </div>
            </div>

            {/* UPI Section */}
            {paymentMethod === 'UPI' && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pay via UPI</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    readOnly
                    value="school@nexpay"
                    className="flex-1 px-3 py-2 text-sm font-mono bg-white border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText('school@nexpay')}
                    className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Open your UPI app and pay to this UPI ID</p>
              </div>
            )}

            {/* QR Code Section */}
            {paymentMethod === 'QR' && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
                <div className="w-48 h-48 bg-white rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <div className="w-24 h-24 bg-white rounded flex flex-wrap gap-1 p-1">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Scan this QR code to pay ₹{ADMISSION_FORM_FEE}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pay Now Button */}
            <button
              type="button"
              onClick={handlePaymentComplete}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay ₹${ADMISSION_FORM_FEE} & Submit`
              )}
            </button>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowPayment(false)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/admissions')}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Management
          </button>
          <h1 className="text-2xl font-bold text-gray-900">New Admission Application</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to submit an admission application</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              <div className={`hidden sm:block text-xs font-medium ${
                step >= s ? 'text-indigo-600' : 'text-gray-400'
              }`}>
                {s === 1 ? 'Personal Info' : s === 2 ? 'Contact & Address' : 'Academic Details'}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-6">
            <form onSubmit={submitForm}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                          errors.studentFirstName ? 'border-red-400' : 'border-gray-300'
                        }`}
                        {...register('studentFirstName', { required: 'First name is required' })}
                      />
                      {errors.studentFirstName && <p className="text-xs text-red-500 mt-1">{errors.studentFirstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                          errors.studentLastName ? 'border-red-400' : 'border-gray-300'
                        }`}
                        {...register('studentLastName', { required: 'Last name is required' })}
                      />
                      {errors.studentLastName && <p className="text-xs text-red-500 mt-1">{errors.studentLastName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                      <select
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                          errors.gender ? 'border-red-400' : 'border-gray-300'
                        }`}
                        {...register('gender', { required: 'Gender is required' })}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                          errors.dob ? 'border-red-400' : 'border-gray-300'
                        }`}
                        {...register('dob', { required: 'Date of birth is required' })}
                      />
                      {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        {...register('bloodGroup')}
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                      <input
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        {...register('religion')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact & Address */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Contact & Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                          errors.mobile ? 'border-red-400' : 'border-gray-300'
                        }`}
                        {...register('mobile', {
                          required: 'Mobile is required',
                          minLength: { value: 10, message: 'Enter valid mobile number' },
                          pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10-digit mobile' }
                        })}
                      />
                      {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                          errors.email ? 'border-red-400' : 'border-gray-300'
                        }`}
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Enter valid email' }
                        })}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guardian Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                          errors.guardianName ? 'border-red-400' : 'border-gray-300'
                        }`}
                        {...register('guardianName', { required: 'Guardian name is required' })}
                      />
                      {errors.guardianName && <p className="text-xs text-red-500 mt-1">{errors.guardianName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Mobile</label>
                      <input
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        {...register('guardianMobile')}
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                          rows={2}
                          {...register('address')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          {...register('city')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          {...register('state')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                        <input
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          {...register('pincode')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Academic Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Academic Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Applying Class <span className="text-red-500">*</span>
                      </label>
                      <select
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                          errors.applyingClassId ? 'border-red-400' : 'border-gray-300'
                        }`}
                        {...register('applyingClassId', { required: 'Class is required' })}
                      >
                        <option value="">Select Class</option>
                        {classOptions.map((cls) => (
                          <option key={cls} value={cls}>Class {cls}</option>
                        ))}
                      </select>
                      {errors.applyingClassId && <p className="text-xs text-red-500 mt-1">{errors.applyingClassId.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Student Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                          errors.studentType ? 'border-red-400' : 'border-gray-300'
                        }`}
                        {...register('studentType', { required: 'Student type is required' })}
                      >
                        <option value="">Select Type</option>
                        <option value="Day Scholar">Day Scholar</option>
                        <option value="Residential">Residential</option>
                      </select>
                      {errors.studentType && <p className="text-xs text-red-500 mt-1">{errors.studentType.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        {...register('category')}
                      >
                        <option value="">Select Category</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                      </select>
                    </div>
                  </div>

                  {watchStudentType === 'Residential' && (
                    <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                      <span className="font-medium">Note:</span> As a residential student, hostel facilities will be arranged.
                    </div>
                  )}

                  {/* Fee Summary */}
                  <div className="border-t border-gray-100 pt-4 mt-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Fee Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Admission Form Fee</span>
                          <span className="font-medium">₹{ADMISSION_FORM_FEE}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-semibold text-gray-900">
                          <span>Total</span>
                          <span>₹{ADMISSION_FORM_FEE}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <div>
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                      Previous
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Proceed to Payment
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}