// src/pages/Activity.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { getAllActivities, deleteActivity } from '../services/activityService'

// ─── Icons ────────────────────────────────────────────────────────────────────
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
)
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
)
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
)
const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
)
const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
)
const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
)
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)
const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
)
const Trash2Icon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Map category enum → warna badge
const CATEGORY_COLORS = {
  AKADEMIK:    { bg: 'bg-[#EBF5FF]', text: 'text-[#004AC6]' },
  ORGANISASI:  { bg: 'bg-[#FFF4EB]', text: 'text-[#943700]' },
  SKILL:       { bg: 'bg-[#EDFDF0]', text: 'text-[#1A7F3C]' },
  KEPANITIAAN: { bg: 'bg-[#F5F0FF]', text: 'text-[#6B21A8]' },
  LAINNYA:     { bg: 'bg-[#F3F4F6]', text: 'text-[#374151]' },
}

// Format tanggal → "Monday, May 24, 2024"
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

// Format waktu → "09:00"
const formatTime = (dateStr) => {
  if (!dateStr) return '--:--'
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

// Kelompokkan activities berdasarkan tanggal (YYYY-MM-DD)
const groupByDate = (activities) => {
  return activities.reduce((acc, act) => {
    const dateKey = new Date(act.startedAt).toDateString()
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(act)
    return acc
  }, {})
}

// Apakah tanggal == hari ini?
const isToday = (dateStr) => new Date(dateStr).toDateString() === new Date().toDateString()

// Status → label display
const STATUS_LABEL = {
  TODO:        'Todo',
  IN_PROGRESS: 'In Progress',
  DONE:        'Done',
}

// ─── Filter options (sesuai enum Prisma) ─────────────────────────────────────
const CATEGORIES = ['All', 'AKADEMIK', 'ORGANISASI', 'SKILL', 'KEPANITIAAN', 'LAINNYA']
const STATUSES   = ['All', 'TODO', 'IN_PROGRESS', 'DONE']

// ─── Sub-components ───────────────────────────────────────────────────────────

const FilterDropdown = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex-1 flex flex-col px-6 py-2 relative">
      <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">{label}</span>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between cursor-pointer w-full focus:outline-none"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{value}</span>
        <ChevronDownIcon />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ActivityCard = ({ activity, onDelete }) => {
  const { id, title, category, status, startedAt, endedAt, description } = activity
  const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.LAINNYA
  const isActive = status === 'IN_PROGRESS'
  const timeRange = endedAt
    ? `${formatTime(startedAt)} - ${formatTime(endedAt)}`
    : `${formatTime(startedAt)} - ongoing`

  const handleDelete = async () => {
    if (!window.confirm(`Hapus "${title}"?`)) return
    try {
      await onDelete(id)
    } catch (err) {
      alert(err.message || 'Gagal menghapus aktivitas.')
    }
  }

  if (isActive) {
    return (
      <div className="bg-[#F0F4F8] dark:bg-[#1A1C1E] rounded-xl flex items-stretch border-l-4 border-[#004AC6] overflow-hidden transition-colors">
        <div className="flex-1 p-5 flex gap-4">
          <div className="w-12 h-12 bg-[#004AC6] rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-1">
            <UserIcon />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${categoryColor.bg} ${categoryColor.text}`}>
                {category}
              </span>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{STATUS_LABEL[status]}</span>
            </div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">{title}</h4>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">{description}</p>
            )}
            <div className="flex items-center gap-1.5 text-[#004AC6] dark:text-blue-400 font-medium text-xs">
              <ClockIcon />
              <span>{timeRange}</span>
            </div>
          </div>
        </div>
        <div className="p-5 flex flex-col justify-center items-end gap-3">
          <button className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#2A2D31] transition-colors">
            <PencilIcon />
          </button>
          <button
            onClick={handleDelete}
            className="w-8 h-8 rounded-full border border-red-200 dark:border-red-900/30 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <Trash2Icon />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-[#1A1C1E] rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all border border-transparent dark:border-gray-800">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#F0F7FF] dark:bg-[#2A2D31] rounded-xl flex items-center justify-center text-[#004AC6] dark:text-blue-400 flex-shrink-0">
          <BookIcon />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${categoryColor.bg} ${categoryColor.text}`}>
              {category}
            </span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{STATUS_LABEL[status]}</span>
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">{title}</h4>
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs mt-0.5">
            <ClockIcon />
            <span>{timeRange}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2D31] transition-colors">
          <PencilIcon />
        </button>
        <button
          onClick={handleDelete}
          className="w-8 h-8 rounded-full border border-red-200 dark:border-red-900/30 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <Trash2Icon />
        </button>
      </div>
    </div>
  )
}

const TimelineDivider = ({ label }) => (
  <div className="flex items-center gap-4 py-4">
    <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800"></div>
    <div className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
      {label}
    </div>
    <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800"></div>
  </div>
)

// Skeleton loader untuk card
const ActivitySkeleton = () => (
  <div className="bg-white dark:bg-[#1A1C1E] rounded-xl p-5 flex items-center gap-4 animate-pulse">
    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10

const Activity = () => {
  const { isDarkMode } = useTheme()

  // State: data & UI
  const [activities, setActivities]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus]     = useState('All')
  const [activePage, setActivePage]     = useState(1)

  // Fetch dari backend
  const fetchActivities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const filters = {}
      if (filterCategory !== 'All') filters.category = filterCategory
      if (filterStatus !== 'All')   filters.status   = filterStatus

      const res = await getAllActivities(filters)
      setActivities(res.data || [])
      setActivePage(1) // reset ke halaman 1 setiap kali filter berubah
    } catch (err) {
      console.error('[Activity] fetch error:', err)
      setError(err.message || 'Gagal memuat data aktivitas.')
    } finally {
      setLoading(false)
    }
  }, [filterCategory, filterStatus])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  // Handle delete — optimistic removal
  const handleDelete = async (id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id))
    try {
      await deleteActivity(id)
    } catch (err) {
      // Rollback tidak tersedia di sini tanpa re-fetch,
      // jadi kita re-fetch saja jika gagal
      fetchActivities()
      throw err
    }
  }

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(activities.length / ITEMS_PER_PAGE))
  const paginated   = activities.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  )

  // Group paginated results berdasarkan tanggal
  const grouped = groupByDate(paginated)
  const dateKeys = Object.keys(grouped)

  // ── Pagination button helper ───────────────────────────────────────────────
  const buildPages = () => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1, 2]
    if (activePage > 3) pages.push('...')
    if (activePage > 2 && activePage < totalPages - 1) pages.push(activePage)
    if (activePage < totalPages - 2) pages.push('...')
    pages.push(totalPages - 1, totalPages)
    return [...new Set(pages)] // deduplicate edge cases
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121212] p-8 flex justify-start transition-colors duration-300">
      <div className="w-full max-w-5xl space-y-8">

        {/* Header */}
        <header>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Activity List</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor all your productivity schedules.</p>
        </header>

        {/* Filter Card */}
        <div className="bg-white dark:bg-[#1A1C1E] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center divide-x divide-gray-100 dark:divide-gray-800 overflow-hidden transition-colors">
          <FilterDropdown
            label="CATEGORY"
            value={filterCategory}
            options={CATEGORIES}
            onChange={setFilterCategory}
          />
          <FilterDropdown
            label="STATUS"
            value={filterStatus}
            options={STATUSES}
            onChange={setFilterStatus}
          />
        </div>

        {/* Timer & Entry Form (UI-only, belum wired) */}
        <div className="space-y-4">
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
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 cursor-pointer min-w-[160px] transition-colors">
              <span className="flex-1">mm/dd/yyyy</span>
              <CalendarIcon />
            </div>
            <div className="bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 cursor-pointer min-w-[140px] transition-colors">
              <span className="flex-1">Category</span>
              <ChevronDownIcon />
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-[#EBF5FF] dark:bg-[#2A2D31] text-[#004AC6] dark:text-blue-400 rounded-xl flex items-center justify-center hover:bg-[#D6E9FF] transition-colors">
                <PauseIcon />
              </button>
              <button className="w-10 h-10 bg-[#004AC6] text-white rounded-xl flex items-center justify-center hover:bg-[#003da3] transition-colors shadow-lg shadow-blue-200 dark:shadow-none">
                <PlayIcon />
              </button>
              <button className="w-10 h-10 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors">
                <DeleteIcon />
              </button>
            </div>
            <div className="border-2 border-gray-200 dark:border-gray-800 rounded-xl px-6 py-2 font-mono font-bold text-gray-700 dark:text-gray-300 text-lg transition-colors">
              00 : 00 : 00
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-4 pt-4">
          {/* Loading state */}
          {loading && (
            <div className="space-y-3">
              <ActivitySkeleton />
              <ActivitySkeleton />
              <ActivitySkeleton />
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
              <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
              <button
                onClick={fetchActivities}
                className="mt-3 text-sm text-[#004AC6] hover:underline font-medium"
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && activities.length === 0 && (
            <div className="bg-white dark:bg-[#1A1C1E] rounded-xl p-12 text-center border border-gray-100 dark:border-gray-800">
              <p className="text-gray-400 dark:text-gray-600 text-sm font-medium">
                {filterCategory !== 'All' || filterStatus !== 'All'
                  ? 'Tidak ada aktivitas yang sesuai filter.'
                  : 'Belum ada aktivitas. Mulai dengan menambahkan yang baru!'}
              </p>
            </div>
          )}

          {/* Data */}
          {!loading && !error && dateKeys.map((dateKey) => (
            <div key={dateKey}>
              <TimelineDivider
                label={isToday(dateKey) ? 'Today' : formatDate(dateKey)}
              />
              <div className="space-y-3">
                {grouped[dateKey].map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-10">
            {buildPages().map((page, idx) => (
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
        )}

      </div>
    </div>
  )
}

export default Activity