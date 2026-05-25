import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

export function ResultPublishDialog({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  return <Dialog open={open} onClose={onClose}><DialogTitle>Publish & Lock Results</DialogTitle><DialogContent><Typography variant='body2'>Once published, marks are locked except for admin override.</Typography></DialogContent><DialogActions><Button onClick={onClose}>Cancel</Button><Button variant='contained' onClick={onConfirm}>Publish</Button></DialogActions></Dialog>;
}
