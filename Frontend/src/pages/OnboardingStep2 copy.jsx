import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Assets dari Figma (Pastikan asset gambar/ikon Anda sudah berupa ikon transparan tanpa background oval bawaan)
const imgSoftware = "https://www.figma.com/api/mcp/asset/74e2e3da-72b5-4d5a-9018-ecf843bd1d90";
const imgUIUX = "https://www.figma.com/api/mcp/asset/c146e383-e5a3-4b1e-b1ea-84a3193e9177";
const imgData = "https://www.figma.com/api/mcp/asset/07d4554c-b9e9-445a-8035-7be22361bb88";
const imgPublicSpeaking = "https://www.figma.com/api/mcp/asset/f89ca7f4-5819-4e5f-a116-55c7e8b2ebb5";
const imgManagement = "https://www.figma.com/api/mcp/asset/bdd0dd7e-d446-4320-8d21-7c2f88b1b365";
const imgResearch = "https://www.figma.com/api/mcp/asset/82b02357-53d0-4dd9-9048-a4a2f6dde83e";
const imgInfo = "https://www.figma.com/api/mcp/asset/2e486dab-18ed-4ea7-8bef-8d40ac757852";
const imgContainerContinue = "https://www.figma.com/api/mcp/asset/b683e621-dc08-4f9c-a95e-01c6e4155e78";
const imgIconBack = "https://www.figma.com/api/mcp/asset/7bac61ed-54c8-4fcb-a115-6d8ade2ef61e";
const imgIconUser = "https://www.figma.com/api/mcp/asset/5271cd6e-7814-4a56-acba-549ef9733df4";

const imgCheck = "https://www.figma.com/api/mcp/asset/0eca3eba-e356-4f98-86a6-357b63b0e6cd";

const OnboardingStep2 = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();

  // Mapping warna untuk border dan background saat terpilih (semua biru sesuai permintaan)
  const interests = [
    { id: 'software', title: 'Software Development', desc: 'Web, Mobile, Cloud', icon: imgSoftware, colorClass: 'border-[#004ac6] bg-blue-50' },
    { id: 'uiux', title: 'UI/UX Design', desc: 'Product Design, Research', icon: imgUIUX, colorClass: 'border-[#004ac6] bg-blue-50' },
    { id: 'data', title: 'Data Science', desc: 'AI, Machine Learning', icon: imgData, colorClass: 'border-[#004ac6] bg-blue-50' },
    { id: 'public-speaking', title: 'Public Speaking', desc: 'Communication, Presenting', icon: imgPublicSpeaking, colorClass: 'border-[#004ac6] bg-blue-50' },
    { id: 'management', title: 'Management', desc: 'Business, Strategy, People', icon: imgManagement, colorClass: 'border-[#004ac6] bg-blue-50' },
    { id: 'research', title: 'Research', desc: 'Academic, Scientific', icon: imgResearch, colorClass: 'border-[#004ac6] bg-blue-50' }
  ];

  const toggleInterest = (id) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    // Simulasikan penyimpanan status onboarding selesai
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] font-inter flex flex-col relative overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="h-14 w-full bg-white flex items-center justify-between px-4 fixed top-0 left-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/onboarding/step-1')}
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
        <div className="w-full max-w-[672px] space-y-10">
          
          {/* Progress Bar Section */}
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
          <div className="space-y-3">
            <h1 className="text-[#191c1e] text-3xl font-bold tracking-tight">
              What is your main focus or interest?
            </h1>
            <p className="text-[#434655] text-base leading-relaxed max-w-[500px]">
              Select the interests you want to develop for more accurate career recommendations.
            </p>
          </div>

          {/* Bento-style Interest Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interests.map((item) => {
              const isSelected = selectedInterests.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all relative text-left group ${
                    isSelected
                      ? `${item.colorClass} shadow-md`
                      : 'bg-white border-[#e5e7eb] hover:border-gray-300 shadow-sm'
                  }`}
                >
                  {/* Icon Wrapper - maximized icon */}
                  <div className="mb-4 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <img src={item.icon} alt={item.title} className="w-14 h-14 object-contain" />
                  </div>

                  {/* Typography */}
                  <h3 className="text-[#191c1e] font-bold text-lg">{item.title}</h3>
                  <p className="text-[#434655] text-sm mt-1">{item.desc}</p>

                  {/* Checkbox indicator */}
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <img src={imgCheck} alt="" className="w-3.5 h-3.5 brightness-0 invert" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info Card */}
          <div className="flex gap-4 p-5 bg-[#2563eb]/10 border border-[#004ac6]/20 rounded-xl items-start">
            <img src={imgInfo} alt="Info" className="w-5 h-5 mt-0.5" />
            <p className="text-[#004ac6] text-sm leading-relaxed font-medium">
              You can select more than one interest.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-[#e7e8ea] py-4 px-6 md:px-32 z-50">
        <div className="max-w-[1024px] mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate('/onboarding/step-1')}
            className="px-8 py-4 bg-[#f3f4f6] text-[#434655] font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Return
          </button>
          <button 
            onClick={handleFinish}
            disabled={selectedInterests.length === 0}
            className={`px-8 py-4 flex items-center gap-2 font-semibold rounded-lg transition-all shadow-sm ${
              selectedInterests.length > 0
                ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.98]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
            <img src={imgContainerContinue} alt="" className="w-3.5 h-3.5 brightness-0 invert" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingStep2;