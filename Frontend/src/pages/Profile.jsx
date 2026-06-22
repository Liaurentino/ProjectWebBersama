import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/userService';
import Streak from '../assets/ProfilePage/Streak.png';
import AddPicture from '../assets/ProfilePage/AddPicture.png';
import Danger from '../assets/ProfilePage/Danger.png';
import Focus from '../assets/ProfilePage/FocusHour.png';
import Account from '../assets/ProfilePage/Account.png';
import Tasks from '../assets/ProfilePage/TaskCompleted.png';
import ChangePass from '../assets/ProfilePage/ChangePass.png';
import Edit from '../assets/ProfilePage/Edit.png';
import Sync from '../assets/ProfilePage/SyncGoogle.png';
import Chevron from '../assets/SettingsPage/Chevron.png';

const DeleteAccountModal = ({ isOpen, closeModal, onConfirm, isDeleting }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={!isDeleting ? closeModal : undefined} />
      <div className="relative w-full max-w-[400px] bg-white dark:bg-[#1A1C1E] border border-[#edeef0] dark:border-gray-800 rounded-[12px] shadow-2xl p-[25px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-[18px] font-bold text-[#191c1e] dark:text-white leading-[24px]">Delete your account?</h3>
          <p className="text-[14px] text-[#434655] dark:text-gray-400 leading-[20px]">
            All your activities, notes, and analysis history will be permanently deleted. This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-col gap-[8px]">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full bg-[#ba1a1a] hover:bg-[#9d1717] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-[10px] rounded-[8px] transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
          </button>
          <button
            onClick={closeModal}
            disabled={isDeleting}
            className="w-full bg-white dark:bg-[#1A1C1E] border border-[#c3c6d7] dark:border-gray-800 text-[#191C1E] dark:text-white font-bold py-[10px] rounded-[8px] transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
          >
            Cancelled
          </button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, error, clearUser } = useUser();
  const { isDarkMode } = useTheme();

  const [stats, setStats] = useState({ streak: 0, tasksCompleted: 0, focusHours: 0 });
  const [resetStatus, setResetStatus] = useState('idle');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    userService.getDashboard()
      .then(data => setStats({
        streak:         data.summary.streak,
        tasksCompleted: data.summary.tasksCompleted,
        focusHours:     data.summary.focusHours,
      }))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearUser();
    navigate('/login', { replace: true });
  };

  const handleChangePassword = async () => {
    if (resetStatus === 'sending' || resetStatus === 'sent' || !user?.email) return;
    setResetStatus('sending');
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      setResetStatus('sent');
      setTimeout(() => setResetStatus('idle'), 30000);
    } catch {
      setResetStatus('idle');
      alert('Gagal mengirim email reset password. Silakan coba lagi.');
    }
  };

  const handleConfirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await userService.deleteAccount();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      clearUser();
      navigate('/login', { replace: true });
    } catch (err) {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      alert(err.message || 'Gagal menghapus akun. Silakan coba lagi.');
    }
  };

  const icons = {
    streak:        Streak,
    tasks:         Tasks,
    hours:         Focus,
    settingsHeader: AddPicture,
    Account:       Account,
    password:      ChangePass,
    chevronRight:  Chevron,
    google:        Sync,
    dangerHeader:  Danger,
    editIcon:      Edit,
  };

  if (loading) return <div className="p-8 text-center text-[#434655] dark:text-gray-400">Loading profile...</div>;
  if (error)   return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!user)   return null;

  const interests = Array.isArray(user.interests) ? user.interests.join(', ') : user.interests;

  return (
    <div className="max-w-[1152px] mx-auto p-8 space-y-10 transition-colors duration-300">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-[#191C1E] dark:text-white tracking-tight">Your Profile</h1>
        <p className="text-[#434655] dark:text-gray-400">Manage your account and view your productivity journey</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#1A1C1E] p-8 rounded-xl shadow-sm border border-[#C3C6D7]/30 dark:border-gray-800 relative overflow-hidden space-y-8 transition-colors">
        <div className="absolute top-[-64px] right-[-64px] w-32 h-32 bg-[#004AC6]/5 rounded-full" />
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-40 h-40 rounded-3xl overflow-hidden shadow-lg border-4 border-[#F3F4F6] dark:border-gray-800">
              <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => navigate('/profile/edit-profile')}
              className="absolute -bottom-2 -right-2 bg-[#004AC6] p-2 rounded-xl text-white shadow-lg hover:bg-[#003da3] transition flex items-center justify-center"
            >
              <img src={icons.settingsHeader} alt="Edit" className="w-3 h-3 brightness-0 invert" />
            </button>
          </div>
          <div className="flex-1 pt-2 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#191C1E] dark:text-white">{user.name}</h2>
                <p className="text-[#434655] dark:text-gray-400 font-medium">{user.email}</p>
              </div>
              <button
                onClick={() => navigate('/profile/edit-profile')}
                className="bg-[#004AC6] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#003da3] transition shadow-md"
              >
                <img src={icons.editIcon} alt="" className="w-3 h-3 brightness-0 invert"/>
                Edit Profile
              </button>
            </div>
            {user.bio && (
              <p className="text-[#434655] dark:text-gray-300 font-medium italic">"{user.bio}"</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#F3F4F6] dark:bg-[#2A2D31] border border-[#C3C6D7]/30 dark:border-gray-700 p-4 rounded-xl transition-colors">
            <p className="text-[10px] font-bold text-[#434655] dark:text-gray-400 tracking-widest uppercase mb-1">Study Program</p>
            <p className="text-[#191C1E] dark:text-white font-semibold">{user.jurusan || '-'}</p>
          </div>
          <div className="bg-[#F3F4F6] dark:bg-[#2A2D31] border border-[#C3C6D7]/30 dark:border-gray-700 p-4 rounded-xl transition-colors">
            <p className="text-[10px] font-bold text-[#434655] dark:text-gray-400 tracking-widest uppercase mb-1">Current Semester</p>
            <p className="text-[#191C1E] dark:text-white font-semibold">{user.semester ? `${user.semester}th Semester` : '-'}</p>
          </div>
          <div className="bg-[#F3F4F6] dark:bg-[#2A2D31] border border-[#C3C6D7]/30 dark:border-gray-700 p-4 rounded-xl transition-colors">
            <p className="text-[10px] font-bold text-[#434655] dark:text-gray-400 tracking-widest uppercase mb-1">Primary Interest</p>
            <p className="text-[#191C1E] dark:text-white font-semibold">{interests || '-'}</p>
          </div>
        </div>
      </div>

      {/* Productivity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1A1C1E] border-l-4 border-[#004AC6] p-6 rounded-xl shadow-sm space-y-4 transition-colors">
          <div className="flex justify-between items-start">
            <div className="w-8 h-9 relative">
              <img src={icons.streak} alt="Streak" className="w-full h-full object-contain" />
            </div>
            <span className="bg-[#004AC6]/10 text-[#004AC6] text-[10px] font-bold px-2 py-1 rounded-full">
              {stats.streak > 0 ? 'Keep it up!' : 'Start today!'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#434655] dark:text-gray-400">Productivity Streak</p>
            <h3 className="text-3xl font-extrabold text-[#191C1E] dark:text-white">{stats.streak} Days</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1C1E] border-l-4 border-[#943700] p-6 rounded-xl shadow-sm space-y-4 transition-colors">
          <div className="flex justify-between items-start">
            <div className="w-9 h-8 relative">
              <img src={icons.tasks} alt="Tasks" className="w-full h-full object-contain dark:invert" />
            </div>
            <span className="bg-[#943700]/10 text-[#943700] text-[10px] font-bold px-2 py-1 rounded-full">All Time</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#434655] dark:text-gray-400">Tasks Completed</p>
            <h3 className="text-3xl font-extrabold text-[#191C1E] dark:text-white">{stats.tasksCompleted} Tasks</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1C1E] border-l-4 border-[#616363] p-6 rounded-xl shadow-sm space-y-4 transition-colors">
          <div className="flex justify-between items-start">
            <div className="w-8 h-9 relative">
              <img src={icons.hours} alt="Hours" className="w-full h-full object-contain dark:invert" />
            </div>
            <span className="bg-[#616363]/10 text-[#616363] text-[10px] font-bold px-2 py-1 rounded-full">All Time</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#434655] dark:text-gray-400">Focus Hours</p>
            <h3 className="text-3xl font-extrabold text-[#191C1E] dark:text-white">{stats.focusHours} Hours</h3>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7]/30 dark:border-gray-800 p-6 rounded-xl shadow-sm space-y-6 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-8 relative">
            <img src={icons.Account} alt="" className="w-full h-full object-contain dark:invert" />
          </div>
          <h3 className="text-lg font-semibold text-[#191C1E] dark:text-white">Account Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleChangePassword}
            disabled={resetStatus !== 'idle'}
            className={`flex items-center justify-between p-4 border rounded-lg transition-colors group ${
              resetStatus === 'sent'
                ? 'border-green-300 bg-green-50 dark:bg-green-900/10 cursor-not-allowed'
                : resetStatus === 'sending'
                ? 'border-[#C3C6D7] dark:border-gray-700 opacity-60 cursor-wait'
                : 'border-[#C3C6D7] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-4 h-5 relative">
                <img src={icons.password} alt="" className="w-full h-full object-contain dark:invert" />
              </div>
              <span className="font-semibold text-[#191C1E] dark:text-white">
                {resetStatus === 'sent' ? 'Email Terkirim' : resetStatus === 'sending' ? 'Mengirim...' : 'Change Password'}
              </span>
            </div>
            {resetStatus === 'idle' && (
              <img src={icons.chevronRight} alt="" className="w-2 h-3 dark:invert opacity-50 group-hover:opacity-100" />
            )}
          </button>
          <button className="flex items-center justify-between p-4 border border-[#C3C6D7] dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-5 h-2.5 relative">
                <img src={icons.google} alt="" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-[#191C1E] dark:text-white">Connected Account: Google</span>
            </div>
            <img src={icons.chevronRight} alt="" className="w-2 h-3 dark:invert opacity-50 group-hover:opacity-100" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#BA1A1A]/5 dark:bg-[#BA1A1A]/10 border-2 border-[#BA1A1A]/20 p-6 rounded-xl space-y-6 transition-colors">
        <div className="flex items-center gap-3 text-[#BA1A1A]">
          <div className="w-9 h-8 relative">
            <img src={icons.dangerHeader} alt="" className="w-full h-full object-contain" />
          </div>
          <h3 className="text-lg font-semibold">Dangerous</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleLogout}
            className="border-2 border-[#BA1A1A] text-[#BA1A1A] py-3 rounded-lg font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Log Out of This Session
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-[#BA1A1A] text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Permanently Delete Account
          </button>
        </div>
        <p className="text-center text-[11px] text-[#BA1A1A]/70">
          The act of deleting an account cannot be undone.
        </p>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteAccount}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Profile;