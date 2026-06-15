import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const StatusBreakdown = ({ 
  title = "Notes Activity",
  data = [
    { name: 'Todo', value: 20, color: '#737686', count: 24 },
    { name: 'In Progress', value: 35, color: '#facc15', count: 42 },
    { name: 'Done', value: 45, color: '#22c55e', count: 54 }
  ]
}) => {
  const { isDarkMode } = useTheme();

  // Recharts Stacked Bar layout for a horizontal progress bar effect
  const chartData = [{
    name: 'Status',
    ...data.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.value }), {})
  }];

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
        {/* Progress Bar Container */}
        <div className="h-10 w-full rounded-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip 
                cursor={false}
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ zIndex: 1000 }}
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1A1C1E' : '#fff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {data.map((item, index) => (
                <Bar 
                  key={index}
                  dataKey={item.name} 
                  stackId="a" 
                  fill={item.color}
                  isAnimationActive={true}
                  // Memberikan radius pada elemen bar pertama dan terakhir secara manual 
                  // untuk mensimulasikan bentuk kapsul tanpa overflow-hidden
                  radius={
                    index === 0 ? [20, 0, 0, 20] : 
                    index === data.length - 1 ? [0, 20, 20, 0] : 0
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend/Labels */}
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
