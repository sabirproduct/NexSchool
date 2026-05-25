import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

type LoginForm = { email: string; password: string };

export function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const onSubmit = ({ email }: LoginForm) => {
    setUser({ uid: 'demo', email, role: 'super_admin', schoolId: 'school_001' });
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        px: 2,
        background: 'linear-gradient(145deg, #e8f0ff 0%, #f6f7fb 60%, #ffffff 100%)',
      }}
    >
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420, borderRadius: 4 }} elevation={4}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <LockRoundedIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>Sign in to NexSchool</Typography>
          </Stack>
          <Alert severity="info">Use any email/password for demo access.</Alert>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField fullWidth margin="normal" label="Email" {...register('email', { required: true })} />
            <TextField fullWidth margin="normal" label="Password" type="password" {...register('password', { required: true })} />
            <Button fullWidth variant="contained" type="submit" size="large" sx={{ mt: 2 }}>
              Continue
            </Button>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}
