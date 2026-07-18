import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, SendHorizontal, Files, ClipboardPenLine, NotebookText, File, CalendarFold, X, FileText, ImageIcon, AlertCircle } from 'lucide-react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5 MB
const MAX_PDF_SIZE   = 20 * 1024 * 1024; // 20 MB

const ChatInput = ({ value, onChange, onSend, onIncludeClick, selectedItems = [], onRemoveItem, onFileSelect, selectedFile, onRemoveFile }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [fileError, setFileError]     = useState('');
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // Validasi dan set file
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');

    const isImage = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
    const isPdf   = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      setFileError('Hanya file JPG, PNG, atau PDF yang didukung.');
      e.target.value = '';
      return;
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      setFileError('Ukuran gambar maksimal 5 MB.');
      e.target.value = '';
      return;
    }

    if (isPdf && file.size > MAX_PDF_SIZE) {
      setFileError('Ukuran PDF maksimal 20 MB.');
      e.target.value = '';
      return;
    }

    onFileSelect(file);
    // Reset input agar file yang sama bisa dipilih lagi
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    onRemoveFile();
    setFileError('');
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

  const isImageFile = selectedFile && selectedFile.type.startsWith('image/');
  const isPdfFile   = selectedFile && selectedFile.type === 'application/pdf';

  return (
    <div className="w-full shrink-0 bg-gradient-to-t from-[#F8F9FB] dark:from-[#121212] via-[#F8F9FB] dark:via-[#121212] to-transparent pt-4 pb-6 px-6 flex flex-col items-center z-[100] relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="w-full max-w-2xl flex flex-col gap-3">

        {/* Error message */}
        {fileError && (
          <div className="flex items-center gap-2 text-red-500 text-xs px-1 animate-in fade-in duration-200">
            <AlertCircle size={14} />
            <span>{fileError}</span>
          </div>
        )}

        {/* File preview chip */}
        {selectedFile && (
          <div className="flex items-center gap-2 px-1 animate-in slide-in-from-bottom-2 duration-300">
            {isImageFile ? (
              <div className="relative group">
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-2">
                  {/* Thumbnail preview */}
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="preview"
                    className="w-8 h-8 rounded-lg object-cover"
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[#2563EB] text-xs font-semibold truncate max-w-[180px]">{selectedFile.name}</span>
                    <span className="text-[#737686] text-[10px]">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB · Gambar</span>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="ml-1 text-[#2563EB] hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : isPdfFile ? (
              <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl px-3 py-2">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-orange-500" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold truncate max-w-[180px]">{selectedFile.name}</span>
                  <span className="text-[#737686] text-[10px]">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB · PDF</span>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="ml-1 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Context chips (tasks/notes) */}
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
          <div className="bg-white dark:bg-[#1A1C1E] border-2 border-[#004AC6]/30 dark:border-blue-900/50 rounded-xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05)] dark:shadow-none flex items-center p-0.5 relative">
            <textarea
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none py-3 px-4 text-[#434655] dark:text-gray-300 text-sm resize-none h-12 max-h-28 min-h-[48px] scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#C3C6D7] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#A0A3B1]"
            />
            <div className="flex items-center gap-1 pr-2 relative" ref={dropdownRef}>
              {showOptions && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setShowOptions(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#434655] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2D31] rounded-lg transition-colors group"
                    >
                      <Files className="w-5 h-5 text-[#434655] dark:text-gray-400 group-hover:text-[#004AC6] transition-colors" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Upload Files or Photos</span>
                        <span className="text-[10px] text-[#737686] dark:text-gray-500">JPG/PNG max 5 MB · PDF max 20 MB</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowOptions(false);
                        onIncludeClick();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#434655] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2D31] rounded-lg transition-colors group"
                    >
                      <ClipboardPenLine className="w-5 h-5 text-[#434655] dark:text-gray-400 group-hover:text-[#004AC6] transition-colors" />
                      <span className="font-medium">Include Tasks or Notes</span>
                    </button>
                  </div>
                </div>
              )}
              {/* Indikator file terpilih di tombol paperclip */}
              <button
                onClick={() => setShowOptions(!showOptions)}
                className={`p-1.5 rounded-lg transition-all relative ${
                  showOptions || selectedFile
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-[#004AC6]'
                    : 'text-[#434655] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2A2D31]'
                }`}
              >
                <Paperclip className="w-5 h-5" />
                {selectedFile && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#004AC6] rounded-full border-2 border-white dark:border-[#1A1C1E]" />
                )}
              </button>
              <button
                onClick={onSend}
                disabled={!value.trim() && !selectedFile}
                className="bg-[#004AC6] text-white p-2 rounded-lg shadow-md hover:bg-[#003da3] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <SendHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-[#434655] dark:text-gray-500 font-medium tracking-wide text-center">AI Mentor can make mistakes.</p>
      </div>
    </div>
  );
};

export default ChatInput;
