import { useTheme } from '../../context/ThemeContext';
import { X, ChartColumnStacked, Loader2 } from 'lucide-react';

const AnalysisLoadingModal = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className={`relative w-full max-w-[560px] h-[665px] flex flex-col rounded-[16px] shadow-2xl transition-all transform animate-in fade-in zoom-in duration-300 ${
          isDarkMode ? 'bg-[#1A1C1E] text-white border border-gray-800' : 'bg-white text-[#191c1e]'
        }`}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
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
        <div className="flex-1 p-8 space-y-12">
          {/* Skeleton Section */}
          <div className="space-y-6">
            <div className={`h-6 rounded-lg animate-pulse w-3/4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
            <div className={`h-6 rounded-lg animate-pulse w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
            <div className={`h-6 rounded-lg animate-pulse w-2/3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
          </div>

          {/* Analysis Indicator */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-dashed animate-spin-slow ${isDarkMode ? 'border-blue-900/50' : 'border-blue-200'}`}>
               <Loader2 className="text-blue-600 animate-spin" size={32} />
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg font-bold tracking-tight">AI is analyzing history</p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-[#737686]'}`}>Please wait while we process your data...</p>
            </div>
          </div>

          {/* Bottom Visual Element Skeleton */}
          <div className={`p-4 rounded-2xl flex items-center gap-4 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <ChartColumnStacked className="text-blue-600/30" size={24} />
            </div>
            <div className="space-y-2 flex-1">
              <div className={`h-3 rounded-full w-1/2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-2 rounded-full w-1/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-6 flex justify-end border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <button 
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${
              isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoadingModal;
