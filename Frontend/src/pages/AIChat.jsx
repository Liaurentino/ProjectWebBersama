import { useEffect, useRef, useState } from 'react';
import { Rocket, MessageSquarePlus, BookOpenCheck, ClipboardList, Lightbulb } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import ChatIntro from '../components/chat/ChatIntro';
import ChatPromptCards from '../components/chat/ChatPromptCards';
import ChatInput from '../components/chat/ChatInput';
import ChatHistorySidebar from '../components/chat/ChatHistorySidebar';
import ChatBubble from '../components/chat/ChatBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import IncludeToAIModal from '../components/modals/IncludeToAIModal';
import { deleteChatSession, getChatSessions, sendChatMessage } from '../services/AIservice';
import { getAllActivities } from '../services/Activityservice';
import { getAllNotes } from '../services/Notesservice';

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getTimeLabel = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '--:--';

  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const formatRelativeTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const sameDay = now.toDateString() === date.toDateString();

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;
  if (sameDay) return `${diffHours} hours ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatSidebarSections = (sessions, activeSessionId) => {
  const sorted = [...sessions].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const today = [];
  const lastWeek = [];
  const earlier = [];

  sorted.forEach((session) => {
    const updatedAt = new Date(session.updatedAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - updatedAt.getTime()) / 86400000);
    const item = {
      id: session.id,
      title: session.title || 'Chat',
      time: formatRelativeTime(session.updatedAt),
      isActive: session.id === activeSessionId,
    };

    if (diffDays === 0) {
      today.push(item);
      return;
    }

    if (diffDays <= 7) {
      lastWeek.push(item);
      return;
    }

    earlier.push(item);
  });

  const sections = [];
  if (today.length > 0) sections.push({ label: 'Today', items: today });
  if (lastWeek.length > 0) sections.push({ label: 'Last Week', items: lastWeek });
  if (earlier.length > 0) sections.push({ label: 'Earlier', items: earlier });

  return sections;
};

const normalizeChatMessage = (message) => ({
  id: message.id || makeId(),
  message: message.content || '',
  sender: message.role === 'assistant' ? 'ai' : 'user',
  time: getTimeLabel(message.createdAt),
  status: 'Sent',
  fileUrl:  message.fileUrl  || null,
  fileName: message.fileName || null,
  fileType: message.fileType || null,
});

const normalizeChatSession = (session) => ({
  id: session.id,
  title: session.title || 'Chat',
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
  messages: Array.isArray(session.messages)
    ? session.messages.map(normalizeChatMessage)
    : [],
});

const toApiMessages = (messages) => messages.map((message) => ({
  role: message.sender === 'ai' ? 'assistant' : 'user',
  content: message.message,
}));

const AIChat = () => {
  const { user, loading: userLoading } = useUser();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isIncludeModalOpen, setIsIncludeModalOpen] = useState(false);
  const [selectedContextItems, setSelectedContextItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contextData, setContextData] = useState({ activities: [], notes: [] });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (userLoading) return;

    if (!user?.id) return;

    const controller = new AbortController();

    const loadSessions = async () => {
      setLoadingSessions(true);

      try {
        const data = await getChatSessions({ signal: controller.signal });
        const nextSessions = Array.isArray(data.chat_sessions)
          ? data.chat_sessions.map(normalizeChatSession)
          : [];

        setSessions(nextSessions);

        const initialSession = nextSessions[0] || null;
        setActiveSessionId(initialSession?.id || '');
        setMessages(initialSession?.messages || []);
      } catch (error) {
        if (error?.name === 'AbortError') return;
        setSessions([]);
        setMessages([]);
        setActiveSessionId('');
      } finally {
        setLoadingSessions(false);
      }
    };

    loadSessions();

    return () => controller.abort();
  }, [user?.id, userLoading]);

  const upsertSession = (session) => {
    setSessions((prev) => {
      const next = prev.filter((item) => item.id !== session.id);
      return [session, ...next].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    });
  };

  const clearSelection = (id) => {
    setSelectedContextItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleNewChat = () => {
    setActiveSessionId('');
    setMessages([]);
    setInputValue('');
    setSelectedContextItems([]);
    setSelectedFile(null);
    setIsTyping(false);
  };

  const handleSelectChat = (item) => {
    const session = sessions.find((entry) => entry.id === item.id);
    if (!session) return;

    setActiveSessionId(session.id);
    setMessages(session.messages || []);
    setInputValue('');
    setSelectedContextItems([]);
    setSelectedFile(null);
    setIsTyping(false);
  };

  const handleDeleteChat = async (item) => {
    try {
      await deleteChatSession(item.id);
      setSessions((prev) => {
        const next = prev.filter((session) => session.id !== item.id);

        if (item.id === activeSessionId) {
          const fallback = next[0] || null;
          setActiveSessionId(fallback?.id || '');
          setMessages(fallback?.messages || []);
        }

        return next;
      });
    } catch {
      // keep UI stable if delete fails
    }
  };

  const sendTextMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed && !selectedFile) return;

    const userMessage = {
      id: makeId(),
      message: trimmed,
      sender: 'user',
      time: getTimeLabel(),
      status: 'Load',
      // Tampilkan preview lokal sebelum upload
      fileUrl:  selectedFile ? URL.createObjectURL(selectedFile) : null,
      fileName: selectedFile?.name || null,
      fileType: selectedFile
        ? (selectedFile.type === 'application/pdf' ? 'pdf' : 'image')
        : null,
    };

    const nextMessages    = [...messages, userMessage];
    const contextItems    = selectedContextItems;
    const fileToUpload    = selectedFile;

    setMessages(nextMessages);
    setInputValue('');
    setSelectedContextItems([]);
    setSelectedFile(null);
    setIsTyping(true);

    try {
      const response = await sendChatMessage({
        chat_session_id: activeSessionId || undefined,
        messages: toApiMessages(nextMessages),
        selected_context_items: contextItems,
        file: fileToUpload || undefined,
      });

      const savedSession = response.chat_session ? normalizeChatSession(response.chat_session) : null;
      if (savedSession) {
        upsertSession(savedSession);
        setActiveSessionId(savedSession.id);
        setMessages(savedSession.messages || []);
      } else {
        const aiMessage = {
          id: makeId(),
          message: response.message || 'Maaf, aku belum bisa menjawab saat ini.',
          sender: 'ai',
          time: getTimeLabel(),
          status: 'Sent',
        };

        const updatedMessages = [
          ...nextMessages.map((message) => (message.id === userMessage.id ? { ...message, status: 'Sent' } : message)),
          aiMessage,
        ];

        setMessages(updatedMessages);
      }
    } catch (error) {
      const fallbackMessage = {
        id: makeId(),
        message: error?.message || 'Gagal memuat jawaban. Coba lagi sebentar ya.',
        sender: 'ai',
        time: getTimeLabel(),
        status: 'Sent',
      };

      setMessages([
        ...nextMessages.map((message) => (message.id === userMessage.id ? { ...message, status: 'Sent' } : message)),
        fallbackMessage,
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => sendTextMessage(inputValue);

  const promptCards = [
    {
      title: 'Career Exploration',
      description: '"What\'s my next career move?"',
      icon: Rocket,
      onClick: () => sendTextMessage('Tolong analisa arah karir saya berdasarkan aktivitas dan primary interest saya.'),
    },
    {
      title: 'Study Tips',
      description: '"The most effective way to study?"',
      icon: BookOpenCheck,
      onClick: () => sendTextMessage('Can you give me the most effective way to study?'),
    },
    {
      title: 'Review Notes',
      description: '"Summarize last week\'s notes."',
      icon: ClipboardList,
      onClick: () => sendTextMessage('Summarize last week\'s notes.'),
    },
    {
      title: 'Ide Project',
      description: '"Give me project topic ideas."',
      icon: Lightbulb,
      onClick: () => sendTextMessage('Give me project topic ideas.'),
    },
  ];

  const chatHistory = formatSidebarSections(sessions, activeSessionId);

  if (userLoading || loadingSessions) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FB] dark:bg-[#121212] text-[#434655] dark:text-gray-300">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#F8F9FB] dark:bg-[#121212] transition-colors duration-300">
      {isHistoryOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-[45] md:hidden transition-opacity duration-500"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      <div className={`flex-1 flex flex-col relative transition-all duration-500 ease-in-out ${isHistoryOpen ? 'md:mr-64 mr-0' : 'md:mr-[64px] mr-0'}`}>
        <div className="flex-1 overflow-y-auto pt-6 pb-6 px-4 sm:px-6 flex flex-col items-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-full max-w-4xl">
            {messages.length === 0 && !isTyping ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <ChatIntro />
                <ChatPromptCards prompts={promptCards} />
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

        <ChatInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSend={handleSend}
          onIncludeClick={async () => {
            try {
              const [actRes, noteRes] = await Promise.all([getAllActivities(), getAllNotes()]);
              setContextData({
                activities: (actRes.data || []).map(a => ({ id: a.id, title: a.title, type: a.category, description: a.description || '' })),
                notes: noteRes.map(n => ({ id: n.id, title: n.title, type: n.category || 'NOTE', description: n.description || '' })),
              });
            } catch {}
            setIsIncludeModalOpen(true);
          }}
          selectedItems={selectedContextItems}
          onRemoveItem={clearSelection}
          onFileSelect={(file) => setSelectedFile(file)}
          selectedFile={selectedFile}
          onRemoveFile={() => setSelectedFile(null)}
        />

        <IncludeToAIModal
          isOpen={isIncludeModalOpen}
          activities={contextData.activities}
          notes={contextData.notes}
          onClose={() => setIsIncludeModalOpen(false)}
          onInclude={(selected) => {
            setSelectedContextItems(selected);
            setIsIncludeModalOpen(false);
          }}
        />

        {!isHistoryOpen && (
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="md:hidden fixed right-4 top-4 p-2.5 bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7] dark:border-gray-800 rounded-xl shadow-lg text-[#2563EB] dark:text-blue-400 z-[40] active:scale-95 transition-transform"
            title="Open History"
          >
            <MessageSquarePlus className="w-6 h-6" />
          </button>
        )}
      </div>

      <ChatHistorySidebar
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        history={chatHistory}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
      />
    </div>
  );
};

export default AIChat;

