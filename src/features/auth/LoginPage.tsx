import { Box, Button, Paper, TextField, Typography } from '@mui/material';
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
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <Paper sx={{ p: 4, width: 380 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth margin="normal" label="Email" {...register('email', { required: true })} />
          <TextField fullWidth margin="normal" label="Password" type="password" {...register('password', { required: true })} />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Sign In</Button>
        </form>
      </Paper>
    </Box>
  );
}
