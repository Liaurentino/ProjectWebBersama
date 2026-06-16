import React from 'react';
import { Aperture } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-4 items-end w-full max-w-3xl mb-8 animate-in fade-in duration-300">
      <div className="bg-[#004AC6] shadow-md flex items-center justify-center rounded-xl shrink-0 w-10 h-10 animate-pulse transition-all">
        <Aperture className="w-6 h-6 text-white animate-[spin_1s_linear_infinite]" />
      </div>
      <div className="bg-white border border-[#C3C6D7] flex gap-2 items-center px-4 py-3 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl shadow-sm">
        <div className="bg-[#004AC6] rounded-full w-2 h-2 animate-[bounce_0.5s_infinite] [animation-delay:-0.3s]" />
        <div className="bg-[#2563EB] rounded-full w-2 h-2 animate-[bounce_0.5s_infinite] [animation-delay:-0.15s]" />
        <div className="bg-[#60A5FA] rounded-full w-2 h-2 animate-[bounce_0.5s_infinite]" />
      </div>
    </div>
  );
};

export default TypingIndicator;
