import { Button, Stack, Typography } from '@mui/material';
export function StudentDocumentUploader() { return <Stack spacing={1}><Typography variant="subtitle2">Document Upload (Firebase Storage placeholder)</Typography><Button variant="outlined" component="label">Upload<input hidden type="file" multiple /></Button></Stack>; }
