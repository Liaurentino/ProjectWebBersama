import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { List, BookCheck, Timer, CalendarFold, Clock4, Flag } from 'lucide-react';
import StatHeader from '../components/statistics/StatHeader';
import StatSummary from '../components/statistics/StatSummary';
import StatusBreakdown from '../components/statistics/StatusBreakdown';
import CategoryDonutChart from '../components/statistics/CategoryDonutChart';
import WeeklyBarChart from '../components/statistics/WeeklyBarChart';
import MonthlyTrendChart from '../components/statistics/MonthlyTrendChart';
import CareerAnalysisModal from '../components/modals/CareerAnalysisModal';
import AnalysisLoadingModal from '../components/modals/AnalysisLoadingModal';

const Statistics = () => {
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const categoryData = [
    { name: 'Academic', value: 35, color: '#004ac6' },
    { name: 'Organization', value: 25, color: '#2563eb' },
    { name: 'Skill', value: 15, color: '#943700' },
    { name: 'Commitment', value: 15, color: '#ba1a1a' },
    { name: 'Career', value: 10, color: '#737686' }
  ];

  const weeklyActivityData = [
    { label: "09 June", value: 82, color: "#97b6fb" },
    { label: "10 June", value: 76, color: "#97b6fb" },
    { label: "11 June", value: 88, color: "#97b6fb" },
    { label: "12 June", value: 84, color: "#97b6fb" },
    { label: "Today", value: 91, color: "#2563eb", isToday: true }
  ];

  const productivityTrendData = [
    { day: "Mon", finished: 5.5, plan: 8 },
    { day: "Tue", finished: 4.2, plan: 8 },
    { day: "Wed", finished: 7.8, plan: 8 },
    { day: "Thu", finished: 6.4, plan: 8 },
    { day: "Fri", finished: 9.2, plan: 8 },
    { day: "Sat", finished: 3.0, plan: 8 },
    { day: "Sun", finished: 4.5, plan: 8 },
  ];

  const statusData = [
    { name: 'Todo', value: 20, color: '#737686', count: 24 },
    { name: 'In Progress', value: 35, color: '#facc15', count: 42 },
    { name: 'Done', value: 45, color: '#22c55e', count: 54 }
  ];

  const summaryStats = [
    {
      title: "Total Activities",
      value: "128",
      icon: <List color="#2563eb" size={24} />
    },
    {
      title: "Activity Completed",
      value: "104",
      icon: <BookCheck color="#22C55E" size={24} />
    },
    {
      title: "Productive Time",
      value: "42.5h",
      icon: <Timer color="#f59e0b" size={24} />
    },
    {
      title: "Most Productive Day",
      value: "Tuesday Thursday",
      icon: <CalendarFold color="#8b5cf6" size={24} />
    },
    {
      title: "Best Focus Clock",
      value: "09:00 - 11:30",
      icon: <Clock4 color="#ECE33E" size={24} />
    },
    {
      title: "Most Active Categories",
      value: "Academic",
      icon: <Flag color="#15A3B6" size={24} />
    }
  ];

  const handleStartAnalysis = () => {
    setIsLoadingAnalysis(true);
    setTimeout(() => {
      setIsLoadingAnalysis(false);
      setIsModalOpen(true);
    }, 3000);
  };

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f8f9fb]'}`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        <StatHeader onButtonClick={handleStartAnalysis} />

        <StatSummary stats={summaryStats} />

        <StatusBreakdown 
          title="My Notes Distribution"
          data={statusData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <CategoryDonutChart 
              title="Activities per Category"
              totalValue="128"
              data={categoryData}
            />
          </div>
          <div className="lg:col-span-7">
            <WeeklyBarChart 
              title="Activities per Week"
              subtitle="Today's Progress"
              data={weeklyActivityData}
            />
          </div>
        </div>

        <MonthlyTrendChart 
          title="Daily Productivity Trends"
          subtitle="Comparison of the last 7 Days. Planned data based on your average activity history."
          data={productivityTrendData}
        />

      </div>

      <AnalysisLoadingModal 
        isOpen={isLoadingAnalysis} 
        onClose={() => setIsLoadingAnalysis(false)} 
      />

      <CareerAnalysisModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Statistics;
