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
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 px-2"
      style={{ background: 'linear-gradient(145deg, #e8f0ff 0%, #f6f7fb 60%, #ffffff 100%)' }}
    >
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center" style={{ width: 38, height: 38 }}>
              🔒
            </div>
            <div>
              <h1 className="h5 mb-0">Sign in to NexSchool</h1>
            </div>
          </div>

          <div className="alert alert-info">Use any email/password for demo access.</div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" {...register('email', { required: true })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" {...register('password', { required: true })} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100">
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
