import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import loginBg from '../../assets/login.png';
import NexSchoolLogo from '../../components/layout/NexSchoolLogo';

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
    <div className="flex min-h-screen">
      {/* Left Section - School Illustration Background */}
      <div
        className="hidden lg:flex lg:w-3/4 relative flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-indigo-900/40" />

        {/* Content on top of the image */}
        <div className="relative z-10 text-center text-white px-12">
          <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg">NexSchool</h2>
          <p className="text-xl text-blue-100 mb-12 drop-shadow">
            Empowering Education, Simplifying Management
          </p>

        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/4 flex items-center justify-center px-6 py-12 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="w-full max-w-md">
          {/* Logo & Brand */}
          <div className="text-center mb-10">
            <NexSchoolLogo />
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Sign in to your NexSchool account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <input
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm"
                type="email"
                placeholder="Enter your username"
                {...register('email', { required: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm"
                type="password"
                placeholder="Enter your password"
                {...register('password', { required: true })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-200"
            >
              Sign In
            </button>
          </form>

          {/* Forgot Password */}
          <div className="text-center mt-6">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Demo hint */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800 text-center">
              <span className="font-semibold">Demo:</span> Use any email/password to sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}