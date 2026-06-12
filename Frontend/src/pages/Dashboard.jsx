import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, subtext, icon, trend }) => (
  <div className="bg-white border border-[#E7E8EA] p-[21px] rounded-[12px] shadow-[0px_4px_6px_rgba(17,24,39,0.05)] flex flex-col gap-1">
    <div className="flex justify-between items-start">
      <div className="w-[32px] h-[32px] flex items-center justify-center">
        <img src={icon} alt="" className="w-full h-full object-contain aspect-square" />
      </div>
      {trend && (
        <span className="text-[#16A34A] text-[12px] font-bold">{trend}</span>
      )}
      {subtext && !trend && (
        <span className="text-[#434655] text-[12px] font-bold">{subtext}</span>
      )}
    </div>
    <div className="pt-3">
      <p className="text-[#434655] text-sm">{title}</p>
      <h3 className="text-[#191C1E] text-[30px] font-bold leading-tight mt-1">{value}</h3>
    </div>
  </div>
);

const TimelineItem = ({ time, title, location, status, type }) => {
  const statusStyles = {
    COMPLETED: 'bg-[#DCFCE7] text-[#15803D]',
    UPCOMING: 'bg-[#2563EB] text-[#EEEFFF]',
    SCHEDULED: 'bg-[#E7E8EA] text-[#434655]'
  };

  const dotStyles = {
    COMPLETED: 'bg-[#004AC6]',
    UPCOMING: 'bg-[#E1E2E4] border-2 border-[#004AC6]',
    SCHEDULED: 'bg-[#E1E2E4] border-2 border-[#E7E8EA]'
  };

  return (
    <div className="flex gap-8 relative pl-12 pb-8 last:pb-0">
      {/* Vertical line connector */}
      <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-[#E7E8EA] last:hidden" />
      
      {/* Status Dot/Icon */}
      <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center z-10 ${dotStyles[status]}`}>
        {status === 'COMPLETED' ? (
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : status === 'UPCOMING' ? (
          <div className="w-4 h-1 bg-[#004AC6] rounded-full" />
        ) : (
          <div className="w-2 h-3 bg-gray-400 rounded-sm" />
        )}
      </div>

      {/* Content Card */}
      <div className={`flex-1 p-4 rounded-xl border border-[#E7E8EA] ${status === 'SCHEDULED' ? 'bg-[#F8F9FB] opacity-60' : 'bg-white'} ${status === 'UPCOMING' ? 'ring-2 ring-[#2563EB] ring-offset-2' : ''}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-[12px] font-semibold tracking-wider uppercase ${status === 'UPCOMING' ? 'text-[#004AC6]' : 'text-gray-500'}`}>{time}</p>
            <h4 className="text-[#191C1E] font-bold text-base mt-1">{title}</h4>
            <p className="text-[#434655] text-sm mt-1">{location}</p>
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
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Greeting & Action Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-[#191C1E] tracking-tight">Welcome, Alex!</h1>
          <p className="text-[#434655] mt-1 text-base">Senin, 23 Oktober 2023 • Keep up the momentum!</p>
        </div>
        <Link 
          to="/activity/add-activity"
          className="bg-[#004AC6] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#003da3] transition shadow-sm self-start md:self-auto"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add activity
        </Link>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total activities for today" 
          value="5" 
          trend="+2 today" 
          icon="https://www.figma.com/api/mcp/asset/11b16d83-839f-452b-b464-ed7dd364b1e0" 
        />
        <StatCard 
          title="Productive time" 
          value="4.5h" 
          subtext="August: 4.2h" 
          icon="https://www.figma.com/api/mcp/asset/61aa2e40-9072-450b-b03f-fa9edb2154b5" 
        />
        <StatCard 
          title="Streak productive days" 
          value="12 days" 
          subtext="Personal Best!" 
          icon="https://www.figma.com/api/mcp/asset/dec936b9-2d2a-438c-b544-497070c27137" 
        />
        
        {/* Progress Card */}
        <div className="bg-white border border-[#E7E8EA] p-[21px] rounded-[12px] shadow-[0px_4px_6px_rgba(17,24,39,0.05)] flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#F3F4F6" strokeWidth="4"></circle>
              <circle cx="18" cy="18" r="16" fill="none" stroke="#2563EB" strokeWidth="4" strokeDasharray="75, 100" strokeLinecap="round"></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#191C1E] text-xs font-bold">75%</span>
            </div>
          </div>
          <div>
            <p className="text-[#434655] text-sm leading-tight">Target<br />completion</p>
            <h3 className="text-[#191C1E] text-xl font-bold mt-0.5">On Track</h3>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#E7E8EA] p-6 rounded-2xl shadow-[0px_4px_6px_rgba(17,24,39,0.05)]">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <h2 className="text-lg font-bold text-[#191C1E]">Journey Timeline</h2>
              </div>
              <Link to="/activity" className="text-[#004AC6] text-sm font-semibold hover:underline">See all</Link>
            </div>
            
            <div className="space-y-0">
              <TimelineItem 
                time="09:00 - 11:30" 
                title="Data Structure Lectures" 
                location="New Building, Room 402 • Lecturer: Dr." 
                status="COMPLETED" 
              />
              <TimelineItem 
                time="14:00 - 15:30" 
                title="Organizational Meeting" 
                location="1st Floor, Co-working Space • Agenda: Anniversary Event" 
                status="UPCOMING" 
              />
              <TimelineItem 
                time="16:00 - 18:00" 
                title="Independent Study Session" 
                location="Focus Mode: 2 Pomodoros • Topic: Algorithm Analysis" 
                status="SCHEDULED" 
              />
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Motivation */}
        <div className="space-y-8">
          {/* Mini Statistics Card */}
          <div className="bg-white border border-[#E7E8EA] p-6 rounded-2xl shadow-[0px_4px_6px_rgba(17,24,39,0.05)]">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
              <h2 className="text-lg font-bold text-[#191C1E]">Mini Statistics</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-black mb-4">Today's Progress</p>
                {/* Bar Chart Placeholder */}
                <div className="h-40 flex items-end justify-between gap-2 px-2">
                  {[82, 76, 88, 84, 91].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-[#F5F5F5] rounded-t-lg relative group">
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-500 ${i === 4 ? 'bg-[#2563EB]' : 'bg-[#97B6FB]'}`}
                          style={{ height: `${val}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {val}%
                          </span>
                        </div>
                      </div>
                      <span className={`text-[8px] whitespace-nowrap ${i === 4 ? 'font-bold text-black' : 'text-gray-400'}`}>
                        {i === 4 ? 'Today' : `${9+i} June`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#EDEEF0]">
                <p className="text-sm font-semibold text-[#434655] mb-4">Category Distribution</p>
                <div className="flex items-center gap-6">
                  {/* Pie Chart Placeholder */}
                  <div className="w-16 h-16 relative">
                    <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
                      <circle r="16" cx="16" cy="16" fill="#5D5F5F" />
                      <circle r="16" cx="16" cy="16" fill="transparent" stroke="#943700" strokeWidth="32" strokeDasharray="80 100" />
                      <circle r="16" cx="16" cy="16" fill="transparent" stroke="#004AC6" strokeWidth="32" strokeDasharray="55 100" />
                    </svg>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#004AC6]" />
                      <span className="text-[12px] font-medium text-[#191C1E]">Academic (55%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#943700]" />
                      <span className="text-[12px] font-medium text-[#191C1E]">Organization (25%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#5D5F5F]" />
                      <span className="text-[12px] font-medium text-[#191C1E]">Personal (20%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Motivation Card */}
          <div className="bg-[#004AC6] p-8 rounded-2xl relative overflow-hidden shadow-lg group">
            {/* Background Pattern/Image Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
               <img src="https://www.figma.com/api/mcp/asset/f2df82b5-712d-45ba-be8a-681f8710fc66" alt="" className="w-full h-full object-cover scale-150 group-hover:scale-125 transition-transform duration-1000" />
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
  );
};

export default Dashboard;