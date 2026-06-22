import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import LegalModal from '../components/modals/LegalModal';
import IconLogo from '../assets/LoginPage/icon.png';
import LeftSide from '../assets/LoginPage/LeftSideImg.png';
import IconMail from '../assets/LoginPage/IconMail.png';
import IconPass from '../assets/LoginPage/IconPass.png';
import IconEyePass from '../assets/LoginPage/IconEyePass.png';
import FowardIcon from '../assets/LoginPage/FowardIcon.png';

// Asset Icon and Picture
const imgImage = LeftSide;
const imgContainer = IconLogo;
const imgIcon = IconMail;
const imgIcon1 = IconPass;
const imgEyeIcon = IconEyePass;
const imgContainer2 = FowardIcon;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null); // 'privacy' or 'terms' or null
  
  const navigate = useNavigate();
  const { fetchUser } = useUser();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Email and Password are required!');
    }

    if (!validateEmail(email)) {
      return setError('Invalid email format!');
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || 'Login failed, please try again.');
      }

      localStorage.setItem('token', data.token);

      // Sinkronkan state user global dengan data terbaru dari server
      await fetchUser();

      if (data.user.isOnboarded) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding/step-1', { replace: true });
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const privacyContent = (
    <>
      <section className="space-y-3">
        <h4 className="font-bold text-[#191c1e]">1. Data Collection</h4>
        <p>We collect information you provide directly to us, such as when you create an account, update your profile, or use our career tracking features. This includes your name, email, educational background, and professional interests.</p>
      </section>
      <section className="space-y-3">
        <h4 className="font-bold text-[#191c1e]">2. Use of Information</h4>
        <p>Your data is used to personalize your experience, provide career guidance, and improve our services. We do not sell your personal information to third parties.</p>
      </section>
      <section className="space-y-3">
        <h4 className="font-bold text-[#191c1e]">3. Data Security</h4>
        <p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is 100% secure.</p>
      </section>
      <section className="space-y-3">
        <h4 className="font-bold text-[#191c1e]">4. Your Rights</h4>
        <p>You have the right to access, correct, or delete your personal information at any time through your account settings.</p>
      </section>
    </>
  );

  const termsContent = (
    <>
      <section className="space-y-3">
        <h4 className="font-bold text-[#191c1e]">1. Acceptance of Terms</h4>
        <p>By accessing or using ProdActivity, you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not use our platform.</p>
      </section>
      <section className="space-y-3">
        <h4 className="font-bold text-[#191c1e]">2. User Accounts</h4>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
      </section>
      <section className="space-y-3">
        <h4 className="font-bold text-[#191c1e]">3. Prohibited Conduct</h4>
        <p>You agree not to use the service for any unlawful purposes or in any way that could damage, disable, or impair our servers or networks.</p>
      </section>
      <section className="space-y-3">
        <h4 className="font-bold text-[#191c1e]">4. Termination</h4>
        <p>We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms.</p>
      </section>
    </>
  );

  return (
    <div className="flex h-screen w-full bg-[#f8f9fb] font-inter overflow-hidden">
      {/* Left Side ... (remains same) */}
      <div className="hidden lg:flex flex-[1.2] bg-[#00174b] relative overflow-hidden items-start justify-center">
        <div className="absolute inset-0 mix-blend-overlay opacity-50">
          <img alt="" className="absolute h-full left-[-30%] max-w-none top-0 w-[160%] object-cover" src={imgImage} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#00174b]/95 via-[#00174b]/80 to-transparent" />
        
        <div className="flex flex-col h-full justify-between p-12 relative z-10 w-full">
          {/* Logo */}
          <div className="flex gap-2 items-center">
            <div className="bg-[#2563eb] flex items-center justify-center rounded-sm w-8 h-8 p-1.5">
              <img alt="Logo Icon" src={imgContainer} className="w-full h-full" />
            </div>
            <span className="text-white text-xl font-semibold tracking-tight">ProdActivity</span>
          </div>

          {/* Text Content */}
          <div className="max-w-md space-y-4">
            <h1 className="text-white text-4xl font-bold leading-tight tracking-tight">Accelerate your career journey.</h1>
            <p className="text-[#b4c5ff] text-lg leading-relaxed opacity-90">
              Connect with industry experts, get personalized guidance, and take the next step in your professional development.
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#e7e8ea] border-2 border-[#00174b] flex items-center justify-center text-[10px] font-bold text-[#191c1e]">JD</div>
              <div className="w-8 h-8 rounded-full bg-[#2563eb] border-2 border-[#00174b] flex items-center justify-center text-[10px] font-bold text-white">AM</div>
              <div className="w-8 h-8 rounded-full bg-[#dfe0e0] border-2 border-[#00174b] flex items-center justify-center text-[10px] font-bold text-[#191c1e]">+5</div>
            </div>
            <p className="text-[#b4c5ff] text-sm font-medium">Join thousands of active students.</p>
          </div>
        </div>
      </div>

      {/* Right Side: Interaction Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute bg-[#2563eb]/5 blur-[64px] w-3/4 h-1/2 rounded-full top-1/4 left-1/4 -z-10" />
        
        <div className="bg-white border border-[#e1e2e4] shadow-[0px_12px_24px_rgba(17,24,39,0.05)] rounded-2xl p-8 lg:p-10 w-full max-w-[448px] relative z-10 space-y-8">
          <div className="space-y-2">
            <h2 className="text-[#191c1e] text-2xl font-bold tracking-tight">Welcome back to your career journey</h2>
            <p className="text-[#434655] text-sm leading-relaxed">
              Please enter your credentials to continue your mentorship session.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 text-xs font-medium text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[#191c1e] text-sm font-semibold">Email</label>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="nama@universitas.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#c3c6d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb] transition-all text-[15px] placeholder:text-[#c3c6d7]/80"
                />
                <img src={imgIcon} alt="" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-4 opacity-50 group-focus-within:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[#191c1e] text-sm font-semibold">Password</label>
                <Link to="/forgotpassword" className="text-[#004ac6] text-xs font-semibold hover:underline decoration-2 underline-offset-2">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-white border border-[#c3c6d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb] transition-all text-[15px] placeholder:text-[#c3c6d7]/80"
                />
                <img src={imgIcon1} alt="" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-5 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <img src={imgEyeIcon} alt="Toggle Visibility" className="w-5 h-4 opacity-40 hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] text-[#eeefff] py-4 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-[#1d4ed8] active:scale-[0.98] transition-all shadow-[0px_4px_12px_rgba(37,99,235,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Enter'}
              {!loading && <img src={imgContainer2} alt="" className="w-3 h-3 brightness-0 invert" />}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[#434655] text-sm">
              Don't have an account yet? <Link to="/register" className="text-[#004ac6] font-bold ml-1 hover:underline decoration-2 underline-offset-2">Create an Account</Link>
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 flex gap-8 text-[#737686] text-[11px] font-bold tracking-widest uppercase opacity-80">
          <button 
            onClick={() => setModalType('privacy')}
            className="hover:text-[#2563eb] transition-colors"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => setModalType('terms')}
            className="hover:text-[#2563eb] transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </div>

      <LegalModal 
        isOpen={modalType === 'privacy'}
        onClose={() => setModalType(null)}
        title="Privacy Policy"
        content={privacyContent}
      />
      <LegalModal 
        isOpen={modalType === 'terms'}
        onClose={() => setModalType(null)}
        title="Terms of Service"
        content={termsContent}
      />
    </div>
  );
};

export default Login;