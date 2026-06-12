import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

// --- Icons (SVG) ---
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
);

const Trash2Icon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

// --- Sub-components ---

const FilterDropdown = ({ label, value }) => (
  <div className="flex-1 flex flex-col px-6 py-2">
    <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">{label}</span>
    <div className="flex items-center justify-between cursor-pointer">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{value}</span>
      <ChevronDownIcon />
    </div>
  </div>
);

const ActivityCard = ({ activity }) => {
  const { 
    id, title, category, project, timeRange, duration, 
    isActive, description, categoryColor, iconType 
  } = activity;

  if (isActive) {
    return (
      <div className="bg-[#F0F4F8] dark:bg-[#1A1C1E] rounded-xl flex items-stretch border-l-4 border-[#004AC6] overflow-hidden transition-colors">
        <div className="flex-1 p-5 flex gap-4">
          <div className="w-12 h-12 bg-[#004AC6] rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-1">
            {iconType === 'user' ? <UserIcon /> : <BookIcon />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${categoryColor.bg} ${categoryColor.text} dark:bg-opacity-20`}>
                {category}
              </span>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{project}</span>
            </div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">{description}</p>
            <div className="flex items-center gap-1.5 text-[#004AC6] dark:text-blue-400 font-medium text-xs">
              <ClockIcon />
              <span>{timeRange} | {duration}</span>
            </div>
          </div>
        </div>
        <div className="p-5 flex flex-col justify-center items-end gap-3">
          <button className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#2A2D31] transition-colors">
            <PencilIcon />
          </button>
          <button className="w-8 h-8 rounded-full border border-red-200 dark:border-red-900/30 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <Trash2Icon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1A1C1E] rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all border border-transparent dark:border-gray-800">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#F0F7FF] dark:bg-[#2A2D31] rounded-xl flex items-center justify-center text-[#004AC6] dark:text-blue-400 flex-shrink-0">
          {iconType === 'book' ? <BookIcon /> : <UserIcon />}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${categoryColor.bg} ${categoryColor.text} dark:bg-opacity-20`}>
              {category}
            </span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{project}</span>
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">{title}</h4>
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs mt-0.5">
            <ClockIcon />
            <span>{timeRange} | {duration}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer hover:underline">
        <span>View Details</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </div>
    </div>
  );
};

const TimelineDivider = ({ label }) => (
  <div className="flex items-center gap-4 py-4">
    <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800"></div>
    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest cursor-pointer">
      <span>{label}</span>
      <ChevronDownIcon />
    </div>
    <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800"></div>
  </div>
);

// --- Main Page Component ---

const Activity = () => {
  const [activePage, setActivePage] = useState(1);
  const { isDarkMode } = useTheme();

  const activities = [
    {
      id: 1,
      title: 'Midterm Exam Preparation (UTS)',
      category: 'ACADEMIC',
      project: 'Project HCI',
      timeRange: '09:00 - 11:30',
      duration: '02 : 30 : 20',
      isActive: false,
      iconType: 'book',
      categoryColor: { bg: 'bg-[#EBF5FF]', text: 'text-[#004AC6]' }
    },
    {
      id: 2,
      title: 'Sports & HIIT Training',
      category: 'PERSONAL',
      project: 'Portofolio',
      timeRange: '09:00 - 11:30',
      duration: '02 : 30 : 20',
      isActive: true,
      description: 'High intensity training sessions in the Student Gym Center.',
      iconType: 'user',
      categoryColor: { bg: 'bg-[#FFF4EB]', text: 'text-[#943700]' }
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121212] p-8 flex justify-start transition-colors duration-300">
      <div className="w-full max-w-5xl space-y-8">
        {/* Section 1: Header */}
        <header>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Activity List</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor all your productivity schedules.</p>
        </header>

        {/* Section 2: Filter Card */}
        <div className="bg-white dark:bg-[#1A1C1E] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center divide-x divide-gray-100 dark:divide-gray-800 overflow-hidden transition-colors">
          <FilterDropdown label="CATEGORY" value="All" />
          <FilterDropdown label="PROJECT" value="All" />
        </div>

        {/* Section 3: Timer & Entry Form */}
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Example: Working on My Math Project" 
              className="flex-1 bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-[#191C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004AC6]/20 transition-all"
            />
            <div className="flex overflow-hidden rounded-xl">
              <button className="bg-[#004AC6] text-white px-6 py-3 font-bold text-sm hover:bg-[#003da3] transition-colors whitespace-nowrap">
                Start Timer
              </button>
              <button className="bg-[#004AC6] text-white px-2 border-l border-white/20 hover:bg-[#003da3] transition-colors">
                <ChevronDownIcon />
              </button>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Picker */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 cursor-pointer min-w-[160px] transition-colors">
              <span className="flex-1">mm/dd/yyyy</span>
              <CalendarIcon />
            </div>

            {/* Category Dropdown */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 cursor-pointer min-w-[140px] transition-colors">
              <span className="flex-1">Category</span>
              <ChevronDownIcon />
            </div>

            {/* Project Dropdown */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 cursor-pointer min-w-[140px] transition-colors">
              <span className="flex-1">Project</span>
              <ChevronDownIcon />
            </div>

            <div className="flex-1"></div>

            {/* Control Buttons Group */}
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-[#EBF5FF] dark:bg-[#2A2D31] text-[#004AC6] dark:text-blue-400 rounded-xl flex items-center justify-center hover:bg-[#D6E9FF] dark:hover:bg-gray-700 transition-colors">
                <PauseIcon />
              </button>
              <button className="w-10 h-10 bg-[#004AC6] text-white rounded-xl flex items-center justify-center hover:bg-[#003da3] transition-colors shadow-lg shadow-blue-200 dark:shadow-none">
                <PlayIcon />
              </button>
              <button className="w-10 h-10 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                <DeleteIcon />
              </button>
            </div>

            {/* Timer Display */}
            <div className="border-2 border-gray-200 dark:border-gray-800 rounded-xl px-6 py-2 font-mono font-bold text-gray-700 dark:text-gray-300 text-lg transition-colors">
              00 : 00 : 00
            </div>
          </div>
        </div>

        {/* Section 4: Activity List (Timeline) */}
        <div className="space-y-4 pt-4">
          <TimelineDivider label="Today" />
          <div className="space-y-3">
            {activities.map(act => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>

          <TimelineDivider label="Monday, May 24, 2024" />
          <div className="opacity-70 grayscale-[0.2]">
             <ActivityCard activity={{...activities[0], id: 3, title: 'Advanced Data Study'}} />
          </div>
        </div>

        {/* Section 5: Pagination */}
        <div className="flex justify-center items-center gap-2 py-10">
          {[1, 2, 3, '...', 67, 68].map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === 'number' && setActivePage(page)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                activePage === page 
                  ? 'bg-[#004AC6] text-white shadow-lg shadow-blue-100 dark:shadow-none' 
                  : 'text-[#004AC6] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800'
              } ${typeof page !== 'number' ? 'cursor-default pointer-events-none text-gray-400' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activity;
