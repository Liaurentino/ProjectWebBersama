import React from 'react';
import { Copy, RotateCcw, MoreHorizontal } from 'lucide-react';

const ChatBubble = ({ message, sender, time, status }) => {
  const isUser = sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end w-full mb-6">
        <div className="flex flex-col gap-1 items-end max-w-[80%] sm:max-w-[70%] md:max-w-[60%] animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-[#2563EB] text-[#EEEFFF] p-4 rounded-l-2xl rounded-br-2xl shadow-sm">
            <p className="text-sm sm:text-base leading-relaxed">
              {message}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#434655] px-1 font-medium">
            <span>{time}</span>
            <span>•</span>
            <span>{status || 'Sent'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mb-8 animate-in slide-in-from-left-4 fade-in duration-300">
      <div className="flex flex-col gap-3">
        <div className="text-[#191C1E] text-sm sm:text-base leading-relaxed text-justify space-y-4">
          <p>{message}</p>
        </div>
      </div>
      
      {/* AI Actions */}
      <div className="flex items-center gap-2">
        <button className="p-1.5 text-[#434655] hover:bg-gray-100 rounded-md transition-colors" title="Copy">
          <Copy className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-[#434655] hover:bg-gray-100 rounded-md transition-colors" title="Regenerate">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-[#434655] hover:bg-gray-100 rounded-md transition-colors" title="More">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatBubble;
