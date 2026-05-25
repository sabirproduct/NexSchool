import { Button, Paper, Stack, Typography } from '@mui/material';

export function ReportCardGenerator() {
  return <Paper sx={{ p: 2 }}><Typography variant='h6' mb={1}>Report Card Generator</Typography><Stack direction='row' spacing={1}><Button variant='contained'>Generate PDF</Button><Button variant='outlined'>Print</Button><Button variant='text'>QR Verify (Placeholder)</Button></Stack></Paper>;
}
