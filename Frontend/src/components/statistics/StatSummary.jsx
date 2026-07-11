import SummaryCard from './SummaryCard';

const StatSummary = ({ stats = [] }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full">
      {stats.map((stat, index) => (
        <SummaryCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatSummary;
