import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    // Validasi form kosong
    if (!email || !password || !confirmPassword) {
      return setError('Semua kolom wajib diisi!');
    }

    // Validasi format email menggunakan Regex sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError('Format email tidak valid.');
    }

    // Validasi panjang password
    if (password.length < 6) {
      return setError('Password minimal harus terdiri dari 6 karakter.');
    }

    // Validasi kecocokan password
    if (password !== confirmPassword) {
      return setError('Password dan Konfirmasi Password tidak cocok!');
    }

    // Simulasi proses penyimpanan data ke database
    // Pada implementasi riil, di sinilah Axios/Fetch API dipanggil
    alert('Registrasi berhasil! Akun Anda telah dibuat. Silakan login.');
    
    // Setelah sukses mendaftar, kembalikan user ke halaman Login
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-slate-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-slate-800">Daftar Akun Baru</h2>
          <p className="text-slate-500 mt-2 text-sm">Bergabunglah dengan platform Prodactivity</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-700">Email Valid</label>
            <input 
              type="text" 
              placeholder="mahasiswa@upnvj.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-700">Password</label>
            <input 
              type="password" 
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-700">Konfirmasi Password</label>
            <input 
              type="password" 
              placeholder="Ketik ulang password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 mt-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all"
          >
            Buat Akun
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Sudah memiliki akun? <Link to="/login" className="font-bold text-green-600 hover:underline">Login di sini</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;