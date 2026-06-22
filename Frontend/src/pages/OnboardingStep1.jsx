import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import Study from "../assets/ProfilePage/Study.png"
import Back from "../assets/ForgotPasswordPage/BackArrow.png"
import Front from "../assets/ForgotPasswordPage/FrontArrow.png"
import Question from "../assets/RegisterPage/QuestionIcon.png"

const imgIconArrow = Study;
const imgContainerContinue = Front;
const imgIconBack = Back;
const imgIconUser = Question;

// Konversi angka semester dari database (1-8) ke label tampilan ('1'-'7', '8+')
const semesterNumberToLabel = (num) => {
  if (!num) return null;
  return num >= 8 ? '8+' : String(num);
};

const OnboardingStep1 = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = useUser();

  // Prefill dari data user di context, kalau sudah pernah isi step-1 sebelumnya
  const [department, setDepartment] = useState(user?.jurusan || '');
  const [semester, setSemester] = useState(semesterNumberToLabel(user?.semester));
  const [loading, setLoading] = useState(false);

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8+'];

  const handleContinue = async () => {
    if (!department || !semester) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/onboarding/step-1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          jurusan: department, 
          semester 
        }),
      });

      if (!res.ok) throw new Error('Failed to save step 1');

      // Refresh data user di context agar jurusan terisi
      await fetchUser();
      
      navigate('/onboarding/step-2');
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] font-inter flex flex-col relative overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="h-14 w-full bg-white flex items-center justify-between px-4 fixed top-0 left-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/login')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <img src={imgIconBack} alt="Back" className="w-4 h-4" />
          </button>
          <span className="text-[#004ac6] text-lg font-bold tracking-tight">ProdActivity</span>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <img src={imgIconUser} alt="User" className="w-5 h-5" />
        </button>
      </nav>
 
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center pt-24 pb-32 px-6">
        <div className="w-full max-w-[672px] space-y-12">
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-[#004ac6]">Step 1 of 2</span>
              <span className="text-[#737686]">50% Complete</span>
            </div>
            <div className="h-1.5 w-full bg-[#edeef0] rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-[#004ac6] rounded-full" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-[#191c1e] text-3xl md:text-4xl font-bold tracking-tight">
              Tell us about your academic background
            </h1>
            <p className="text-[#434655] text-lg">
              Help AI Mentor understand your current course context.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Department Input */}
            <div className="space-y-2">
              <label className="text-[#434655] text-base font-medium">Department / Study Program</label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Example: Informatics Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-6 pr-12 py-4 bg-white border border-[#c3c6d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb] transition-all text-base placeholder:text-[#6b7280]"
                />
                <img src={imgIconArrow} alt="" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-4 opacity-40" />
              </div>
            </div>

            {/* Semester Selection */}
            <div className="space-y-4">
              <label className="text-[#434655] text-base font-medium">Current Semester</label>
              <div className="flex flex-wrap gap-3">
                {semesters.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSemester(s)}
                    className={`min-w-[56px] px-6 py-3 rounded-full border transition-all font-medium text-base ${
                      semester === s 
                        ? 'bg-[#004ac6] border-[#004ac6] text-white shadow-md' 
                        : 'bg-white border-[#c3c6d7] text-[#191c1e] hover:border-[#004ac6] hover:text-[#004ac6]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-[#e7e8ea] py-4 px-6 md:px-32 z-50">
        <div className="max-w-[1024px] mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-[#f3f4f6] text-[#434655] font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Return
          </button>
          <button 
            onClick={handleContinue}
            disabled={!department || !semester || loading}
            className={`px-8 py-4 flex items-center gap-2 font-semibold rounded-lg transition-all shadow-sm ${
              department && semester && !loading
                ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.98]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Saving...' : 'Continue'}
            {!loading && <img src={imgContainerContinue} alt="" className="w-3.5 h-3.5 brightness-0 invert" />}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingStep1;