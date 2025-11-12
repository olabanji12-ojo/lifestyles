import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email === 'emmanuelojo291@gmail.com' && password === 'tofunmie') {
        localStorage.setItem('adminAuth', 'true');
        toast.success('Welcome back, Boss.');
        navigate('/dashboard');
      } else {
        toast.error('Access denied.');
      }
      setLoading(false);
    }, 1200);
  };

  return (
  <div className="h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bed1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-12 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-white tracking-widest">INSPIRE</h1>
          <p className="text-white/70 text-sm mt-2">Admin Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-5 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-5 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-all duration-300"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                ENTER
              </>
            )}
          </button>

         <div className="mt-6 space-y-2 text-center">
  <Link
    to="/forgot-password"
    className="text-white/60 hover:text-yellow-400 text-xs transition"
  >
    Forgot password?
  </Link>

  <p className="text-white/50 text-xs">
    Haven’t signed in?{' '}
    <Link
      to="/register"
      className="text-yellow-400 hover:text-yellow-300 underline transition"
    >
      Sign up / Register
    </Link>
  </p>

  <p className="text-white/40 text-[10px]">
    Demo: admin@inspire.ng / inspire2025
  </p>
</div>
        </form>
      </div>
    </div>
  );
}