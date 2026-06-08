import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Asset dari Figma
const imgSvg = "https://www.figma.com/api/mcp/asset/56ca618c-f567-4140-8578-8b9bce6b589e";
const imgContainer = "https://www.figma.com/api/mcp/asset/148461bc-561d-4ba0-96f1-182f253e5897";
const imgSvgBackArrowIcon = "https://www.figma.com/api/mcp/asset/90db3796-4b27-40aa-ab41-08ab0c6a6619";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success' atau 'error'
  const navigate = useNavigate();

  const handleSend = (e) => {
    e.preventDefault();
    if (!email) return;

    // Simulasi pengiriman kode
    console.log('Mengirim kode reset ke:', email);
    setStatus('success');
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] font-inter flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glow (Opsional, untuk konsistensi dengan Login/Register) */}
      <div className="absolute bg-[#2563eb]/5 blur-[64px] w-3/4 h-1/2 rounded-full top-1/4 left-1/4 -z-10" />

      <div className="bg-white border border-[#f1f5f9] shadow-[0px_12px_24px_rgba(17,24,39,0.05)] rounded-xl p-10 w-full max-w-[440px] relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Icon & Heading */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-white border border-[#e2e8f0] shadow-sm rounded-xl flex items-center justify-center p-4 transition-transform hover:scale-110 duration-300">
            <img src={imgSvg} alt="Lock Icon" className="w-full h-full object-contain" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-[#0f172a] text-[30px] font-bold leading-tight tracking-tight">Forgot your password?</h1>
            <p className="text-[#64748b] text-[14px] leading-relaxed">
              We will send the code to your email
            </p>
          </div>
        </div>

        {/* Success Message */}
        {status === 'success' ? (
          <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-center animate-in slide-in-from-bottom-2 duration-300">
            <p className="text-green-700 text-sm font-medium">Reset code has been sent to your email!</p>
            <button 
              onClick={() => setStatus(null)} 
              className="mt-2 text-green-600 text-xs font-bold hover:underline"
            >
              Change email
            </button>
          </div>
        ) : (
          /* Form Section */
          <form onSubmit={handleSend} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[#334155] text-sm font-semibold">Email</label>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb] transition-all text-sm placeholder:text-[#94a3b8]"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#2563eb] text-white py-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#1d4ed8] active:scale-[0.98] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
            >
              Send
              <img src={imgContainer} alt="" className="w-3 h-3 brightness-0 invert" />
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

export default ForgotPassword;
