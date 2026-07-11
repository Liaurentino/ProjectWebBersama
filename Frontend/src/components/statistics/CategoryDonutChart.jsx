import { useTheme } from '../../context/ThemeContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CategoryDonutChart = ({ 
  title = "Activities per Category", 
  totalValue = "128", 
  data = [
    { name: 'Academic', value: 35, color: '#004ac6' },
    { name: 'Organization', value: 25, color: '#2563eb' },
    { name: 'Skill', value: 15, color: '#943700' },
    { name: 'Commitment', value: 15, color: '#ba1a1a' },
    { name: 'Career', value: 10, color: '#737686' }
  ] 
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`p-[33px] rounded-[12px] border transition-all duration-300 w-full h-full flex flex-col ${
      isDarkMode 
        ? 'bg-[#1A1C1E] border-gray-800 shadow-[0px_1px_1px_rgba(255,255,255,0.05)]' 
        : 'bg-white border-[rgba(195,198,215,0.3)] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'
    }`}>
      <h3 className={`text-base font-semibold mb-8 ${isDarkMode ? 'text-white' : 'text-[#191c1e]'}`}>
        {title}
      </h3>
      <div className="flex-1 flex flex-col items-center gap-8 min-h-[300px]">
        <div className="relative w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ zIndex: 1000 }}
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1A1C1E' : '#fff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#737373]'}`}>Total</span>
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{totalValue}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 w-full">
          {data.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-[#434655]'}`}>
                {cat.name} ({cat.value}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDonutChart;
