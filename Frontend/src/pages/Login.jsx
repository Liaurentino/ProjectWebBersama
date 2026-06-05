import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Email dan Password wajib diisi!');
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || 'Login gagal');
      }

      // Simpan token dan data user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-slate-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-slate-800">Masuk Akun</h2>
          <p className="text-slate-500 mt-2 text-sm">Silakan login untuk mengakses platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Lupa password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Login Sekarang'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;