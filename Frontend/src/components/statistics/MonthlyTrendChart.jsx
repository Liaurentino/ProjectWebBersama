import { useTheme } from '../../context/ThemeContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const MonthlyTrendChart = ({ 
  title = "Daily Productivity Trends", 
  subtitle = "Comparison of the last 7 Days",
  data = [
    { day: "Mon", finished: 5.5, plan: 8 },
    { day: "Tue", finished: 4.2, plan: 8 },
    { day: "Wed", finished: 7.8, plan: 8 },
    { day: "Thu", finished: 6.4, plan: 8 },
    { day: "Fri", finished: 9.2, plan: 8 },
    { day: "Sat", finished: 3.0, plan: 8 },
    { day: "Sun", finished: 4.5, plan: 8 },
  ]
}) => {
  const { isDarkMode } = useTheme();

  const chartColors = {
    finished: '#004ac6',
    plan: '#c3c6d7',
    grid: isDarkMode ? '#2A2D31' : '#F3F4F6',
    text: isDarkMode ? '#9CA3AF' : '#737686'
  };

  return (
    <div className={`p-[33px] rounded-[12px] border transition-all duration-300 w-full h-[442px] flex flex-col ${
      isDarkMode 
        ? 'bg-[#1A1C1E] border-gray-800 shadow-[0px_1px_1px_rgba(255,255,255,0.05)]' 
        : 'bg-white border-[rgba(195,198,215,0.3)] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-[#191c1e]'}`}>
            {title}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#737686]'}`}>
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#004ac6]" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#434655]'}`}>Finished</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#c3c6d7]" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#737686]'}`}>Plan</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: chartColors.text, fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: chartColors.text, fontSize: 12 }}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1A1C1E' : '#fff',
                border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                borderRadius: '8px',
                fontSize: '12px'
              }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Line 
              type="monotone" 
              dataKey="plan" 
              stroke={chartColors.plan} 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false}
              activeDot={false}
            />
            <Line 
              type="monotone" 
              dataKey="finished" 
              stroke={chartColors.finished} 
              strokeWidth={3} 
              dot={{ r: 4, fill: chartColors.finished, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyTrendChart;
