// src/pages/AddActivity.jsx
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createActivity, getProjects } from '../services/Activityservice'

// ─── Icons ────────────────────────────────────────────────────────────────────
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
)
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
)
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
)
const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
)
const Trash2Icon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
)
const PenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/><path d="m15 5 4 4"/></svg>
)
const TimerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
)
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
)

// ─── Constants ────────────────────────────────────────────────────────────────

// Sesuai enum Prisma ActivityCategory
const CATEGORIES = [
  { label: 'Akademik',    value: 'AKADEMIK',    color: { bg: 'bg-[#EBF5FF]', text: 'text-[#004AC6]' } },
  { label: 'Organisasi',  value: 'ORGANISASI',  color: { bg: 'bg-[#F5F3FF]', text: 'text-[#7C3AED]' } },
  { label: 'Skill',       value: 'SKILL',       color: { bg: 'bg-[#EDFDF0]', text: 'text-[#1A7F3C]' } },
  { label: 'Kepanitiaan', value: 'KEPANITIAAN', color: { bg: 'bg-[#FFF4EB]', text: 'text-[#943700]' } },
  { label: 'Lainnya',     value: 'LAINNYA',     color: { bg: 'bg-[#F3F4F6]', text: 'text-[#374151]' } },
]

// Sesuai enum Prisma ActivityStatus
const STATUSES = [
  { label: 'Todo',        value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done',        value: 'DONE' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTimer = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`
}

// Hindari toLocaleTimeString untuk nilai yang akan diparsing — selalu format "HH:MM"
const calcDuration = (start, end) => {
  if (!start || !end) return '--:--:--'
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  if ([sh, sm, eh, em].some(Number.isNaN)) return '--:--:--'

  let diff = (eh * 60 + em) - (sh * 60 + sm)
  if (diff <= 0) return 'INVALID'

  return `${String(Math.floor(diff / 60)).padStart(2, '0')}:${String(diff % 60).padStart(2, '0')}:00`
}

// Combine date + time → ISO string untuk dikirim ke backend
const toISO = (date, time) => new Date(`${date}T${time}:00`).toISOString()

// ─── Sub-components ───────────────────────────────────────────────────────────

const SelectDropdown = ({ label, value, options, onChange, placeholder }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div className="space-y-1.5" ref={ref}>
      {label && <label className="text-sm font-medium text-[#434655]">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full h-[48px] bg-white border border-[#C3C6D7] rounded-lg px-4 text-left text-[#191C1E] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
        >
          <span className={selected ? 'text-[#191C1E]' : 'text-gray-400'}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDownIcon />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${value === opt.value ? 'text-[#2563EB] font-bold' : 'text-[#191C1E]'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ProjectDropdown — projects diambil dari DB via parent
const ProjectDropdown = ({ value, onChange, projects, onAddProject }) => {
  const [open, setOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [input, setInput] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleAdd = () => {
    if (!input.trim()) return
    onAddProject(input.trim())
    onChange(input.trim())
    setInput('')
    setIsAdding(false)
    setOpen(false)
  }

  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-sm font-medium text-[#434655]">Project <span className="text-gray-400 font-normal">(opsional)</span></label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full h-[48px] bg-white border border-[#C3C6D7] rounded-lg px-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
        >
          <span className={value ? 'text-[#191C1E]' : 'text-gray-400'}>{value || 'Pilih project'}</span>
          <ChevronDownIcon />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-400 hover:bg-gray-50 transition-colors"
            >
              Tidak ada
            </button>
            <div className="h-px bg-gray-100 mx-2 my-1" />
            {projects.length === 0 && (
              <p className="px-4 py-2 text-xs text-gray-400">Belum ada project.</p>
            )}
            {projects.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { onChange(p); setOpen(false) }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${value === p ? 'text-[#2563EB] font-bold' : 'text-[#191C1E]'}`}
              >
                {p}
              </button>
            ))}
            <div className="h-px bg-gray-100 mx-2 my-1" />
            {!isAdding ? (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="w-full px-4 py-2.5 text-left text-sm text-[#2563EB] font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Tambah project baru
              </button>
            ) : (
              <div className="px-2 py-2" onClick={e => e.stopPropagation()}>
                <input
                  autoFocus
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Nama project..."
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-gray-400 hover:text-gray-600 font-bold uppercase">Batal</button>
                  <button type="button" onClick={handleAdd} className="text-xs text-[#2563EB] font-bold uppercase hover:bg-blue-50 px-2 py-1 rounded">Tambah</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ title, onBack, onAddMore }) => (
  <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-8">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md w-full text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
        <CheckIcon />
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#191C1E]">Aktivitas Ditambahkan!</h2>
        <p className="text-gray-500 mt-1 text-sm">"{title}" berhasil disimpan.</p>
      </div>
      <div className="flex flex-col gap-3">
        <button onClick={onAddMore} className="w-full py-3 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Tambah Aktivitas Lagi
        </button>
        <button onClick={onBack} className="w-full py-3 border border-gray-200 text-[#434655] rounded-xl font-bold hover:bg-gray-50 transition-colors">
          Kembali ke Activity
        </button>
      </div>
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────
const AddActivity = () => {
  const navigate = useNavigate()

  // Mode: 'timer' | 'manual'
  const [mode, setMode] = useState('timer')

  // Form fields
  const [title, setTitle]           = useState('')
  const [category, setCategory]     = useState('AKADEMIK')
  const [status, setStatus]         = useState('TODO')
  const [description, setDescription] = useState('')
  const [project, setProject]       = useState('')
  const [projects, setProjects]     = useState([])

  // ── Fetch projects dari DB ─────────────────────────────────────────────────
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await getProjects()
        setProjects(res.data || [])
      } catch {
        // gagal load projects tidak perlu block UI
      }
    }
    loadProjects()
  }, [])

  const handleAddProject = (name) => {
    setProjects(prev => prev.includes(name) ? prev : [...prev, name])
  }

  // Manual mode fields
  const [manualDate, setManualDate]           = useState(new Date().toISOString().split('T')[0])
  const [manualStartTime, setManualStartTime] = useState('09:00')
  const [manualEndTime, setManualEndTime]     = useState('10:00')
  const dateRef  = useRef(null)
  const startRef = useRef(null)
  const endRef   = useRef(null)

  // Timer mode
  const [timerStatus, setTimerStatus]   = useState('idle') // idle | running | paused
  const [elapsed, setElapsed]           = useState(0)
  const [timerStart, setTimerStart]     = useState(null) // waktu mulai (Date object)
  const intervalRef = useRef(null)

  // Submission state
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [success, setSuccess]   = useState(false)
  const [savedTitle, setSavedTitle] = useState('')

  // Timer logic
  useEffect(() => {
    if (timerStatus === 'running') {
      intervalRef.current = setInterval(() => setElapsed(p => p + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [timerStatus])

  const handleStartTimer = () => {
    setTimerStart(new Date())
    setTimerStatus('running')
  }

  const handleResetTimer = () => {
    setTimerStatus('idle')
    setElapsed(0)
    setTimerStart(null)
  }

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = () => {
    if (mode === 'timer') {
      // timerStart = kapan mulai, sekarang = kapan selesai
      const endTime   = new Date()
      const startTime = timerStart || new Date(endTime - elapsed * 1000)
      return {
        title,
        category,
        status,
        description,
        project: project || null,
        startedAt: startTime.toISOString(),
        endedAt:   endTime.toISOString(),
      }
    } else {
      return {
        title,
        category,
        status,
        description,
        project: project || null,
        startedAt: toISO(manualDate, manualStartTime),
        endedAt:   toISO(manualDate, manualEndTime),
      }
    }
  }

  // Validasi durasi manual (cegah selisih 0 / minus secara nyata)
  const isManualDurationValid = () => {
    if (mode !== 'manual') return true
    const [sh, sm] = manualStartTime.split(':').map(Number)
    const [eh, em] = manualEndTime.split(':').map(Number)
    if ([sh, sm, eh, em].some(Number.isNaN)) return false
    return (eh * 60 + em) > (sh * 60 + sm)  // end harus > start, tidak ada wrap
  } 

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!title.trim()) { setError('Judul aktivitas wajib diisi.'); return }
    if (!description.trim()) { setError('Deskripsi wajib diisi.'); return }
    if (!isManualDurationValid()) { setError('Waktu selesai harus setelah waktu mulai.'); return }

    setLoading(true)
    setError(null)
    try {
      const payload = buildPayload()
      await createActivity(payload)
      setSavedTitle(title)
      setSuccess(true)
      // Reset timer jika pakai mode timer
      handleResetTimer()
    } catch (err) {
      setError(err.message || 'Gagal menyimpan aktivitas.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMore = () => {
    setSuccess(false)
    setTitle('')
    setDescription('')
    setProject('')
    setStatus('TODO')
    setCategory('AKADEMIK')
    setManualDate(new Date().toISOString().split('T')[0])
    setManualStartTime('09:00')
    setManualEndTime('10:00')
    setElapsed(0)
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <SuccessScreen
        title={savedTitle}
        onBack={() => navigate('/activity')}
        onAddMore={handleAddMore}
      />
    )
  }

  const manualDuration = calcDuration(manualStartTime, manualEndTime)
  const manualDurationInvalid = manualDuration === 'INVALID'  

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeftIcon />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#191C1E] tracking-tight">Tambah Aktivitas</h1>
            <p className="text-sm text-gray-500 mt-0.5">Catat aktivitasmu hari ini.</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-1 flex gap-1 relative w-fit">
          <button
            onClick={() => setMode('timer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'timer' ? 'bg-[#2563EB] text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <TimerIcon /> Start Timer
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'manual' ? 'bg-[#2563EB] text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <PenIcon /> Input Manual
          </button>
        </div>

        {/* Timer Section (Timer Mode) */}
        {mode === 'timer' && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Timer</h2>
            <div className="flex items-center gap-4">
              {/* Display */}
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-center font-mono text-3xl font-bold text-[#191C1E] tracking-widest">
                {formatTimer(elapsed)}
              </div>
              {/* Controls */}
              <div className="flex gap-2">
                {timerStatus === 'idle' ? (
                  <button
                    type="button"
                    onClick={handleStartTimer}
                    className="w-12 h-12 bg-[#2563EB] text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow"
                  >
                    <PlayIcon />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setTimerStatus(s => s === 'running' ? 'paused' : 'running')}
                      className="w-12 h-12 bg-[#2563EB] text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow"
                    >
                      {timerStatus === 'running' ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetTimer}
                      className="w-12 h-12 bg-red-50 text-red-500 border border-red-200 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <Trash2Icon />
                    </button>
                  </>
                )}
              </div>
            </div>
            {timerStatus !== 'idle' && (
              <p className="text-xs text-gray-400">
                Mulai: {timerStart?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} — Timer {timerStatus === 'paused' ? 'dijeda' : 'berjalan'}
              </p>
            )}
          </div>
        )}

        {/* Date & Time Section (Manual Mode) */}
        {mode === 'manual' && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Waktu</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Date */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium text-[#434655]">Tanggal</label>
                <div
                  onClick={() => dateRef.current?.showPicker()}
                  className="relative h-[48px] bg-white border border-[#C3C6D7] rounded-lg px-4 flex items-center justify-between cursor-pointer hover:border-[#2563EB] transition-all"
                >
                  <span className="text-sm text-[#191C1E]">{new Date(manualDate).toLocaleDateString('id-ID')}</span>
                  <CalendarIcon />
                  <input ref={dateRef} type="date" value={manualDate} onChange={e => setManualDate(e.target.value)} className="absolute inset-0 opacity-0 pointer-events-none" />
                </div>
              </div>
              {/* Start */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#434655]">Mulai</label>
                <div
                  onClick={() => startRef.current?.showPicker()}
                  className="relative h-[48px] bg-white border border-[#C3C6D7] rounded-lg px-4 flex items-center justify-between cursor-pointer hover:border-[#2563EB] transition-all"
                >
                  <span className="text-sm text-[#191C1E]">{manualStartTime}</span>
                  <ClockIcon />
                  <input ref={startRef} type="time" value={manualStartTime} onChange={e => setManualStartTime(e.target.value)} className="absolute inset-0 opacity-0 pointer-events-none" />
                </div>
              </div>
              {/* End */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#434655]">Selesai</label>
                <div
                  onClick={() => endRef.current?.showPicker()}
                  className="relative h-[48px] bg-white border border-[#C3C6D7] rounded-lg px-4 flex items-center justify-between cursor-pointer hover:border-[#2563EB] transition-all"
                >
                  <span className="text-sm text-[#191C1E]">{manualEndTime}</span>
                  <ClockIcon />
                  <input ref={endRef} type="time" value={manualEndTime} onChange={e => setManualEndTime(e.target.value)} className="absolute inset-0 opacity-0 pointer-events-none" />
                </div>
              </div>
              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#434655]">Durasi</label>
                <div className={`h-[48px] bg-gray-50 border rounded-lg px-4 flex items-center justify-center text-sm font-bold ${manualDurationInvalid ? 'border-red-200 text-red-500' : 'border-gray-200 text-[#434655]'}`}>
                     {manualDurationInvalid ? '--:--:--' : manualDuration}
                </div>
              </div>
            </div>
           {manualDurationInvalid && (
                  <p className="text-xs text-red-500">Waktu selesai harus lebih besar dari waktu mulai (aktivitas hanya untuk 1 hari).</p>
                )}
          </div>
        )}

        {/* Form Fields */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Detail Aktivitas</h2>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#434655]">Judul Aktivitas <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="Contoh: Belajar UI/UX Design"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-[48px] bg-white border border-[#C3C6D7] rounded-lg px-4 text-[#191C1E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
            />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectDropdown
              label="Kategori"
              value={category}
              options={CATEGORIES}
              onChange={setCategory}
              placeholder="Pilih kategori"
            />
            <SelectDropdown
              label="Status"
              value={status}
              options={STATUSES}
              onChange={setStatus}
              placeholder="Pilih status"
            />
          </div>

          {/* Project */}
          <ProjectDropdown
            value={project}
            onChange={setProject}
            projects={projects}
            onAddProject={handleAddProject}
          />

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#434655]">Deskripsi <span className="text-red-400">*</span></label>
            <textarea
              placeholder="Ceritakan apa yang kamu kerjakan..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-white border border-[#C3C6D7] rounded-lg px-4 py-3 text-[#191C1E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all resize-none"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-200 text-[#434655] rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className={`px-8 py-3 bg-[#2563EB] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5 ${loading || !title.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'Menyimpan...' : mode === 'timer' && timerStatus !== 'idle' ? 'Stop & Simpan' : 'Simpan Aktivitas'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddActivity