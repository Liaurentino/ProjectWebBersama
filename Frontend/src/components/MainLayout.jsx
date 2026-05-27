import { Link, useNavigate, Outlet } from 'react-router-dom';

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar Navigasi Sistem */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shadow-xl">
        <div>
          <div className="mb-8 px-2">
            <h2 className="text-2xl font-black text-blue-400 tracking-tight">Prodactivity</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Platform Ekosistem Mahasiswa</p>
          </div>
          
          <nav className="space-y-2">
            <Link to="/dashboard" className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition">
              Dashboard
            </Link>
            <Link to="/roadmap" className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition">
              Profiling & Roadmap
            </Link>
            <Link to="/chat" className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition">
              AI Chatbot
            </Link>
            <Link to="/career-analysis" className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition">
              Analisis Karir
            </Link>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
        >
          Keluar Aplikasi
        </button>
      </aside>

      {/* Konten Utama Aplikasi */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;