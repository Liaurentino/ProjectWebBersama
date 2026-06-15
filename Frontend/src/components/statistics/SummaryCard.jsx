import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const SummaryCard = ({ title, value, icon }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex flex-col gap-2 p-[25px] rounded-[12px] border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-[#1A1C1E] border-gray-800 shadow-[0px_1px_1px_rgba(255,255,255,0.05)]' 
        : 'bg-white border-[rgba(195,198,215,0.3)] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'
    }`}>
      <div className="flex items-start justify-between">
        <span className={`text-base font-medium ${isDarkMode ? 'text-gray-400' : 'text-[#434655]'}`}>
          {title}
        </span>
        <div className={`w-6 h-6 flex items-center justify-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {icon}
        </div>
      </div>
      <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#191c1e]'}`}>
        {value}
      </div>
    </div>
  );
};

export default SummaryCard;
