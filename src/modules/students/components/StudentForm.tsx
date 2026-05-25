import { Box, Button, MenuItem, Stack, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Student } from '../types';
import { validateStudentPayload } from '../schemas/studentSchema';
import { useState } from 'react';

const steps = ['Basic', 'Parent', 'Academic', 'Address', 'Hostel', 'Documents'];
export function StudentForm({ defaultValues, onSubmit, mode }: { defaultValues?: Partial<Student>; onSubmit: (v: any) => Promise<void> | void; mode: 'create'|'edit' }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<any>({ defaultValues });
  const [step, setStep] = useState(0);
  const studentType = watch('academic.studentType', defaultValues?.academic?.studentType ?? 'day_scholar');

  return <Box><Stepper activeStep={step} sx={{ mb: 2 }}>{steps.map((s)=><Step key={s}><StepLabel>{s}</StepLabel></Step>)}</Stepper>
  <form onSubmit={handleSubmit(async (v)=>{ const check=validateStudentPayload(v); if(!check.valid) return; await onSubmit(v); })}>
    <Stack spacing={2}>
      <TextField label="First Name" error={!!errors.firstName} {...register('firstName', { required: true })} />
      <TextField label="Last Name" error={!!errors.lastName} {...register('lastName', { required: true })} />
      <TextField select label="Gender" defaultValue="male" {...register('gender')}><MenuItem value="male">Male</MenuItem><MenuItem value="female">Female</MenuItem></TextField>
      <TextField label="Mobile" {...register('mobile', { required: true })} />
      <TextField label="Email" {...register('email')} />
      <TextField label="Admission Number" disabled={mode==='edit'} {...register('academic.admissionNo', { required: true })} />
      <TextField label="Roll Number" {...register('academic.rollNo')} />
      <TextField select label="Student Type" defaultValue={studentType} {...register('academic.studentType')}><MenuItem value="day_scholar">Day Scholar</MenuItem><MenuItem value="residential">Residential</MenuItem></TextField>
      {studentType === 'residential' && <><TextField label="Hostel Name" {...register('hostel.hostelName')} /><TextField label="Room Number" {...register('hostel.roomNo')} /></>}
      <Stack direction="row" spacing={1}><Button variant="outlined" disabled={step===0} onClick={()=>setStep((s)=>s-1)}>Back</Button><Button variant="outlined" disabled={step===steps.length-1} onClick={()=>setStep((s)=>s+1)}>Next</Button><Button type="submit" variant="contained">{mode==='create'?'Create Student':'Save Changes'}</Button></Stack>
    </Stack>
  </form></Box>;
}
