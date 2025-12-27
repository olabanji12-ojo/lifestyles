import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signup, googleSignIn, role } = useAuth();
  const navigate = useNavigate();

  // Handle redirect after successful signup based on role
  useEffect(() => {
    if (signupSuccess && role) {
      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
      setSignupSuccess(false); // Reset for next signup
    }
  }, [signupSuccess, role, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      await signup(email, password, name);
      setSignupSuccess(true); // Trigger role-based redirect in useEffect
    } catch (err: any) {
      console.error(err);

      // Provide user-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      await googleSignIn();
      setSignupSuccess(true); // Trigger role-based redirect in useEffect
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
          <span className="text-[10px] tracking-[0.5em] text-gold-600 font-bold uppercase mb-4 block">Membership Initiation</span>
          <h2 className="text-5xl font-serif text-gray-900 tracking-tight">Join Collective</h2>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed italic uppercase tracking-widest">Begin your archival journey</p>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-2 border-rose-400 p-4 mb-8 text-rose-600 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-3">Full Designation</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border-transparent border-b border-gray-100 px-0 py-4 focus:bg-white focus:border-gold-600 focus:outline-none transition-all text-sm tracking-wide"
              placeholder="Your name"
              required
            />
          </div>

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
            <label htmlFor="password" title="Create Password" className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-3">Secret Key</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-transparent border-b border-gray-100 px-0 py-4 focus:bg-white focus:border-gold-600 focus:outline-none transition-all text-sm tracking-wide"
              placeholder="Create password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" title="Confirm Password" className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-3">Verify Key</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-50 border-transparent border-b border-gray-100 px-0 py-4 focus:bg-white focus:border-gold-600 focus:outline-none transition-all text-sm tracking-wide"
              placeholder="Repeat password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-gold-600 transition-all disabled:opacity-50 shadow-premium mt-4"
          >
            {loading ? 'Initiating...' : 'Confirm Membership'}
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
          Already part of the collective?{' '}
          <Link to="/login" className="text-gold-600 hover:text-gray-900 transition-colors">
            Access Archives
          </Link>
        </p>
      </div>
    </section>
  );
}