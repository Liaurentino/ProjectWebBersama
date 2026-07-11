import { Brain } from 'lucide-react';

const ChatIntro = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="bg-[#2563EB]/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-2">
        <Brain className="w-9 h-9 text-[#2563EB]" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold text-[#191C1E] dark:text-white tracking-tight mb-1">Hello Buddy!</h2>
      <p className="text-[#434655] dark:text-gray-400 text-sm text-center">Ask anything about lectures, career plans, or methods</p>
    </div>
  );
};

export default ChatIntro;
