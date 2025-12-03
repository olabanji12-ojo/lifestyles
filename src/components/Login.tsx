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
      className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-12"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div
        className="max-w-md w-full bg-white rounded-lg shadow-md p-8"
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
      >
        <h2
          className="text-3xl font-serif font-bold text-[#3E3E3E] text-center mb-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Welcome Back
        </h2>
        <p
          className="text-center text-[#3E3E3E] mb-8"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Log in to your INSPIRE account
        </p>

        {error && (
          <p
            className="text-red-500 text-center mb-4"
            data-aos="fade-up"
            data-aos-delay="350"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div data-aos="fade-right" data-aos-delay="400">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#3E3E3E] mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F4C430] transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div data-aos="fade-right" data-aos-delay="500">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#3E3E3E] mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F4C430] transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>
           <div className="text-right mb-4">
            <button 
              onClick={(e) => { 
                e.preventDefault(); 
                alert('Password reset feature coming soon!'); 
              }} 
              className="text-[#F4C430] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#F4C430] hover:bg-[#E5B520] text-[#3E3E3E] font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div
          className="mt-6 flex flex-col items-center"
          data-aos="fade-up"
          data-aos-delay="750"
        >
          <p className="text-sm text-gray-600 mb-2">or continue with</p>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-all duration-300"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="text-[#3E3E3E] font-medium">Sign in with Google</span>
          </button>
        </div>

        <p
          className="text-center text-sm text-[#3E3E3E] mt-6"
          data-aos="fade-up"
          data-aos-delay="700"
        >
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#F4C430] hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}