import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessPopup from '../components/SuccessPopup';

// --- Icons (SVG) ---
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

const StopIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><rect width="6" height="6" x="9" y="9" fill="currentColor"/></svg>
);

const PenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/><path d="m15 5 4 4"/></svg>
);

const TimerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
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

const EditActivityModal = ({ isOpen, onClose, onSave, activity, categories, projects }) => {
  const [editedActivity, setEditedActivity] = useState(null);
  const editDateRef = useRef(null);
  const editStartRef = useRef(null);
  const editEndRef = useRef(null);

  useEffect(() => {
    if (activity) {
      setEditedActivity({
        ...activity,
        // Ensure date and times are in a format native inputs can use
        manualDate: new Date().toISOString().split('T')[0], 
        manualStartTime: '12:00',
        manualEndTime: '14:00'
      });
    }
  }, [activity]);

  if (!isOpen || !editedActivity) return null;

  const calculateDuration = (start, end) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let diff = (endH * 60 + endM) - (startH * 60 + startM);
    if (diff < 0) diff += 24 * 60;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : 00`;
  };

  const currentDuration = calculateDuration(editedActivity.manualStartTime, editedActivity.manualEndTime);

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
              type="text" 
              value={editedActivity.title}
              onChange={(e) => setEditedActivity({...editedActivity, title: e.target.value})}
              className="w-full bg-white border border-[#C3C6D7] rounded-lg px-4 py-3 text-base font-semibold text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition-all"
            />
          </div>

          {/* Category & Project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#434655]">Category</label>
              <div className="relative">
                <select 
                  value={editedActivity.category}
                  onChange={(e) => setEditedActivity({...editedActivity, category: e.target.value})}
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
                  value={editedActivity.project}
                  onChange={(e) => setEditedActivity({...editedActivity, project: e.target.value})}
                  className="w-full bg-white border border-[#C3C6D7] rounded-lg px-4 py-3 text-base text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition-all appearance-none"
                >
                  <option value="None">None</option>
                  {projects.map((proj, i) => (
                    <option key={i} value={proj}>{proj}</option>
                  ))}
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
              value={editedActivity.description}
              onChange={(e) => setEditedActivity({...editedActivity, description: e.target.value})}
              placeholder="Briefly describe what you did..."
              rows={4}
              className="w-full bg-white border border-[#C3C6D7] rounded-lg px-4 py-3 text-base text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition-all resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4">
            <div className="space-y-1.5 col-span-1">
              <label className="text-sm font-medium text-[#434655]">Date</label>
              <div 
                onClick={() => editDateRef.current?.showPicker()}
                className="relative bg-white border border-[#D9D9D9] rounded-lg px-4 py-2 flex items-center justify-between text-[#434655] text-sm cursor-pointer hover:border-[#2563EB] transition-all"
              >
                <span>{new Date(editedActivity.manualDate).toLocaleDateString('en-GB')}</span>
                <CalendarIcon />
                <input 
                  ref={editDateRef}
                  type="date"
                  value={editedActivity.manualDate}
                  onChange={(e) => setEditedActivity({...editedActivity, manualDate: e.target.value})}
                  className="absolute inset-0 opacity-0 pointer-events-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]">Start Time</label>
              <div 
                onClick={() => editStartRef.current?.showPicker()}
                className="relative bg-white border border-[#D9D9D9] rounded-lg px-3 py-2 flex items-center justify-between text-[#434655] text-sm cursor-pointer hover:border-[#2563EB] transition-all"
              >
                <span>{editedActivity.manualStartTime}</span>
                <ClockIcon />
                <input 
                  ref={editStartRef}
                  type="time"
                  value={editedActivity.manualStartTime}
                  onChange={(e) => setEditedActivity({...editedActivity, manualStartTime: e.target.value})}
                  className="absolute inset-0 opacity-0 pointer-events-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]">End Time</label>
              <div 
                onClick={() => editEndRef.current?.showPicker()}
                className="relative bg-white border border-[#D9D9D9] rounded-lg px-3 py-2 flex items-center justify-between text-[#434655] text-sm cursor-pointer hover:border-[#2563EB] transition-all"
              >
                <span>{editedActivity.manualEndTime}</span>
                <ClockIcon />
                <input 
                  ref={editEndRef}
                  type="time"
                  value={editedActivity.manualEndTime}
                  onChange={(e) => setEditedActivity({...editedActivity, manualEndTime: e.target.value})}
                  className="absolute inset-0 opacity-0 pointer-events-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]">Total Time</label>
              <div className="bg-gray-50 border border-[#D9D9D9] rounded-lg px-3 py-2 text-center text-[#434655] text-sm font-bold">
                {currentDuration}
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
            onClick={() => onSave({ ...editedActivity, duration: currentDuration })}
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

const ActivityCard = ({ activity, onEdit, onDelete }) => {
  const { 
    id, title, category, project, timeRange, duration, 
    isActive, description, iconType 
  } = activity;

  const [isExpanded, setIsExpanded] = useState(isActive);

  // Map category to colors
  const categoryColors = {
    'AKADEMIK': { bg: 'bg-[#EBF5FF]', text: 'text-[#004AC6]' },
    'PERSONAL': { bg: 'bg-[#FFF4EB]', text: 'text-[#943700]' },
    'ORGANISASI': { bg: 'bg-[#F5F3FF]', text: 'text-[#7C3AED]' },
    'OTHER': { bg: 'bg-[#F9FAFB]', text: 'text-[#4B5563]' },
  };

  const color = categoryColors[category.toUpperCase()] || categoryColors['OTHER'];

  return (
    <div className={`rounded-xl flex items-stretch transition-all duration-300 w-full border border-transparent hover:border-blue-50 ${isExpanded ? 'bg-[rgba(0,74,198,0.05)] border-l-4 border-[#004AC6] shadow-sm' : 'bg-white shadow-sm'}`}>
      <div className={`flex-1 ${isExpanded ? 'pl-7 py-6' : 'p-5'} flex gap-4`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${isExpanded ? 'bg-[#2563EB] text-white shadow-md shadow-blue-100' : 'bg-[#F0F7FF] text-[#004AC6]'}`}>
          {iconType === 'book' ? <BookIcon /> : <UserIcon />}
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
          
          {isExpanded && (
            <p className="text-sm text-gray-500 mb-2 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
              {description}
            </p>
          )}

          <div className={`flex items-center gap-1.5 font-medium text-xs transition-colors ${isExpanded ? 'text-[#004AC6]' : 'text-gray-400'}`}>
            <ClockIcon />
            <span>{timeRange} | {duration}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col justify-center items-end gap-3 transition-all duration-300 min-w-[140px]">
        {isExpanded ? (
          <div className="flex flex-col items-end gap-2 animate-in fade-in zoom-in duration-200">
            <div className="flex gap-2 items-center">
              <button 
                onClick={() => onEdit(id)}
                className="border border-[#737686] p-2.5 rounded-lg text-[#434655] hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center"
                title="Edit Activity"
              >
                <PencilIcon />
              </button>
              <button 
                onClick={() => onDelete(id)}
                className="border border-[#BA1A1A] p-2.5 rounded-lg text-[#BA1A1A] hover:bg-red-50 transition-all shadow-sm flex items-center justify-center"
                title="Delete Activity"
              >
                <Trash2Icon />
              </button>
            </div>
            {!isActive && (
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase pr-1 tracking-wider"
              >
                Hide
              </button>
            )}
          </div>
        ) : (
          <div 
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1 text-sm font-bold text-blue-600 cursor-pointer hover:text-blue-700 group/link whitespace-nowrap"
          >
            <span>View Details</span>
            <svg className="transition-transform group-hover/link:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        )}
      </div>
    </div>
  );
};

const TimelineDivider = ({ label, isCollapsed, onToggle }) => (
  <div 
    className="flex items-center gap-4 py-4 cursor-pointer group" 
    onClick={onToggle}
  >
    <div className="flex-1 h-[1px] bg-gray-200 group-hover:bg-gray-400 transition-colors"></div>
    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all">
      <span className="group-hover:text-gray-700 transition-colors">{label}</span>
      <div className={`transition-all duration-200 group-hover:text-gray-700 ${isCollapsed ? 'rotate-180' : ''}`}>
        <ChevronDownIcon />
      </div>
    </div>
    <div className="flex-1 h-[1px] bg-gray-200 group-hover:bg-gray-400 transition-colors"></div>
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
  
  // View Filter States
  const [viewCategory, setViewCategory] = useState('All Categories');
  const [isViewCategoryDropdownOpen, setIsViewCategoryDropdownOpen] = useState(false);
  const [viewProject, setViewProject] = useState('All Projects');
  const [isViewProjectDropdownOpen, setIsViewProjectDropdownOpen] = useState(false);

  // New States for Timer Control
  const [controlMode, setControlMode] = useState('timer'); // 'timer' or 'add'
  const [isControlDropdownOpen, setIsControlDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Timer Functional States
  const [timerStatus, setTimerStatus] = useState('idle'); // 'idle', 'running', 'paused'
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerStartTime, setTimerStartTime] = useState(null);
  const timerIntervalRef = useRef(null);

  // Project States
  const [projects, setProjects] = useState(['Project HCI', 'Portofolio']);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectInput, setNewProjectInput] = useState('');

  // Manual Entry States
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualStartTime, setManualStartTime] = useState('00:00');
  const [manualEndTime, setManualEndTime] = useState('00:00');

  // Refs for native pickers
  const dateInputRef = useRef(null);
  const startTimeInputRef = useRef(null);
  const endTimeInputRef = useRef(null);

  // Section Collapse State
  const [collapsedSections, setCollapsedSections] = useState({
    today: false,
    past: false
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const calculateManualDuration = () => {
    const [startH, startM] = manualStartTime.split(':').map(Number);
    const [endH, endM] = manualEndTime.split(':').map(Number);
    
    let diffInMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffInMinutes < 0) diffInMinutes += 24 * 60; // Handle overnight
    
    const h = Math.floor(diffInMinutes / 60);
    const m = diffInMinutes % 60;
    return `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : 00`;
  };
  
  const categories = [
    { label: 'Akademik', color: { bg: 'bg-[#EBF5FF]', text: 'text-[#004AC6]' } },
    { label: 'Personal', color: { bg: 'bg-[#FFF4EB]', text: 'text-[#943700]' } },
    { label: 'Organisasi', color: { bg: 'bg-[#F5F3FF]', text: 'text-[#7C3AED]' } },
  ];

  const statuses = ['All Status', 'Active', 'Completed'];

  // Main Activities State with dummy data for multiple pages
  const [activities, setActivities] = useState([
    // Today
    {
      id: 1,
      title: 'Midterm Exam Preparation (UTS)',
      category: 'AKADEMIK',
      project: 'Project HCI',
      date: new Date().toISOString().split('T')[0],
      timeRange: '09:00 - 11:30',
      duration: '02 : 30 : 20',
      isActive: false,
      iconType: 'book',
      description: 'Preparing for the Human-Computer Interaction midterm exam by reviewing all lecture notes and design principles.',
      page: 1
    },
    // Past Activities distributed across pages
    {
      id: 2,
      title: 'Sports & HIIT Training',
      category: 'PERSONAL',
      project: 'Portofolio',
      date: '2024-05-24',
      timeRange: '16:30 - 18:00',
      duration: '01 : 30 : 15',
      isActive: false,
      description: 'High intensity training sessions in the Student Gym Center.',
      iconType: 'user',
      page: 1
    },
    {
      id: 3,
      title: 'Advanced Data Structure Study',
      category: 'AKADEMIK',
      project: 'None',
      date: '2024-05-23',
      timeRange: '10:00 - 12:00',
      duration: '02 : 00 : 00',
      isActive: false,
      iconType: 'book',
      description: 'Reviewing graph algorithms and their complexities.',
      page: 2
    },
    {
      id: 4,
      title: 'Organization Meeting',
      category: 'ORGANISASI',
      project: 'None',
      date: '2024-05-22',
      timeRange: '19:00 - 20:30',
      duration: '01 : 30 : 00',
      isActive: false,
      iconType: 'user',
      description: 'Weekly coordination meeting for the upcoming campus event.',
      page: 3
    },
    {
      id: 5,
      title: 'UI Design Refinement',
      category: 'PERSONAL',
      project: 'Project HCI',
      date: '2024-05-21',
      timeRange: '14:00 - 16:00',
      duration: '02 : 00 : 00',
      isActive: false,
      iconType: 'user',
      description: 'Refining the activity card designs based on Figma feedback.',
      page: 4
    },
    {
      id: 6,
      title: 'Library Research',
      category: 'AKADEMIK',
      project: 'None',
      date: '2024-05-20',
      timeRange: '08:00 - 10:30',
      duration: '02 : 30 : 00',
      isActive: false,
      iconType: 'book',
      description: 'Gathering references for the final project proposal.',
      page: 5
    },
    {
      id: 7,
      title: 'Community Service Planning',
      category: 'ORGANISASI',
      project: 'None',
      date: '2024-05-19',
      timeRange: '16:00 - 17:00',
      duration: '01 : 00 : 00',
      isActive: false,
      iconType: 'user',
      description: 'Planning the agenda for next month social activity.',
      page: 6
    },
    {
      id: 8,
      title: 'Backend API Documentation',
      category: 'PERSONAL',
      project: 'Portofolio',
      date: '2024-05-18',
      timeRange: '20:00 - 22:00',
      duration: '02 : 00 : 00',
      isActive: false,
      iconType: 'user',
      description: 'Writing documentation for the authentication endpoints.',
      page: 7
    }
  ]);

  // Timer Logic
  useEffect(() => {
    if (timerStatus === 'running') {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerStatus]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    // Start count-up immediately when clicking "Start Timer"
    if (timerStatus === 'idle') {
      setTimerStatus('running');
      setTimerStartTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const handleEndTimer = () => {
    const titleInput = document.getElementById('activity-name-input');
    const title = titleInput?.value || 'New Timed Activity';
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const finalDuration = formatTime(elapsedSeconds);

    const newActivity = {
      id: Date.now(),
      title,
      category: selectedCategory?.label.toUpperCase() || 'PERSONAL',
      project: selectedProject || 'None',
      date: new Date().toISOString().split('T')[0],
      timeRange: `${timerStartTime} - ${currentTime}`,
      duration: finalDuration,
      isActive: false,
      iconType: selectedCategory?.label === 'Akademik' ? 'book' : 'user',
      description: `Timed activity on project ${selectedProject || 'None'}`,
      page: activePage // Ensure it matches current page view
    };

    setActivities(prev => [newActivity, ...prev]);
    
    setSuccessData({
      title: title,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      duration: finalDuration
    });
    setIsSuccessPopupOpen(true);
    
    // Reset Timer & Form
    setTimerStatus('idle');
    setElapsedSeconds(0);
    setTimerStartTime(null);
    if (titleInput) titleInput.value = '';
    setSelectedCategory(null);
    setSelectedProject(null);
  };

  const handleTogglePlayPause = () => {
    if (timerStatus === 'running') {
      setTimerStatus('paused');
    } else if (timerStatus === 'paused') {
      setTimerStatus('running');
    }
  };

  const handleResetTimer = () => {
    setTimerStatus('idle');
    setElapsedSeconds(0);
    setTimerStartTime(null);
  };

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
    setActivities(prev => prev.filter(a => a.id !== activityToDelete));
    setIsDeleteModalOpen(false);
  };

  const handleAction = () => {
    if (controlMode === 'timer') {
      if (timerStatus === 'idle') handleStartTimer();
      else handleEndTimer();
    } else {
      const titleInput = document.getElementById('activity-name-input');
      const title = titleInput?.value || 'Manually Added Activity';
      const duration = calculateManualDuration();

      const newActivity = {
        id: Date.now(),
        title,
        category: selectedCategory?.label.toUpperCase() || 'PERSONAL',
        project: selectedProject || 'None',
        date: manualDate,
        timeRange: `${manualStartTime} - ${manualEndTime}`,
        duration,
        isActive: false,
        iconType: selectedCategory?.label === 'Akademik' ? 'book' : 'user',
        description: `Manual entry for ${manualDate}`,
        page: activePage // Ensure it matches current page view
      };

      setActivities(prev => [newActivity, ...prev]);

      setSuccessData({
        title: title,
        date: new Date(manualDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        duration
      });
      setIsSuccessPopupOpen(true);
      
      // Clear form
      if (titleInput) titleInput.value = '';
      setSelectedCategory(null);
      setSelectedProject(null);
    }
  };

  const handleSaveEdit = (activity) => {
    setActivities(prev => prev.map(a => a.id === activity.id ? activity : a));
    setSuccessData({
      title: activity.title,
      date: new Date(activity.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      duration: activity.duration
    });
    setIsEditModalOpen(false);
    setIsSuccessPopupOpen(true);
  };

  // Helper to format date for display
  const formatDateLabel = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Filtering & Grouping Logic
  const filteredActivities = activities.filter(act => {
    const categoryMatch = viewCategory === 'All Categories' || act.category.toUpperCase() === viewCategory.toUpperCase();
    const projectMatch = viewProject === 'All Projects' || act.project === viewProject;
    const pageMatch = act.page === activePage;
    return categoryMatch && projectMatch && pageMatch;
  });

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(activity);
    return groups;
  }, {});

  // Sort dates descending (newest first)
  const sortedDates = Object.keys(groupedActivities).sort().reverse();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col p-4 sm:p-8" onClick={() => {
      setIsControlDropdownOpen(false);
      setIsCategoryDropdownOpen(false);
      setIsViewCategoryDropdownOpen(false);
      setIsViewStatusDropdownOpen(false);
      setIsProjectDropdownOpen(false);
      setIsAddingProject(false);
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center divide-x divide-gray-100 overflow-visible max-w-xl">
          {/* Category Filter */}
          <div className="flex-1 relative">
            <div 
              onClick={(e) => { e.stopPropagation(); setIsViewCategoryDropdownOpen(!isViewCategoryDropdownOpen); setIsViewProjectDropdownOpen(false); }}
              className="flex flex-col px-6 py-2 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1 group-hover:text-blue-500 transition-colors">CATEGORY</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{viewCategory}</span>
                <ChevronDownIcon />
              </div>
            </div>
            {isViewCategoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-[60] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => { setViewCategory('All Categories'); setIsViewCategoryDropdownOpen(false); }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                >
                  All Categories
                </button>
                <div className="h-px bg-gray-100 my-1 mx-2" />
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {categories.map((cat, i) => (
                    <button 
                      key={i} 
                      onClick={() => { setViewCategory(cat.label); setIsViewCategoryDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Project Filter */}
          <div className="flex-1 relative">
            <div 
              onClick={(e) => { e.stopPropagation(); setIsViewProjectDropdownOpen(!isViewProjectDropdownOpen); setIsViewCategoryDropdownOpen(false); }}
              className="flex flex-col px-6 py-2 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1 group-hover:text-blue-500 transition-colors">PROJECT</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{viewProject}</span>
                <ChevronDownIcon />
              </div>
            </div>
            {isViewProjectDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-[60] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => { setViewProject('All Projects'); setIsViewProjectDropdownOpen(false); }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                >
                  All Projects
                </button>
                <div className="h-px bg-gray-100 my-1 mx-2" />
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  <button 
                    onClick={() => { setViewProject('None'); setIsViewProjectDropdownOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-400 font-medium"
                  >
                    None
                  </button>
                  {projects.map((proj, i) => (
                    <button 
                      key={i} 
                      onClick={() => { setViewProject(proj); setIsViewProjectDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
                      {proj}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Timer & Entry Form */}
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Row 1: Name Input + Start/Add Toggle */}
          <div className="flex gap-4 items-center w-full">
            <div className="flex-1 bg-white border border-[#C3C6D7] rounded-xl px-6 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#2563EB]/20 transition-all">
              <input 
                id="activity-name-input"
                type="text" 
                placeholder="Example: Working on My Math Project" 
                className="w-full bg-transparent border-none outline-none text-[#1E293B] placeholder-[#6B7280] text-base font-normal"
              />
            </div>

            <div className="relative w-[176px]">
              <div className="flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-[#2563EB] flex items-center h-[48px] rounded-xl overflow-hidden group/btn">
                  <button 
                    onClick={() => {
                      if (controlMode === 'timer') {
                        if (timerStatus === 'idle') handleStartTimer(); // Immediately starts running
                        else handleEndTimer();
                      } else {
                        handleAction();
                      }
                    }}
                    className={`flex-1 h-full px-4 text-white font-semibold text-base hover:bg-[#1D4ED8] transition-colors whitespace-nowrap text-center outline-none ${timerStatus !== 'idle' ? 'flex items-center justify-end gap-2' : ''}`}
                  >
                    {controlMode === 'add' ? 'Add Activity' : timerStatus === 'idle' ? 'Start Timer' : 'End Timer'}
                    {controlMode === 'timer' && timerStatus !== 'idle' && <StopIcon />}
                  </button>
                  {timerStatus === 'idle' && (
                    <>
                      <div className="w-px h-full bg-white/20" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsControlDropdownOpen(!isControlDropdownOpen); }}
                        className="px-3 h-full text-white hover:bg-[#1D4ED8] transition-colors outline-none"
                      >
                        <ChevronDownIcon />
                      </button>
                    </>
                  )}
                </div>

                {/* Control Dropdown */}
                {isControlDropdownOpen && timerStatus === 'idle' && (
                  <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={() => { setControlMode('timer'); setIsControlDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-left text-base font-normal flex items-center justify-between hover:bg-gray-50 transition-colors ${controlMode === 'timer' ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}
                    >
                      Start Timer
                      <TimerIcon />
                    </button>
                    <button 
                      onClick={() => { setControlMode('add'); setIsControlDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-left text-base font-normal flex items-center justify-between hover:bg-gray-50 transition-colors ${controlMode === 'add' ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}
                    >
                      Add Activity
                      <PenIcon />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Metadata & Controls */}
          <div className="flex items-center gap-4 w-full">
            {/* Date Picker (Shown in Add Mode) */}
            {controlMode === 'add' && (
              <div className="flex-1 min-w-0 relative">
                <div 
                  onClick={() => dateInputRef.current?.showPicker()}
                  className="bg-white border border-[#D9D9D9] rounded-lg px-4 py-3 text-[#434655] text-base font-normal shadow-sm hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span className="truncate">{new Date(manualDate).toLocaleDateString('en-GB')}</span>
                  <div className="text-gray-400 group-hover:text-[#2563EB] transition-colors">
                    <CalendarIcon />
                  </div>
                  <input 
                    ref={dateInputRef}
                    type="date" 
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Category Dropdown (Shared) */}
            <div className="flex-1 min-w-0 relative">
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
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Project Dropdown (Shared) */}
            <div className="flex-1 min-w-0 relative">
              <div 
                onClick={(e) => { e.stopPropagation(); setIsProjectDropdownOpen(!isProjectDropdownOpen); setIsAddingProject(false); }}
                className="bg-white border border-[#C3C6D7] rounded-lg px-4 py-3 flex items-center justify-between text-[#191C1E] text-base font-normal shadow-sm hover:border-[#2563EB] transition-all cursor-pointer"
              >
                <span className="truncate">{selectedProject || 'Project'}</span>
                <ChevronDownIcon />
              </div>
              
              {isProjectDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    <button 
                      onClick={() => { setSelectedProject('None'); setIsProjectDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-400 font-medium"
                    >
                      None
                    </button>
                    <div className="h-px bg-gray-50 my-1 mx-2" />
                    {projects.map((proj, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setSelectedProject(proj); setIsProjectDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                      >
                        {proj}
                      </button>
                    ))}

                    <div className="h-px bg-gray-100 my-1 mx-2" />
                    {!isAddingProject ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsAddingProject(true); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        Add New Project
                      </button>
                    ) : (
                      <div className="px-2 py-1" onClick={(e) => e.stopPropagation()}>
                        <input 
                          autoFocus
                          type="text"
                          value={newProjectInput}
                          onChange={(e) => setNewProjectInput(e.target.value)}
                          placeholder="Project name..."
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newProjectInput.trim()) {
                              const newProj = newProjectInput.trim();
                              if (!projects.includes(newProj)) {
                                setProjects([...projects, newProj]);
                              }
                              setSelectedProject(newProj);
                              setNewProjectInput('');
                              setIsAddingProject(false);
                              setIsProjectDropdownOpen(false);
                            }
                          }}
                        />
                        <div className="flex justify-end gap-1 mt-2">
                          <button 
                            onClick={() => setIsAddingProject(false)}
                            className="px-2 py-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => {
                              if (newProjectInput.trim()) {
                                const newProj = newProjectInput.trim();
                                if (!projects.includes(newProj)) {
                                  setProjects([...projects, newProj]);
                                }
                                setSelectedProject(newProj);
                                setNewProjectInput('');
                                setIsAddingProject(false);
                                setIsProjectDropdownOpen(false);
                              }
                            }}
                            className="px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded uppercase"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-12 bg-[#C3C6D7]" />

            {/* Action Buttons & Time Info */}
            <div className="flex items-center gap-4 shrink-0">
              {controlMode === 'timer' ? (
                <>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setTimerStatus('paused')}
                      disabled={timerStatus !== 'running'}
                      className={`bg-[#2563EB] text-white p-3 rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-sm ${timerStatus !== 'running' ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                      title="Pause Timer"
                    >
                      <PauseIcon />
                    </button>
                    <button 
                      onClick={() => setTimerStatus('running')}
                      disabled={timerStatus === 'running' || timerStatus === 'idle'}
                      className={`bg-[#2563EB] text-white p-3 rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-sm ${timerStatus === 'running' || timerStatus === 'idle' ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                      title="Play Timer"
                    >
                      <PlayIcon />
                    </button>
                    <button 
                      onClick={handleResetTimer}
                      disabled={timerStatus === 'idle'}
                      className={`bg-[#EF4444] text-white p-3 rounded-lg hover:bg-[#DC2626] transition-colors shadow-sm ${timerStatus === 'idle' ? 'opacity-30 cursor-not-allowed' : ''}`}
                      title="Reset Timer"
                    >
                      <Trash2Icon />
                    </button>
                  </div>
                  <div className="bg-white border border-[#D9D9D9] rounded-lg px-4 py-3 min-w-[126px] text-center text-[#191C1E] text-base font-normal shadow-sm">
                    {formatTime(elapsedSeconds)}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Start Time Picker */}
                  <div 
                    onClick={() => startTimeInputRef.current?.showPicker()}
                    className="relative bg-white border border-[#D9D9D9] rounded-lg pl-4 pr-3 py-3 min-w-[120px] shadow-sm hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="text-[#191C1E] text-base font-normal">{manualStartTime}</span>
                    <div className="text-gray-400 group-hover:text-[#2563EB] transition-colors">
                      <ClockIcon />
                    </div>
                    <input 
                      ref={startTimeInputRef}
                      type="time" 
                      value={manualStartTime}
                      onChange={(e) => setManualStartTime(e.target.value)}
                      className="absolute inset-0 opacity-0 pointer-events-none w-full h-full" 
                    />
                  </div>
                  
                  <span className="text-[#191C1E] text-base font-normal">-</span>
                  
                  {/* End Time Picker */}
                  <div 
                    onClick={() => endTimeInputRef.current?.showPicker()}
                    className="relative bg-white border border-[#D9D9D9] rounded-lg pl-4 pr-3 py-3 min-w-[120px] shadow-sm hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="text-[#191C1E] text-base font-normal">{manualEndTime}</span>
                    <div className="text-gray-400 group-hover:text-[#2563EB] transition-colors">
                      <ClockIcon />
                    </div>
                    <input 
                      ref={endTimeInputRef}
                      type="time" 
                      value={manualEndTime}
                      onChange={(e) => setManualEndTime(e.target.value)}
                      className="absolute inset-0 opacity-0 pointer-events-none w-full h-full" 
                    />
                  </div>

                  <div className="w-px h-12 bg-[#C3C6D7] mx-1" />
                  
                  {/* Duration Display */}
                  <div className="bg-white border border-[#D9D9D9] rounded-lg px-4 py-3 min-w-[126px] text-center text-[#191C1E] text-base font-normal shadow-sm">
                    {calculateManualDuration()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Activity List (Timeline) */}
        <div className="space-y-4 pt-4">
          {sortedDates.length > 0 ? (
            sortedDates.map(date => (
              <React.Fragment key={date}>
                <TimelineDivider 
                  label={formatDateLabel(date)} 
                  isCollapsed={collapsedSections[date]} 
                  onToggle={() => toggleSection(date)} 
                />
                {!collapsedSections[date] && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {groupedActivities[date].map(act => (
                      <ActivityCard 
                        key={act.id} 
                        activity={act} 
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No activities found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Section 5: Pagination - Paling bawah di tengah */}
      <div className="flex justify-center items-center gap-2 py-8 mt-auto border-t border-gray-100 w-full">
        {[1, 2, 3, '...', 6, 7].map((page, idx) => (
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
        projects={projects}
      />

      <SuccessPopup 
        isOpen={isSuccessPopupOpen}
        onClose={() => navigate('/dashboard')}
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
