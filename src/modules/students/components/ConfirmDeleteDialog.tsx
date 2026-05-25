import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
export function ConfirmDeleteDialog({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
 return <Dialog open={open} onClose={onClose}><DialogTitle>Deactivate student?</DialogTitle><DialogContent>This will soft delete the student by marking status as inactive.</DialogContent><DialogActions><Button onClick={onClose}>Cancel</Button><Button onClick={onConfirm} color="error" variant="contained">Confirm</Button></DialogActions></Dialog>;
}
