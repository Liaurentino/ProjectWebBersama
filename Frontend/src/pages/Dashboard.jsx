import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { userService } from '../services/userService';
import TotalAct from '../assets/DashboardPage/TotalActivity.png';
import Prodtime from '../assets/DashboardPage/Productive.png';
import Streak from '../assets/DashboardPage/Streak.png';
import Image from '../assets/DashboardPage/ImageMotive.png';
import WeeklyBarChart from '../components/statistics/WeeklyBarChart';

const imgAct = TotalAct;
const imgProd = Prodtime;
const imgStreak = Streak;
const imgImage = Image;

const StatCard = ({ title, value, subtext, icon, trend }) => (
  <div className="bg-white dark:bg-[#1A1C1E] border border-[#E7E8EA] dark:border-gray-800 p-[21px] rounded-[12px] shadow-[0px_4px_6px_rgba(17,24,39,0.05)] flex flex-col gap-1 transition-colors">
    <div className="flex justify-between items-start">
      <div className="w-[32px] h-[32px] flex items-center justify-center">
        <img src={icon} alt="" className="w-full h-full object-contain aspect-square dark:brightness-200" />
      </div>
      {trend && <span className="text-[#16A34A] text-[12px] font-bold">{trend}</span>}
      {subtext && !trend && <span className="text-[#434655] dark:text-gray-400 text-[12px] font-bold">{subtext}</span>}
    </div>
    <div className="pt-3">
      <p className="text-[#434655] dark:text-gray-400 text-sm">{title}</p>
      <h3 className="text-[#191C1E] dark:text-white text-[30px] font-bold leading-tight mt-1">{value}</h3>
    </div>
  </div>
);

const TimelineItem = ({ time, title, location, status }) => {
  const statusStyles = {
    COMPLETED: 'bg-[#DCFCE7] text-[#15803D] dark:bg-green-900/20 dark:text-green-400',
    UPCOMING:  'bg-[#2563EB] text-[#EEEFFF]',
    SCHEDULED: 'bg-[#E7E8EA] text-[#434655] dark:bg-gray-800 dark:text-gray-400',
  };
  const dotStyles = {
    COMPLETED: 'bg-[#004AC6]',
    UPCOMING:  'bg-[#E1E2E4] dark:bg-gray-700 border-2 border-[#004AC6]',
    SCHEDULED: 'bg-[#E1E2E4] dark:bg-gray-700 border-2 border-[#E7E8EA] dark:border-gray-600',
  };

  return (
    <div className="flex gap-8 relative pl-12 pb-8 last:pb-0">
      <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-[#E7E8EA] dark:bg-gray-800" />
      <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center z-10 ${dotStyles[status]}`}>
        {status === 'COMPLETED' ? (
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : status === 'UPCOMING' ? (
          <div className="w-4 h-1 bg-[#004AC6] rounded-full" />
        ) : (
          <div className="w-2 h-3 bg-gray-400 rounded-sm" />
        )}
      </div>
      <div className={`flex-1 p-4 rounded-xl border border-[#E7E8EA] dark:border-gray-800 transition-colors ${
        status === 'SCHEDULED' ? 'bg-[#F8F9FB] dark:bg-[#121212] opacity-60' : 'bg-white dark:bg-[#1A1C1E]'
      } ${status === 'UPCOMING' ? 'ring-2 ring-[#2563EB] ring-offset-2 dark:ring-offset-[#121212]' : ''}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-[12px] font-semibold tracking-wider uppercase ${status === 'UPCOMING' ? 'text-[#004AC6]' : 'text-gray-500 dark:text-gray-400'}`}>{time}</p>
            <h4 className="text-[#191C1E] dark:text-white font-bold text-base mt-1">{title}</h4>
            <p className="text-[#434655] dark:text-gray-400 text-sm mt-1">{location}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useUser();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await userService.getDashboard();
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-[#434655] dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || 'Something went wrong.'}</p>
      </div>
    );
  }

  const { summary, timeline, weeklyData, categoryData } = data;

  const circumference = 251.2;
  let offset = 0;
  const donutSegments = categoryData.map(cat => {
    const dash = (cat.value / 100) * circumference;
    const segment = { ...cat, dash, offset };
    offset += dash;
    return segment;
  });

  return (
    <div className="p-8 flex justify-start">
      <div className="w-full max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-bold text-[#191C1E] dark:text-white tracking-tight transition-colors">
              Welcome, {user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-[#434655] dark:text-gray-400 mt-1 text-base transition-colors">
              {today} • Keep up the momentum!
            </p>
          </div>
          <Link
            to="/activity"
            className="bg-[#004AC6] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#003da3] transition shadow-sm self-start md:self-auto"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add activity
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total activities for today"
            value={String(summary.totalToday)}
            icon={imgAct}
          />
          <StatCard
            title="Productive time"
            value={summary.productiveTime}
            icon={imgProd}
          />
          <StatCard
            title="Streak productive days"
            value={`${summary.streak} days`}
            subtext={summary.streak > 0 ? 'Keep it up!' : 'Start today!'}
            icon={imgStreak}
          />
          <div className="bg-white dark:bg-[#1A1C1E] border border-[#E7E8EA] dark:border-gray-800 p-[21px] rounded-[12px] shadow-[0px_4px_6px_rgba(17,24,39,0.05)] flex items-center gap-4 transition-colors">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#F3F4F6" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#2563EB" strokeWidth="4"
                  strokeDasharray={`${summary.targetCompletion}, 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#191C1E] dark:text-white text-xs font-bold">{summary.targetCompletion}%</span>
              </div>
            </div>
            <div>
              <p className="text-[#434655] dark:text-gray-400 text-sm leading-tight">Target<br />completion</p>
              <h3 className="text-[#191C1E] dark:text-white text-xl font-bold mt-0.5">
                {summary.targetCompletion >= 100 ? 'Done!' : summary.targetCompletion >= 50 ? 'On Track' : 'Keep Going'}
              </h3>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-[#1A1C1E] border border-[#E7E8EA] dark:border-gray-800 p-6 rounded-2xl shadow-[0px_4px_6px_rgba(17,24,39,0.05)] transition-colors">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  <h2 className="text-lg font-bold text-[#191C1E] dark:text-white">Journey Timeline</h2>
                </div>
                <Link to="/activity" className="text-[#004AC6] text-sm font-semibold hover:underline">See all</Link>
              </div>
              {timeline.length === 0 ? (
                <p className="text-center text-[#434655] dark:text-gray-400 py-8">No activities today. Start by adding one!</p>
              ) : (
                <div className="space-y-0">
                  {timeline.map(item => (
                    <TimelineItem key={item.id} {...item} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
<div className="space-y-8">
  {/* Mini Statistics */}
  <div className="bg-white dark:bg-[#1A1C1E] border border-[#E7E8EA] dark:border-gray-800 p-6 rounded-2xl shadow-[0px_4px_6px_rgba(17,24,39,0.05)] transition-colors overflow-hidden">
    <div className="flex items-center gap-2 mb-4">
      <svg className="w-4 h-4 text-blue-600" viewBox="0 0 0 0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
      <h2 className="text-lg font-bold text-[#191C1E] dark:text-white">Mini Statistics</h2>
    </div>

    <div className="space-y-6">
      {/* Weekly Bar */}
      <div className="h-[450px]">
        <WeeklyBarChart
          title="Today's Progress"
          subtitle=""
          data={weeklyData}
        />
      </div>

      {/* Category Donut */}
      <div className="pt-4 border-t border-[#EDEEF0] dark:border-gray-800">
        <p className="text-sm font-semibold text-[#434655] dark:text-gray-400 mb-4">Category Distribution</p>
        {categoryData.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No data yet</p>
        ) : (
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 relative shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {donutSegments.map((seg, i) => (
                  <circle key={i}
                    cx="50" cy="50" r="40"
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth="20"
                    strokeDasharray={`${seg.dash} ${circumference}`}
                    strokeDashoffset={-seg.offset}
                  />
                ))}
              </svg>
            </div>
            <div className="space-y-1.5">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-[12px] font-medium text-[#191C1E] dark:text-white">
                    {cat.name} ({cat.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

            {/* Motivation Card */}
            <div className="bg-[#004AC6] p-8 rounded-2xl relative overflow-hidden shadow-lg group">
              <div className="absolute inset-0 opacity-100 pointer-events-none mix-blend-overlay">
                <img src={imgImage} alt="" className="w-full h-full object-cover scale-150 group-hover:scale-125 transition-transform duration-1000" />
              </div>
              <div className="relative z-10 space-y-4">
                <svg className="w-6 h-6 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.154c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                <blockquote className="text-white text-xl font-bold italic leading-relaxed">
                  "Focus on being productive instead of busy."
                </blockquote>
                <p className="text-white text-[12px] font-bold tracking-[1.2px] opacity-80 uppercase">— TIM FERRISS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;