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
      className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 via-white to-slate-100"
      style={{ minHeight: '100vh' }}
    >
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl shadow-lg">
              🔒
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Sign in to NexSchool</h1>
              <p className="text-sm text-slate-500 mt-1">School management workspace</p>
            </div>
          </div>

          <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-sm text-blue-800">Use any email/password for demo access.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                type="email"
                placeholder="Enter your email"
                {...register('email', { required: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                type="password"
                placeholder="Enter your password"
                {...register('password', { required: true })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
