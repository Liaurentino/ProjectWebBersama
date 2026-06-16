import React, { useState, useRef, useEffect } from 'react';
import ChatIntro from '../components/chat/ChatIntro';
import ChatPromptCards from '../components/chat/ChatPromptCards';
import ChatInput from '../components/chat/ChatInput';
import ChatHistorySidebar from '../components/chat/ChatHistorySidebar';
import ChatBubble from '../components/chat/ChatBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import IncludeToAIModal from '../components/modals/IncludeToAIModal';
import { MessageSquarePlus } from 'lucide-react';

const AIChat = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isIncludeModalOpen, setIsIncludeModalOpen] = useState(false);
  const [selectedContextItems, setSelectedContextItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Mock history data
  const chatHistory = [
    {
      label: "Today",
      items: [
        { title: "Recommend skills for my major", time: "2 mins ago", isActive: true },
        { title: "Calculus 2 material analysis", time: "4 hours ago", isActive: false },
      ]
    },
    {
      label: "Last Week",
      items: [
        { title: "Tips manage burnout", time: "Dec 12", isActive: false },
        { title: "IISMA Scholarship 2024 Preparation", time: "Dec 10", isActive: false },
        { title: "English Essay Review", time: "Dec 08", isActive: false },
        { title: "UKM Meeting Minutes Template", time: "Dec 05", isActive: false },
        { title: "UKM Meeting Minutes Template", time: "Dec 05", isActive: false },
        { title: "UKM Meeting Minutes Template", time: "Dec 05", isActive: false },
        { title: "UKM Meeting Minutes Template", time: "Dec 05", isActive: false },
      ]
    }
  ];

  const handleInclude = (selected) => {
    setSelectedContextItems(selected);
    setIsIncludeModalOpen(false);
  };

  const clearSelection = (id) => {
    setSelectedContextItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      const now = new Date();
      const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                     now.getMinutes().toString().padStart(2, '0');
      
      const userId = Date.now();
      const userMessage = {
        id: userId,
        message: inputValue,
        sender: 'user',
        time: timeStr,
        status: 'Load'
      };

      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setSelectedContextItems([]);
      setIsTyping(true);

      // Simulate AI response
      setTimeout(() => {
        setIsTyping(false);
        
        // Update user message status to Sent and add AI message
        setMessages(prev => {
          const updated = prev.map(msg => 
            msg.id === userId ? { ...msg, status: 'Sent' } : msg
          );
          
          const aiMessage = {
            id: Date.now() + 1,
            message: "A great choice! In 2024, if you want to quickly build a portfolio that works on both iOS and Android, Flutter is highly recommended. However, learning native development (Kotlin/Swift) will give you a deeper understanding of how operating systems work internally.",
            sender: 'ai',
            time: timeStr,
            status: 'Sent'
          };
          
          return [...updated, aiMessage];
        });
      }, 2000);
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#F8F9FB]">
      {/* Backdrop for Mobile Sidebar */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[45] md:hidden transition-opacity duration-500"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col relative transition-all duration-500 ease-in-out ${isHistoryOpen ? 'md:mr-64 mr-0' : 'md:mr-[64px] mr-0'}`}>
        <div className="flex-1 overflow-y-auto pt-6 pb-32 px-4 sm:px-6 flex flex-col items-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-full max-w-4xl">
            {messages.length === 0 && !isTyping ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <ChatIntro />
                <ChatPromptCards />
              </div>
            ) : (
              <div className="flex flex-col w-full py-4">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} {...msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <ChatInput 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSend={handleSend}
          onIncludeClick={() => setIsIncludeModalOpen(true)}
          selectedItems={selectedContextItems}
          onRemoveItem={clearSelection}
        />

        {/* Modals */}
        <IncludeToAIModal 
          isOpen={isIncludeModalOpen}
          onClose={() => setIsIncludeModalOpen(false)}
          onInclude={(selected) => {
            setSelectedContextItems(selected);
            setIsIncludeModalOpen(false);
          }}
        />

        {/* Floating Toggle Button (Only on Mobile/Tablet when closed) */}
        {!isHistoryOpen && (
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="md:hidden fixed right-4 top-4 p-2.5 bg-white border border-[#C3C6D7] rounded-xl shadow-lg text-[#2563EB] z-[40] active:scale-95 transition-transform"
            title="Open History"
          >
            <MessageSquarePlus className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Right Sidebar - Chat History */}
      <ChatHistorySidebar 
        isOpen={isHistoryOpen} 
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)} 
        history={chatHistory}
      />
    </div>
  );
};

export default AIChat;
