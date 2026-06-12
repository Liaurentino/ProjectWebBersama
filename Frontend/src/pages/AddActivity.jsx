import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddActivity = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 text-blue-600 font-semibold flex items-center gap-2"
      >
        ← Kembali
      </button>
      <h1 className="text-2xl font-bold">Tambah Aktivitas Baru</h1>
      <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm max-w-2xl">
        <p className="text-gray-500">[Form Tambah Aktivitas Akan Muncul Di Sini]</p>
      </div>
    </div>
  );
};

export default AddActivity;