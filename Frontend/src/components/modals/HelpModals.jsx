import React, { useState } from 'react';

export const DocumentationModal = ({ isOpen, onClose, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const docs = [
    {
      id: 'overview',
      title: '🌟 General Overview',
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Welcome to <strong>Produktif</strong>! Designed specifically for students and professionals to track productivity, structure daily activities, and get AI-driven career guidance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#2A2D31] border-gray-700' : 'bg-blue-50/60 border-blue-100'}`}>
              <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-1">📊 Smart Analytics</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Track focus hours, weekly streaks, and task completion metrics in real time.</p>
            </div>
            <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#2A2D31] border-gray-700' : 'bg-purple-50/60 border-purple-100'}`}>
              <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">🤖 AI Career Mentor</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Get personalized skill recommendations and career path insight based on your logged activities.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'activities',
      title: '📋 Activity & Notes',
      content: (
        <div className="space-y-3 text-sm leading-relaxed">
          <h4 className="font-bold text-base">Managing Your Tasks & Notes</h4>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <li><strong>Add Activity:</strong> Navigate to <em>Activity</em> page and click <em>+ Add New Activity</em>. Specify category, duration, and status.</li>
            <li><strong>Notes & Todo Lists:</strong> Use the <em>Notes</em> page to keep track of lecture notes, assignment checklists, and quick thoughts.</li>
            <li><strong>Include to AI:</strong> You can select specific notes or activities to include in your AI chat context for tailored advice.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'ai',
      title: '🤖 AI Chatbot',
      content: (
        <div className="space-y-3 text-sm leading-relaxed">
          <h4 className="font-bold text-base">Using AI Chat Assistant</h4>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <li><strong>Career Analysis:</strong> Click <em>Career Exploration</em> cards to automatically generate custom insights based on your activities.</li>
            <li><strong>Attach Documents:</strong> You can attach PDF or image files in the chat box for instant AI summary and analysis.</li>
            <li><strong>Session History:</strong> Access past conversations anytime from the right-hand sidebar menu inside AI Chat.</li>
          </ul>
        </div>
      )
    },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${isDarkMode ? 'bg-[#1A1C1E] border border-gray-800 text-white' : 'bg-white text-[#191C1E]'}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-800 bg-[#2A2D31]/50' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Documentation & User Guide</h3>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#434655]'}`}>Learn how to use all features in Produktif</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Tab Selection */}
        <div className={`flex border-b px-6 pt-3 gap-2 overflow-x-auto ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveTab(doc.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
                activeTab === doc.id
                  ? 'border-[#2563EB] text-[#2563EB] bg-[#2563EB]/5'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {doc.title}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {docs.find(d => d.id === activeTab)?.content}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex justify-end ${isDarkMode ? 'border-gray-800 bg-[#121212]' : 'border-gray-100 bg-gray-50'}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-sm transition-colors shadow-sm"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export const ContactSupportModal = ({ isOpen, onClose, isDarkMode }) => {
  const [subject, setSubject] = useState('technical');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setSubmitted(false);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#1A1C1E] border border-gray-800 text-white' : 'bg-white text-[#191C1E]'}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-800 bg-[#2A2D31]/50' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Contact Support</h3>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#434655]'}`}>Our team is here to help you</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h4 className="text-xl font-bold">Ticket Submitted!</h4>
              <p className={`text-sm max-w-sm mx-auto ${isDarkMode ? 'text-gray-400' : 'text-[#434655]'}`}>
                Thank you for reaching out. We have received your message and will get back to you via email within 24 hours.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1d4ed8] transition"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={`p-3 rounded-xl text-xs flex items-center justify-between border ${isDarkMode ? 'bg-[#2A2D31] border-gray-700 text-gray-300' : 'bg-blue-50/70 border-blue-100 text-gray-700'}`}>
                <div>
                  <p className="font-bold">Email Support Direct</p>
                  <p className="text-[11px] opacity-80">support@produktif.com</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-[10px]">
                  Online
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
                  Topic / Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm font-medium outline-none transition ${isDarkMode ? 'bg-[#2A2D31] border-gray-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-[#191C1E] focus:border-blue-500'}`}
                >
                  <option value="technical">🛠️ Technical Issue / Bug</option>
                  <option value="account">👤 Account & Login Problem</option>
                  <option value="ai">🤖 AI Mentor Questions</option>
                  <option value="other">💬 Other Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue or question in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition ${isDarkMode ? 'bg-[#2A2D31] border-gray-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-[#191C1E] focus:border-blue-500'}`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${isDarkMode ? 'bg-[#2A2D31] text-gray-300 hover:bg-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-sm transition shadow-sm disabled:opacity-60"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const SubmitFeedbackModal = ({ isOpen, onClose, isDarkMode }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('feature');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFeedback('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#1A1C1E] border border-gray-800 text-white' : 'bg-white text-[#191C1E]'}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-800 bg-[#2A2D31]/50' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Submit Feedback</h3>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#434655]'}`}>Help us improve Produktif for everyone</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-[#2563EB] rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17 4 12"/></svg>
              </div>
              <h4 className="text-xl font-bold">Thank You! 🎉</h4>
              <p className={`text-sm max-w-sm mx-auto ${isDarkMode ? 'text-gray-400' : 'text-[#434655]'}`}>
                Your feedback has been submitted successfully. We appreciate your contribution to making Produktif better!
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1d4ed8] transition"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Rating */}
              <div className="text-center py-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Rate your experience
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      <span className={star <= (hoverRating || rating) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-700'}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
                  Feedback Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'feature', label: '✨ Feature' },
                    { id: 'bug', label: '🐛 Bug' },
                    { id: 'design', label: '🎨 Design' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        category === cat.id
                          ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]'
                          : isDarkMode ? 'bg-[#2A2D31] border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">
                  Your Suggestions / Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="What can we do better? Let us know..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm outline-none transition ${isDarkMode ? 'bg-[#2A2D31] border-gray-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-[#191C1E] focus:border-blue-500'}`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${isDarkMode ? 'bg-[#2A2D31] text-gray-300 hover:bg-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-sm transition shadow-sm disabled:opacity-60"
                >
                  {sending ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
