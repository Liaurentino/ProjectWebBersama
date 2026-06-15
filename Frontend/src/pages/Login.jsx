import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Asset dari Figma
const imgImage = "https://www.figma.com/api/mcp/asset/652ddd11-ffc5-4842-a14d-57f13f730a3f";
const imgContainer = "https://www.figma.com/api/mcp/asset/e7ca7bc4-3a55-4a96-81ab-c6a2c9f85f56";
const imgIcon = "https://www.figma.com/api/mcp/asset/6743aa87-14a1-4c14-afb7-52e1fae84ab4";
const imgIcon1 = "https://www.figma.com/api/mcp/asset/63341217-9b81-41ae-bafa-34c8829a7b75";
const imgEyeIcon = "https://www.figma.com/api/mcp/asset/c710f133-22be-48a5-9b49-190e6caf6e1b";
const imgContainer2 = "https://www.figma.com/api/mcp/asset/67f5a7cc-4c3f-4a2f-a33d-8b72415d454f";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Email dan Password wajib diisi!');
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
        return setError(data.message || 'Login gagal, coba lagi.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Tidak dapat terhubung ke server. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f9fb] font-inter overflow-hidden">
      {/* Left Side: Visual Anchor (Hidden on mobile) */}
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

        <div className="absolute bottom-6 flex gap-8 text-[#737686] text-[11px] font-bold tracking-widest uppercase opacity-60">
          <Link to="#" className="hover:text-[#2563eb] transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-[#2563eb] transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;