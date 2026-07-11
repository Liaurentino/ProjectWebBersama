import { useCallback, useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getCareerInsight } from '../../services/AIservice';
import { X, ChartColumnStacked, Sparkles, Loader2, TriangleAlert, RefreshCw } from 'lucide-react';

const emptyInsight = {
  prediksi_karir: '',
  alasan: '',
  skills_to_develop: [],
  next_steps: [],
  career_options: [],
};

const CareerAnalysisModal = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusCode, setStatusCode] = useState(null);
  const [insight, setInsight] = useState(emptyInsight);

  const fetchInsight = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    setStatusCode(null);

    try {
      const data = await getCareerInsight({ includeActivities: true }, { signal });
      setInsight({
        prediksi_karir: data.prediksi_karir || '',
        alasan: data.alasan || '',
        skills_to_develop: Array.isArray(data.skills_to_develop) ? data.skills_to_develop : [],
        next_steps: Array.isArray(data.next_steps) ? data.next_steps : [],
        career_options: Array.isArray(data.career_options) ? data.career_options : [],
      });
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setInsight(emptyInsight);
      setError(err.message || 'Gagal memuat career insight');
      setStatusCode(err.status || null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetchInsight(controller.signal);
    }, 0);

    document.body.style.overflow = 'hidden';

    return () => {
      controller.abort();
      window.clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, fetchInsight]);

  if (!isOpen) return null;

  const renderMessage = () => {
    if (statusCode === 400) return 'Data belum cukup. Tambahkan activity berstatus Done agar analisis karir bisa dibuat.';
    if (statusCode === 503) return 'AI Engine sedang sibuk. Coba lagi sebentar ya.';
    return error;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div
        className={`relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[16px] shadow-2xl transition-all transform animate-in fade-in zoom-in duration-300 ${
          isDarkMode ? 'bg-[#1A1C1E] text-white border border-gray-800' : 'bg-white text-[#191c1e]'
        }`}
      >
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${isDarkMode ? 'bg-[#1A1C1E] border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="text-blue-600">
              <ChartColumnStacked size={24} />
            </div>
            <h3 className="text-lg font-bold">Your Career Insight</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section className="space-y-4">
            <h4 className={`text-[10px] font-bold uppercase tracking-[1.5px] ${isDarkMode ? 'text-gray-500' : 'text-[#737686]'}`}>
              Potential Career Direction for You
            </h4>

            <div className="min-h-[120px] space-y-4">
              {loading ? (
                <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-blue-200/40">
                  <div className="flex items-center gap-3 text-sm font-medium text-blue-600">
                    <Loader2 size={18} className="animate-spin" />
                    AI sedang menganalisis data...
                  </div>
                </div>
              ) : insight.prediksi_karir ? (
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
                            ? (isDarkMode ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20' : 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20')
                            : (isDarkMode ? 'bg-[#A0A0A0] text-white border-[#A0A0A0]' : 'bg-[#B0B0B0] text-white border-[#B0B0B0]')
                        }`}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isPrimary ? 'bg-white/15' : 'bg-white/15'} text-sm font-black`}>
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
              ) : (
                <div className={`rounded-xl border border-dashed p-4 text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-[#737686]'}`}>
                  {renderMessage() || 'Belum ada hasil analisis.'}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h4 className={`text-[10px] font-bold uppercase tracking-[1.5px] ${isDarkMode ? 'text-gray-500' : 'text-[#737686]'}`}>
              Skills That Need Development
            </h4>
            <div className="space-y-4">
              {loading ? (
                <div className={`rounded-xl border border-dashed p-4 text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-[#737686]'}`}>
                  Menunggu daftar skill...
                </div>
              ) : insight.skills_to_develop.length > 0 ? (
                insight.skills_to_develop.map((skill) => (
                  <div key={skill} className="flex gap-4">
                    <div className="mt-1 text-blue-600 shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{skill}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`rounded-xl border border-dashed p-4 text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-[#737686]'}`}>
                  Belum ada rekomendasi skill.
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h4 className={`text-[10px] font-bold uppercase tracking-[1.5px] ${isDarkMode ? 'text-gray-500' : 'text-[#737686]'}`}>
              The Next Step
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {loading ? (
                <div className={`rounded-xl border border-dashed p-4 text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-[#737686]'}`}>
                  Menunggu next step...
                </div>
              ) : insight.next_steps.length > 0 ? (
                insight.next_steps.map((step, index) => (
                  <div key={`${step}-${index}`} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Step {index + 1}</p>
                    <p className="text-sm font-medium">{step}</p>
                  </div>
                ))
              ) : (
                <div className={`rounded-xl border border-dashed p-4 text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-[#737686]'}`}>
                  Belum ada next step.
                </div>
              )}
            </div>
          </section>

          {!loading && error && (
            <section className={`rounded-xl border p-4 ${isDarkMode ? 'border-red-500/20 bg-red-500/10 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
              <div className="flex items-start gap-3">
                <TriangleAlert size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">{renderMessage()}</p>
                </div>
              </div>
            </section>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={onClose}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
            <button
              onClick={() => fetchInsight()}
              disabled={loading}
              className="bg-[#004ac6] text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#003da3] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Refresh Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerAnalysisModal;
