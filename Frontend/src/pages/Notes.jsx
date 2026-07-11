import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  getAllNotes, createNote, updateNote, deleteNote,
  toDbStatus, calcProgress,
} from '../services/Notesservice.js';
import Plus from "../assets/NotesPage/Plus.png";
import Calender from "../assets/NotesPage/Calender.png";
import Message from "../assets/NotesPage/Message.png";
import More from "../assets/NotesPage/More.png";
import ChevronDown from "../assets/NotesPage/ChevronDown.png"
import Edit from "../assets/NotesPage/Edit.png";
import Trash from "../assets/NotesPage/Trash.png";
import CornerDownRight from "../assets/NotesPage/Corner-down-right.png"
import EmptyBox from "../assets/NotesPage/EmptyBox.png"
import bluecheck from '../assets/NotesPage/Bluecheck.png'
import dragdown from "../assets/NotesPage/Dragdown.png"
import BlueCal from "../assets/NotesPage/BlueCalender.png"

const icons = {
  plus: Plus,
  emptyBox: EmptyBox,
  calendar: Calender,
  message: Message,
  more: More,
  chevron: ChevronDown,
  check: bluecheck,
  edit: Edit,
  delete: Trash,
  dropdown: ChevronDown,
  trash: Trash,
  dragHandle: dragdown,
  cornerDownRight: CornerDownRight,
  BlueCal : BlueCal
};

const ActivityCard = (props) => {
  const { activity, menuOpenId, setMenuOpenId, deleteConfirmId, setDeleteConfirmId, deleteActivity, handleEditClick, toggleExpand, toggleTaskComplete, setDetailActivityId, draggedActivityId, handleActivityDragStart, handleActivityDragEnd } = props;
  const isDone = activity.status === 'done';
  const isMenuOpen = menuOpenId === activity.id;
  const isConfirmingDelete = deleteConfirmId === activity.id;
  const isDragging = draggedActivityId === activity.id;

  const categoryStyles = {
    'ACADEMIC': 'bg-[#dfe0e0] text-[#616363] dark:bg-gray-700 dark:text-gray-300',
    'DESIGN': 'bg-[#2563eb] text-[#eeefff]',
    'ORGANIZATION': 'bg-[rgba(37,99,235,0.2)] text-[#2563eb] dark:bg-blue-900/30 dark:text-blue-400',
    'FINAL': 'bg-[#dfe0e0] text-[#616363] dark:bg-gray-700 dark:text-gray-300'
  };

  if (isConfirmingDelete) {
    return (
      <div className="bg-[rgba(255,218,214,0.3)] border border-[rgba(186,26,26,0.2)] dark:bg-red-950/20 dark:border-red-900/50 p-[17px] rounded-[12px] shadow-sm w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <h4 className="text-base font-semibold text-[#191C1E] dark:text-white leading-6">Delete this activity?</h4>
        <p className="text-sm text-[#434655] dark:text-gray-400 leading-6">{activity.title} will be deleted</p>
        <div className="pt-2 space-y-2">
          <button onClick={() => deleteActivity(activity.id)} className="w-full bg-[#ba1a1a] hover:bg-[#9d1717] text-white font-bold py-[8px] rounded-[8px] transition-colors">Yes, Delete</button>
          <button onClick={() => setDeleteConfirmId(null)} className="w-full bg-white dark:bg-[#1A1C1E] border border-[#c3c6d7] dark:border-gray-800 text-[#191C1E] dark:text-white font-bold py-[8px] rounded-[8px] transition-colors">Cancelled</button>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        handleActivityDragStart(e, activity.id);
        if (e.target && e.dataTransfer) {
          e.target.style.transform = "rotate(2deg)";
          e.target.style.border = "2px solid #2563eb";
          e.target.style.boxShadow = "0px 10px 20px rgba(0,0,0,0.1)";
          setTimeout(() => {
            if (e.target) {
              e.target.style.transform = "";
              e.target.style.border = "";
              e.target.style.boxShadow = "";
            }
          }, 0);
        }
      }}
      onDragEnd={handleActivityDragEnd}
      className={`relative bg-white dark:bg-[#1A1C1E] shadow-sm rounded-[12px] p-[17px] space-y-2 w-full transition-all duration-200 cursor-grab active:cursor-grabbing ${isDone ? 'opacity-60' : ''} ${isDragging ? 'opacity-0' : 'border border-[rgba(195,198,215,0.5)] dark:border-gray-800 hover:border-[#2563eb]/30'}`}
    >
      <div className="flex items-start justify-between">
        <span className={`px-[8px] py-[2px] rounded-full text-[10px] font-bold tracking-[0.5px] uppercase ${categoryStyles[activity.category] || categoryStyles['ACADEMIC']}`}>
          {activity.category}
        </span>
        <div className="relative">
          <button onClick={() => setMenuOpenId(isMenuOpen ? null : activity.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            <img src={icons.more} alt="More" className="w-[3px] h-[12px] object-contain dark:invert" />
          </button>
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
              <div className="absolute right-0 top-full mt-1 w-[128px] bg-white dark:bg-[#1A1C1E] border border-[#c3c6d7] dark:border-gray-800 rounded-[8px] shadow-lg py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button onClick={() => handleEditClick(activity)} className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                  <img src={icons.edit} alt="" className="w-[10.5px] h-[10.5px] dark:invert" />
                  <span className="text-sm text-[#191C1E] dark:text-white">Edit</span>
                </button>
                <button onClick={() => { setDeleteConfirmId(activity.id); setMenuOpenId(null); }} className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                  <img src={icons.delete} alt="" className="w-[10.5px] h-[11.5px]" />
                  <span className="text-sm text-[#ba1a1a]">Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <h4 className={`text-base font-semibold text-[#191C1E] dark:text-white leading-6 ${isDone ? 'line-through' : ''}`}>
        {activity.title}
      </h4>

      {activity.status === 'in-progress' && (
        <div className="space-y-1">
          <div className="h-[6px] bg-[#f3f4f6] dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#fc0] rounded-full transition-all duration-500" style={{ width: `${activity.progress}%` }} />
          </div>
          <p className="text-[11px] font-medium text-[#434655] dark:text-gray-400">Progress: {activity.progress}%</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <img src={icons.calendar} alt="" className="w-[10.5px] h-[11.6px] object-contain dark:invert opacity-70" />
            <span className="text-[11px] font-medium text-[#434655] dark:text-gray-400">{activity.dueDate}</span>
          </div>
          <button onClick={() => toggleExpand(activity.id)} className={`flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 px-1 rounded transition-colors ${activity.isExpanded ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
            <img src={icons.message} alt="" className="w-[11.6px] h-[11.6px] object-contain dark:invert opacity-70" />
            <span className="text-[11px] font-medium text-[#434655] dark:text-gray-400">{activity.taskCount}</span>
          </button>
        </div>
        <button onClick={() => setDetailActivityId(activity.id)} className="flex items-center gap-1 text-[11px] font-bold text-[#004AC6] hover:underline">
          <span>View Details</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      {activity.isExpanded && activity.tasks.length > 0 && (
        <div className="pt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {activity.tasks.map((task) => (
            <div key={task.id} className="bg-[#f3f4f6]/50 dark:bg-gray-800/30 rounded-[8px] flex items-center gap-3 px-[16px] py-[8px]">
              <div onClick={() => toggleTaskComplete(activity.id, task.id)} className={`w-[15px] h-[15px] rounded-[4px] flex items-center justify-center border cursor-pointer transition-colors ${task.completed ? 'bg-[#004ac6] border-transparent' : 'bg-white border-[#737686]'}`}>
                {task.completed && <img src={icons.check} alt="" className="w-[20px] h-[20px] object-contain" />}
              </div>
              <span className={`text-[11px] font-medium transition-all ${task.completed ? 'text-[#434655] dark:text-gray-500 line-through opacity-50' : 'text-[#434655] dark:text-gray-300'}`}>{task.title}</span>
            </div>
          ))}
          <div className="flex justify-center pt-2">
            <button onClick={() => toggleExpand(activity.id)} className="rotate-180 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-full transition-colors">
              <img src={icons.chevron} alt="Collapse" className="w-[14px] h-[14px] dark:invert opacity-50" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, closeModal, onConfirm, activityTitle }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeModal} />
      <div className="relative w-full max-w-[400px] bg-white dark:bg-[#1A1C1E] border border-[#edeef0] dark:border-gray-800 rounded-[12px] shadow-2xl p-[25px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-[18px] font-bold text-[#191c1e] dark:text-white leading-[24px]">Delete this activity?</h3>
          <p className="text-[14px] text-[#434655] dark:text-gray-400 leading-[20px]">{activityTitle} will be deleted. This action cannot be undone.</p>
        </div>
        <div className="flex flex-col gap-[8px]">
          <button onClick={onConfirm} className="w-full bg-[#ba1a1a] hover:bg-[#9d1717] text-white font-bold py-[10px] rounded-[8px] transition-colors">Yes, Delete</button>
          <button onClick={closeModal} className="w-full bg-white dark:bg-[#1A1C1E] border border-[#c3c6d7] dark:border-gray-800 text-[#191C1E] dark:text-white font-bold py-[10px] rounded-[8px] transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">Cancelled</button>
        </div>
      </div>
    </div>
  );
};

const ActivityDetailModal = ({ isOpen, closeModal, activity, setDeleteConfirmId, handleEditClick, toggleTaskComplete }) => {
  if (!isOpen || !activity) return null;

  const categoryStyles = {
    'ACADEMIC': 'bg-[rgba(37,99,235,0.1)] text-[#004ac6]',
    'DESIGN': 'bg-[#2563eb] text-[#eeefff]',
    'ORGANIZATION': 'bg-[rgba(37,99,235,0.2)] text-[#2563eb]',
    'FINAL': 'bg-[#dfe0e0] text-[#616363]'
  };

  const statusStyles = {
    'all': { bg: 'bg-[#FC0]', text: 'text-white', label: 'Not Started' },
    'in-progress': { bg: 'bg-[#FC0]', text: 'text-white', label: 'In Progress' },
    'done': { bg: 'bg-[#5D5F5F]', text: 'text-white', label: 'Completed' }
  };

  const status = statusStyles[activity.status] || statusStyles['all'];
  const completedTasks = activity.tasks.filter(t => t.completed).length;
  const totalTasks = activity.tasks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeModal} />
      <div className="relative w-full max-w-[821px] bg-white dark:bg-[#1A1C1E] border border-[#edeef0] dark:border-gray-800 rounded-[12px] shadow-2xl p-[25px] flex flex-col gap-[32px] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center justify-between">
            <div className="flex gap-[12px] items-center">
              <div className={`px-[12px] py-[4px] rounded-full text-[10px] font-bold tracking-[1px] uppercase ${categoryStyles[activity.category] || categoryStyles['ACADEMIC']}`}>{activity.category}</div>
              <div className={`${status.bg} px-[12px] py-[4px] rounded-full flex gap-[4px] items-center`}>
                <div className="bg-white/20 rounded-full w-[10px] h-[10px]" />
                <span className={`text-[10px] font-bold tracking-[1px] ${status.text}`}>{status.label}</span>
              </div>
            </div>
            <div className="flex gap-[12px] items-center">
              <button onClick={() => { handleEditClick(activity); closeModal(); }} className="border border-[#c3c6d7] dark:border-gray-800 flex gap-[8px] items-center px-[17px] py-[9px] rounded-[16px] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <img src={icons.edit} alt="" className="w-[10.5px] h-[10.5px] dark:invert" />
                <span className="text-[16px] font-medium text-[#191c1e] dark:text-white">Edit Note</span>
              </button>
              <button onClick={() => setDeleteConfirmId(activity.id)} className="flex gap-[8px] items-center px-[16px] py-[8px] rounded-[16px] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                <img src={icons.delete} alt="" className="w-[9.3px] h-[10.5px]" />
                <span className="text-[16px] font-medium text-[#ba1a1a]">Hapus</span>
              </button>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <h2 className="text-[20px] font-bold text-[#191c1e] dark:text-white leading-[20px]">{activity.title}</h2>

          <div className="flex gap-[24px] items-start">
            <div className="flex gap-[16px] items-center">
              <div className="bg-[#edeef0] dark:bg-gray-800 w-[40px] h-[40px] rounded-[8px] flex items-center justify-center">
                <img src={icons.BlueCal} alt="" className="w-[18px] h-[20px] dark:invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] text-[#434655] dark:text-gray-400">Tanggal</span>
                <span className="text-[16px] font-semibold text-[#191c1e] dark:text-white">{activity.dueDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/50 border border-[rgba(195,198,215,0.1)] dark:border-gray-800 rounded-[16px] p-[25px] flex flex-col gap-[16px] shadow-sm">
          <h3 className="text-[16px] font-bold text-[#191c1e] dark:text-white">Description</h3>
          <p className="text-[16px] text-[#434655] dark:text-gray-400 leading-[26px]">{activity.description || 'No description provided for this note.'}</p>
        </div>

        {activity.tasks.length > 0 && (
          <div className="bg-white dark:bg-gray-900/50 border border-[rgba(195,198,215,0.1)] dark:border-gray-800 rounded-[16px] p-[25px] flex flex-col gap-[16px] shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-[8px] items-center">
                <img src="https://www.figma.com/api/mcp/asset/ea9a2f2d-4357-4e20-b64c-aaa08b326151" alt="" className="w-[20px] h-[15px] dark:invert" />
                <span className="text-[16px] font-bold text-[#191c1e] dark:text-white">Todo list</span>
              </div>
              <div className="bg-[rgba(0,74,198,0.1)] px-[8px] py-[4px] rounded-[8px]">
                <span className="text-[12px] font-bold text-[#004ac6]">{completedTasks}/{totalTasks} Done</span>
              </div>
            </div>
            <div className="flex flex-col gap-[12px]">
              {activity.tasks.map(task => (
                <div key={task.id} className="bg-[rgba(243,244,246,0.5)] dark:bg-gray-800/30 flex gap-[12px] items-center p-[16px] rounded-[24px]">
                  <div onClick={() => toggleTaskComplete(activity.id, task.id)} className={`w-[22px] h-[22px] rounded-[8px] flex items-center justify-center border cursor-pointer transition-colors ${task.completed ? 'bg-[#004ac6] border-transparent' : 'bg-white border-[#737686]'}`}>
                    {task.completed && <img src="https://www.figma.com/api/mcp/asset/7c4850a4-2795-41ff-a4c7-2d5980e876f7" alt="" className="w-[20px] h-[20px] object-contain invert" />}
                  </div>
                  <span className={`flex-1 text-[16px] transition-all ${task.completed ? 'text-[#434655] dark:text-gray-500 line-through opacity-60' : 'text-[#191c1e] dark:text-white font-medium'}`}>{task.title}</span>
                  <img src="https://www.figma.com/api/mcp/asset/d6676089-602c-4f59-9e59-ae2252e0372f" alt="" className="w-[5.8px] h-[9.3px] opacity-40 dark:invert" />
                </div>
              ))}
            </div>
            <button onClick={() => { handleEditClick(activity); closeModal(); }} className="flex gap-[8px] items-center pt-2 hover:opacity-80 transition-opacity">
              <img src="https://www.figma.com/api/mcp/asset/d68329ab-6075-4fd6-8985-669dae797087" alt="" className="w-[11.6px] h-[11.6px] dark:invert" />
              <span className="text-[14px] font-bold text-[#004ac6]">Tambah item baru</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = (props) => {
  const { title, statusKey, description, badgeColor, activities, setIsAddModalOpen, setNewActivity, handleActivityDragOver, handleActivityDrop, dragOverStatus } = props;
  const count = activities.filter(a => a.status === statusKey).length;
  const filteredActivities = activities.filter(a => a.status === statusKey);
  const isDragOver = dragOverStatus === statusKey;

  return (
    <div
      className="flex-1 flex flex-col gap-[16px] min-w-0"
      onDragOver={(e) => handleActivityDragOver && handleActivityDragOver(e, statusKey)}
      onDrop={(e) => handleActivityDrop && handleActivityDrop(e, statusKey)}
    >
      <div className="flex items-center justify-between px-2 h-6">
        <div className="flex items-center gap-2">
          <div className={`w-[10px] h-[10px] rounded-full ${badgeColor}`} />
          <h3 className="text-base font-semibold text-[#191C1E] dark:text-white leading-6">{title}</h3>
          <div className="bg-[#E7E8EA] dark:bg-[#2A2D31] px-[8px] py-[2px] rounded-full flex items-center justify-center transition-colors min-w-[20px] h-[19px]">
            <span className="text-[10px] font-bold text-[#434655] dark:text-gray-400 leading-[15px] block text-center">{count}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setNewActivity(prev => ({ ...prev, status: statusKey }));
            setIsAddModalOpen(true);
          }}
          className="w-[14px] h-[14px] flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
        >
          <img src={icons.plus} alt="Add" className="w-full h-full object-contain dark:invert" />
        </button>
      </div>

      <div className={`flex-1 min-h-[500px] flex flex-col gap-4 transition-all duration-200 rounded-[16px] p-2 -m-2 ${isDragOver ? 'bg-[#fff5e3] dark:bg-orange-900/20 border-2 border-dashed border-[#e6b37a] dark:border-orange-500/50' : (filteredActivities.length === 0 ? 'bg-white/50 dark:bg-[#1A1C1E]/50 border-2 border-[#C3C6D7]/30 dark:border-gray-800 border-dashed items-center justify-center p-[34px] m-0' : 'border-2 border-transparent items-start')}`}>
        {filteredActivities.length > 0 || isDragOver ? (
          <div className="w-full space-y-4 pointer-events-auto relative">
            {filteredActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} {...props} />
            ))}
            {isDragOver && (
              <div className="h-[100px] w-full rounded-[12px] border-2 border-dashed border-[#e6b37a] bg-[#f7eedc]/50" />
            )}
            <button
              onClick={() => {
                setNewActivity(prev => ({ ...prev, status: statusKey }));
                setIsAddModalOpen(true);
              }}
              className="w-full border-2 border-[#c3c6d7] dark:border-gray-800 border-dashed rounded-[12px] py-[18px] flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <img src={icons.plus} alt="" className="w-[8px] h-[8px] object-contain dark:invert opacity-60" />
              <span className="text-sm font-medium text-[#434655] dark:text-gray-400">Add activity</span>
            </button>
          </div>
        ) : (
          <div className="pointer-events-none flex flex-col items-center">
            <div className="w-[64px] h-[64px] bg-[#EDEEF0] dark:bg-[#2A2D31] rounded-full flex items-center justify-center mb-4 transition-colors">
              <img src={icons.emptyBox} alt="" className="w-[25px] h-[20px] object-contain dark:invert opacity-60" />
            </div>
            <p className="text-base font-semibold text-[#434655] dark:text-gray-300 text-center leading-6">{`No tasks ${description} yet`}</p>
            <div className="mt-1 text-center">
              <p className="text-sm text-[#434655]/70 dark:text-gray-500 leading-6">{title === 'In Progress' ? 'Drag and drop cards here to' : 'Create cards here to'}</p>
              <p className="text-sm text-[#434655]/70 dark:text-gray-500 leading-6">{title === 'In Progress' ? 'set them on progres.' : 'finish them.'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityModal = ({ isOpen, closeModal, editingActivityId, newActivity, setNewActivity, newTaskInput, setNewTaskInput, addTaskToNewActivity, removeTaskFromNewActivity, onDragStart, onDragOver, onDragEnd, draggedTaskIndex, handleSaveActivity }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeModal} />
      <div className="relative w-full max-w-[821px] bg-white dark:bg-[#1A1C1E] border border-[#edeef0] dark:border-gray-800 rounded-[12px] shadow-2xl p-[25px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center">
          <h3 className="text-[19px] font-semibold text-[#191C1E] dark:text-white leading-[24px]">{editingActivityId ? 'Edit Notes' : 'Add Notes'}</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-base text-[#434655] dark:text-gray-300 leading-[24px]">Notes Title</label>
            <input
              type="text"
              placeholder="e.g., UI/UX Design Workshop"
              value={newActivity.title}
              onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
              className="w-full h-[48px] bg-white dark:bg-gray-900 border border-[#c3c6d7] dark:border-gray-800 rounded-[8px] px-[17px] text-[#191C1E] dark:text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-base text-[#434655] dark:text-gray-300 leading-[24px]">Category</label>
              <div className="relative">
                <select
                  value={newActivity.category}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full h-[48px] bg-white dark:bg-gray-900 border border-[#c3c6d7] dark:border-gray-800 rounded-[8px] px-[17px] text-[#191C1E] dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
                >
                  <option value="ACADEMIC">Academic</option>
                  <option value="DESIGN">Design</option>
                  <option value="ORGANIZATION">Organization</option>
                  <option value="FINAL">Final</option>
                </select>
                <img src={icons.dropdown} alt="" className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none dark:invert opacity-60" />
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="text-base text-[#434655] dark:text-gray-300 leading-[24px]">Status</label>
              <div className="relative">
                <select
                  value={newActivity.status}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full h-[48px] bg-white dark:bg-gray-900 border border-[#c3c6d7] dark:border-gray-800 rounded-[8px] px-[17px] text-[#191C1E] dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
                >
                  <option value="all">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Completed</option>
                </select>
                <img src={icons.dropdown} alt="" className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none dark:invert opacity-60" />
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="text-base text-[#434655] dark:text-gray-300 leading-[24px]">Due Date</label>
              <input
                type="date"
                value={newActivity.dueDate}
                onChange={(e) => setNewActivity(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full h-[48px] bg-white dark:bg-gray-900 border border-[#c3c6d7] dark:border-gray-800 rounded-[8px] px-[17px] text-[#191C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-base text-[#434655] dark:text-gray-300 leading-[24px]">Description</label>
            <textarea
              placeholder="Briefly describe what you did..."
              value={newActivity.description}
              onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-[100px] bg-white dark:bg-gray-900 border border-[#c3c6d7] dark:border-gray-800 rounded-[8px] p-[17px] text-[#191C1E] dark:text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 cursor-pointer select-none py-2" onClick={() => setNewActivity(prev => ({ ...prev, hasTodoList: !prev.hasTodoList }))}>
              <div className={`w-[20px] h-[20px] mt-1 rounded-[4px] border flex items-center justify-center transition-colors ${newActivity.hasTodoList ? 'bg-[#2563eb] border-transparent' : 'bg-white dark:bg-gray-900 border-[#c3c6d7] dark:border-gray-800'}`}>
                {newActivity.hasTodoList && <img src={icons.check} alt="" className="w-5 h-5 object-contain" />}
              </div>
              <div className="space-y-0.5">
                <p className="text-base text-[#434655] dark:text-gray-300 leading-[24px]">Activate a small Todo list</p>
                <p className="text-sm text-[#434655]/60 dark:text-gray-500">A small to do list to show task progress</p>
              </div>
            </div>

            {newActivity.hasTodoList && (
              <div className="space-y-3 pl-8 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex gap-[6px] items-start opacity-70">
                  <img src={icons.cornerDownRight} alt="" className="w-5 h-5 dark:invert" />
                  <span className="text-base text-[#434655] dark:text-gray-300 leading-[24px]">Add a small todo list</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter task name..."
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTaskToNewActivity()}
                    className="flex-1 h-[40px] bg-white dark:bg-gray-900 border border-[#c3c6d7] dark:border-gray-800 rounded-[8px] px-[12px] text-sm text-[#191C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                  />
                  <button onClick={addTaskToNewActivity} className="px-4 bg-[#2563eb] text-white rounded-[8px] text-sm font-medium hover:bg-blue-700 transition-colors">Add</button>
                </div>
                <div className="space-y-2">
                  {newActivity.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, index)}
                      onDragOver={(e) => onDragOver(e, index)}
                      onDragEnd={onDragEnd}
                      className={`border border-[#c3c6d7] dark:border-gray-800 rounded-[8px] flex items-center gap-[16px] px-[12px] py-[8px] bg-white dark:bg-gray-900/50 group transition-all duration-200 ${draggedTaskIndex === index ? 'opacity-40 scale-95 border-[#2563eb] border-dashed' : 'hover:border-[#2563eb]/50'}`}
                    >
                      <div className="cursor-grab active:cursor-grabbing p-1 -m-1">
                        <img src={icons.dragHandle} alt="Drag" className="w-5 h-5 opacity-40 group-hover:opacity-70 transition-opacity" />
                      </div>
                      <span className="flex-1 text-[16px] text-[#434655] dark:text-gray-300 leading-[24px] select-none">{task.title}</span>
                      <button onClick={() => removeTaskFromNewActivity(task.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                        <img src={icons.trash} alt="Delete" className="w-[10.5px] h-[11.5px]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-6 pt-2">
          <button onClick={closeModal} className="px-6 py-3 text-base font-medium text-[#434655] dark:text-gray-400 hover:text-[#191C1E] dark:hover:text-white transition-colors">Cancelled</button>
          <button
            onClick={handleSaveActivity}
            disabled={!newActivity.title}
            className={`w-[100px] h-[48px] bg-[#2563eb] text-white rounded-[8px] font-medium transition-all ${!newActivity.title ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:scale-95'}`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const Notes = () => {
  const { isDarkMode } = useTheme();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailActivityId, setDetailActivityId] = useState(null);
  const [editingActivityId, setEditingActivityId] = useState(null);

  const [newActivity, setNewActivity] = useState({
    title: '', category: 'ACADEMIC', status: 'all',
    dueDate: '', description: '', hasTodoList: false, tasks: [],
  });
  const [newTaskInput, setNewTaskInput] = useState('');
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  const [draggedActivityId, setDraggedActivityId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getAllNotes();
        setActivities(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const toggleExpand = (id) =>
    setActivities(prev => prev.map(a => a.id === id ? { ...a, isExpanded: !a.isExpanded } : a));

  const calculateProgress = calcProgress;

  const toggleTaskComplete = useCallback(async (activityId, taskId) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    const updatedTasks = activity.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    setActivities(prev => prev.map(a =>
      a.id === activityId ? { ...a, tasks: updatedTasks, progress: calculateProgress(updatedTasks) } : a
    ));

    try {
      await updateNote(activityId, { todoList: updatedTasks });
    } catch {
      setActivities(prev => prev.map(a => a.id === activityId ? activity : a));
    }
  }, [activities]);

  const deleteActivity = async (id) => {
    try {
      await deleteNote(id);
      setActivities(prev => prev.filter(a => a.id !== id));
      setDeleteConfirmId(null);
      setDetailActivityId(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleEditClick = (activity) => {
    setEditingActivityId(activity.id);
    setNewActivity({
      title: activity.title,
      category: activity.category,
      status: activity.status,
      dueDate: activity.dueDateRaw ?? '',
      description: activity.description ?? '',
      hasTodoList: activity.tasks.length > 0,
      tasks: activity.tasks,
    });
    setMenuOpenId(null);
    setIsAddModalOpen(true);
  };

  const addTaskToNewActivity = () => {
    if (!newTaskInput.trim()) return;
    setNewActivity(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: crypto.randomUUID(), title: newTaskInput.trim(), completed: false }],
    }));
    setNewTaskInput('');
  };

  const removeTaskFromNewActivity = (id) =>
    setNewActivity(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));

  const onDragStart = (e, index) => {
    setDraggedTaskIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (e, index) => {
    e.preventDefault();
    if (draggedTaskIndex === null || draggedTaskIndex === index) return;
    const newTasks = [...newActivity.tasks];
    const [moved] = newTasks.splice(draggedTaskIndex, 1);
    newTasks.splice(index, 0, moved);
    setDraggedTaskIndex(index);
    setNewActivity(prev => ({ ...prev, tasks: newTasks }));
  };
  const onDragEnd = () => setDraggedTaskIndex(null);

  const handleActivityDragStart = (e, id) => {
    setTimeout(() => setDraggedActivityId(id), 0);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleActivityDragEnd = () => {
    setDraggedActivityId(null);
    setDragOverStatus(null);
  };
  const handleActivityDragOver = (e, status) => {
    e.preventDefault();
    if (dragOverStatus !== status) setDragOverStatus(status);
  };
  const handleActivityDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverStatus(null);
    if (!draggedActivityId) return;

    const activity = activities.find(a => a.id === draggedActivityId);
    if (!activity || activity.status === newStatus) return;

    setActivities(prev => prev.map(a => a.id === draggedActivityId ? { ...a, status: newStatus } : a));
    setDraggedActivityId(null);

    try {
      await updateNote(draggedActivityId, { status: toDbStatus(newStatus) });
    } catch {
      setActivities(prev => prev.map(a => a.id === draggedActivityId ? activity : a));
    }
  };

  const handleSaveActivity = async () => {
    if (!newActivity.title) return;

    const finalTasks = newActivity.hasTodoList ? newActivity.tasks : [];
    const payload = {
      title: newActivity.title,
      category: newActivity.category,
      status: toDbStatus(newActivity.status),
      dueDate: newActivity.dueDate || null,
      description: newActivity.description || null,
      todoList: finalTasks,
    };

    try {
      if (editingActivityId) {
        const updated = await updateNote(editingActivityId, payload);
        setActivities(prev => prev.map(a =>
          a.id === editingActivityId ? { ...updated, isExpanded: a.isExpanded } : a
        ));
      } else {
        const created = await createNote(payload);
        setActivities(prev => [created, ...prev]);
      }
      closeModal();
    } catch (e) {
      alert(e.message);
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingActivityId(null);
    setNewActivity({ title: '', category: 'ACADEMIC', status: 'all', dueDate: '', description: '', hasTodoList: false, tasks: [] });
    setNewTaskInput('');
  };

  const selectedActivity = activities.find(a => a.id === detailActivityId);

  const sharedProps = {
    activities, setIsAddModalOpen, setNewActivity,
    menuOpenId, setMenuOpenId, deleteConfirmId, setDeleteConfirmId,
    deleteActivity, handleEditClick, toggleExpand, toggleTaskComplete,
    setDetailActivityId, draggedActivityId,
    handleActivityDragStart, handleActivityDragEnd,
    handleActivityDragOver, handleActivityDrop, dragOverStatus,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm">Memuat notes...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F8F9FB]'}`}>
      <div className="max-w-[1024px] mx-auto p-[32px] space-y-8 flex flex-col">
        <div className="flex gap-[24px] items-start">
          <EmptyState title="All" statusKey="all" description="assign" badgeColor="bg-[#2563EB]" {...sharedProps} />
          <EmptyState title="In Progress" statusKey="in-progress" description="on progress" badgeColor="bg-[#FC0]" {...sharedProps} />
          <EmptyState title="Done" statusKey="done" description="completed" badgeColor="bg-[#5D5F5F]" {...sharedProps} />
        </div>
      </div>

      <ActivityModal
        isOpen={isAddModalOpen} closeModal={closeModal}
        editingActivityId={editingActivityId}
        newActivity={newActivity} setNewActivity={setNewActivity}
        newTaskInput={newTaskInput} setNewTaskInput={setNewTaskInput}
        addTaskToNewActivity={addTaskToNewActivity}
        removeTaskFromNewActivity={removeTaskFromNewActivity}
        onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}
        draggedTaskIndex={draggedTaskIndex}
        handleSaveActivity={handleSaveActivity}
      />
      <ActivityDetailModal
        isOpen={!!detailActivityId} closeModal={() => setDetailActivityId(null)}
        activity={selectedActivity} setDeleteConfirmId={setDeleteConfirmId}
        handleEditClick={handleEditClick} toggleTaskComplete={toggleTaskComplete}
      />
      <DeleteConfirmationModal
        isOpen={!!deleteConfirmId} closeModal={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteActivity(deleteConfirmId)}
        activityTitle={activities.find(a => a.id === deleteConfirmId)?.title ?? ''}
      />
    </div>
  );
};

export default Notes;