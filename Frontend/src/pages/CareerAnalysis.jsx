import { useCallback, useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { getCareerInsight } from '../services/AIservice'
import { ArrowRight, BadgeInfo, Brain, Lightbulb, Loader2, RefreshCw, Sparkles, TriangleAlert } from 'lucide-react'

const emptyInsight = {
  prediksi_karir: '',
  alasan: '',
  skills_to_develop: [],
  next_steps: [],
  career_options: [],
}

const CareerAnalysis = () => {
  const { isDarkMode } = useTheme()
  const [insight, setInsight] = useState(emptyInsight)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusCode, setStatusCode] = useState(null)

  const fetchInsight = useCallback(async (signal) => {
    setLoading(true)
    setError('')
    setStatusCode(null)

    try {
      const data = await getCareerInsight({ includeActivities: true }, { signal })
      setInsight({
        prediksi_karir: data.prediksi_karir || '',
        alasan: data.alasan || '',
        skills_to_develop: Array.isArray(data.skills_to_develop) ? data.skills_to_develop : [],
        next_steps: Array.isArray(data.next_steps) ? data.next_steps : [],
        career_options: Array.isArray(data.career_options) ? data.career_options : [],
      })
    } catch (err) {
      if (err?.name === 'AbortError') return
      setError(err.message || 'Gagal memuat insight karir')
      setStatusCode(err.status || null)
      setInsight(emptyInsight)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      fetchInsight(controller.signal)
    }, 0)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [fetchInsight])

  const hasInsight = Boolean(insight.prediksi_karir && insight.alasan)

  const renderErrorMessage = () => {
    if (statusCode === 400) {
      return 'Data belum cukup. Tambahkan lebih banyak activity berstatus Done agar analisis karir bisa dibuat.'
    }

    if (statusCode === 503) {
      return 'AI Engine sedang sibuk. Coba lagi sebentar ya.'
    }

    return error || 'Terjadi kendala saat memuat analisis karir.'
  }

  return (
    <div className={`min-h-screen px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1115] text-white' : 'bg-[#f6f8fc] text-[#191c1e]'}`}>
      <div className="mx-auto w-full max-w-6xl">
        <div className={`overflow-hidden rounded-[28px] border shadow-[0_18px_60px_rgba(0,0,0,0.08)] ${isDarkMode ? 'border-white/10 bg-[#15181f]' : 'border-white bg-white'}`}>
          <div className="relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.12),transparent_28%)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] backdrop-blur-sm ${isDarkMode ? 'border-white/10 bg-white/5 text-blue-300' : 'border-blue-100 bg-blue-50 text-blue-700'}`}>
                  <Sparkles size={14} />
                  Career Insight
                </div>
                <div className="space-y-3">
                  <h1 className={`text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl ${isDarkMode ? 'text-white' : 'text-[#101828]'}`}>
                    Rekomendasi arah karir berbasis riwayat kegiatanmu
                  </h1>
                  <p className={`max-w-2xl text-sm leading-6 sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-[#434655]'}`}>
                    Halaman ini membaca activity yang sudah selesai, notes milikmu, dan primary interest di profil untuk menghasilkan prediksi karir dalam format JSON murni.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fetchInsight()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#004ac6] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-[#003da3] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                {loading ? 'Menganalisis...' : 'Analisis ulang'}
              </button>
            </div>
          </div>

          <div className="grid gap-6 px-6 pb-8 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:pb-10">
            <div className="space-y-6">
              <section className={`rounded-3xl border p-6 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-[#E6EAF2] bg-[#FBFCFE]'}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                    <Brain size={20} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${isDarkMode ? 'text-gray-400' : 'text-[#737686]'}`}>
                      Prediksi Utama
                    </p>
                    <h2 className="text-lg font-bold">Arah karir yang paling cocok</h2>
                  </div>
                </div>

                <div className="mt-5 min-h-[160px]">
                  {loading ? (
                    <div className="flex h-full min-h-[160px] items-center justify-center">
                      <div className="flex items-center gap-3 text-sm font-medium text-blue-600">
                        <Loader2 size={18} className="animate-spin" />
                        Sedang membaca riwayat aktivitas...
                      </div>
                    </div>
                  ) : hasInsight ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {['1', '2'].map((rank, index) => {
                          const option = index === 0
                            ? (insight.career_options[0] || insight.prediksi_karir)
                            : (insight.career_options[1] || '')

                          if (!option) return null

                          const isPrimary = index === 0
                          return (
                            <div
                              key={`${option}-${rank}`}
                              className={`flex items-center gap-3 rounded-full border px-4 py-3 ${
                                isPrimary
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                                  : isDarkMode ? 'bg-[#A0A0A0] text-white border-[#A0A0A0]' : 'bg-[#B0B0B0] text-white border-[#B0B0B0]'
                              }`}
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm font-black">
                                {rank}.
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">
                                  {isPrimary ? 'Primary passion' : 'Secondary passion'}
                                </p>
                                <p className="truncate text-sm font-bold">{option}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className={`flex h-full min-h-[160px] items-center rounded-2xl border border-dashed p-5 ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-[#D8E0EE] text-[#737686]'}`}>
                      {renderErrorMessage()}
                    </div>
                  )}
                </div>
              </section>

              <section className={`rounded-3xl border p-6 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-[#E6EAF2] bg-[#FBFCFE]'}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                    <Lightbulb size={20} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${isDarkMode ? 'text-gray-400' : 'text-[#737686]'}`}>
                      Skills to develop
                    </p>
                    <h2 className="text-lg font-bold">Skill yang perlu diperdalam</h2>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {loading && (
                    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-white text-[#737686] shadow-sm'}`}>
                      <Loader2 size={16} className="animate-spin" />
                      Menunggu hasil...
                    </div>
                  )}
                  {!loading && insight.skills_to_develop.length === 0 && (
                    <div className={`rounded-2xl border border-dashed px-4 py-5 text-sm ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-[#D8E0EE] text-[#737686]'}`}>
                      Belum ada saran skill yang bisa ditampilkan.
                    </div>
                  )}
                  {insight.skills_to_develop.map((skill) => (
                    <span
                      key={skill}
                      className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${isDarkMode ? 'bg-white/8 text-blue-200 ring-1 ring-white/10' : 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className={`rounded-3xl border p-6 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-[#E6EAF2] bg-[#FBFCFE]'}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <BadgeInfo size={20} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${isDarkMode ? 'text-gray-400' : 'text-[#737686]'}`}>
                      Data sources
                    </p>
                    <h2 className="text-lg font-bold">Input yang dipakai AI</h2>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm leading-6">
                  <div className={`rounded-2xl p-4 ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-white text-[#434655] shadow-sm'}`}>
                    Endpoint membaca semua activity berstatus <span className="font-bold text-emerald-500">Done</span> milik user dari token.
                  </div>
                  <div className={`rounded-2xl p-4 ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-white text-[#434655] shadow-sm'}`}>
                    Notes juga ikut dikirim sebagai konteks tambahan agar prediksi lebih relevan.
                  </div>
                  <div className={`rounded-2xl p-4 ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-white text-[#434655] shadow-sm'}`}>
                    Primary interest di profil menjadi kompas utama agar hasilnya lebih selaras dengan minatmu.
                  </div>
                </div>
              </section>

              <section className={`rounded-3xl border p-6 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-[#E6EAF2] bg-[#FBFCFE]'}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                    <ArrowRight size={20} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${isDarkMode ? 'text-gray-400' : 'text-[#737686]'}`}>
                      Next steps
                    </p>
                    <h2 className="text-lg font-bold">Langkah berikutnya</h2>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {loading && (
                    <div className={`rounded-2xl border border-dashed p-4 text-sm ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-[#D8E0EE] text-[#737686]'}`}>
                      Menunggu hasil rekomendasi...
                    </div>
                  )}
                  {!loading && insight.next_steps.length === 0 && (
                    <div className={`rounded-2xl border border-dashed p-4 text-sm ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-[#D8E0EE] text-[#737686]'}`}>
                      Belum ada next step yang bisa ditampilkan.
                    </div>
                  )}
                  {insight.next_steps.map((step, index) => (
                    <div key={step} className={`flex gap-4 rounded-2xl p-4 ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <p className={`text-sm leading-6 ${isDarkMode ? 'text-gray-300' : 'text-[#434655]'}`}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {!loading && error && (
                <section className={`rounded-3xl border p-5 ${isDarkMode ? 'border-red-500/20 bg-red-500/10 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
                  <div className="flex items-start gap-3">
                    <TriangleAlert size={18} className="mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-bold">{renderErrorMessage()}</p>
                      <p className="text-sm opacity-90">
                        Kamu bisa refresh setelah menambah activity done baru atau setelah Groq kembali normal.
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerAnalysis
