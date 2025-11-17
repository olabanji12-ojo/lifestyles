import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, googleSignIn } = useAuth();
  const navigate = useNavigate();

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
      navigate('/'); // Redirect to home page after successful signup
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
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      await googleSignIn();
      navigate('/');
    } catch (error: any) {
      console.error('Google Sign-In failed', error);
      setError(error.message || 'Google Sign-In failed. Please try again.');
    } finally {
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
          Join INSPIRE
        </h2>
        <p 
          className="text-center text-[#3E3E3E] mb-8" 
          data-aos="fade-up" 
          data-aos-delay="300"
        >
          Create an account to start your journey
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
              htmlFor="name" 
              className="block text-sm font-medium text-[#3E3E3E] mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F4C430] transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div data-aos="fade-right" data-aos-delay="450">
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
              placeholder="Create a password"
              required
            />
          </div>
          
          <div data-aos="fade-right" data-aos-delay="550">
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-[#3E3E3E] mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F4C430] transition-colors"
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#F4C430] hover:bg-[#E5B520] text-[#3E3E3E] font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
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
            <span className="text-[#3E3E3E] font-medium">Sign up with Google</span>
          </button>
        </div>

        <p 
          className="text-center text-sm text-[#3E3E3E] mt-6" 
          data-aos="fade-up" 
          data-aos-delay="700"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-[#F4C430] hover:underline font-medium">
            Log In
          </Link>
        </p>
      </div>
    </section>
  );
}