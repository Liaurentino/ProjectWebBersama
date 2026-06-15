import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAll } from '../services/searchService';

const STATUS_STYLE = {
  DONE:        'bg-[#DCFCE7] text-[#15803D]',
  IN_PROGRESS: 'bg-[#FEF9C3] text-[#A16207]',
  TODO:        'bg-[#E7E8EA] text-[#434655]',
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');

  const [results, setResults]   = useState({ activities: [], notes: [] });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    searchAll(query)
      .then(setResults)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [query]);

  const { activities, notes } = results;
  const hasResults = activities.length > 0 || notes.length > 0;

  const showActivities = (activeTab === 'all' || activeTab === 'activity') && activities.length > 0;
  const showNotes      = (activeTab === 'all' || activeTab === 'notes')    && notes.length > 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-6">
        <div>
          <h1 className="text-[30px] font-bold text-[#191C1E] tracking-tight">Search Results</h1>
          <p className="text-[#434655] mt-1 text-base">
            Showing results for "<span className="font-bold text-[#004AC6]">{query}</span>"
          </p>
        </div>

        <div className="flex items-center gap-3">
          {[{ id: 'all', label: 'All' }, { id: 'activity', label: 'Activity' }, { id: 'notes', label: 'Notes' }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#004AC6] text-white border-[#004AC6] shadow-md shadow-blue-100'
                  : 'bg-white text-[#434655] border-[#E7E8EA] hover:border-[#004AC6] hover:text-[#004AC6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Mencari...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && !hasResults && (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E7E8EA] rounded-2xl border-dashed">
          <svg className="w-16 h-16 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <p className="text-gray-500 font-medium text-lg">No results found for "{query}"</p>
          <p className="text-gray-400 text-sm mt-1">Try searching with different keywords.</p>
        </div>
      )}

      {!loading && !error && hasResults && (
        <div className="space-y-12">
          {/* Activities */}
          {showActivities && (
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDEEF0] pb-4">
                <h2 className="text-xl font-bold text-[#191C1E] flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#004AC6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                  Activity
                </h2>
                <span className="text-sm font-semibold text-[#434655] bg-gray-100 px-3 py-1 rounded-full">{activities.length} Found</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map(item => (
                  <div key={item.id} className="bg-white border border-[#E7E8EA] p-6 rounded-2xl shadow-[0px_4px_6px_rgba(17,24,39,0.05)] hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-[#004AC6] tracking-widest uppercase">{item.category}</span>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLE[item.status] ?? STATUS_STYLE.TODO}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-[#191C1E] font-bold text-lg mb-2">{item.title}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {item.startedAt
                        ? new Date(item.startedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'No date'}
                    </div>
                    <p className="text-[#434655] text-sm leading-relaxed mb-6 line-clamp-2">{item.description}</p>
                    <Link to={`/activity/${item.id}`} className="text-[#004AC6] text-sm font-bold hover:underline flex items-center gap-1">
                      View Details
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Notes */}
          {showNotes && (
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDEEF0] pb-4">
                <h2 className="text-xl font-bold text-[#191C1E] flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#004AC6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Notes
                </h2>
                <span className="text-sm font-semibold text-[#434655] bg-gray-100 px-3 py-1 rounded-full">{notes.length} Found</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notes.map(note => (
                  <div key={note.id} className="bg-white border border-[#E7E8EA] p-6 rounded-2xl shadow-[0px_4px_6px_rgba(17,24,39,0.05)] hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-[#191C1E] font-bold text-lg">{note.title}</h3>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {new Date(note.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {note.description && (
                      <p className="text-[#434655] text-sm leading-relaxed mb-4 line-clamp-2">{note.description}</p>
                    )}
                    {note.category && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="text-[10px] bg-blue-50 text-[#004AC6] px-2 py-0.5 rounded font-bold uppercase">{note.category}</span>
                      </div>
                    )}
                    <Link to={`/notes`} className="text-[#004AC6] text-sm font-bold hover:underline flex items-center gap-1">
                      Read Note
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;