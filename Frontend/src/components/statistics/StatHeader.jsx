import { useTheme } from '../../context/ThemeContext';
import { Presentation } from 'lucide-react';

const StatHeader = ({ 
  title = "Statistics", 
  subtitle = "See the results of our analysis of your habits.", 
  buttonText = "Do a Career Analysis",
  onButtonClick = () => {}
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
      <div className="space-y-1">
        <h2 className={`text-[20px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#191c1e]'}`}>
          {title}
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#434655]'}`}>
          {subtitle}
        </p>
      </div>
      <button 
        onClick={onButtonClick}
        className="bg-[#004ac6] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md hover:bg-[#003da3] hover:shadow-lg transition-all active:scale-[0.98] self-start md:self-auto"
      >
        <Presentation size={20} />
        {buttonText}
      </button>
    </div>
  );
};

export default StatHeader;
