import { useState } from 'react';
import { MessageSquarePlus, History, PanelRightClose, EllipsisVertical, Trash2 } from 'lucide-react';

const ChatHistoryItem = ({ title, time, isActive, onSelect, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative group">
      <button 
        onClick={onSelect}
        className={`w-full text-left p-3.5 rounded-xl transition-all duration-300 flex flex-col gap-1 relative ${
          isActive 
            ? 'bg-[#2563EB]/10 border-2 border-[#004AC6]' 
            : 'bg-transparent border border-transparent hover:bg-gray-100'
        }`}
      >
        <div className="pr-8">
          <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#004AC6]' : 'text-[#191C1E]'}`}>
            {title}
          </p>
          <p className="text-[10px] text-[#434655] dark:text-gray-300 font-normal">
            {time}
          </p>
        </div>
        {isActive && !showMenu && (
          <EllipsisVertical className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#004AC6]" />
        )}
      </button>

      {/* Hover Actions */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className={`p-1.5 rounded-lg transition-colors ${showMenu ? 'bg-gray-200 text-[#191C1E]' : 'text-[#434655] dark:text-gray-300 hover:bg-gray-200 hover:text-[#191C1E]'}`}
          >
            <EllipsisVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              ></div>
              <div className="absolute right-0 mt-1 w-32 bg-white border border-[#C3C6D7] rounded-lg shadow-lg z-20 py-1 animate-in fade-in zoom-in duration-200 origin-top-right">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#BA1A1A] hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Chat
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatHistorySidebar = ({ 
  isOpen, 
  onToggle, 
  history = [], 
  onSelectChat = (item) => console.log('Selected:', item.title),
  onDeleteChat = (item) => console.log('Delete:', item.title),
  onNewChat = () => console.log('New Chat')
}) => {
  const sections = history;

  return (
    <aside 
      className={`fixed right-0 top-16 bottom-0 bg-[#F8F9FB] dark:bg-[#121212] border-l border-[#C3C6D7] dark:border-gray-800 transition-all duration-500 ease-in-out z-50 ${
        isOpen 
          ? 'w-64 translate-x-0' 
          : 'translate-x-full md:translate-x-0 md:w-[64px]'
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className={`p-4 h-16 flex items-center border-b border-[#C3C6D7] dark:border-gray-800 transition-all duration-500 ${isOpen ? 'justify-between px-4' : 'justify-center px-0'}`}>
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>
            <h3 className="font-semibold text-[#434655] dark:text-gray-300 whitespace-nowrap">Chat History</h3>
          </div>
          
          <div className="flex items-center gap-1">
            {isOpen && (
              <button 
                onClick={onNewChat}
                className="p-2 text-[#434655] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2A2D31] rounded-lg transition-colors"
                title="New Chat"
              >
                <MessageSquarePlus className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={onToggle}
              className="p-2 text-[#434655] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2A2D31] rounded-lg transition-all duration-300 flex items-center justify-center shrink-0"
              title={isOpen ? "Close History" : "Open History"}
            >
              {isOpen ? (
                <PanelRightClose className="w-5 h-5 transition-transform duration-500 rotate-0" />
              ) : (
                <MessageSquarePlus className="w-5 h-5 transition-transform duration-500 hover:scale-110" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto transition-all duration-500 scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#C3C6D7] dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#A0A3B1] dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {sections.length > 0 ? (
            <div className="p-4 flex flex-col gap-6">
              {sections.map((section, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <h4 className="px-2 text-[11px] font-bold text-[#737686] dark:text-gray-500 tracking-[0.05em] uppercase">
                    {section.label}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {section.items.map((item, itemIdx) => (
                      <ChatHistoryItem 
                        key={itemIdx} 
                        {...item} 
                        onSelect={() => onSelectChat(item)}
                        onDelete={() => onDeleteChat(item)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 bg-[#EDEef0] dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                <History className="w-6 h-6 text-[#434655] dark:text-gray-300" />
              </div>
              <p className="text-[#434655] dark:text-gray-300 font-medium whitespace-nowrap">No chat history yet</p>
              <p className="text-sm text-[#737686] dark:text-gray-500 whitespace-nowrap">Start a discussion</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ChatHistorySidebar;
