import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/userService';
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

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await userService.getStatistics();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const summaryStats = stats ? [
    {
      title: 'Total Activities',
      value: String(stats.summary.totalActivities),
      icon:  <List color="#2563eb" size={24} />,
    },
    {
      title: 'Activity Completed',
      value: String(stats.summary.activityCompleted),
      icon:  <BookCheck color="#22C55E" size={24} />,
    },
    {
      title: 'Productive Time',
      value: stats.summary.productiveTime,
      icon:  <Timer color="#f59e0b" size={24} />,
    },
    {
      title: 'Most Productive Day',
      value: stats.summary.mostProductiveDay,
      icon:  <CalendarFold color="#8b5cf6" size={24} />,
    },
    {
      title: 'Best Focus Clock',
      value: stats.summary.bestFocusClock,
      icon:  <Clock4 color="#ECE33E" size={24} />,
    },
    {
      title: 'Most Active Categories',
      value: stats.summary.mostActiveCategory,
      icon:  <Flag color="#15A3B6" size={24} />,
    },
  ] : [];

  const handleStartAnalysis = () => {
    setIsLoadingAnalysis(true);
    setTimeout(() => {
      setIsLoadingAnalysis(false);
      setIsModalOpen(true);
    }, 3000);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f8f9fb]'}`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-[#434655]'}>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f8f9fb]'}`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#f8f9fb]'}`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        <StatHeader onButtonClick={handleStartAnalysis} />

        <StatSummary stats={summaryStats} />

        <StatusBreakdown
          title="Notes Activity"
          data={stats.statusData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <CategoryDonutChart
              title="Activities per Category"
              totalValue={String(stats.totalActivities)}
              data={stats.categoryData}
            />
          </div>
          <div className="lg:col-span-7">
            <WeeklyBarChart
              title="Activities per Week"
              subtitle="Today's Progress"
              data={stats.weeklyData}
            />
          </div>
        </div>

        <MonthlyTrendChart
          title="Daily Productivity Trends"
          subtitle="Comparison of the last 7 Days. Planned data based on your average activity history."
          data={stats.trendData}
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