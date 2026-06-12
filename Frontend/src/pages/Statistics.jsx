import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Statistics = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#F8F9FA] text-[#191C1E]'}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Productivity Statistics</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Deep analysis of your performance and achievements.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1A1C1E] border-gray-800' : 'bg-white border-gray-100'} shadow-sm`}>
            <h3 className="font-bold mb-4">Weekly Progress</h3>
            <div className={`h-48 flex items-end justify-between gap-2 px-2`}>
              {[60, 45, 90, 75, 80, 55, 70].map((val, i) => (
                <div key={i} className="flex-1 bg-[#2563EB]/20 rounded-t-lg relative">
                  <div 
                    className="w-full bg-[#2563EB] rounded-t-lg absolute bottom-0"
                    style={{ height: `${val}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1A1C1E] border-gray-800' : 'bg-white border-gray-100'} shadow-sm`}>
            <h3 className="font-bold mb-4">Category Breakdown</h3>
            <div className="flex items-center justify-center h-48">
               <div className="w-32 h-32 rounded-full border-8 border-[#004AC6] flex items-center justify-center">
                  <span className="text-xl font-bold">75%</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
