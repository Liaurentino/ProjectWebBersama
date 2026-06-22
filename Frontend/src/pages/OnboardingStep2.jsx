import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import Back from "../assets/ForgotPasswordPage/BackArrow.png"
import Front from "../assets/ForgotPasswordPage/FrontArrow.png"
import Question from "../assets/RegisterPage/QuestionIcon.png"

const imgContainerContinue = Front;
const imgIconBack = Back;
const imgIconUser = Question;


const OnboardingStep2 = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useUser();

  const interestOptions = [
    'Software Development',
    'Data Science',
    'UI/UX Design',
    'Project Management',
    'Cyber Security',
    'Artificial Intelligence',
    'Digital Marketing',
    'Business Analysis'
  ];

  const goBackToStep1 = () => {
    navigate('/onboarding/step-1', { state: { intentional: true } });
  };

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleFinish = async () => {
    if (interests.length === 0) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/onboarding/step-2`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ interests }),
      });

      if (!res.ok) throw new Error('Failed to complete onboarding');

      // Refresh data user agar isOnboarded menjadi true
      await fetchUser();
      
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Gagal menyelesaikan onboarding. Silakan coba lagi.');
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
            onClick={goBackToStep1}
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
              <span className="text-[#004ac6]">Step 2 of 2</span>
              <span className="text-[#737686]">100% Complete</span>
            </div>
            <div className="h-1.5 w-full bg-[#edeef0] rounded-full overflow-hidden">
              <div className="h-full w-full bg-[#004ac6] rounded-full" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-[#191c1e] text-3xl md:text-4xl font-bold tracking-tight">
              What are you interested in?
            </h1>
            <p className="text-[#434655] text-lg">
              Select at least one interest to help us personalize your experience.
            </p>
          </div>

          {/* Interests Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interestOptions.map((option) => (
              <button
                key={option}
                onClick={() => toggleInterest(option)}
                className={`flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all font-semibold text-lg ${
                  interests.includes(option)
                    ? 'bg-blue-50 border-[#004ac6] text-[#004ac6] shadow-sm'
                    : 'bg-white border-[#edeef0] text-[#434655] hover:border-[#004ac6]/30'
                }`}
              >
                {option}
                {interests.includes(option) && (
                  <div className="w-5 h-5 bg-[#004ac6] rounded-full flex items-center justify-center">
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-[#e7e8ea] py-4 px-6 md:px-32 z-50">
        <div className="max-w-[1024px] mx-auto flex justify-between items-center">
          <button 
            onClick={goBackToStep1}
            className="px-8 py-4 bg-[#f3f4f6] text-[#434655] font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          <button 
            onClick={handleFinish}
            disabled={interests.length === 0 || loading}
            className={`px-8 py-4 flex items-center gap-2 font-semibold rounded-lg transition-all shadow-sm ${
              interests.length > 0 && !loading
                ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.98]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Finishing...' : 'Complete Onboarding'}
            {!loading && <img src={imgContainerContinue} alt="" className="w-3.5 h-3.5 brightness-0 invert" />}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingStep2;