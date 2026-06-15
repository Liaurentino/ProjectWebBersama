import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, SendHorizontal, Files, ClipboardPenLine, NotebookText, File, CalendarFold, X } from 'lucide-react';

const ChatInput = ({ value, onChange, onSend, onIncludeClick, selectedItems = [], onRemoveItem }) => {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const getIconForItem = (type) => {
    switch (type) {
      case 'WORK':
      case 'LEARNING':
        return <NotebookText size={16} />;
      case 'SKILL':
      case 'ACADEMIC':
      case 'CAREER':
        return <CalendarFold size={16} />;
      default:
        return <File size={16} />;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#F8F9FB] via-[#F8F9FB] to-transparent pt-8 pb-6 px-6 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-3">
        {/* Chips Area */}
        {selectedItems.length > 0 && (
          <div className="flex flex-col gap-3 px-1 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 text-[#434655] text-sm">
              <ClipboardPenLine size={18} />
              <span className="tracking-wide">Included context:</span>
            </div>
            <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-thin [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#C3C6D7] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#A0A3B1]">
              {selectedItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-[#004AC6]/10 border border-[#004AC6]/20 flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-[#2563EB] shrink-0">
                      {getIconForItem(item.type)}
                    </div>
                    <span className="text-[#2563EB] text-sm font-medium whitespace-nowrap">{item.title}</span>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="text-[#2563EB] hover:bg-[#2563EB]/10 rounded-full p-0.5 transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full relative">
          <div className="bg-white border-2 border-[#004AC6]/30 rounded-xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05)] flex items-center p-0.5 relative">
            <textarea
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none py-3 px-4 text-[#434655] text-sm resize-none h-12 max-h-28 min-h-[48px] scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#C3C6D7] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#A0A3B1]"
            />
            <div className="flex items-center gap-1 pr-2 relative" ref={dropdownRef}>
              {showOptions && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="p-1">
                    <button 
                      onClick={() => {
                        setShowOptions(false);
                        // Add file upload logic here
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#434655] hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <Files className="w-5 h-5 text-[#434655] group-hover:text-[#004AC6] transition-colors" />
                      <span className="font-medium">Upload Files or Photos</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowOptions(false);
                        onIncludeClick();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#434655] hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <ClipboardPenLine className="w-5 h-5 text-[#434655] group-hover:text-[#004AC6] transition-colors" />
                      <span className="font-medium">Include Tasks or Notes</span>
                    </button>
                  </div>
                </div>
              )}
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className={`p-1.5 rounded-lg transition-all ${showOptions ? 'bg-blue-50 text-[#004AC6]' : 'text-[#434655] hover:bg-gray-100'}`}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button 
                onClick={onSend}
                className="bg-[#004AC6] text-white p-2 rounded-lg shadow-md hover:bg-[#003da3] transition-colors"
              >
                <SendHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-[#434655] font-medium tracking-wide text-center">AI Mentor can make mistakes.</p>
      </div>
    </div>
  );
};

export default ChatInput;
