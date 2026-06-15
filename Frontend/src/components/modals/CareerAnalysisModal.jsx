import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X, ChartColumnStacked, Briefcase, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const CareerAnalysisModal = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className={`relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[16px] shadow-2xl transition-all transform animate-in fade-in zoom-in duration-300 ${
          isDarkMode ? 'bg-[#1A1C1E] text-white border border-gray-800' : 'bg-white text-[#191c1e]'
        }`}
      >
        {/* Modal Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${isDarkMode ? 'bg-[#1A1C1E] border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="text-blue-600">
              <ChartColumnStacked size={24} />
            </div>
            <h3 className="text-lg font-bold">Your Career Insight</h3>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-8">
          
          {/* Section 1: Potential Directions */}
          <section className="space-y-4">
            <h4 className={`text-[10px] font-bold uppercase tracking-[1.5px] ${isDarkMode ? 'text-gray-500' : 'text-[#737686]'}`}>
              Potential Career Direction for You
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${isDarkMode ? 'bg-blue-900/10 border-blue-900/30 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                <Briefcase size={20} />
                <span className="font-bold">1. UI/UX Designer</span>
              </div>
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                <span className="font-bold">2. UX Researcher</span>
              </div>
            </div>
          </section>

          {/* Section 2: Skills to Develop */}
          <section className="space-y-4">
            <h4 className={`text-[10px] font-bold uppercase tracking-[1.5px] ${isDarkMode ? 'text-gray-500' : 'text-[#737686]'}`}>
              Skills That Need Development
            </h4>
            <div className="space-y-4">
              {[
                { title: "Time Management", desc: "Focus on resolving schedule conflicts in team projects." },
                { title: "Visual Design", desc: "Reinforce understanding of grid layouts and visual hierarchy." },
                { title: "Communication", desc: "Start presenting the progress of your weekly activities." },
                { title: "Leadership", desc: "Take the initiative to guide discussions in study groups." }
              ].map((skill, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 text-blue-600 shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{skill.title}</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#434655]'}`}>{skill.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Next Steps */}
          <section className="space-y-4">
            <h4 className={`text-[10px] font-bold uppercase tracking-[1.5px] ${isDarkMode ? 'text-gray-500' : 'text-[#737686]'}`}>
              The Next Step
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Step 1</p>
                <p className="text-sm font-medium">Take the course "Introduction to UI/UX Design"</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Step 2</p>
                <p className="text-sm font-medium">Create one comprehensive UX case study</p>
              </div>
            </div>
          </section>

          {/* Modal Footer Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={onClose}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button className="bg-[#004ac6] text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#003da3] transition-all flex items-center justify-center gap-2">
              Save Analysis
              <CheckCircle2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerAnalysisModal;
