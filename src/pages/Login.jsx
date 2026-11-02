import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  HandPlatter, 
  UtensilsCrossed, 
  Sparkles,
  Info
} from 'lucide-react';
import { LOGIN_BANNER_VERSE } from '../data/quotes';

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Return to previous page or appropriate default dashboard
  const destination = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const user = await login(identifier, password);
      addToast(`Welcome back, ${user.contactName}!`, 'success');

      if (destination) {
        navigate(destination, { replace: true });
      } else if (user.userType === 'donor') {
        navigate('/donate', { replace: true });
      } else {
        navigate('/receive', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (demoUsername) => {
    setIdentifier(demoUsername);
    setPassword('demo1234');
    setSubmitting(true);
    setError('');

    try {
      const user = await login(demoUsername, 'demo1234');
      addToast(`Logged in as demo ${user.userType}: ${user.institutionName}`, 'success');

      if (destination) {
        navigate(destination, { replace: true });
      } else if (user.userType === 'donor') {
        navigate('/donate', { replace: true });
      } else {
        navigate('/receive', { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#FFF8EE] via-[#FFF1E8] to-[#FFF8EE]">
      <div className="w-full max-w-md relative">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#C98A2B]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#5E7B3A]/20 blur-3xl pointer-events-none" />

        {/* Centered Anjappam Logo and Wordmark above the Form Card */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <Link to="/" className="flex items-center gap-2 mb-1.5 group cursor-pointer focus:outline-none" aria-label="Anjappam Home">
            <img src="/logo.svg" alt="Anjappam Emblem" className="w-10 h-10 rounded-full shadow-sm group-hover:scale-105 transition-transform" />
            <span className="font-serif text-3xl font-bold tracking-tight text-[#3B2A1A] group-hover:text-[#845400] transition-colors">
              ANJAPPAM
            </span>
          </Link>
          <p className="text-[11px] uppercase tracking-widest text-[#845400] font-bold">
            Five Loaves · Bread for All
          </p>
        </div>

        {/* Back Link to Home */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#845400] hover:text-[#3B2A1A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Sanctuary</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="relative bg-white shadow-xl rounded-3xl p-6 sm:p-8 border border-[#E8D9C5] text-[#3B2A1A]">
          
          <div className="flex flex-col items-center text-center mb-6">
            {/* Daily Bread Scripture Banner */}
            <div className="mb-4 p-3 bg-[#FFF8EE] rounded-2xl w-full border border-[#E8D9C5]">
              <p className="font-serif italic text-sm text-[#845400]">
                &ldquo;{LOGIN_BANNER_VERSE.verse}&rdquo;
              </p>
              <span className="text-[10px] uppercase font-bold text-[#837564] tracking-wider mt-0.5 block">
                — {LOGIN_BANNER_VERSE.reference}
              </span>
            </div>

            <h1 className="font-serif text-2xl font-bold text-[#3B2A1A]">
              Sign In to Your Account
            </h1>
          </div>

          {error && (
            <div className="p-3 mb-5 rounded-2xl bg-[#FFDAD8] border border-[#FFB3B0] text-xs text-[#7A2E2E] font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label htmlFor="identifier" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A]">
                Username or Phone
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                <input
                  id="identifier"
                  type="text"
                  placeholder="e.g. donor_demo or receiver_demo"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#837564] hover:text-[#3B2A1A]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#845400] text-white hover:bg-[#643F00] font-sans font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Quick Demo Account Shortcuts (PRD §9) */}
          <div className="mt-6 pt-5 border-t border-[#E8D9C5]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#845400] mb-2 text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Demo Accounts</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('donor_demo')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#FFEADA] text-[#845400] hover:bg-[#FFE3CD] text-xs font-semibold border border-[#E8D9C5] transition-all"
              >
                <HandPlatter className="w-3.5 h-3.5" />
                <span>Donor Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('receiver_demo')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#CCEEA0] text-[#1E3500] hover:bg-[#B0D186] text-xs font-semibold border border-[#B0D186] transition-all"
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#5E7B3A]" />
                <span>Receiver Demo</span>
              </button>
            </div>
            <p className="text-[11px] text-[#837564] text-center mt-2">
              Password for demo accounts: <code className="bg-[#FFF8EE] px-1.5 py-0.5 rounded text-[#3B2A1A]">demo1234</code>
            </p>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-[#E8D9C5]">
            <p className="text-xs text-[#514536]">
              Don&apos;t have an account yet?{' '}
              <Link to="/signup" className="font-bold text-[#C98A2B] hover:text-[#845400] underline underline-offset-4">
                Register here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

