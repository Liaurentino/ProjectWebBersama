import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Key from '../assets/ForgotPasswordPage/Key.png'
import FrontArrow from '../assets/ForgotPasswordPage/FrontArrow.png';
import BackArrow from '../assets/ForgotPasswordPage/BackArrow.png';

// Asset and Picture
const imgSvg = Key;
const imgContainer = FrontArrow;
const imgSvgBackArrowIcon = BackArrow;

const EyeIcon = ({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    {open ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </>
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </>
    )}
  </svg>
);

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newPassword || !confirmPassword) {
      return setErrorMsg('Semua kolom wajib diisi.');
    }

    if (newPassword !== confirmPassword) {
      return setErrorMsg('Password dan konfirmasi password tidak cocok.');
    }

    if (newPassword.length < 8) {
      return setErrorMsg('Password minimal 8 karakter.');
    }

    if (!token) {
      return setErrorMsg('Token tidak valid. Minta link reset baru.');
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Gagal reset password.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch (err) {
      setErrorMsg('Tidak dapat terhubung ke server. Coba lagi.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] font-inter flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute bg-[#2563eb]/5 blur-[64px] w-3/4 h-1/2 rounded-full top-1/4 left-1/4 -z-10" />

      <div className="bg-white border border-[#f1f5f9] shadow-[0px_12px_24px_rgba(17,24,39,0.05)] rounded-xl p-10 w-full max-w-[440px] relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">

        {/* Icon & Heading */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-white border border-[#e2e8f0] shadow-sm rounded-xl flex items-center justify-center p-4 transition-transform hover:scale-110 duration-300">
            <img src={imgSvg} alt="Lock Icon" className="w-full h-full object-contain" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-[#0f172a] text-[30px] font-bold leading-tight tracking-tight">Set new password</h1>
            <p className="text-[#64748b] text-[14px] leading-relaxed">
              Your new password must be at least 8 characters.
            </p>
          </div>
        </div>

        {/* Success State */}
        {status === 'success' ? (
          <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-center">
              <p className="text-green-700 text-sm font-medium">Password berhasil diubah!</p>
              <p className="text-green-600 text-xs mt-1">Silakan login dengan password baru kamu.</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#2563eb] text-white py-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#1d4ed8] active:scale-[0.98] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
            >
              Ke halaman Login
              <img src={imgContainer} alt="" className="w-3 h-3 brightness-0 invert" />
            </button>
          </div>
        ) : (
          /* Form Section */
          <form onSubmit={handleReset} className="space-y-5">

            {/* Error message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-xs font-medium">{errorMsg}</p>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-[#334155] text-sm font-semibold">New Password</label>
              <div className="relative group">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 pr-12 py-3.5 bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb] transition-all text-sm placeholder:text-[#94a3b8]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#94a3b8] hover:text-[#475569] transition-colors"
                >
                  <EyeIcon open={showNew} />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[#334155] text-sm font-semibold">Confirm New Password</label>
              <div className="relative group">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 pr-12 py-3.5 bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb] transition-all text-sm placeholder:text-[#94a3b8]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#94a3b8] hover:text-[#475569] transition-colors"
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] text-white py-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#1d4ed8] active:scale-[0.98] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Reset Password'}
              {!loading && <img src={imgContainer} alt="" className="w-3 h-3 brightness-0 invert" />}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-[#475569] text-sm font-medium hover:text-[#2563eb] transition-colors group"
          >
            <img src={imgSvgBackArrowIcon} alt="Back" className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-all" />
            <span>Return to login page</span>
          </button>
        </div>
      </div>

      {/* Branding Footer */}
      <div className="mt-8">
        <p className="text-[#94a3b8] text-[12px] font-medium tracking-[1.2px] uppercase">
          Prodactivity
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;