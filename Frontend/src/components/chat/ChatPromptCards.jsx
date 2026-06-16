import React from 'react';
import { Rocket, BookOpenCheck, ClipboardList, Lightbulb } from 'lucide-react';

const PromptCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="bg-white border border-[#C3C6D7]/30 p-4 rounded-xl flex flex-col gap-1.5 items-start text-left hover:border-[#2563EB]/50 transition-all hover:shadow-sm"
    >
      <div className="flex items-center gap-2.5">
        <div className="text-[#191C1E]">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-bold text-[#191C1E] text-sm">{title}</span>
      </div>
      <p className="text-[12px] text-[#434655] leading-relaxed opacity-90">{description}</p>
    </button>
  );
};

const ChatPromptCards = () => {
  const prompts = [
    {
      title: "Career Exploration",
      description: '"What\'s my next career move?"',
      icon: Rocket
    },
    {
      title: "Study Tips",
      description: '"The most effective way to study?"',
      icon: BookOpenCheck
    },
    {
      title: "Review Notes",
      description: '"Summarize last week\'s notes."',
      icon: ClipboardList
    },
    {
      title: "Ide Project",
      description: '"Give me project topic ideas."',
      icon: Lightbulb
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4 mx-auto">
      {prompts.map((prompt, index) => (
        <PromptCard key={index} {...prompt} />
      ))}
    </div>
  );
};

export default ChatPromptCards;
