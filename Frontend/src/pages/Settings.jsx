import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import Apperance from '../assets/SettingsPage/Apperance.png';
import Account from '../assets/SettingsPage/Account.png';
import AiAssist from '../assets/SettingsPage/AiAssist.png';
import Danger from '../assets/SettingsPage/Dangerous.png';
import Notif from '../assets/SettingsPage/Notification.png';
import Changeps from '../assets/SettingsPage/ChangePass.png';
import Google from '../assets/SettingsPage/SyncGoogle.png';
import Save from '../assets/SettingsPage/Save.png';

const Settings = () => {
  const { isDarkMode, toggleDarkMode, saveTheme, revertTheme } = useTheme();
  const navigate = useNavigate();

  const hasSavedRef = useRef(false);
  const [settings, setSettings] = useState({
    emailNotification: true,
    activityReminders: true,
    allowAiAnalyze: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    return () => {
      // Revert if leaving without saving
      if (!hasSavedRef.current) {
        revertTheme();
      }
    };
  }, [revertTheme]);

  const icons = {
    appearance: Apperance,
    notifications: Notif,
    ai: AiAssist,
    account: Account,
    danger: Danger,
    save: Save,
    password: Changeps,
    chevronRight: "https://www.figma.com/api/mcp/asset/613c6b9d-717a-4415-8dbb-05f441b1fe71",
    google: Google,
  };
  
  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/login', { replace: true });
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await userService.getSettings();
        setSettings(data);
      } catch (err) {
        setError('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      await userService.updateSettings(settings);
      // Persist the current isDarkMode to localStorage
      saveTheme(isDarkMode);
      hasSavedRef.current = true;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1024px] mx-auto p-12 flex items-center justify-center min-h-[400px]">
        <p className="text-[#434655] dark:text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1024px] mx-auto p-12 space-y-10 transition-colors duration-300">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#191C1E] dark:text-white tracking-tight">Arrangement</h1>
          <p className="text-[#434655] dark:text-gray-400">Manage your account preferences and app experience.</p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-sm text-green-600 font-medium">Saved!</span>
          )}
          {error && (
            <span className="text-sm text-red-500">{error}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#004AC6] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-[#003da3] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src={icons.save} alt="" className="w-4 h-4 brightness-0 invert" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-6 pb-20">
        {/* 1. Appearance Section */}
        <section className="bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7]/30 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative flex items-center justify-center transition-colors">
              <img src={icons.appearance} alt="" className="w-full h-full object-contain dark:invert" />
            </div>
            <h2 className="text-base font-semibold text-[#191C1E] dark:text-white">Appearance</h2>
          </div>
          <div className="bg-[#F3F4F6] dark:bg-[#2A2D31] p-4 rounded-xl flex items-center justify-between transition-colors">
            <div>
              <p className="text-base font-medium text-[#191C1E] dark:text-white">Application Theme</p>
              <p className="text-sm text-[#434655] dark:text-gray-400">Choose between light or dark mode as per your eye comfort.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#434655] dark:text-gray-400">Bright</span>
              <button
                onClick={toggleDarkMode}
                className={`w-11 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-[#004AC6]' : 'bg-[#C3C6D7]'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'left-6' : 'left-1'}`} />
              </button>
              <span className="text-sm text-[#434655] dark:text-gray-400">It's dark</span>
            </div>
          </div>
        </section>

        {/* 2. Notifications Section */}
        <section className="bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7]/30 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative flex items-center justify-center">
              <img src={icons.notifications} alt="" className="w-full h-full object-contain dark:invert" />
            </div>
            <h2 className="text-base font-semibold text-[#191C1E] dark:text-white">Notifications</h2>
          </div>
          <div className="space-y-3">
            <div className="border border-[#C3C6D7]/20 dark:border-gray-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-[#191C1E] dark:text-white">Email Notification</p>
                <p className="text-sm text-[#434655] dark:text-gray-400">Receive weekly reports and important updates via email.</p>
              </div>
              <button
                onClick={() => toggleSetting('emailNotification')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.emailNotification ? 'bg-[#004AC6]' : 'bg-[#C3C6D7]'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.emailNotification ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <div className="border border-[#C3C6D7]/20 dark:border-gray-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-[#191C1E] dark:text-white">Activity Reminders</p>
                <p className="text-sm text-[#434655] dark:text-gray-400">Get reminders to fill out your daily activity log.</p>
              </div>
              <button
                onClick={() => toggleSetting('activityReminders')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.activityReminders ? 'bg-[#004AC6]' : 'bg-[#C3C6D7]'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.activityReminders ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* 3. AI Personalization Section */}
        <section className="bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7]/30 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative flex items-center justify-center">
              <img src={icons.ai} alt="" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-base font-semibold text-[#191C1E] dark:text-white">AI personalization</h2>
          </div>
          <div className="bg-[#2563EB]/5 dark:bg-[#2563EB]/10 border border-[#004AC6]/20 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-[#191C1E] dark:text-white">Allow AI to Analyze</p>
              <p className="text-sm text-[#434655] dark:text-gray-400">AI will analyze your activity patterns to provide more accurate productivity suggestions.</p>
            </div>
            <button
              onClick={() => toggleSetting('allowAiAnalyze')}
              className={`w-11 h-6 rounded-full transition-colors relative ${settings.allowAiAnalyze ? 'bg-[#004AC6]' : 'bg-[#C3C6D7]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.allowAiAnalyze ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </section>

        {/* 4. Account Settings Section */}
        <section className="bg-white dark:bg-[#1A1C1E] border border-[#C3C6D7]/30 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-8 relative flex items-center justify-center">
              <img src={icons.account} alt="" className="w-full h-full object-contain dark:invert" />
            </div>
            <h2 className="text-base font-semibold text-[#191C1E] dark:text-white">Account Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-between p-4 border border-[#C3C6D7] dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
              <div className="flex items-center gap-3">
                <img src={icons.password} alt="" className="w-4 h-5 dark:invert opacity-70" />
                <span className="font-semibold text-[#191C1E] dark:text-white">Change Password</span>
              </div>
              <img src={icons.chevronRight} alt="" className="w-2 h-3 opacity-50 group-hover:opacity-100 dark:invert" />
            </button>
            <button className="flex items-center justify-between p-4 border border-[#C3C6D7] dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
              <div className="flex items-center gap-3">
                <img src={icons.google} alt="" className="w-5 h-2.5" />
                <span className="font-semibold text-[#191C1E] dark:text-white">Connected Account: Google</span>
              </div>
              <img src={icons.chevronRight} alt="" className="w-2 h-3 opacity-50 group-hover:opacity-100 dark:invert" />
            </button>
          </div>
        </section>

        {/* Danger Zone Section */}
        <section className="bg-[#BA1A1A]/5 dark:bg-[#BA1A1A]/10 border-2 border-[#BA1A1A]/20 p-6 rounded-xl space-y-6">
          <div className="flex items-center gap-3 text-[#BA1A1A]">
            <div className="w-9 h-9 relative flex items-center justify-center">
              <img src={icons.danger} alt="" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-base font-semibold">Dangerous</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
             onClick={handleLogout}
             className="border-2 border-[#BA1A1A] text-[#BA1A1A] py-3 rounded-lg font-bold hover:bg-[#BA1A1A]/10 transition-colors">
              Log Out of This Session
            </button>
            <button className="bg-[#BA1A1A] text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
              Permanently Delete Account
            </button>
          </div>
          <p className="text-center text-[11px] text-[#BA1A1A]/70">
            The act of deleting an account cannot be undone.
          </p>
        </section>

        <p className="text-center text-sm text-[#434655]/50 dark:text-gray-500 pt-8">
          Produktif v2.4.1 — Precision Tech System
        </p>
      </div>
    </div>
  );
};

export default Settings;