const prisma = require('../config/prisma')

// Helper: hitung durasi jam dari dua Date
const diffHours = (start, end) => {
  if (!start || !end) return 0;
  return Math.max(0, (new Date(end) - new Date(start)) / (1000 * 60 * 60));
};

// Helper: nama hari dari Date
const dayName = (date) => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
};

// Helper: format label tanggal "DD Mon"
const dateLabel = (date) => {
  return new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
};

// GET /api/statistics
const getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    const activities = await prisma.activity.findMany({
      where: { userId },
      select: {
        id: true,
        category: true,
        status: true,
        startedAt: true,
        endedAt: true,
      },
      orderBy: { startedAt: 'asc' },
    });

    const total = activities.length;
    if (total === 0) {
      return res.status(200).json({ data: emptyResponse() });
    }

    const done       = activities.filter(a => a.status === 'DONE');
    const inProgress = activities.filter(a => a.status === 'IN_PROGRESS');
    const todo       = activities.filter(a => a.status === 'TODO');

    // ── Status Breakdown (dari Notes) ─────────────────────
    const notes = await prisma.notes.findMany({
      where: { userId },
      select: { status: true },
    });
    const totalNotes    = notes.length;
    const notesDone     = notes.filter(n => n.status === 'DONE').length;
    const notesProgress = notes.filter(n => n.status === 'IN_PROGRESS').length;
    const notesTodo     = notes.filter(n => n.status === 'TODO').length;

    const statusData = totalNotes === 0 ? [] : [
      { name: 'Todo',        value: Math.round((notesTodo / totalNotes) * 100),     color: '#737686', count: notesTodo },
      { name: 'In Progress', value: Math.round((notesProgress / totalNotes) * 100), color: '#facc15', count: notesProgress },
      { name: 'Done',        value: Math.round((notesDone / totalNotes) * 100),      color: '#22c55e', count: notesDone },
    ];

    // ── Category Donut ────────────────────────────────────
    const categoryColors = {
      AKADEMIK:    '#004ac6',
      ORGANISASI:  '#2563eb',
      SKILL:       '#943700',
      KEPANITIAAN: '#ba1a1a',
      LAINNYA:     '#737686',
    };
    const categoryLabels = {
      AKADEMIK:    'Academic',
      ORGANISASI:  'Organization',
      SKILL:       'Skill',
      KEPANITIAAN: 'Commitment',
      LAINNYA:     'Others',
    };
    const categoryCounts = {};
    for (const a of activities) {
      categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    }
    const categoryData = Object.entries(categoryCounts).map(([cat, count]) => ({
      name:  categoryLabels[cat] || cat,
      value: Math.round((count / total) * 100),
      color: categoryColors[cat] || '#737686',
    }));

    // ── Weekly Bar (5 hari terakhir) ──────────────────────
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const weeklyData = [];

    for (let i = 4; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
      const dayEnd   = new Date(day); dayEnd.setHours(23, 59, 59, 999);

      const dayActivities = activities.filter(a => {
        const d = new Date(a.startedAt);
        return d >= dayStart && d <= dayEnd;
      });

      const dayDone  = dayActivities.filter(a => a.status === 'DONE').length;
      const dayTotal = dayActivities.length;
      const value    = dayTotal > 0 ? Math.round((dayDone / dayTotal) * 100) : 0;
      const isToday  = i === 0;

      weeklyData.push({
        label:   isToday ? 'Today' : dateLabel(day),
        value,
        color:   isToday ? '#2563eb' : '#97b6fb',
        isToday,
      });
    }

    // ── Monthly Trend (7 hari terakhir) ──────────────────
    // plan = rata-rata jam harian dari 30 hari terakhir
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30Done = done.filter(a => new Date(a.startedAt) >= thirtyDaysAgo && a.endedAt);
    const totalHours30 = last30Done.reduce((sum, a) => sum + diffHours(a.startedAt, a.endedAt), 0);
    const planHours = last30Done.length > 0 ? Math.round((totalHours30 / 30) * 10) / 10 : 0;

    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
      const dayEnd   = new Date(day); dayEnd.setHours(23, 59, 59, 999);

      const dayDone = done.filter(a => {
        const d = new Date(a.startedAt);
        return d >= dayStart && d <= dayEnd && a.endedAt;
      });
      const finished = Math.round(
        dayDone.reduce((sum, a) => sum + diffHours(a.startedAt, a.endedAt), 0) * 10
      ) / 10;

      trendData.push({
        day:      dayName(day),
        finished,
        plan:     planHours,
      });
    }

    // ── Summary Stats ─────────────────────────────────────
    const totalProductiveHours = Math.round(
      done.filter(a => a.endedAt)
          .reduce((sum, a) => sum + diffHours(a.startedAt, a.endedAt), 0) * 10
    ) / 10;

    // Most productive day — hari dengan jumlah DONE terbanyak
    const dayCount = {};
    for (const a of done) {
      const d = dayName(a.startedAt);
      dayCount[d] = (dayCount[d] || 0) + 1;
    }
    const maxDayCount = Math.max(0, ...Object.values(dayCount));
    const mostProductiveDays = Object.entries(dayCount)
      .filter(([, v]) => v === maxDayCount)
      .map(([k]) => k)
      .join(' ');

    // Best focus clock — jam mulai dengan aktivitas terbanyak (bucket per 2 jam)
    const hourBuckets = {};
    for (const a of activities) {
      const h = new Date(a.startedAt).getHours();
      const bucket = Math.floor(h / 2) * 2;
      hourBuckets[bucket] = (hourBuckets[bucket] || 0) + 1;
    }
    const bestBucket = Object.entries(hourBuckets).sort((a, b) => b[1] - a[1])[0];
    const bestFocusClock = bestBucket
      ? `${String(bestBucket[0]).padStart(2, '0')}:00 - ${String(Number(bestBucket[0]) + 2).padStart(2, '0')}:00`
      : '--:-- - --:--';

    // Most active category
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
    const mostActiveCategory = topCategory ? categoryLabels[topCategory[0]] || topCategory[0] : '-';

    const summary = {
      totalActivities:    total,
      activityCompleted:  done.length,
      productiveTime:     `${totalProductiveHours}h`,
      mostProductiveDay:  mostProductiveDays || '-',
      bestFocusClock,
      mostActiveCategory,
    };

    return res.status(200).json({
      data: {
        summary,
        statusData,
        categoryData,
        totalActivities: total,
        weeklyData,
        trendData,
        planHours,
      },
    });
  } catch (err) {
    console.error('[getStatistics]', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const emptyResponse = () => ({
  summary: {
    totalActivities:    0,
    activityCompleted:  0,
    productiveTime:     '0h',
    mostProductiveDay:  '-',
    bestFocusClock:     '--:-- - --:--',
    mostActiveCategory: '-',
  },
  statusData:      [],
  categoryData:    [],
  totalActivities: 0,
  weeklyData:      [],
  trendData:       [],
  planHours:       0,
});

module.exports = { getStatistics };