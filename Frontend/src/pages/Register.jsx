import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Asset dari Figma
const imgImage = "https://www.figma.com/api/mcp/asset/2c54dee7-aa88-4954-b462-b7b9d4a7e4af";
const imgIcon = "https://www.figma.com/api/mcp/asset/8b843771-e3f6-4d6b-a01c-2b06d5541b40";
const imgContainer = "https://www.figma.com/api/mcp/asset/4d5fdd60-907d-4eb9-ab74-dd8da9ca6b23";
const imgIcon1 = "https://www.figma.com/api/mcp/asset/d02f47c1-1934-4af2-b756-5b81ad6b9643";
const imgContainer1 = "https://www.figma.com/api/mcp/asset/c710f133-22be-48a5-9b49-190e6caf6e1b";
const imgContainer2 = "https://www.figma.com/api/mcp/asset/08b8fd94-b1a7-4a38-aa4f-5484b4625981";
const imgContainer3 = "https://www.figma.com/api/mcp/asset/818bc0b9-d28d-4c03-9e86-8916fa8b0d8d";
const imgContainer4 = "https://www.figma.com/api/mcp/asset/de8689f7-7dac-4795-b189-96bec7df7a11";
const imgErrorIcon = "https://www.figma.com/api/mcp/asset/15e7957b-a688-4e3d-97ed-bc8f505fdb3c";

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      return setError('Semua kolom wajib diisi!');
    }

    if (!validateEmail(email)) {
      return setError('Format email tidak valid. Gunakan contoh: jane.doe@example.com');
    }

    // Simulasi email sudah terdaftar
    if (email === 'admin@test.com') {
      return setError('Email sudah terdaftar atau format password salah.');
    }

    if (password !== confirmPassword) {
      return setError('Password dan Konfirmasi Password tidak cocok!');
    }

    if (!agreed) {
      return setError('Anda harus menyetujui Syarat dan Ketentuan!');
    }

    // Simulasi sukses registrasi
    alert('Registrasi berhasil! Silakan login.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] font-inter flex flex-col relative overflow-x-hidden">
      {/* Navbar Placeholder from Figma */}
      <nav className="h-14 w-full bg-[#f8f9fb] flex items-center justify-between px-4 fixed top-0 left-0 z-50">
        <button 
          onClick={() => navigate('/login')}
          className="p-2 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer flex items-center gap-2"
        >
          <img src={imgContainer3} alt="Back" className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[#004ac6] text-2xl font-bold tracking-tight">ProdActivity</span>
        </div>
        <div className="p-2 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer">
          <img src={imgContainer4} alt="User" className="w-5 h-5" />
        </div>
      </nav>

      {/* Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 mt-14 lg:p-12 space-y-6 origin-top scale-[0.7] md:scale-[0.75] lg:scale-[0.8] transition-transform duration-500">
        {error && (
          <div 
            className="w-full max-w-[896px] bg-[#ffdad6] border border-[#ba1a1a] flex gap-4 items-center px-6 py-4 relative rounded-lg shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="flex-shrink-0 w-5 h-5">
              <img src={imgErrorIcon} alt="Error" className="w-full h-full" />
            </div>
            <div className="flex-1">
              <p className="text-[#93000a] text-[14px] font-medium leading-tight">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white max-w-[896px] w-full flex flex-col md:flex-row rounded-xl shadow-[0px_12px_24px_rgba(17,24,39,0.1)] overflow-hidden">
          
          {/* Left Panel: Illustration / Branding */}
          <div className="hidden md:block flex-1 relative min-h-[500px]">
            <div className="absolute inset-0">
              <img src={imgImage} alt="Illustration" className="w-full h-full object-cover scale-[1.1]" />
            </div>
            <div className="absolute inset-0 bg-[#004ac6]/20 mix-blend-multiply" />
            <div className="absolute bottom-0 left-0 p-8 space-y-2">
              <h2 className="text-white text-3xl font-bold tracking-tight">Let's Connect</h2>
              <p className="text-white/90 text-base">Create an account to access premium tools and personalized guidance.</p>
            </div>
          </div>

          {/* Right Panel: Registration Form */}
          <div className="flex-1 p-8 lg:p-10 space-y-6">
            <div className="space-y-1">
              <h1 className="text-[#191c1e] text-3xl font-bold tracking-tight">Create an Account</h1>
              <p className="text-[#434655] text-sm">Fill in your personal data to get started.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Error block removed from here */}

              {/* Full Name Field */}
              <div className="space-y-1">
                <label className="text-[#191c1e] text-xs font-medium tracking-wide">Full Name</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-3.5 bg-white border border-[#c3c6d7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb] transition-all text-sm placeholder:text-[#6b7280]/60"
                  />
                  <img src={imgIcon} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-[#191c1e] text-xs font-medium tracking-wide">Email</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="jane.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-3.5 bg-white border border-[#c3c6d7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb] transition-all text-sm placeholder:text-[#6b7280]/60"
                  />
                  <img src={imgContainer} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-[#191c1e] text-xs font-medium tracking-wide">Password</label>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-3.5 bg-white border border-[#c3c6d7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb] transition-all text-sm placeholder:text-[#6b7280]/60"
                  />
                  <img src={imgIcon1} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-50 rounded transition-colors"
                  >
                    <img src={imgContainer1} alt="" className="w-5 h-4 opacity-40 hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <label className="text-[#191c1e] text-xs font-medium tracking-wide">Confirm Password</label>
                <div className="relative group">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-3.5 bg-white border border-[#c3c6d7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb] transition-all text-sm placeholder:text-[#6b7280]/60"
                  />
                  <img src={imgIcon1} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-50 rounded transition-colors"
                  >
                    <img src={imgContainer1} alt="" className="w-5 h-4 opacity-40 hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex gap-2 pt-2">
                <div className="pt-1">
                  <input 
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 rounded border-[#c3c6d7] text-[#2563eb] focus:ring-[#2563eb]"
                  />
                </div>
                <label htmlFor="terms" className="text-[#434655] text-sm leading-tight">
                  I have agreed to the <Link to="#" className="text-[#2563eb] font-bold hover:underline">Terms and Conditions</Link> and <Link to="#" className="text-[#2563eb] font-bold hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full bg-[#2563eb] text-white py-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#1d4ed8] active:scale-[0.99] transition-all shadow-[0px_4px_12px_rgba(37,99,235,0.1)] pt-4 mt-2"
              >
                Create an Account
                <img src={imgContainer2} alt="" className="w-3 h-3 brightness-0 invert" />
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-[#434655] text-sm">
                Already have an account? <Link to="/login" className="text-[#004ac6] font-medium ml-1 hover:underline">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
