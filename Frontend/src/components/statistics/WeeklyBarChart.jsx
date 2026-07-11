import { useTheme } from '../../context/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const WeeklyBarChart = ({ 
  title = "Activities per Week", 
  subtitle = "Today's Progress",
  data = [
    { label: "09 June", value: 82, color: "#97b6fb" },
    { label: "10 June", value: 76, color: "#97b6fb" },
    { label: "11 June", value: 88, color: "#97b6fb" },
    { label: "12 June", value: 84, color: "#97b6fb" },
    { label: "Today", value: 91, color: "#2563eb", isToday: true }
  ]
}) => {
  const { isDarkMode } = useTheme();

  const chartColors = {
    grid: isDarkMode ? '#2A2D31' : '#F3F4F6',
    text: isDarkMode ? '#9CA3AF' : '#737686'
  };

  return (
    <div className={`p-[33px] rounded-[12px] border transition-all duration-300 w-full h-full flex flex-col ${
      isDarkMode 
        ? 'bg-[#1A1C1E] border-gray-800 shadow-[0px_1px_1px_rgba(255,255,255,0.05)]' 
        : 'bg-white border-[rgba(195,198,215,0.3)] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'
    }`}>
      <div className="flex flex-col gap-2 mb-8">
        <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-[#191c1e]'}`}>
          {title}
        </h3>
        <p className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>
          {subtitle}
        </p>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: chartColors.text, fontSize: 10 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: chartColors.text, fontSize: 10 }}
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip 
              cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1A1C1E' : '#fff',
                border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value}%`, 'Progress']}
            />
            <Bar 
              dataKey="value" 
              radius={[6, 6, 0, 0]}
              barSize={40}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyBarChart;
