import { Alert, Box, Button, Grid2, MenuItem, Stack, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Student } from '../types';
import { validateStudentPayload } from '../schemas/studentSchema';
import { useMemo, useState } from 'react';
import { isValidEmail, isValidMobile } from '../utils/validation';

const steps = ['Basic Information', 'Parent Information', 'Academic Information', 'Address Information', 'Hostel Information', 'Document Upload'];

export type StudentAdmissionFormValues = {
  firstName: string; lastName: string; gender: 'male' | 'female' | 'other'; dob: string; bloodGroup?: string; religion?: string; category?: string;
  aadhaarNo?: string; mobile: string; email?: string; photo?: FileList;
  parent: { fatherName: string; motherName: string; guardianName: string; guardianMobile: string; guardianEmail?: string; occupation?: string; annualIncome?: string; };
  academic: { admissionNo: string; rollNo: string; admissionDate: string; classId: string; sectionId: string; session: string; previousSchool?: string; studentType: 'day_scholar'|'residential'; };
  address: { addressLine: string; state: string; district: string; city: string; pinCode: string; };
  hostel?: { hostelName?: string; roomNo?: string; bedNo?: string; wardenName?: string; joiningDate?: string; };
  documents?: { birthCertificate?: FileList; transferCertificate?: FileList; aadhaar?: FileList; previousMarksheet?: FileList; otherDocuments?: FileList; };
};

export function StudentForm({ defaultValues, onSubmit, mode }: { defaultValues?: Partial<StudentAdmissionFormValues>; onSubmit: (v: StudentAdmissionFormValues) => Promise<void> | void; mode: 'create'|'edit' }) {
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState('');
  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm<StudentAdmissionFormValues>({ defaultValues: defaultValues as StudentAdmissionFormValues });
  const studentType = watch('academic.studentType', defaultValues?.academic?.studentType ?? 'day_scholar');

  const stepFields = useMemo(() => ([
    ['firstName', 'lastName', 'gender', 'dob', 'mobile', 'email'],
    ['parent.fatherName', 'parent.motherName', 'parent.guardianName', 'parent.guardianMobile', 'parent.guardianEmail'],
    ['academic.admissionNo', 'academic.rollNo', 'academic.admissionDate', 'academic.classId', 'academic.sectionId', 'academic.session', 'academic.studentType'],
    ['address.addressLine', 'address.state', 'address.district', 'address.city', 'address.pinCode'],
    ['hostel.hostelName', 'hostel.roomNo', 'hostel.bedNo', 'hostel.wardenName', 'hostel.joiningDate'],
    ['documents.birthCertificate', 'documents.transferCertificate', 'documents.aadhaar', 'documents.previousMarksheet', 'documents.otherDocuments'],
  ]), []);

  const onNext = async () => {
    if (step === 4 && studentType !== 'residential') return setStep((s) => s + 1);
    const ok = await trigger(stepFields[step] as any);
    if (ok) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  return <Box><Stepper activeStep={step} sx={{ mb: 3 }}>{steps.map((s)=><Step key={s}><StepLabel>{s}</StepLabel></Step>)}</Stepper>
    {formError ? <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert> : null}
    <form onSubmit={handleSubmit(async (v)=>{
      const check=validateStudentPayload(v as any);
      if (!isValidMobile(v.mobile)) { setFormError('Mobile number must be 10 digits.'); return; }
      if (v.email && !isValidEmail(v.email)) { setFormError('Please enter a valid email.'); return; }
      if (!check.valid) { setFormError('Please fill all required fields.'); return; }
      setFormError('');
      await onSubmit(v);
    })}>
      <Stack spacing={2.2}>
        {step === 0 && <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="First Name" error={!!errors.firstName} helperText={errors.firstName ? 'Required' : ''} {...register('firstName', { required: true })} /></Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Last Name" error={!!errors.lastName} helperText={errors.lastName ? 'Required' : ''} {...register('lastName', { required: true })} /></Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}><TextField fullWidth select label="Gender" defaultValue="male" {...register('gender', { required: true })}><MenuItem value="male">Male</MenuItem><MenuItem value="female">Female</MenuItem><MenuItem value="other">Other</MenuItem></TextField></Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}><TextField fullWidth type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} {...register('dob', { required: true })} /></Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}><TextField fullWidth label="Blood Group" {...register('bloodGroup')} /></Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}><TextField fullWidth label="Religion" {...register('religion')} /></Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}><TextField fullWidth label="Category" {...register('category')} /></Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}><TextField fullWidth label="Aadhaar Number (placeholder)" {...register('aadhaarNo')} /></Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Mobile Number" error={!!errors.mobile} helperText={errors.mobile ? 'Required' : ''} {...register('mobile', { required: true, validate: (v) => isValidMobile(v) || 'Invalid mobile' })} /></Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Email" error={!!errors.email} helperText={errors.email ? 'Invalid email' : ''} {...register('email', { validate: (v) => !v || isValidEmail(v) || 'Invalid email' })} /></Grid2>
          <Grid2 size={{ xs: 12 }}><Button component="label" variant="outlined">Student Photo Upload<input hidden type="file" accept="image/*" {...register('photo')} /></Button></Grid2>
        </Grid2>}

        {step === 1 && <Grid2 container spacing={2}><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Father Name" {...register('parent.fatherName', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Mother Name" {...register('parent.motherName', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Guardian Name" {...register('parent.guardianName', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Guardian Mobile" {...register('parent.guardianMobile', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Guardian Email" {...register('parent.guardianEmail')} /></Grid2><Grid2 size={{ xs: 12, md: 3 }}><TextField fullWidth label="Occupation" {...register('parent.occupation')} /></Grid2><Grid2 size={{ xs: 12, md: 3 }}><TextField fullWidth label="Annual Income (placeholder)" {...register('parent.annualIncome')} /></Grid2></Grid2>}

        {step === 2 && <Grid2 container spacing={2}><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Admission Number" disabled={mode==='edit'} {...register('academic.admissionNo', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Roll Number" {...register('academic.rollNo', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 4 }}><TextField fullWidth type="date" label="Admission Date" InputLabelProps={{ shrink: true }} {...register('academic.admissionDate', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 4 }}><TextField fullWidth label="Class" {...register('academic.classId', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 4 }}><TextField fullWidth label="Section" {...register('academic.sectionId', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Session" {...register('academic.session', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Previous School" {...register('academic.previousSchool')} /></Grid2><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth select label="Student Type" defaultValue={studentType} {...register('academic.studentType', { required: true })}><MenuItem value="day_scholar">Day Scholar</MenuItem><MenuItem value="residential">Residential</MenuItem></TextField></Grid2></Grid2>}

        {step === 3 && <Grid2 container spacing={2}><Grid2 size={{ xs: 12 }}><TextField fullWidth label="Address Line" {...register('address.addressLine', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 3 }}><TextField fullWidth label="State" {...register('address.state', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 3 }}><TextField fullWidth label="District" {...register('address.district', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 3 }}><TextField fullWidth label="City" {...register('address.city', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 3 }}><TextField fullWidth label="Pin Code" {...register('address.pinCode', { required: true })} /></Grid2></Grid2>}

        {step === 4 && (studentType === 'residential' ? <Grid2 container spacing={2}><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Hostel Name" {...register('hostel.hostelName', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 3 }}><TextField fullWidth label="Room Number" {...register('hostel.roomNo', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 3 }}><TextField fullWidth label="Bed Number" {...register('hostel.bedNo', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth label="Warden Name" {...register('hostel.wardenName', { required: true })} /></Grid2><Grid2 size={{ xs: 12, md: 6 }}><TextField fullWidth type="date" label="Joining Date" InputLabelProps={{ shrink: true }} {...register('hostel.joiningDate', { required: true })} /></Grid2></Grid2> : <Alert severity="info">Hostel section is only required for Residential students.</Alert>)}

        {step === 5 && <Stack spacing={1.5}><Typography variant="subtitle1" fontWeight={700}>Document Upload</Typography><Button component="label" variant="outlined">Birth Certificate<input hidden type="file" {...register('documents.birthCertificate')} /></Button><Button component="label" variant="outlined">Transfer Certificate<input hidden type="file" {...register('documents.transferCertificate')} /></Button><Button component="label" variant="outlined">Aadhaar (placeholder)<input hidden type="file" {...register('documents.aadhaar')} /></Button><Button component="label" variant="outlined">Previous Marksheet<input hidden type="file" {...register('documents.previousMarksheet')} /></Button><Button component="label" variant="outlined">Other Documents<input hidden type="file" multiple {...register('documents.otherDocuments')} /></Button><Alert severity="info">Files should be uploaded to Firebase Storage and document URLs saved in Firestore during submission integration.</Alert></Stack>}

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" disabled={step===0} onClick={()=>setStep((s)=>s-1)}>Back</Button>
          <Button variant="outlined" disabled={step===steps.length-1} onClick={onNext}>Next</Button>
          <Button type="submit" variant="contained">{mode==='create'?'Create Student':'Save Changes'}</Button>
        </Stack>
      </Stack>
    </form>
  </Box>;
}
