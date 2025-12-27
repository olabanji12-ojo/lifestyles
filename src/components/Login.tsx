import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, googleSignIn, currentUser, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get redirect URL from query params
  const redirect = searchParams.get('redirect') || '/';

  // If already logged in, redirect based on role
  useEffect(() => {
    if (currentUser && role) {
      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate(redirect);
      }
    }
  }, [currentUser, role, navigate, redirect]);

  // Handle redirect after successful login based on role
  useEffect(() => {
    if (loginSuccess && role) {
      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate(redirect);
      }
      setLoginSuccess(false); // Reset for next login
    }
  }, [loginSuccess, role, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      setLoginSuccess(true); // Trigger role-based redirect in useEffect
    } catch (err: any) {
      console.error(err);

      // Provide user-friendly error messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      await googleSignIn();
      setLoginSuccess(true); // Trigger role-based redirect in useEffect
    } catch (error: any) {
      console.error('Google Sign-In failed', error);
      setError(error.message || 'Google Sign-In failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-12 font-sans-serif"
    >
      <div
        className="max-w-md w-full bg-white shadow-premium p-10 lg:p-14 border border-gray-50"
        data-aos="fade-up"
      >
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.5em] text-gold-600 font-bold uppercase mb-4 block">Identity Verification</span>
          <h2 className="text-5xl font-serif text-gray-900 tracking-tight">Access Archives</h2>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed italic uppercase tracking-widest">Entering the world of INSPIRE</p>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-2 border-rose-400 p-4 mb-8 text-rose-600 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-3">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border-transparent border-b border-gray-100 px-0 py-4 focus:bg-white focus:border-gold-600 focus:outline-none transition-all text-sm tracking-wide"
              placeholder="curator@inspire.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" title="Enter Password" className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-3">Secret Key</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-transparent border-b border-gray-100 px-0 py-4 focus:bg-white focus:border-gold-600 focus:outline-none transition-all text-sm tracking-wide"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => alert('Recovery protocol coming soon!')}
              className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-gold-600 transition-colors"
            >
              Lost Access?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-gold-600 transition-all disabled:opacity-50 shadow-premium"
          >
            {loading ? 'Verifying...' : 'Authorize Access'}
          </button>
        </form>

        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Alternative protocol</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white border border-gray-100 py-5 hover:bg-gray-50 transition-all shadow-soft"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5 opacity-70"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Sync with Google</span>
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-12 uppercase tracking-widest font-bold">
          New to the collective?{' '}
          <Link to="/signup" className="text-gold-600 hover:text-gray-900 transition-colors">
            Initiate Account
          </Link>
        </p>
      </div>
    </section>
  );
}