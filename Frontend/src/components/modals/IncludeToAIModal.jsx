import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, Check } from 'lucide-react';

const IncludeToAIModal = ({ isOpen, onClose, onInclude }) => {
  const [activeTab, setActiveTab] = useState('Activity');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock data - In real app, this would come from your backend/context
  const activities = [
    { id: 1, title: 'Algorithms & Structures Practice', type: 'SKILL', date: '12 Oct 2023' },
    { id: 2, title: 'Webinar: Future of AI in universes', type: 'ACADEMIC', date: '14 Oct 2023' },
    { id: 3, title: 'Final Project: UI Design', type: 'CAREER', date: '18 Oct 2023' },
    { id: 4, title: 'Kudos React Native: advanced', type: 'SKILL', date: '20 Oct 2023' },
  ];

  const notes = [
    { id: 5, title: 'Meeting Notes: Frontend Team', type: 'WORK', date: '15 Oct 2023' },
    { id: 6, title: 'Personal Goal: Learn Figma', type: 'LEARNING', date: '16 Oct 2023' },
  ];

  const currentItems = (activeTab === 'Activity' ? activities : notes).filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSelectedCount = (tabName) => {
    const list = tabName === 'Activity' ? activities : notes;
    return selectedItems.filter(id => list.some(item => item.id === id)).length;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getTagStyles = (type) => {
    switch (type) {
      case 'SKILL':
        return 'bg-[#004AC6]/10 text-[#004AC6]';
      case 'ACADEMIC':
        return 'bg-[#BC4800]/20 text-[#943700]';
      case 'CAREER':
        return 'bg-[#DFE0E0]/50 text-[#5D5F5F]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-[480px] rounded-[24px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C3C6D7]/50">
          <h2 className="text-base font-bold text-[#191C1E]">Include to AI</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#434655]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 px-6 border-b border-[#C3C6D7]/50">
          {['Activity', 'Notes'].map((tab) => {
            const count = getSelectedCount(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === tab 
                    ? 'border-[#004AC6] text-[#004AC6]' 
                    : 'border-transparent text-[#434655] font-medium'
                }`}
              >
                {tab}
                {count > 0 && (
                  <span className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] rounded-full transition-colors ${
                    activeTab === tab 
                      ? 'bg-[#004AC6] text-white' 
                      : 'bg-[#C3C6D7] text-[#434655]'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="p-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
            <input 
              type="text"
              placeholder={`Search for ${activeTab.toLowerCase()}s...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3F4F6] border border-[#C3C6D7] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-[#004AC6] transition-colors"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2 scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#C3C6D7] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#A0A3B1]">
          {currentItems.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <div 
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-center gap-4 p-4 rounded-[16px] border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#004AC6]/5 border-[#004AC6]/20' 
                    : 'bg-white border-[#C3C6D7] hover:border-[#004AC6]/30'
                }`}
              >
                <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${
                  isSelected 
                    ? 'bg-[#004AC6] border-[#004AC6]' 
                    : 'bg-white border-[#C3C6D7]'
                }`}>
                  {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-[#191C1E]' : 'text-[#191C1E]/80'}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase ${getTagStyles(item.type)}`}>
                      {item.type}
                    </span>
                    <div className="flex items-center gap-1 text-[#434655] opacity-70">
                      <Calendar size={12} />
                      <span className="text-[12px]">{item.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 pt-5 border-t border-[#C3C6D7]/50 bg-white/80 backdrop-blur-md">
          <button 
            disabled={selectedItems.length === 0}
            onClick={() => {
              const selectedObjects = [...activities, ...notes].filter(item => selectedItems.includes(item.id));
              onInclude(selectedObjects);
            }}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2 ${
              selectedItems.length > 0
                ? 'bg-[#004AC6] text-white hover:bg-[#003DA3] shadow-blue-500/20'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Include to Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncludeToAIModal;
