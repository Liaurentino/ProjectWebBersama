import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessPopup from '../components/SuccessPopup';

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

const EditActivityModal = ({ isOpen, onClose, onSave, activity, categories }) => {
  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-in fade-in zoom-in duration-200 my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#191C1E]">Edit Activity</h3>
            <p className="text-[#434655] text-sm mt-1">Make your current activity to be more specific.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#434655]">Activity title</label>
            <input 
              id="edit-activity-title"
              type="text" 
              defaultValue={activity.title}
              className="w-full bg-white border border-[#C3C6D7] rounded-lg px-4 py-3 text-base font-semibold text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition-all"
            />
          </div>

          {/* Category & Project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#434655]">Category</label>
              <div className="relative">
                <select 
                  defaultValue={activity.category}
                  className="w-full bg-white border border-[#C3C6D7] rounded-lg px-4 py-3 text-base text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition-all appearance-none"
                >
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.label.toUpperCase()}>{cat.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#434655]">On Project</label>
              <div className="relative">
                <select 
                  defaultValue={activity.project}
                  className="w-full bg-white border border-[#C3C6D7] rounded-lg px-4 py-3 text-base text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition-all appearance-none"
                >
                  <option value={activity.project}>{activity.project}</option>
                  <option value="none">Not in a Project</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#434655]">Description</label>
            <textarea 
              defaultValue={activity.description}
              placeholder="Briefly describe what you did..."
              rows={4}
              className="w-full bg-white border border-[#C3C6D7] rounded-lg px-4 py-3 text-base text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition-all resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4">
            <div className="space-y-1.5 col-span-1">
              <label className="text-sm font-medium text-[#434655]">Date</label>
              <div className="bg-white border border-[#D9D9D9] rounded-lg px-4 py-2 flex items-center justify-between text-[#434655] text-sm">
                <span>mm/dd/yyyy</span>
                <CalendarIcon />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]">Start Time</label>
              <div className="bg-white border border-[#D9D9D9] rounded-lg px-3 py-2 flex items-center justify-between text-[#434655] text-sm">
                <span>12 : 00</span>
                <ClockIcon />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]">End Time</label>
              <div className="bg-white border border-[#D9D9D9] rounded-lg px-3 py-2 flex items-center justify-between text-[#434655] text-sm">
                <span>14 : 00</span>
                <ClockIcon />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]">Total Time</label>
              <div className="bg-white border border-[#D9D9D9] rounded-lg px-3 py-2 text-center text-[#434655] text-sm">
                {activity.duration}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 border border-[#737686] text-[#434655] rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => { 
              const title = document.getElementById('edit-activity-title')?.value || activity.title;
              onSave({ ...activity, title }); 
            }}
            className="px-8 py-2.5 bg-[#004AC6] text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
          >
            Save Activity
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterDropdown = ({ label, value }) => (
  <div className="flex-1 flex flex-col px-6 py-2 hover:bg-gray-50 transition-colors cursor-pointer group">
    <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1 group-hover:text-blue-500 transition-colors">{label}</span>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{value}</span>
      <ChevronDownIcon />
    </div>
  </div>
);

const ActivityCard = ({ activity, onEdit, onDelete, onViewDetails }) => {
  const { 
    id, title, category, project, timeRange, duration, 
    isActive, description, iconType 
  } = activity;

  // Map category to colors
  const categoryColors = {
    'ACADEMIC': { bg: 'bg-[#EBF5FF]', text: 'text-[#004AC6]' },
    'PERSONAL': { bg: 'bg-[#FFF4EB]', text: 'text-[#943700]' },
    'WORK': { bg: 'bg-[#EBFDF5]', text: 'text-[#059669]' },
    'HEALTH': { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]' },
    'HOBBY': { bg: 'bg-[#F5F3FF]', text: 'text-[#7C3AED]' },
    'SOCIAL': { bg: 'bg-[#FDF2F8]', text: 'text-[#DB2777]' },
    'FINANCE': { bg: 'bg-[#FEFCE8]', text: 'text-[#A16207]' },
    'OTHER': { bg: 'bg-[#F9FAFB]', text: 'text-[#4B5563]' },
  };

  const color = categoryColors[category.toUpperCase()] || categoryColors['OTHER'];

  if (isActive) {
    return (
      <div className="bg-[#F0F4F8] rounded-xl flex items-stretch border-l-4 border-[#004AC6] overflow-hidden w-full group/card transition-all hover:translate-x-1">
        <div className="flex-1 p-5 flex gap-4">
          <div className="w-12 h-12 bg-[#004AC6] rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-md shadow-blue-100">
            {iconType === 'user' ? <UserIcon /> : <BookIcon />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${color.bg} ${color.text}`}>
                {category}
              </span>
              <span className="text-gray-300 text-[10px]">|</span>
              <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wider">{project}</span>
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-500 mb-2 leading-relaxed">{description}</p>
            <div className="flex items-center gap-1.5 text-[#004AC6] font-medium text-xs">
              <ClockIcon />
              <span>{timeRange} | {duration}</span>
            </div>
          </div>
        </div>
        <div className="p-5 flex flex-col justify-center items-end gap-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(id)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all"
            title="Edit Activity"
          >
            <PencilIcon />
          </button>
          <button 
            onClick={() => onDelete(id)}
            className="w-8 h-8 rounded-full border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
            title="Delete Activity"
          >
            <Trash2Icon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all w-full hover:translate-x-1 border border-transparent hover:border-blue-50">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#F0F7FF] rounded-xl flex items-center justify-center text-[#004AC6] flex-shrink-0">
          {iconType === 'book' ? <BookIcon /> : <UserIcon />}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${color.bg} ${color.text}`}>
              {category}
            </span>
            <span className="text-gray-300 text-[10px]">|</span>
            <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wider">{project}</span>
          </div>
          <h4 className="text-base font-bold text-gray-900">{title}</h4>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-0.5">
            <ClockIcon />
            <span>{timeRange} | {duration}</span>
          </div>
        </div>
      </div>
      <div 
        onClick={() => onViewDetails(id)}
        className="flex items-center gap-1 text-sm font-bold text-blue-600 cursor-pointer hover:text-blue-700 group/link"
      >
        <span>View Details</span>
        <svg className="transition-transform group-hover/link:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </div>
    </div>
  );
};

const TimelineDivider = ({ label }) => (
  <div className="flex items-center gap-4 py-4">
    <div className="flex-1 h-[1px] bg-gray-200"></div>
    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer">
      <span>{label}</span>
      <ChevronDownIcon />
    </div>
    <div className="flex-1 h-[1px] bg-gray-200"></div>
  </div>
);

// --- Main Page Component ---

const Activity = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  
  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Success Popup State
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  
  // New States for Timer Control
  const [controlMode, setControlMode] = useState('timer'); // 'timer' or 'add'
  const [isControlDropdownOpen, setIsControlDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  
  const categories = [
    { label: 'Academic', color: { bg: 'bg-[#EBF5FF]', text: 'text-[#004AC6]' } },
    { label: 'Personal', color: { bg: 'bg-[#FFF4EB]', text: 'text-[#943700]' } },
    { label: 'Work', color: { bg: 'bg-[#EBFDF5]', text: 'text-[#059669]' } },
    { label: 'Health', color: { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]' } },
    { label: 'Hobby', color: { bg: 'bg-[#F5F3FF]', text: 'text-[#7C3AED]' } },
    { label: 'Social', color: { bg: 'bg-[#FDF2F8]', text: 'text-[#DB2777]' } },
    { label: 'Finance', color: { bg: 'bg-[#FEFCE8]', text: 'text-[#A16207]' } },
    { label: 'Other', color: { bg: 'bg-[#F9FAFB]', text: 'text-[#4B5563]' } },
  ];

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
      description: 'Preparing for the Human-Computer Interaction midterm exam by reviewing all lecture notes and design principles.'
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
      iconType: 'user'
    }
  ];

  const handleDeleteClick = (id) => {
    setActivityToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (id) => {
    const activity = activities.find(a => a.id === id) || activities[0]; // Fallback for demo
    setSelectedActivity(activity);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log(`Deleting activity with ID: ${activityToDelete}`);
  };

  const handleAction = () => {
    if (controlMode === 'timer') {
      console.log('Starting timer...');
    } else {
      console.log('Adding new activity manually...');
      setSuccessData({
        title: 'Manually Added Activity',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        duration: '00 : 00 : 00'
      });
      setIsSuccessPopupOpen(true);
    }
  };

  const handleSaveEdit = (activity) => {
    console.log('Saving activity...', activity);
    setSuccessData({
      title: activity.title,
      date: '24 Oct 2023', // Hardcoded for demo matching Figma
      duration: activity.duration
    });
    setIsEditModalOpen(false);
    setIsSuccessPopupOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col p-4 sm:p-8" onClick={() => {
      setIsControlDropdownOpen(false);
      setIsCategoryDropdownOpen(false);
    }}>
      <div className="w-full flex-1 space-y-8">
        {/* Section 1: Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Activity List</h1>
            <p className="text-gray-500 mt-1">Manage and monitor all your productivity schedules.</p>
          </div>
        </header>

        {/* Section 2: Filter Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center divide-x divide-gray-100 overflow-hidden max-w-xl">
          <FilterDropdown label="CATEGORY" value="All Categories" />
          <FilterDropdown label="STATUS" value="All Status" />
        </div>

        {/* Section 3: Timer & Entry Form */}
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Row 1: Name Input + Start/Add Toggle */}
          <div className="flex gap-4 items-center w-full">
            <div className="flex-1 bg-white border border-[#C3C6D7] rounded-xl px-6 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#2563EB]/20 transition-all">
              <input 
                type="text" 
                placeholder="Example: Working on My Math Project" 
                className="w-full bg-transparent border-none outline-none text-[#1E293B] placeholder-[#6B7280] text-base font-normal"
              />
            </div>

            <div className="relative w-[176px]">
              <div className="flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-[#2563EB] flex items-center h-[48px] rounded-xl overflow-hidden">
                  <button 
                    onClick={handleAction}
                    className="flex-1 px-4 text-white font-semibold text-base hover:bg-[#1D4ED8] transition-colors whitespace-nowrap text-center"
                  >
                    {controlMode === 'timer' ? 'Start Timer' : 'Add Activity'}
                  </button>
                  <div className="w-px h-full bg-white/20" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsControlDropdownOpen(!isControlDropdownOpen); }}
                    className="px-3 h-full text-white hover:bg-[#1D4ED8] transition-colors"
                  >
                    <ChevronDownIcon />
                  </button>
                </div>

                {/* Control Dropdown */}
                {isControlDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={() => { setControlMode('timer'); setIsControlDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-left text-base font-normal flex items-center justify-between hover:bg-gray-50 transition-colors ${controlMode === 'timer' ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}
                    >
                      Start Timer
                      <div className="text-[#1E293B]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setControlMode('add'); setIsControlDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-left text-base font-normal flex items-center justify-between hover:bg-gray-50 transition-colors ${controlMode === 'add' ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}
                    >
                      Add Activity
                      <div className="text-[#1E293B]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Metadata & Controls */}
          <div className="flex items-center gap-4 w-full">
            {/* Date Picker */}
            <div className="flex-[1] min-w-0 bg-white border border-[#D9D9D9] rounded-lg px-4 py-3 text-[#434655] text-base font-normal shadow-sm hover:border-[#2563EB] transition-all cursor-pointer">
              mm/dd/yyyy
            </div>

            {/* Category Dropdown */}
            <div className="flex-[1] min-w-0 relative">
              <div 
                onClick={(e) => { e.stopPropagation(); setIsCategoryDropdownOpen(!isCategoryDropdownOpen); }}
                className="bg-white border border-[#C3C6D7] rounded-lg px-4 py-3 flex items-center justify-between text-[#191C1E] text-base font-normal shadow-sm hover:border-[#2563EB] transition-all cursor-pointer"
              >
                <span className="truncate">{selectedCategory ? selectedCategory.label : 'Category'}</span>
                <ChevronDownIcon />
              </div>
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {categories.map((cat, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setSelectedCategory(cat); setIsCategoryDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 font-medium"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${cat.color.bg}`}></span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Project Dropdown */}
            <div className="flex-[1] min-w-0 bg-white border border-[#C3C6D7] rounded-lg px-4 py-3 flex items-center justify-between text-[#191C1E] text-base font-normal shadow-sm hover:border-[#2563EB] transition-all cursor-pointer">
              <span className="truncate">Project</span>
              <ChevronDownIcon />
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-12 bg-[#C3C6D7]" />

            {/* Action Buttons & Time Info */}
            <div className="flex items-center gap-4 shrink-0">
              {controlMode === 'timer' ? (
                <>
                  <div className="flex items-center gap-4 opacity-50">
                    <button className="bg-[#2563EB] text-white p-3 rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-sm">
                      <PauseIcon />
                    </button>
                    <button className="bg-[#2563EB] text-white p-3 rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-sm">
                      <PlayIcon />
                    </button>
                    <button className="bg-[#EF4444] text-white p-3 rounded-lg hover:bg-[#DC2626] transition-colors shadow-sm">
                      <Trash2Icon />
                    </button>
                  </div>
                  <div className="bg-white border border-[#D9D9D9] rounded-lg px-4 py-3 min-w-[126px] text-center text-[#191C1E] text-base font-normal shadow-sm">
                    00 : 00 : 00
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="bg-white border border-[#D9D9D9] rounded-lg px-4 py-3 min-w-[90px] text-center text-[#191C1E] text-base font-normal shadow-sm">
                    00 : 00
                  </div>
                  <span className="text-[#191C1E] text-base font-normal">-</span>
                  <div className="bg-white border border-[#D9D9D9] rounded-lg px-4 py-3 min-w-[90px] text-center text-[#191C1E] text-base font-normal shadow-sm">
                    00 : 00
                  </div>
                  <div className="w-px h-12 bg-[#C3C6D7]" />
                  <div className="bg-white border border-[#D9D9D9] rounded-lg px-4 py-3 min-w-[126px] text-center text-[#191C1E] text-base font-normal shadow-sm">
                    00 : 00 : 00
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Activity List (Timeline) */}
        <div className="space-y-4 pt-4">
          <TimelineDivider label="Today" />
          <div className="space-y-4">
            {activities.map(act => (
              <ActivityCard 
                key={act.id} 
                activity={act} 
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onViewDetails={(id) => navigate(`/activity-details/${id}`)}
              />
            ))}
          </div>

          <TimelineDivider label="Monday, May 24, 2024" />
          <div className="opacity-70 grayscale-[0.2] space-y-4">
             <ActivityCard 
                activity={{...activities[0], id: 3, title: 'Advanced Data Structure Study'}} 
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onViewDetails={(id) => navigate(`/activity-details/${id}`)}
             />
          </div>
        </div>
      </div>

      {/* Section 5: Pagination - Paling bawah di tengah */}
      <div className="flex justify-center items-center gap-2 py-8 mt-auto border-t border-gray-100 w-full">
        {[1, 2, 3, '...', 67, 68].map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && setActivePage(page)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
              activePage === page 
                ? 'bg-[#004AC6] text-white shadow-lg shadow-blue-100' 
                : 'text-[#004AC6] hover:bg-blue-50'
            } ${typeof page !== 'number' ? 'cursor-default pointer-events-none text-gray-400' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>

      <EditActivityModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        activity={selectedActivity}
        categories={categories}
      />

      <SuccessPopup 
        isOpen={isSuccessPopupOpen}
        onClose={() => setIsSuccessPopupOpen(false)}
        activity={successData}
        onAddMore={() => {
          setIsSuccessPopupOpen(false);
          // Potential logic to focus input or clear form
        }}
      />

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Activity"
        message="Are you sure you want to delete this activity? This action cannot be undone."
      />
    </div>
  );
};

export default Activity;
