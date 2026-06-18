import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const LegalModal = ({ isOpen, onClose, title, content }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className="relative w-full max-w-[640px] max-h-[80vh] overflow-hidden flex flex-col bg-white text-[#191c1e] rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <h3 className="text-xl font-bold text-[#00174b]">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-[#434655]">
          {content}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2563eb] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#1d4ed8] transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
