
const SuccessPopup = ({ isOpen, onClose, activity, onAddMore }) => {
  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200 overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col items-center pt-10 pb-6 px-8 text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center shadow-[0px_0px_0px_8px_#F0FDF4]">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#191C1E] tracking-tight mb-2">
            Activity Saved Successfully!
          </h3>
          <p className="text-[#434655] text-base leading-relaxed">
            A good step for your learning progress today.
          </p>
        </div>

        {/* Activity Summary Card */}
        <div className="px-8 pb-8 space-y-8">
          <div className="bg-white border border-[#C3C6D7]/30 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#004AC6]/10 rounded-lg flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#004AC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"></path>
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#737686] uppercase tracking-wider block mb-1">ACTIVITY TITLE</span>
                <p className="text-base font-semibold text-[#191C1E] leading-tight">
                  {activity.title || "Learn UI Design with Tailwind"}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C3C6D7]/30 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#737686] uppercase tracking-wider block">DATE</span>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#434655" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="text-sm font-medium text-[#191C1E]">{activity.date || "24 Oct 2023"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#737686] uppercase tracking-wider block">DURATION</span>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#434655" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span className="text-sm font-medium text-[#191C1E]">{activity.duration || "1j 45m"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={onClose}
              className="w-full bg-[#004AC6] text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Return to Dashboard
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
            <button 
              onClick={onAddMore}
              className="w-full bg-[#E7E8EA] text-[#191C1E] font-semibold py-3.5 rounded-lg hover:bg-gray-300 transition-all"
            >
              Add More Activities
            </button>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="h-14 bg-[#004AC6]/5"></div>
      </div>
    </div>
  );
};

export default SuccessPopup;
