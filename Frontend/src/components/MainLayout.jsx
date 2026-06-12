import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )},
    { name: 'Activity', path: '/activity', icon: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    )},
    { name: 'Statistics', path: '/statistics', icon: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    )},
    { name: 'Notes', path: '/notes', icon: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    )},
    { name: 'AI Asked', path: '/chat', icon: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <path d="m15.5 15.5 2 2" />
        <path d="m15.5 8.5 2-2" />
        <path d="m8.5 15.5-2 2" />
        <path d="m8.5 8.5-2-2" />
      </svg>
    )},
    { name: 'Profile', path: '/profile', icon: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )},
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] font-sans">
      {/* Sidebar Navigasi - Fixed position */}
      <aside className={`fixed inset-y-0 left-0 z-50 ${isSidebarMinimized ? 'w-20' : 'w-64'} bg-white border-r border-[#E7E8EA] transition-all duration-300 ease-in-out flex flex-col h-screen overflow-visible`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
          className="absolute -right-3 top-20 bg-white border border-[#E7E8EA] rounded-full p-1 shadow-sm hover:bg-gray-50 z-[60]"
        >
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isSidebarMinimized ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Header - Fixed at top of sidebar */}
        <div className="p-6 shrink-0">
          <div className={`px-2 transition-opacity duration-200 ${isSidebarMinimized ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className="text-xl font-bold text-[#004AC6] whitespace-nowrap">ProdActivity</h2>
            <p className="text-[10px] text-[#434655] opacity-70 uppercase tracking-wider font-semibold whitespace-nowrap">Career Readiness</p>
          </div>
          {isSidebarMinimized && (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-[#004AC6] rounded-lg flex items-center justify-center text-white font-bold">P</div>
            </div>
          )}
        </div>
        
        {/* Scrollable Nav Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  isActive 
                    ? 'bg-[#2563EB] text-white shadow-md' 
                    : 'text-[#434655] hover:bg-gray-100'
                } ${isSidebarMinimized ? 'justify-center' : ''}`}
                title={isSidebarMinimized ? item.name : ''}
              >
                {item.icon(isActive)}
                {!isSidebarMinimized && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Fixed at bottom of sidebar */}
        <div className="p-4 border-t border-[#EDEEF0] space-y-1 shrink-0 bg-white">
          <Link to="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[#434655] hover:bg-gray-100 transition ${isSidebarMinimized ? 'justify-center' : ''}`} title="Settings">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {!isSidebarMinimized && <span className="whitespace-nowrap">Settings</span>}
          </Link>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[#BA1A1A] hover:bg-red-50 transition ${isSidebarMinimized ? 'justify-center' : ''}`}
            title="Logout"
          >
            <svg className="w-5 h-5 text-[#BA1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!isSidebarMinimized && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Konten Utama + Top Navbar - Compensate for sidebar width */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarMinimized ? 'ml-20' : 'ml-64'}`}>
        <header className="h-16 bg-white border-b border-[#C3C6D7] flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#004AC6] whitespace-nowrap">Productive Projects</h1>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs hidden sm:block">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search Activity or Notes..." 
                className="w-full bg-[#F3F4F6] border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#2563EB] outline-none"
              />
            </form>

            {/* Search Dropdown / Overlay */}
            {isSearchFocused && (
              <div className="absolute top-14 right-0 w-[448px] bg-white border border-[#C3C6D7] rounded-xl shadow-2xl z-[100] overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                   <h3 className="text-[10px] font-bold text-[#434655] tracking-widest uppercase">History</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                  {[
                    { title: 'Running', icon: '🕒' },
                    { title: 'Webinar UI', icon: '🕒' },
                    { title: 'Completing', icon: '🕒' },
                  ].map((item, idx) => (
                    <button 
                      key={idx}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-100 rounded-lg transition group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 group-hover:text-[#2563EB] transition-colors">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-[#191C1E]">{item.title}</span>
                      </div>
                      <span className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="w-10 h-10 rounded-full border-2 border-[#2563EB] overflow-hidden shrink-0">
              <img src="https://www.figma.com/api/mcp/asset/1f26d65b-90c0-4d50-b219-80350290b7e9" alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;