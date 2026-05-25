import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAdmissionsStore } from '../store/useAdmissionsStore';
import { AdmissionApplication, AdmissionStatus } from '../types';
import { AdmissionFilters } from './AdmissionFilters';
import { AdmissionStatusBadge } from './AdmissionStatusBadge';

type FormValues = Pick<AdmissionApplication, 'studentFirstName' | 'studentLastName' | 'gender' | 'mobile' | 'email' | 'studentType' | 'applyingClassId' | 'guardianName'>;

function metric(label: string, value: string | number) {
  return (
    <Card><CardContent><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h5">{value}</Typography></CardContent></Card>
  );
}

export function AdmissionModuleView() {
  const { applications, filters, setFilters, upsertApplication, updateStatus } = useAdmissionsStore();
  const [tab, setTab] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const filtered = useMemo(() => applications.filter((a) => {
    const matchSearch = !filters.search || a.fullName.toLowerCase().includes(filters.search.toLowerCase()) || a.mobile.includes(filters.search);
    const matchStatus = !filters.status || a.applicationStatus === filters.status;
    const matchType = !filters.studentType || a.studentType === filters.studentType;
    return matchSearch && matchStatus && matchType;
  }), [applications, filters]);

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
      ...values
    } as AdmissionApplication);
    reset();
  });

  const openReject = (id: string) => { setSelectedId(id); setRejectReason(''); };
  const confirmReject = () => { if (selectedId && rejectReason.trim()) updateStatus(selectedId, 'Rejected', rejectReason); setSelectedId(null); };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Admission Management</Typography>
      <Grid container spacing={2}>{metric('Total Applications', applications.length)}{metric('Pending Applications', applications.filter((a)=>a.applicationStatus==='Submitted'||a.applicationStatus==='Under Review').length)}{metric('Approved Admissions', applications.filter((a)=>a.applicationStatus==='Approved').length)}{metric('Rejected Applications', applications.filter((a)=>a.applicationStatus==='Rejected').length)}{metric('Waiting List', applications.filter((a)=>a.applicationStatus==='Waiting List').length)}{metric('Admission Revenue', `₹${applications.filter((a)=>a.admissionFeeStatus==='Paid').length * 2500}`)}</Grid>
      <Tabs value={tab} onChange={(_, val) => setTab(val)}><Tab label="Online Form" /><Tab label="Applications" /><Tab label="Enquiries" /><Tab label="Fees" /></Tabs>
      {tab === 0 && (
        <Card><CardContent>
          <Typography variant="h6" mb={2}>Online Admission Form</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>Multi-step stepper, document uploads, draft save, and preview are scaffolded as module placeholders for API/Firebase wiring.</Alert>
          <Box component="form" onSubmit={onSubmit}><Grid container spacing={2}>
            <Grid size={{ xs:12, md:6 }}><TextField fullWidth label="First Name" {...register('studentFirstName', { required: true })} /></Grid>
            <Grid size={{ xs:12, md:6 }}><TextField fullWidth label="Last Name" {...register('studentLastName', { required: true })} /></Grid>
            <Grid size={{ xs:12, md:4 }}><TextField fullWidth select label="Gender" defaultValue="Male" {...register('gender')}><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem><MenuItem value="Other">Other</MenuItem></TextField></Grid>
            <Grid size={{ xs:12, md:4 }}><TextField fullWidth label="Mobile" {...register('mobile', { required: true, minLength: 10 })} /></Grid>
            <Grid size={{ xs:12, md:4 }}><TextField fullWidth label="Email" {...register('email', { required: true })} /></Grid>
            <Grid size={{ xs:12, md:6 }}><TextField fullWidth label="Guardian Name" {...register('guardianName', { required: true })} /></Grid>
            <Grid size={{ xs:12, md:3 }}><TextField fullWidth label="Applying Class" {...register('applyingClassId', { required: true })} /></Grid>
            <Grid size={{ xs:12, md:3 }}><TextField fullWidth select label="Student Type" defaultValue="Day Scholar" {...register('studentType')}><MenuItem value="Day Scholar">Day Scholar</MenuItem><MenuItem value="Residential">Residential</MenuItem></TextField></Grid>
          </Grid><Button sx={{ mt: 2 }} type="submit" variant="contained">Submit Application</Button></Box>
        </CardContent></Card>
      )}
      {tab === 1 && (
        <Stack spacing={2}>
          <AdmissionFilters search={filters.search} onSearch={(search)=>setFilters({search})} onStatus={(status)=>setFilters({status:status||undefined})} onType={(studentType)=>setFilters({studentType:studentType||undefined})} />
          {filtered.map((application) => (
            <Card key={application.id}><CardContent><Stack direction={{ xs:'column', md:'row' }} justifyContent="space-between" spacing={1}>
              <Box><Typography fontWeight={700}>{application.fullName}</Typography><Typography variant="body2">{application.applicationNo} • Class {application.applyingClassId} • {application.mobile}</Typography></Box>
              <Stack direction="row" spacing={1} alignItems="center"><AdmissionStatusBadge status={application.applicationStatus} /><Button size="small" onClick={()=>updateStatus(application.id,'Approved')}>Approve</Button><Button size="small" color="warning" onClick={()=>updateStatus(application.id,'Waiting List')}>Waiting</Button><Button size="small" color="error" onClick={()=>openReject(application.id)}>Reject</Button></Stack>
            </Stack></CardContent></Card>
          ))}
        </Stack>
      )}
      {tab === 2 && <Alert severity="success">Admission enquiry form + follow-up and convert-to-application workflow placeholder is included in architecture plan.</Alert>}
      {tab === 3 && <Alert severity="warning">Admission fee module with Razorpay integration placeholder, receipt generation, and payment status tracking is scaffolded.</Alert>}
      <Dialog open={Boolean(selectedId)} onClose={() => setSelectedId(null)}><DialogTitle>Reject Application</DialogTitle><DialogContent><TextField autoFocus fullWidth multiline rows={3} label="Rejection reason" value={rejectReason} onChange={(e)=>setRejectReason(e.target.value)} /></DialogContent><DialogActions><Button onClick={() => setSelectedId(null)}>Cancel</Button><Button color="error" onClick={confirmReject} disabled={!rejectReason.trim()}>Reject</Button></DialogActions></Dialog>
    </Stack>
  );
}
