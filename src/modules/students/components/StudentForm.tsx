import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { validateStudentPayload } from '../schemas/studentSchema';
import { isValidEmail, isValidMobile } from '../utils/validation';
import { generateAdmissionNo } from '../services/studentService';
import { fetchDropdownData, ClassOption, SectionOption, SessionOption } from '../services/dropdownService';
import { useAuthStore } from '../../../store/authStore';
import indiaStates from '../data/india-states.json';

const steps = [
  { label: 'Basic Information', icon: '👤', desc: 'Personal details & contact', color: 'from-blue-500 to-blue-600' },
  { label: 'Parent Information', icon: '👨‍👩‍👧‍👦', desc: 'Guardian & family details', color: 'from-emerald-500 to-emerald-600' },
  { label: 'Academic Information', icon: '📚', desc: 'Class, section & admission', color: 'from-purple-500 to-purple-600' },
  { label: 'Address Information', icon: '📍', desc: 'Residential address', color: 'from-amber-500 to-amber-600' },
  { label: 'Hostel Information', icon: '🏠', desc: 'Hostel & accommodation', color: 'from-pink-500 to-pink-600' },
  { label: 'Document Upload', icon: '📄', desc: 'Upload required documents', color: 'from-cyan-500 to-cyan-600' },
];

/** File preview entry with binary data */
export interface FilePreview {
  file: File;
  previewUrl: string;
  binaryData: ArrayBuffer | null;
}

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
  /** Binary data for photo (stored as base64 for Firestore) */
  photoBinary?: string;
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
  /** Binary data for documents (keyed by label, base64 encoded) */
  documentsBinary?: Record<string, string>;
};

const statesList = Object.keys(indiaStates);

/** Read a file and return its base64 string */
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is a data URL like "data:image/png;base64,..."
      resolve(result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function StudentForm({ defaultValues, onSubmit, mode }: { defaultValues?: Partial<StudentAdmissionFormValues>; onSubmit: (v: StudentAdmissionFormValues) => Promise<void> | void; mode: 'create' | 'edit' }) {
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState('');
  const [admissionNoLoading, setAdmissionNoLoading] = useState(false);
  const [previews, setPreviews] = useState<Record<string, FilePreview>>({});
  const { register, handleSubmit, watch, trigger, setValue, getValues, formState: { errors } } = useForm<StudentAdmissionFormValues>({ defaultValues: defaultValues as StudentAdmissionFormValues });
  const studentType = watch('academic.studentType', defaultValues?.academic?.studentType ?? 'day_scholar');
  const selectedState = watch('address.state', defaultValues?.address?.state ?? '');
  const selectedDistrict = watch('address.district', defaultValues?.address?.district ?? '');

  const schoolId = useAuthStore((s) => s.user?.schoolId);

  // Load dynamic dropdown data from Firestore
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [sectionOptions, setSectionOptions] = useState<SectionOption[]>([]);
  const [sessionOptions, setSessionOptions] = useState<SessionOption[]>([]);

  useEffect(() => {
    fetchDropdownData(schoolId).then((data) => {
      setClassOptions(data.classes);
      setSectionOptions(data.sections);
      setSessionOptions(data.sessions);
    });
  }, [schoolId]);

  // Generate admission number on mount for create mode
  useEffect(() => {
    if (mode === 'create') {
      setAdmissionNoLoading(true);
      generateAdmissionNo().then((no) => {
        setValue('academic.admissionNo', no);
        setAdmissionNoLoading(false);
      });
    }
  }, [mode, setValue]);

  // Get districts for selected state
  const districtsForState = useMemo(() => {
    if (!selectedState || !indiaStates[selectedState as keyof typeof indiaStates]) return [];
    return Object.keys(indiaStates[selectedState as keyof typeof indiaStates].districts);
  }, [selectedState]);

  // Get cities for selected state+district
  const citiesForDistrict = useMemo(() => {
    if (!selectedState || !selectedDistrict) return [];
    const stateData = indiaStates[selectedState as keyof typeof indiaStates];
    if (!stateData) return [];
    const districtCities = stateData.districts[selectedDistrict as keyof typeof stateData.districts];
    return districtCities || [];
  }, [selectedState, selectedDistrict]);

  // Reset district/city when state changes
  const handleStateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('address.state', e.target.value);
    setValue('address.district', '');
    setValue('address.city', '');
  }, [setValue]);

  // Reset city when district changes
  const handleDistrictChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('address.district', e.target.value);
    setValue('address.city', '');
  }, [setValue]);

  /** Handle file selection for a field - creates preview and reads binary data */
  const handleFileChange = useCallback(async (fieldName: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Create preview URL for images
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
    let binaryData: ArrayBuffer | null = null;

    try {
      binaryData = await file.arrayBuffer();
    } catch {
      // Could not read binary
    }

    const preview: FilePreview = { file, previewUrl, binaryData };

    setPreviews((prev) => ({ ...prev, [fieldName]: preview }));

    // Store base64 data in the form for Firestore
    if (file.type.startsWith('image/')) {
      const base64 = await readFileAsBase64(file);
      if (fieldName === 'photo') {
        setValue('photoBinary' as any, base64);
      } else if (fieldName.startsWith('documents.')) {
        const docKey = fieldName.replace('documents.', '');
        const currentBinaries = getValues('documentsBinary') || {};
        setValue('documentsBinary' as any, { ...currentBinaries, [docKey]: base64 });
      }
    }
  }, [setValue, getValues]);

  /** Remove a file preview */
  const removeFile = useCallback((fieldName: string) => {
    setPreviews((prev) => {
      const { [fieldName]: removed, ...rest } = prev;
      // Revoke object URL to free memory
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return rest;
    });

    // Clear the form value
    if (fieldName === 'photo') {
      setValue('photo' as any, undefined as any);
      setValue('photoBinary' as any, undefined as any);
    } else if (fieldName.startsWith('documents.')) {
      setValue(fieldName as any, undefined as any);
      const docKey = fieldName.replace('documents.', '');
      const currentBinaries = getValues('documentsBinary') || {};
      const { [docKey]: _, ...restBinaries } = currentBinaries;
      setValue('documentsBinary' as any, restBinaries);
    }
  }, [setValue, getValues]);

  /** Render a file upload field with preview */
  const renderFileField = (label: string, fieldName: string, accept?: string, multiple = false) => {
    const preview = previews[fieldName];
    const error = fieldName === 'photo'
      ? (errors as any).photo
      : fieldName.startsWith('documents.')
        ? (errors as any).documents?.[fieldName.replace('documents.', '')]
        : undefined;

    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <label className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm text-slate-600">{preview ? preview.file.name : `Upload ${label}`}</span>
              <input
                hidden
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={(e) => handleFileChange(fieldName, e.currentTarget.files)}
              />
            </label>
            {error && <p className="mt-1 text-xs text-red-600">Required</p>}
          </div>

          {/* Preview thumbnails */}
          {preview && preview.previewUrl && (
            <div className="relative shrink-0">
              <img
                src={preview.previewUrl}
                alt={preview.file.name}
                className="h-16 w-16 rounded-lg border border-slate-200 object-cover shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeFile(fieldName)}
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs shadow hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}

          {/* Non-image file preview */}
          {preview && !preview.previewUrl && (
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => removeFile(fieldName)}
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs shadow hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </div>
        {preview && (
          <p className="mt-1 text-xs text-slate-500">{preview.file.name} ({(preview.file.size / 1024).toFixed(1)} KB)</p>
        )}
      </div>
    );
  };

  const stepFields = useMemo(
    () => [
      mode === 'edit'
        ? ['gender', 'dob', 'mobile', 'email']
        : ['firstName', 'lastName', 'gender', 'dob', 'mobile', 'email'],
      ['parent.fatherName', 'parent.motherName', 'parent.guardianName', 'parent.guardianMobile', 'parent.guardianEmail'],
      mode === 'edit'
        ? ['academic.rollNo', 'academic.admissionDate', 'academic.classId', 'academic.sectionId', 'academic.session', 'academic.studentType']
        : ['academic.admissionNo', 'academic.rollNo', 'academic.admissionDate', 'academic.classId', 'academic.sectionId', 'academic.session', 'academic.studentType'],
      ['address.addressLine', 'address.state', 'address.district', 'address.city', 'address.pinCode'],
      ['hostel.hostelName', 'hostel.roomNo', 'hostel.bedNo', 'hostel.wardenName', 'hostel.joiningDate'],
      ['documents.birthCertificate', 'documents.transferCertificate', 'documents.aadhaar', 'documents.previousMarksheet', 'documents.otherDocuments'],
    ],
    [mode]
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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((s, index) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setStep(index)}
              className={`relative flex flex-col items-center gap-1 rounded-xl p-3 text-center transition-all ${
                index === step
                  ? `bg-gradient-to-br ${s.color} text-white shadow-lg scale-[1.02]`
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <span className="text-xl">{s.icon}</span>
              <span className={`text-[10px] font-semibold leading-tight ${index === step ? 'text-white' : 'text-slate-700'}`}>
                {s.label.split(' ')[0]}
              </span>
              <span className={`text-[8px] leading-tight ${index === step ? 'text-white/80' : 'text-slate-400'}`}>
                {s.desc}
              </span>
              {index < step && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        {formError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-6">
          {step === 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mode !== 'edit' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                    <input
                      className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                        errors.firstName
                          ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      }`}
                      {...register('firstName', { required: true })}
                    />
                    {errors.firstName && <p className="mt-1 text-xs text-red-600">Required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                    <input
                      className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                        errors.lastName
                          ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      }`}
                      {...register('lastName', { required: true })}
                    />
                    {errors.lastName && <p className="mt-1 text-xs text-red-600">Required</p>}
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  defaultValue="male"
                  {...register('gender', { required: true })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.dob
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('dob', { required: true })}
                />
                {errors.dob && <p className="mt-1 text-xs text-red-600">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Blood Group</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  {...register('bloodGroup')}
                >
                  <option value="">Select Blood Group</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Religion</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  {...register('religion')}
                >
                  <option value="">Select Religion</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Islam">Islam</option>
                  <option value="Christianity">Christianity</option>
                  <option value="Sikhism">Sikhism</option>
                  <option value="Buddhism">Buddhism</option>
                  <option value="Jainism">Jainism</option>
                  <option value="Zoroastrianism">Zoroastrianism</option>
                  <option value="Judaism">Judaism</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  {...register('category')}
                >
                  <option value="">Select Category</option>
                  <option value="General">General (Unreserved)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="EWS">EWS (Economically Weaker Sections)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Aadhaar Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.aadhaarNo
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('aadhaarNo', {
                    pattern: {
                      value: /^\d{0,12}$/,
                      message: 'Only digits allowed, max 12 digits'
                    },
                    validate: (v) => !v || (/^\d{12}$/.test(v) || 'Must be exactly 12 digits')
                  })}
                />
                {errors.aadhaarNo && <p className="mt-1 text-xs text-red-600">{errors.aadhaarNo.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.mobile
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('mobile', { required: true, validate: (v) => isValidMobile(v) || 'Invalid mobile' })}
                />
                {errors.mobile && <p className="mt-1 text-xs text-red-600">Required / Invalid</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.email
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('email', { validate: (v) => !v || isValidEmail(v) || 'Invalid email' })}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">Invalid email</p>}
              </div>
              {renderFileField('Photo', 'photo', 'image/*')}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Father Name *</label>
                <input
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.parent?.fatherName
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('parent.fatherName', { required: true })}
                />
                {errors.parent?.fatherName && <p className="mt-1 text-xs text-red-600">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mother Name *</label>
                <input
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.parent?.motherName
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('parent.motherName', { required: true })}
                />
                {errors.parent?.motherName && <p className="mt-1 text-xs text-red-600">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Guardian Name *</label>
                <input
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.parent?.guardianName
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('parent.guardianName', { required: true })}
                />
                {errors.parent?.guardianName && <p className="mt-1 text-xs text-red-600">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Guardian Mobile *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.parent?.guardianMobile
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('parent.guardianMobile', { required: true })}
                />
                {errors.parent?.guardianMobile && <p className="mt-1 text-xs text-red-600">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Guardian Email</label>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  {...register('parent.guardianEmail')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Occupation</label>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  {...register('parent.occupation')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Annual Income</label>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  {...register('parent.annualIncome')}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mode !== 'edit' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Admission Number *</label>
                  <input
                    disabled
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 disabled:opacity-50"
                    {...register('academic.admissionNo', { required: true })}
                  />
                  {admissionNoLoading && <p className="mt-1 text-xs text-blue-600">Generating admission number...</p>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Roll Number *</label>
                <input
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.academic?.rollNo
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('academic.rollNo', { required: true })}
                />
                {errors.academic?.rollNo && <p className="mt-1 text-xs text-red-600">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Admission Date *</label>
                <input
                  type="date"
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.academic?.admissionDate
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('academic.admissionDate', { required: true })}
                />
                {errors.academic?.admissionDate && <p className="mt-1 text-xs text-red-600">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Class *</label>
                <select
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.academic?.classId
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('academic.classId', { required: true })}
                >
                  <option value="">Select Class</option>
                  {classOptions.map((cls) => (
                    <option key={cls.id} value={cls.className}>{cls.className}</option>
                  ))}
                </select>
                {errors.academic?.classId && <p className="mt-1 text-xs text-red-600">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Section *</label>
                <select
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.academic?.sectionId
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('academic.sectionId', { required: true })}
                >
                  <option value="">Select Section</option>
                  {sectionOptions.map((sec) => (
                    <option key={sec.id} value={sec.sectionCode}>Section {sec.sectionName}</option>
                  ))}
                </select>
                {errors.academic?.sectionId && <p className="mt-1 text-xs text-red-600">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Session *</label>
                <select
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.academic?.session
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('academic.session', { required: true })}
                >
                  <option value="">Select Session</option>
                  {sessionOptions.map((s) => (
                    <option key={s.id} value={s.sessionName}>{s.sessionName}</option>
                  ))}
                </select>
                {errors.academic?.session && <p className="mt-1 text-xs text-red-600">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Previous School</label>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  {...register('academic.previousSchool')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Student Type *</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  defaultValue={studentType}
                  {...register('academic.studentType', { required: true })}
                >
                  <option value="day_scholar">Day Scholar</option>
                  <option value="residential">Residential</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address Line *</label>
                <textarea
                  rows={3}
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                    errors.address?.addressLine
                      ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  {...register('address.addressLine', { required: true })}
                />
                {errors.address?.addressLine && <p className="mt-1 text-xs text-red-600">Required</p>}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                  <select
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                      errors.address?.state
                        ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    {...register('address.state', { required: true })}
                    onChange={handleStateChange}
                  >
                    <option value="">Select State</option>
                    {statesList.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.address?.state && <p className="mt-1 text-xs text-red-600">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">District *</label>
                  <select
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                      !selectedState ? 'bg-slate-100' : ''
                    } ${
                      errors.address?.district
                        ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    disabled={!selectedState}
                    {...register('address.district', { required: true })}
                    onChange={handleDistrictChange}
                  >
                    <option value="">Select District</option>
                    {districtsForState.map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {errors.address?.district && <p className="mt-1 text-xs text-red-600">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City/Town *</label>
                  <select
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                      !selectedDistrict ? 'bg-slate-100' : ''
                    } ${
                      errors.address?.city
                        ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    disabled={!selectedDistrict}
                    {...register('address.city', { required: true })}
                  >
                    <option value="">Select City</option>
                    {citiesForDistrict.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.address?.city && <p className="mt-1 text-xs text-red-600">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pin Code *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                    }}
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                      errors.address?.pinCode
                        ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    {...register('address.pinCode', { required: true })}
                  />
                  {errors.address?.pinCode && <p className="mt-1 text-xs text-red-600">Required</p>}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            studentType === 'residential' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hostel Name *</label>
                  <input
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                      errors.hostel?.hostelName
                        ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    {...register('hostel.hostelName', { required: true })}
                  />
                  {errors.hostel?.hostelName && <p className="mt-1 text-xs text-red-600">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Room Number *</label>
                  <input
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                      errors.hostel?.roomNo
                        ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    {...register('hostel.roomNo', { required: true })}
                  />
                  {errors.hostel?.roomNo && <p className="mt-1 text-xs text-red-600">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bed Number *</label>
                  <input
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                      errors.hostel?.bedNo
                        ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    {...register('hostel.bedNo', { required: true })}
                  />
                  {errors.hostel?.bedNo && <p className="mt-1 text-xs text-red-600">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Warden Name *</label>
                  <input
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                      errors.hostel?.wardenName
                        ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    {...register('hostel.wardenName', { required: true })}
                  />
                  {errors.hostel?.wardenName && <p className="mt-1 text-xs text-red-600">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Joining Date *</label>
                  <input
                    type="date"
                    className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                      errors.hostel?.joiningDate
                        ? 'border-red-300 bg-red-50 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    {...register('hostel.joiningDate', { required: true })}
                  />
                  {errors.hostel?.joiningDate && <p className="mt-1 text-xs text-red-600">Required</p>}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Hostel section is only required for Residential students.
              </div>
            )
          )}

          {step === 5 && (
            <div className="space-y-4">
              {renderFileField('Birth Certificate', 'documents.birthCertificate', 'image/*,.pdf')}
              {renderFileField('Transfer Certificate', 'documents.transferCertificate', 'image/*,.pdf')}
              {renderFileField('Aadhaar Card', 'documents.aadhaar', 'image/*,.pdf')}
              {renderFileField('Previous Marksheet', 'documents.previousMarksheet', 'image/*,.pdf')}
              {renderFileField('Other Documents', 'documents.otherDocuments', undefined, true)}
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Files will be stored as base64 binary data in Firestore. Image files show a thumbnail preview.
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              disabled={step === steps.length - 1}
              onClick={onNext}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              {mode === 'create' ? 'Create Student' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}