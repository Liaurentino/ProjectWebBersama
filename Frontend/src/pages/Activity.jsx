import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessPopup from '../components/SuccessPopup';
import { getAllActivities, createActivity, updateActivity, deleteActivity, getProjects } from '../services/Activityservice.js';

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

// --- Helpers ---

// FIX: Ambil HH:mm dari Date object secara aman, tidak bergantung locale
const toHHMM = (dateObj) => {
  const h = String(dateObj.getHours()).padStart(2, '0');
  const m = String(dateObj.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

// FIX: toISO sekarang set jam/menit langsung ke Date object (local time), bukan parse string
const toISO = (date, time) => {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const toDateInput = (iso) => iso ? new Date(iso).toISOString().split('T')[0] : '';

// FIX: Ambil waktu lokal dari ISO string menggunakan getHours/getMinutes
const toTimeInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return toHHMM(d);
};

const defaultEndTime = (startStr) => {
  if (!startStr) return '10:00';
  const [h, m] = startStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h + 1, m, 0);
  return toHHMM(d);
};

const calcDuration = (start, end) => {
  if (!start || !end) return '--:--:--';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  return `${String(Math.floor(diff / 60)).padStart(2, '0')} : ${String(diff % 60).padStart(2, '0')} : 00`;
};

const deriveCardFields = (activity) => {
  const startTime = toTimeInput(activity.startedAt);
  const endTime   = activity.endedAt ? toTimeInput(activity.endedAt) : null;
  const timeRange = endTime ? `${startTime} - ${endTime}` : `${startTime} - ongoing`;
  const duration  = endTime ? calcDuration(startTime, endTime) : '--:--:--';
  const isActive  = activity.status === 'IN_PROGRESS';
  const iconType  = activity.category === 'AKADEMIK' ? 'book' : 'user';
  return { timeRange, duration, isActive, iconType };
};

// --- EditActivityModal ---
const EditActivityModal = ({ isOpen, onClose, onSave, activity, categories, projects }) => {
  const [editedActivity, setEditedActivity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const editDateRef  = useRef(null);
  const editStartRef = useRef(null);
  const editEndRef   = useRef(null);

  useEffect(() => {
    if (activity) {
      const startStr = toTimeInput(activity.startedAt);
      const endStr   = activity.endedAt ? toTimeInput(activity.endedAt) : defaultEndTime(startStr);
      setEditedActivity({
        ...activity,
        manualDate:      toDateInput(activity.startedAt) || new Date().toISOString().split('T')[0],
        manualStartTime: startStr || '09:00',
        manualEndTime:   endStr,
      });
      setError(null);
      setSaving(false);
    }
  }, [activity]);

  if (!isOpen || !editedActivity) return null;

  const currentDuration = calcDuration(editedActivity.manualStartTime, editedActivity.manualEndTime);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(editedActivity);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1C1E] rounded-2xl shadow-2xl max-w-2xl w-full animate-in fade-in zoom-in duration-200 my-8">
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#191C1E] dark:text-white">Edit Activity</h3>
            <p className="text-[#434655] dark:text-gray-400 text-sm mt-1">Make your current activity to be more specific.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#434655] dark:text-gray-400">Activity title</label>
            <input type="text" value={editedActivity.title}
              onChange={(e) => setEditedActivity({...editedActivity, title: e.target.value})}
              className="w-full bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7] dark:border-gray-700 rounded-lg px-4 py-3 text-base font-semibold text-[#191C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition-all"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#434655] dark:text-gray-400">Category</label>
              <div className="relative">
                <select value={editedActivity.category}
                  onChange={(e) => setEditedActivity({...editedActivity, category: e.target.value})}
                  className="w-full bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7] dark:border-gray-700 rounded-lg px-4 py-3 text-base text-[#191C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition-all appearance-none"
                >
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.value || cat.label.toUpperCase()}>{cat.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDownIcon /></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#434655] dark:text-gray-400">On Project</label>
              <div className="relative">
                <select value={editedActivity.project || ''}
                  onChange={(e) => setEditedActivity({...editedActivity, project: e.target.value})}
                  className="w-full bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7] dark:border-gray-700 rounded-lg px-4 py-3 text-base text-[#191C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition-all appearance-none"
                >
                  <option value="">None</option>
                  {projects.map((proj, i) => (
                    <option key={i} value={proj}>{proj}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDownIcon /></div>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#434655] dark:text-gray-400">Description</label>
            <textarea value={editedActivity.description || ''}
              onChange={(e) => setEditedActivity({...editedActivity, description: e.target.value})}
              placeholder="Briefly describe what you did..." rows={4}
              className="w-full bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7] dark:border-gray-700 rounded-lg px-4 py-3 text-base text-[#191C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2563EB] transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4">
            <div className="space-y-1.5 col-span-1">
              <label className="text-sm font-medium text-[#434655] dark:text-gray-400">Date</label>
              <div onClick={() => editDateRef.current?.showPicker()}
                className="relative bg-white dark:bg-[#1A1C1E] border border-[#D9D9D9] dark:border-gray-700 rounded-lg px-4 py-2 flex items-center justify-between text-[#434655] dark:text-gray-400 text-sm cursor-pointer hover:border-[#2563EB] transition-all"
              >
                <span>{new Date(editedActivity.manualDate).toLocaleDateString('en-GB')}</span>
                <CalendarIcon />
                <input ref={editDateRef} type="date" value={editedActivity.manualDate}
                  onChange={(e) => setEditedActivity({...editedActivity, manualDate: e.target.value})}
                  className="absolute inset-0 opacity-0 pointer-events-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]">Start Time</label>
              <div onClick={() => editStartRef.current?.showPicker()}
                className="relative bg-white dark:bg-[#1A1C1E] border border-[#D9D9D9] dark:border-gray-700 rounded-lg px-3 py-2 flex items-center justify-between text-[#434655] dark:text-gray-400 text-sm cursor-pointer hover:border-[#2563EB] transition-all"
              >
                <span>{editedActivity.manualStartTime}</span>
                <ClockIcon />
                <input ref={editStartRef} type="time" value={editedActivity.manualStartTime}
                  onChange={(e) => setEditedActivity({...editedActivity, manualStartTime: e.target.value})}
                  className="absolute inset-0 opacity-0 pointer-events-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]">End Time</label>
              <div onClick={() => editEndRef.current?.showPicker()}
                className="relative bg-white dark:bg-[#1A1C1E] border border-[#D9D9D9] dark:border-gray-700 rounded-lg px-3 py-2 flex items-center justify-between text-[#434655] dark:text-gray-400 text-sm cursor-pointer hover:border-[#2563EB] transition-all"
              >
                <span>{editedActivity.manualEndTime}</span>
                <ClockIcon />
                <input ref={editEndRef} type="time" value={editedActivity.manualEndTime}
                  onChange={(e) => setEditedActivity({...editedActivity, manualEndTime: e.target.value})}
                  className="absolute inset-0 opacity-0 pointer-events-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]">Total Time</label>
              <div className="bg-gray-50 border border-[#D9D9D9] dark:border-gray-700 rounded-lg px-3 py-2 text-center text-[#434655] dark:text-gray-400 text-sm font-bold">
                {currentDuration}
              </div>
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">{error}</div>}
        </div>
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2.5 border border-[#737686] dark:border-gray-600 text-[#434655] dark:text-gray-400 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-8 py-2.5 bg-[#004AC6] text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Activity'}
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
      <div className="bg-white dark:bg-[#1A1C1E] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-100">Delete</button>
        </div>
      </div>
    </div>
  );
};

const ActivityCard = ({ activity, onEdit, onDelete }) => {
  const { id, title, category, project, description } = activity;
  const { timeRange, duration, iconType } = deriveCardFields(activity);
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryColors = {
    'AKADEMIK':    { bg: 'bg-[#EBF5FF] dark:bg-blue-900/20', text: 'text-[#004AC6] dark:text-blue-400' },
    'ORGANISASI':  { bg: 'bg-[#F5F3FF] dark:bg-purple-900/20', text: 'text-[#7C3AED] dark:text-purple-400' },
    'SKILL':       { bg: 'bg-[#EDFDF0] dark:bg-green-900/20', text: 'text-[#1A7F3C] dark:text-green-400' },
    'KEPANITIAAN': { bg: 'bg-[#FFF4EB] dark:bg-orange-900/20', text: 'text-[#943700] dark:text-orange-400' },
    'LAINNYA':     { bg: 'bg-[#F9FAFB] dark:bg-gray-800/50', text: 'text-[#4B5563] dark:text-gray-400' },
  };
  const color = categoryColors[category] || categoryColors['LAINNYA'];

  return (
    <div className={`rounded-xl flex items-stretch transition-all duration-300 w-full border border-transparent hover:border-blue-50 ${isExpanded ? 'bg-[rgba(0,74,198,0.05)] border-l-4 border-[#004AC6] shadow-sm' : 'bg-white dark:bg-[#1A1C1E] shadow-sm'}`}>
      <div className={`flex-1 ${isExpanded ? 'pl-7 py-6' : 'p-5'} flex gap-4`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${isExpanded ? 'bg-[#2563EB] text-white shadow-md shadow-blue-100 dark:shadow-none' : 'bg-[#F0F7FF] dark:bg-[#2563EB]/20 text-[#004AC6] dark:text-blue-400'}`}>
          {iconType === 'book' ? <BookIcon /> : <UserIcon />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${color.bg} ${color.text}`}>
              {category}
            </span>
            <span className="text-gray-300 text-[10px]">|</span>
            <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wider">{project || 'No Project'}</span>
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
              <button onClick={() => onEdit(activity)}
                className="border border-[#737686] dark:border-gray-600 p-2.5 rounded-lg text-[#434655] dark:text-gray-400 hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center"
              >
                <PencilIcon />
              </button>
              <button onClick={() => onDelete(id)}
                className="border border-[#BA1A1A] p-2.5 rounded-lg text-[#BA1A1A] hover:bg-red-50 transition-all shadow-sm flex items-center justify-center"
              >
                <Trash2Icon />
              </button>
            </div>
            <button onClick={() => setIsExpanded(false)} className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase pr-1 tracking-wider">
              Hide
            </button>
          </div>
        ) : (
          <div onClick={() => setIsExpanded(true)} className="flex items-center gap-1 text-sm font-bold text-blue-600 cursor-pointer hover:text-blue-700 group/link whitespace-nowrap">
            <span>View Details</span>
            <svg className="transition-transform group-hover/link:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        )}
      </div>
    </div>
  );
};

const TimelineDivider = ({ label, isCollapsed, onToggle }) => (
  <div className="flex items-center gap-4 py-4 cursor-pointer group" onClick={onToggle}>
    <div className="flex-1 h-[1px] bg-gray-200 group-hover:bg-gray-400 transition-colors"></div>
    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest transition-all">
      <span className="group-hover:text-gray-700 transition-colors">{label}</span>
      <div className={`transition-all duration-200 group-hover:text-gray-700 ${isCollapsed ? 'rotate-180' : ''}`}><ChevronDownIcon /></div>
    </div>
    <div className="flex-1 h-[1px] bg-gray-200 group-hover:bg-gray-400 transition-colors"></div>
  </div>
);

const ActivitySkeleton = () => (
  <div className="bg-white dark:bg-[#1A1C1E] rounded-xl p-5 flex items-center gap-4 animate-pulse shadow-sm">
    <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);

const ValidationModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A1C1E] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 9 4 4-4 4"/><path d="M12 12H8"/><circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Wait a minute!</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <button onClick={onClose} className="w-full px-4 py-2.5 rounded-xl bg-[#004AC6] text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          Got it
        </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const Activity = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isResetConfirmModalOpen, setIsResetConfirmModalOpen] = useState(false);

  const [viewCategory, setViewCategory] = useState('All Categories');
  const [isViewCategoryDropdownOpen, setIsViewCategoryDropdownOpen] = useState(false);
  const [viewProject, setViewProject] = useState('All Projects');
  const [isViewProjectDropdownOpen, setIsViewProjectDropdownOpen] = useState(false);

  const [controlMode, setControlMode] = useState('timer');
  const [isControlDropdownOpen, setIsControlDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [timerStatus, setTimerStatus] = useState('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerStartTime, setTimerStartTime] = useState(null);
  const [timerStartDate, setTimerStartDate] = useState(null);
  const timerIntervalRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectInput, setNewProjectInput] = useState('');

  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualStartTime, setManualStartTime] = useState('09:00');
  const [manualEndTime, setManualEndTime] = useState('10:00');
  const dateInputRef      = useRef(null);
  const startTimeInputRef = useRef(null);
  const endTimeInputRef   = useRef(null);

  const [collapsedSections, setCollapsedSections] = useState({});
  const toggleSection = (section) => setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const categories = [
    { label: 'Akademik',    value: 'AKADEMIK' },
    { label: 'Organisasi',  value: 'ORGANISASI' },
    { label: 'Skill',       value: 'SKILL' },
    { label: 'Kepanitiaan', value: 'KEPANITIAAN' },
    { label: 'Lainnya',     value: 'LAINNYA' },
  ];

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data || []))
      .catch(() => {});
  }, []);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const filters = {};
      if (viewCategory !== 'All Categories') filters.category = viewCategory;
      const res = await getAllActivities(filters);
      setActivities(res.data || []);
    } catch (err) {
      setFetchError(err.message || 'Gagal memuat aktivitas.');
    } finally {
      setLoading(false);
    }
  }, [viewCategory]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  useEffect(() => {
    if (timerStatus === 'running') {
      timerIntervalRef.current = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerStatus]);

  const formatTime = (totalSeconds) => {
    const hours   = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    if (timerStatus === 'idle') {
      const now = new Date();
      setTimerStatus('running');
      // FIX: Pakai toHHMM() bukan toLocaleTimeString() — aman di semua browser/locale
      setTimerStartTime(toHHMM(now));
      setTimerStartDate(now.toISOString().split('T')[0]);
    }
  };

  const handleResetTimer = (force = false) => {
    if (force !== true && timerStatus !== 'idle') {
      setIsResetConfirmModalOpen(true);
      return;
    }
    setTimerStatus('idle');
    setElapsedSeconds(0);
    setTimerStartTime(null);
    setTimerStartDate(null);
    setIsResetConfirmModalOpen(false);
  };

  const handleEndTimer = async () => {
    const titleInput = document.getElementById('activity-name-input');
    const title = titleInput?.value?.trim();
    
    if (!title) {
      setValidationMessage('Please enter an activity title before saving.');
      setIsValidationModalOpen(true);
      return;
    }
    if (!selectedCategory) {
      setValidationMessage('Please select a category for your activity.');
      setIsValidationModalOpen(true);
      return;
    }

    // FIX: Pakai toHHMM() bukan toLocaleTimeString()
    const now = new Date();
    const endTime = toHHMM(now);
    const date = timerStartDate || now.toISOString().split('T')[0];
    try {
      await createActivity({
        title,
        category:    selectedCategory.value,
        description: `Timed activity${selectedProject ? ` on project ${selectedProject}` : ''}`,
        status:      'DONE',
        project:     selectedProject || null,
        startedAt:   toISO(date, timerStartTime || '00:00'),
        endedAt:     toISO(date, endTime),
      });
      setSuccessData({
        title,
        date: new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        duration: formatTime(elapsedSeconds),
      });
      setIsSuccessPopupOpen(true);
      handleResetTimer(true);
      if (titleInput) titleInput.value = '';
      setSelectedCategory(null);
      setSelectedProject(null);
      fetchActivities();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan aktivitas.');
    }
  };

  const handleAction = async () => {
    if (controlMode === 'timer') {
      if (timerStatus === 'idle') handleStartTimer();
      else handleEndTimer();
      return;
    }
    const titleInput = document.getElementById('activity-name-input');
    const title = titleInput?.value?.trim();

    if (!title) {
      setValidationMessage('Please enter an activity title before adding.');
      setIsValidationModalOpen(true);
      return;
    }
    if (!selectedCategory) {
      setValidationMessage('Please select a category for your activity.');
      setIsValidationModalOpen(true);
      return;
    }

    try {
      await createActivity({
        title,
        category:    selectedCategory.value,
        description: `Manual entry for ${manualDate}`,
        status:      'DONE',
        project:     selectedProject || null,
        startedAt:   toISO(manualDate, manualStartTime),
        endedAt:     toISO(manualDate, manualEndTime),
      });
      setSuccessData({
        title,
        date: new Date(manualDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        duration: calcDuration(manualStartTime, manualEndTime),
      });
      setIsSuccessPopupOpen(true);
      if (titleInput) titleInput.value = '';
      setSelectedCategory(null);
      setSelectedProject(null);
      fetchActivities();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan aktivitas.');
    }
  };

  const handleDeleteClick = (id) => {
    setActivityToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setActivities(prev => prev.filter(a => a.id !== activityToDelete));
    setIsDeleteModalOpen(false);
    try {
      await deleteActivity(activityToDelete);
    } catch {
      fetchActivities();
    }
  };

  const handleEditClick = (activity) => {
    setSelectedActivity(activity);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (editedActivity) => {
    await updateActivity(editedActivity.id, {
      title:       editedActivity.title,
      category:    editedActivity.category,
      description: editedActivity.description,
      status:      editedActivity.status,
      project:     editedActivity.project || null,
      startedAt:   toISO(editedActivity.manualDate, editedActivity.manualStartTime),
      endedAt:     toISO(editedActivity.manualDate, editedActivity.manualEndTime),
    });
    setSuccessData({
      title:    editedActivity.title,
      date:     new Date(editedActivity.manualDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      duration: calcDuration(editedActivity.manualStartTime, editedActivity.manualEndTime),
    });
    setIsEditModalOpen(false);
    setIsSuccessPopupOpen(true);
    fetchActivities();
  };

  const ITEMS_PER_PAGE = 5;

  const filteredActivities = activities.filter(act => {
    const categoryMatch = viewCategory === 'All Categories' || act.category === viewCategory;
    const projectMatch  = viewProject === 'All Projects' || (act.project || 'No Project') === viewProject;
    return categoryMatch && projectMatch;
  });

  const sortedActivities = [...filteredActivities].sort(
    (a, b) => new Date(b.startedAt) - new Date(a.startedAt)
  );
  const totalPages = Math.max(1, Math.ceil(sortedActivities.length / ITEMS_PER_PAGE));
  const pagedActivities = sortedActivities.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const groupedActivities = pagedActivities.reduce((groups, activity) => {
    const date = new Date(activity.startedAt).toISOString().split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(activity);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedActivities).sort().reverse();

  const formatDateLabel = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121212] flex flex-col p-4 sm:p-8" onClick={() => {
      setIsControlDropdownOpen(false);
      setIsCategoryDropdownOpen(false);
      setIsViewCategoryDropdownOpen(false);
      setIsViewProjectDropdownOpen(false);
      setIsProjectDropdownOpen(false);
      setIsAddingProject(false);
    }}>
      <div className="w-full flex-1 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Activity List</h1>
            <p className="text-gray-500 mt-1">Manage and monitor all your productivity schedules.</p>
          </div>
        </header>

        <div className="bg-white dark:bg-[#1A1C1E] rounded-xl shadow-sm border border-gray-100 flex items-center divide-x divide-gray-100 overflow-visible max-w-xl">
          <div className="flex-1 relative">
            <div onClick={(e) => { e.stopPropagation(); setIsViewCategoryDropdownOpen(!isViewCategoryDropdownOpen); setIsViewProjectDropdownOpen(false); }}
              className="flex flex-col px-6 py-2 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1 group-hover:text-blue-500 transition-colors">CATEGORY</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{viewCategory}</span>
                <ChevronDownIcon />
              </div>
            </div>
            {isViewCategoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1A1C1E] rounded-xl shadow-xl border border-gray-100 z-[60] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <button onClick={() => { setViewCategory('All Categories'); setIsViewCategoryDropdownOpen(false); setActivePage(1); }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                >All Categories</button>
                <div className="h-px bg-gray-100 my-1 mx-2" />
                {categories.map((cat, i) => (
                  <button key={i} onClick={() => { setViewCategory(cat.value); setIsViewCategoryDropdownOpen(false); setActivePage(1); }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                  >{cat.label}</button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 relative">
            <div onClick={(e) => { e.stopPropagation(); setIsViewProjectDropdownOpen(!isViewProjectDropdownOpen); setIsViewCategoryDropdownOpen(false); }}
              className="flex flex-col px-6 py-2 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1 group-hover:text-blue-500 transition-colors">PROJECT</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{viewProject}</span>
                <ChevronDownIcon />
              </div>
            </div>
            {isViewProjectDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#1A1C1E] rounded-xl shadow-xl border border-gray-100 z-[60] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <button onClick={() => { setViewProject('All Projects'); setIsViewProjectDropdownOpen(false); setActivePage(1); }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                >All Projects</button>
                <div className="h-px bg-gray-100 my-1 mx-2" />
                <button onClick={() => { setViewProject('No Project'); setIsViewProjectDropdownOpen(false); setActivePage(1); }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-400 font-medium"
                >No Project</button>
                {projects.map((proj, i) => (
                  <button key={i} onClick={() => { setViewProject(proj); setIsViewProjectDropdownOpen(false); setActivePage(1); }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                  >{proj}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-4 items-center w-full">
            <div className="flex-1 bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7] dark:border-gray-700 rounded-xl px-6 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#2563EB]/20 dark:focus-within:ring-blue-500/20 transition-all">
              <input id="activity-name-input" type="text" placeholder="Example: Working on My Math Project"
                className="w-full bg-transparent border-none outline-none text-[#1E293B] placeholder-[#6B7280] text-base font-normal"
              />
            </div>
            <div className="relative w-[176px]">
              <div className="flex flex-col bg-white dark:bg-[#1A1C1E] rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-[#2563EB] flex items-center h-[48px] rounded-xl overflow-hidden group/btn">
                  <button
                    onClick={() => {
                      if (controlMode === 'timer') {
                        if (timerStatus === 'idle') handleStartTimer();
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
                      <div className="w-px h-full bg-white dark:bg-[#1A1C1E]/20" />
                      <button onClick={(e) => { e.stopPropagation(); setIsControlDropdownOpen(!isControlDropdownOpen); }}
                        className="px-3 h-full text-white hover:bg-[#1D4ED8] transition-colors outline-none"
                      ><ChevronDownIcon /></button>
                    </>
                  )}
                </div>
                {isControlDropdownOpen && timerStatus === 'idle' && (
                  <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-[#1A1C1E] rounded-xl shadow-xl border border-gray-100 z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={() => { setControlMode('timer'); setIsControlDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-left text-base font-normal flex items-center justify-between hover:bg-gray-50 transition-colors ${controlMode === 'timer' ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}
                    >Start Timer <TimerIcon /></button>
                    <button onClick={() => { setControlMode('add'); setIsControlDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-left text-base font-normal flex items-center justify-between hover:bg-gray-50 transition-colors ${controlMode === 'add' ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}
                    >Add Activity <PenIcon /></button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full">
            {controlMode === 'add' && (
              <div className="flex-1 min-w-0 relative">
                <div onClick={() => dateInputRef.current?.showPicker()}
                  className="bg-white dark:bg-[#1A1C1E] border border-[#D9D9D9] dark:border-gray-700 rounded-lg px-4 py-3 text-[#434655] dark:text-gray-400 text-base font-normal shadow-sm hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span className="truncate">{new Date(manualDate).toLocaleDateString('en-GB')}</span>
                  <div className="text-gray-400 group-hover:text-[#2563EB] transition-colors"><CalendarIcon /></div>
                  <input ref={dateInputRef} type="date" value={manualDate} onChange={(e) => setManualDate(e.target.value)}
                    className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
                  />
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0 relative">
              <div onClick={(e) => { e.stopPropagation(); setIsCategoryDropdownOpen(!isCategoryDropdownOpen); }}
                className="bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7] dark:border-gray-700 rounded-lg px-4 py-3 flex items-center justify-between text-[#191C1E] dark:text-white text-base font-normal shadow-sm hover:border-[#2563EB] transition-all cursor-pointer"
              >
                <span className="truncate">{selectedCategory ? selectedCategory.label : 'Category'}</span>
                <ChevronDownIcon />
              </div>
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1A1C1E] rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  {categories.map((cat, i) => (
                    <button key={i} onClick={() => { setSelectedCategory(cat); setIsCategoryDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >{cat.label}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 relative">
              <div onClick={(e) => { e.stopPropagation(); setIsProjectDropdownOpen(!isProjectDropdownOpen); setIsAddingProject(false); }}
                className="bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7] dark:border-gray-700 rounded-lg px-4 py-3 flex items-center justify-between text-[#191C1E] dark:text-white text-base font-normal shadow-sm hover:border-[#2563EB] transition-all cursor-pointer"
              >
                <span className="truncate">{selectedProject || 'Project'}</span>
                <ChevronDownIcon />
              </div>
              {isProjectDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1A1C1E] rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-60 overflow-y-auto">
                    <button onClick={() => { setSelectedProject(null); setIsProjectDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-400 font-medium"
                    >None</button>
                    <div className="h-px bg-gray-50 my-1 mx-2" />
                    {projects.map((proj, i) => (
                      <button key={i} onClick={() => { setSelectedProject(proj); setIsProjectDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                      >{proj}</button>
                    ))}
                    <div className="h-px bg-gray-100 my-1 mx-2" />
                    {!isAddingProject ? (
                      <button onClick={(e) => { e.stopPropagation(); setIsAddingProject(true); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        Add New Project
                      </button>
                    ) : (
                      <div className="px-2 py-1" onClick={(e) => e.stopPropagation()}>
                        <input autoFocus type="text" value={newProjectInput} onChange={(e) => setNewProjectInput(e.target.value)}
                          placeholder="Project name..."
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newProjectInput.trim()) {
                              const p = newProjectInput.trim();
                              setProjects(prev => prev.includes(p) ? prev : [...prev, p]);
                              setSelectedProject(p);
                              setNewProjectInput('');
                              setIsAddingProject(false);
                              setIsProjectDropdownOpen(false);
                            }
                          }}
                        />
                        <div className="flex justify-end gap-1 mt-2">
                          <button onClick={() => setIsAddingProject(false)} className="px-2 py-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase">Cancel</button>
                          <button onClick={() => {
                            if (newProjectInput.trim()) {
                              const p = newProjectInput.trim();
                              setProjects(prev => prev.includes(p) ? prev : [...prev, p]);
                              setSelectedProject(p);
                              setNewProjectInput('');
                              setIsAddingProject(false);
                              setIsProjectDropdownOpen(false);
                            }
                          }} className="px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded uppercase">Add</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="w-px h-12 bg-[#C3C6D7]" />
            <div className="flex items-center gap-4 shrink-0">
              {controlMode === 'timer' ? (
                <>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setTimerStatus('paused')} disabled={timerStatus !== 'running'}
                      className={`bg-[#2563EB] text-white p-3 rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-sm ${timerStatus !== 'running' ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                    ><PauseIcon /></button>
                    <button onClick={() => setTimerStatus('running')} disabled={timerStatus === 'running' || timerStatus === 'idle'}
                      className={`bg-[#2563EB] text-white p-3 rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-sm ${timerStatus === 'running' || timerStatus === 'idle' ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                    ><PlayIcon /></button>
                    <button onClick={() => handleResetTimer()} disabled={timerStatus === 'idle'}
                      className={`bg-[#EF4444] text-white p-3 rounded-lg hover:bg-[#DC2626] transition-colors shadow-sm ${timerStatus === 'idle' ? 'opacity-30 cursor-not-allowed' : ''}`}
                    ><Trash2Icon /></button>
                  </div>
                  <div className="bg-white dark:bg-[#1A1C1E] border border-[#D9D9D9] dark:border-gray-700 rounded-lg px-4 py-3 min-w-[126px] text-center text-[#191C1E] dark:text-white text-base font-normal shadow-sm">
                    {formatTime(elapsedSeconds)}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div onClick={() => startTimeInputRef.current?.showPicker()}
                    className="relative bg-white dark:bg-[#1A1C1E] border border-[#D9D9D9] dark:border-gray-700 rounded-lg pl-4 pr-3 py-3 min-w-[120px] shadow-sm hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="text-[#191C1E] dark:text-white text-base font-normal">{manualStartTime}</span>
                    <div className="text-gray-400 group-hover:text-[#2563EB] transition-colors"><ClockIcon /></div>
                    <input ref={startTimeInputRef} type="time" value={manualStartTime} onChange={(e) => setManualStartTime(e.target.value)}
                      className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
                    />
                  </div>
                  <span className="text-[#191C1E] dark:text-white text-base font-normal">-</span>
                  <div onClick={() => endTimeInputRef.current?.showPicker()}
                    className="relative bg-white dark:bg-[#1A1C1E] border border-[#D9D9D9] dark:border-gray-700 rounded-lg pl-4 pr-3 py-3 min-w-[120px] shadow-sm hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="text-[#191C1E] dark:text-white text-base font-normal">{manualEndTime}</span>
                    <div className="text-gray-400 group-hover:text-[#2563EB] transition-colors"><ClockIcon /></div>
                    <input ref={endTimeInputRef} type="time" value={manualEndTime} onChange={(e) => setManualEndTime(e.target.value)}
                      className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
                    />
                  </div>
                  <div className="w-px h-12 bg-[#C3C6D7] mx-1" />
                  <div className="bg-white dark:bg-[#1A1C1E] border border-[#D9D9D9] dark:border-gray-700 rounded-lg px-4 py-3 min-w-[126px] text-center text-[#191C1E] dark:text-white text-base font-normal shadow-sm">
                    {calcDuration(manualStartTime, manualEndTime)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          {loading && <div className="space-y-3"><ActivitySkeleton /><ActivitySkeleton /><ActivitySkeleton /></div>}

          {!loading && fetchError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-medium text-sm">{fetchError}</p>
              <button onClick={fetchActivities} className="mt-3 text-sm text-[#2563EB] font-bold hover:underline">Coba lagi</button>
            </div>
          )}

          {!loading && !fetchError && sortedDates.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-[#1A1C1E] rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-400 font-medium">No activities found matching your filters.</p>
            </div>
          )}

          {!loading && !fetchError && sortedDates.map(date => (
            <React.Fragment key={date}>
              <TimelineDivider label={formatDateLabel(date)} isCollapsed={collapsedSections[date]} onToggle={() => toggleSection(date)} />
              {!collapsedSections[date] && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  {groupedActivities[date].map(act => (
                    <ActivityCard key={act.id} activity={act} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-8 mt-auto border-t border-gray-100 w-full">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setActivePage(page)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                activePage === page ? 'bg-[#004AC6] text-white shadow-lg shadow-blue-100' : 'text-[#004AC6] hover:bg-blue-50'
              }`}
            >{page}</button>
          ))}
        </div>
      )}

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
        onAddMore={() => setIsSuccessPopupOpen(false)}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Activity"
        message="Are you sure you want to delete this activity? This action cannot be undone."
      />

      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        message={validationMessage}
      />

      {isResetConfirmModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1A1C1E] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reset Timer?</h3>
            <p className="text-gray-500 text-sm mb-6">You will lose your current timer progress. Are you sure you want to reset?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsResetConfirmModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => handleResetTimer(true)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;