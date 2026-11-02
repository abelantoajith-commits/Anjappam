import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { 
  Building2, 
  User, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  ArrowLeft,
  HandPlatter,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    institutionName: '',
    contactName: '',
    phone: '',
    userType: 'donor', // 'donor' | 'receiver'
    username: '',
    password: '',
    repeatPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};

    if (!formData.institutionName.trim()) {
      errs.institutionName = 'Institution or organization name is required (or "Individual").';
    }

    if (!formData.contactName.trim()) {
      errs.contactName = 'Contact person name is required.';
    }

    // Indian mobile phone format validation (10 digits, optional +91 or 0 prefix)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (phoneDigits.length < 10) {
      errs.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    // Username validation: 4-20 characters
    if (!formData.username.trim()) {
      errs.username = 'Username is required.';
    } else if (formData.username.trim().length < 4 || formData.username.trim().length > 20) {
      errs.username = 'Username must be between 4 and 20 characters.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      errs.username = 'Username can only contain letters, numbers, and underscores.';
    }

    // Password validation: min 8 characters
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }

    // Repeat password match
    if (formData.password !== formData.repeatPassword) {
      errs.repeatPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Normalize phone with +91 format if clean 10 digits
      let formattedPhone = formData.phone.trim();
      const digits = formattedPhone.replace(/\D/g, '');
      if (digits.length === 10) {
        formattedPhone = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
      }

      const newUser = await signup({
        ...formData,
        phone: formattedPhone,
      });

      addToast(`Welcome to Anjappam, ${newUser.contactName}! Your account is ready.`, 'success');

      // Redirect by user type (PRD §8.6)
      if (newUser.userType === 'donor') {
        navigate('/donate');
      } else {
        navigate('/receive');
      }
    } catch (err) {
      addToast(err.message || 'Registration failed. Please check details.', 'error');
      setErrors((prev) => ({ ...prev, form: err.message }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#FFF8EE] via-[#FFF1E8] to-[#FFF8EE]">
      <div className="w-full max-w-2xl relative">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#C98A2B]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#5E7B3A]/15 blur-3xl pointer-events-none" />

        {/* Back Link to Home */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#845400] hover:text-[#3B2A1A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Main Registration Card */}
        <div className="relative bg-white shadow-xl rounded-3xl p-6 sm:p-10 border border-[#E8D9C5] text-[#3B2A1A]">
          
          {/* Five Loaves Decorative Motif */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#C98A2B]"></span>
            <span className="w-3 h-3 rounded-full bg-[#C98A2B]"></span>
            <span className="w-4 h-4 rounded-full bg-[#C98A2B]"></span>
            <span className="w-3 h-3 rounded-full bg-[#C98A2B]"></span>
            <span className="w-2 h-2 rounded-full bg-[#C98A2B]"></span>
          </div>

          {/* Header Section: Title is Registration Form (PRD Override) */}
          <div className="flex flex-col items-center text-center mb-8">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <img src="/logo.svg" alt="Anjappam Emblem" className="w-9 h-9 rounded-full shadow-sm" />
              <span className="font-serif text-2xl font-bold tracking-tight text-[#3B2A1A]">ANJAPPAM</span>
            </Link>
            <span className="text-[11px] uppercase tracking-widest text-[#845400] font-bold mb-1">
              Kerala Community Breadshare
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2A1A] tracking-tight mb-2">
              Registration Form
            </h1>
            <p className="text-sm text-[#514536] max-w-md leading-relaxed">
              Register your institution, kitchen, or home to share abundance and receive prepared meals with dignity across Kerala.
            </p>
          </div>

          {/* Demo-mode password notice (PRD §2 & §8.6) */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFEADA] border border-[#E8D9C5] text-xs text-[#845400] mb-6">
            <ShieldAlert className="w-4 h-4 text-[#845400] shrink-0 mt-0.5" />
            <span>
              <strong>Demo notice:</strong> All accounts live solely in your current browser. Passwords are locally hashed with SHA-256, but please do not use a password you use on other websites.
            </span>
          </div>

          {errors.form && (
            <div className="p-3 mb-6 rounded-2xl bg-[#FFDAD8] border border-[#FFB3B0] text-xs text-[#7A2E2E] font-medium text-center">
              {errors.form}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* User Type: Donor / Receiver Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A] flex items-center justify-between">
                <span>Select Your Calling <span className="text-[#7A2E2E]">*</span></span>
                <span className="text-[11px] font-normal text-[#837564]">Active in all 14 Kerala districts</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-[#FFF8EE] rounded-2xl border border-[#E8D9C5]">
                {/* Donor Option */}
                <label
                  className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                    formData.userType === 'donor'
                      ? 'bg-white border-[#C98A2B] shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-white/50 text-[#514536]'
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="donor"
                    checked={formData.userType === 'donor'}
                    onChange={() => setFormData({ ...formData, userType: 'donor' })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    formData.userType === 'donor' ? 'border-[#C98A2B] bg-[#C98A2B]' : 'border-[#837564]'
                  }`}>
                    {formData.userType === 'donor' && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#3B2A1A] flex items-center gap-1.5">
                      <span>Food Donor</span>
                      <HandPlatter className="w-4 h-4 text-[#845400]" />
                    </div>
                    <p className="text-xs text-[#837564]">Caterer, Restaurant, Bakery, Home</p>
                  </div>
                </label>

                {/* Receiver Option */}
                <label
                  className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                    formData.userType === 'receiver'
                      ? 'bg-white border-[#5E7B3A] shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-white/50 text-[#514536]'
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="receiver"
                    checked={formData.userType === 'receiver'}
                    onChange={() => setFormData({ ...formData, userType: 'receiver' })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    formData.userType === 'receiver' ? 'border-[#5E7B3A] bg-[#5E7B3A]' : 'border-[#837564]'
                  }`}>
                    {formData.userType === 'receiver' && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#3B2A1A] flex items-center gap-1.5">
                      <span>Food Receiver</span>
                      <UtensilsCrossed className="w-4 h-4 text-[#5E7B3A]" />
                    </div>
                    <p className="text-xs text-[#837564]">Shelter, Orphanage, Care Home</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Field 1: Name of the institution */}
            <div className="space-y-1">
              <label htmlFor="institutionName" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A]">
                Name of the Institution / Caterer / Home <span className="text-[#7A2E2E]">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                <input
                  id="institutionName"
                  type="text"
                  placeholder='e.g. St. Joseph Shelter, Malabar Spice Caterers, or "Individual"'
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all"
                />
              </div>
              {errors.institutionName && <p className="text-xs text-[#7A2E2E] pl-3">{errors.institutionName}</p>}
            </div>

            {/* Field 2 & 3: Contact Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="contactName" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A]">
                  Name of Contact Person <span className="text-[#7A2E2E]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                  <input
                    id="contactName"
                    type="text"
                    placeholder="e.g. Thomas Mathew"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all"
                  />
                </div>
                {errors.contactName && <p className="text-xs text-[#7A2E2E] pl-3">{errors.contactName}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A]">
                  Phone Number <span className="text-[#7A2E2E]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="10-digit Indian Mobile"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all"
                  />
                </div>
                {errors.phone && <p className="text-xs text-[#7A2E2E] pl-3">{errors.phone}</p>}
              </div>
            </div>

            {/* Field 4: Username */}
            <div className="space-y-1">
              <label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A]">
                Username <span className="text-[#7A2E2E]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#837564]">@</span>
                <input
                  id="username"
                  type="text"
                  placeholder="Unique username (4–20 characters)"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all"
                />
              </div>
              {errors.username && <p className="text-xs text-[#7A2E2E] pl-3">{errors.username}</p>}
            </div>

            {/* Field 5 & 6: Password and Repeat Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A]">
                  Password <span className="text-[#7A2E2E]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-11 py-3 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all"
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
                {errors.password && <p className="text-xs text-[#7A2E2E] pl-3">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="repeatPassword" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A]">
                  Repeat Password <span className="text-[#7A2E2E]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                  <input
                    id="repeatPassword"
                    type={showRepeatPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={formData.repeatPassword}
                    onChange={(e) => setFormData({ ...formData, repeatPassword: e.target.value })}
                    className="w-full pl-11 pr-11 py-3 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#837564] hover:text-[#3B2A1A]"
                    aria-label="Toggle repeat password visibility"
                  >
                    {showRepeatPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.repeatPassword && <p className="text-xs text-[#7A2E2E] pl-3">{errors.repeatPassword}</p>}
              </div>
            </div>

            {/* Submit Button (Per PRD Override: Button label is "Submit") */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-[#C98A2B] text-white hover:bg-[#845400] font-sans font-bold text-base shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <span>Submit</span>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-[#514536]">
                Already have an account registered on this browser?{' '}
                <Link to="/login" className="font-bold text-[#845400] hover:underline underline-offset-4">
                  Log in here
                </Link>
              </p>
            </div>

          </form>

        </div>
      </div>
    </main>
  );
}

