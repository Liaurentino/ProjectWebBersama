import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/userService';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, error } = useUser();
  const { isDarkMode } = useTheme();

  const [stats, setStats] = useState({ streak: 0, tasksCompleted: 0, focusHours: 0 });

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
  navigate('/login', { replace: true });
};


  const icons = {
    streak:        "https://www.figma.com/api/mcp/asset/dd62831e-2200-4340-aafa-e6309d26cef6",
    tasks:         "https://www.figma.com/api/mcp/asset/d1a00075-6b0a-46c9-92f5-d5205afa60a6",
    hours:         "https://www.figma.com/api/mcp/asset/b0d8438e-f843-4898-91c0-dec95204fcfd",
    settingsHeader:"https://www.figma.com/api/mcp/asset/7c4ba02d-3b5d-4f89-a525-77c7c03fca1c",
    password:      "https://www.figma.com/api/mcp/asset/98130817-9ad0-4702-ad94-c41f870c5096",
    chevronRight:  "https://www.figma.com/api/mcp/asset/96827b54-1850-4406-9ea5-c154fc1bb9e4",
    google:        "https://www.figma.com/api/mcp/asset/b1e40658-1765-4000-b315-9e24d608457d",
    dangerHeader:  "https://www.figma.com/api/mcp/asset/e5e85d3f-1e08-4d2a-ab37-bc61117f7e27",
    editIcon:      "https://www.figma.com/api/mcp/asset/85970a89-78ec-44e1-88d3-51deb49e33b8",
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
              <img src={icons.editIcon} alt="Edit" className="w-3 h-3" />
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
                <img src={icons.editIcon} alt="" className="w-3 h-3 invert"/>
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
            <img src={icons.settingsHeader} alt="" className="w-full h-full object-contain dark:invert" />
          </div>
          <h3 className="text-lg font-semibold text-[#191C1E] dark:text-white">Account Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/reset-password')}
            className="flex items-center justify-between p-4 border border-[#C3C6D7] dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-4 h-5 relative">
                <img src={icons.password} alt="" className="w-full h-full object-contain dark:invert" />
              </div>
              <span className="font-semibold text-[#191C1E] dark:text-white">Change Password</span>
            </div>
            <img src={icons.chevronRight} alt="" className="w-2 h-3 dark:invert opacity-50 group-hover:opacity-100" />
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
            className="border-2 border-[#BA1A1A] text-[#BA1A1A] py-3 rounded-lg font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            Log Out of This Session
          </button>
          <button className="bg-[#BA1A1A] text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
            Permanently Delete Account
          </button>
        </div>
        <p className="text-center text-[11px] text-[#BA1A1A]/70">
          The act of deleting an account cannot be undone.
        </p>
      </div>
    </div>
  );
};

export default Profile;