import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const StatusBreakdown = ({ 
  title = "Notes Activity",
  data = [
    { name: 'Todo', value: 20, color: '#737686', count: 24 },
    { name: 'In Progress', value: 35, color: '#facc15', count: 42 },
    { name: 'Done', value: 45, color: '#22c55e', count: 54 }
  ]
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`p-[33px] rounded-[12px] border transition-all duration-300 w-full ${
      isDarkMode 
        ? 'bg-[#1A1C1E] border-gray-800 shadow-[0px_1px_1px_rgba(255,255,255,0.05)]' 
        : 'bg-white border-[rgba(195,198,215,0.3)] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'
    }`}>
      <h3 className={`text-base font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-[#191c1e]'}`}>
        {title}
      </h3>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="h-10 w-full rounded-full overflow-hidden flex">
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                width: `${item.value}%`,
                backgroundColor: item.color,
                borderRadius:
                  index === 0 ? '9999px 0 0 9999px' :
                  index === data.length - 1 ? '0 9999px 9999px 0' : '0',
              }}
              className="h-full transition-all duration-500"
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#434655]'}`}>
                {item.count} {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusBreakdown;