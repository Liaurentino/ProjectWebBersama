const prisma = require('../config/prisma')

const diffHours = (start, end) => {
  if (!start || !end) return 0;
  return Math.max(0, (new Date(end) - new Date(start)) / (1000 * 60 * 60));
};

// GET /api/dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayEnd   = new Date(now); todayEnd.setHours(23, 59, 59, 999);

    // Fetch activity hari ini + 30 hari terakhir sekaligus
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [todayActivities, recentActivities] = await Promise.all([
      prisma.activity.findMany({
        where: { userId, startedAt: { gte: todayStart, lte: todayEnd } },
        select: { id: true, title: true, description: true, category: true, status: true, startedAt: true, endedAt: true },
        orderBy: { startedAt: 'asc' },
      }),
      prisma.activity.findMany({
        where: { userId, startedAt: { gte: thirtyDaysAgo } },
        select: { category: true, status: true, startedAt: true, endedAt: true },
        orderBy: { startedAt: 'asc' },
      }),
    ]);

    // ── Summary Cards ────────────────────────────────────
    const totalToday     = todayActivities.length;
    const doneToday      = todayActivities.filter(a => a.status === 'DONE');
    const productiveTime = Math.round(
      doneToday.filter(a => a.endedAt)
               .reduce((sum, a) => sum + diffHours(a.startedAt, a.endedAt), 0) * 10
    ) / 10;
    const targetCompletion = totalToday > 0
      ? Math.round((doneToday.length / totalToday) * 100)
      : 0;

    // ── Streak ───────────────────────────────────────────
    // Hitung berapa hari berturut-turut (mundur dari kemarin) user punya minimal 1 DONE
    let streak = 0;
    const checkDay = new Date(now);
    checkDay.setDate(checkDay.getDate() - 1); // mulai dari kemarin

    // Buat set tanggal yang punya DONE
    const doneDates = new Set(
      recentActivities
        .filter(a => a.status === 'DONE')
        .map(a => new Date(a.startedAt).toISOString().split('T')[0])
    );

    // Kalau hari ini sudah ada DONE, mulai streak dari hari ini
    const todayStr = now.toISOString().split('T')[0];
    if (doneDates.has(todayStr)) streak = 1;

    for (let i = 1; i <= 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (doneDates.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }

    // ── Timeline ─────────────────────────────────────────
    const statusMap = { DONE: 'COMPLETED', IN_PROGRESS: 'UPCOMING', TODO: 'SCHEDULED' };
    const timeline = todayActivities.map(a => {
      const startStr = new Date(a.startedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
      const endStr   = a.endedAt
        ? new Date(a.endedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
        : '--:--';
      return {
        id:       a.id,
        time:     `${startStr} - ${endStr}`,
        title:    a.title,
        location: a.description || '',
        status:   statusMap[a.status] || 'SCHEDULED',
        type:     a.category,
      };
    });

    // ── Weekly Bar (5 hari terakhir) ─────────────────────
    const weeklyData = [];
    for (let i = 4; i >= 0; i--) {
      const day      = new Date(now);
      day.setDate(now.getDate() - i);
      const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
      const dayEnd   = new Date(day); dayEnd.setHours(23, 59, 59, 999);

      const dayActs  = recentActivities.filter(a => {
        const d = new Date(a.startedAt);
        return d >= dayStart && d <= dayEnd;
      });
      const dayDone  = dayActs.filter(a => a.status === 'DONE').length;
      const value    = dayActs.length > 0 ? Math.round((dayDone / dayActs.length) * 100) : 0;
      const isToday  = i === 0;

      weeklyData.push({
        label:   isToday ? 'Today' : day.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        value,
        color:   isToday ? '#2563eb' : '#97b6fb',
        isToday,
      });
    }

    // ── Category Distribution ────────────────────────────
    const categoryColors = {
      AKADEMIK:    '#004ac6',
      ORGANISASI:  '#7C3AED',
      SKILL:       '#943700',
      KEPANITIAAN: '#ba1a1a',
      LAINNYA:     '#737686',
    };
    const categoryLabels = {
      AKADEMIK:    'Akademik',
      ORGANISASI:  'Organisasi',
      SKILL:       'Skill',
      KEPANITIAAN: 'Kepanitiaan',
      LAINNYA:     'Lainnya',
    };
    const categoryCounts = {};
    for (const a of recentActivities) {
      categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    }
    const totalRecent = recentActivities.length;
    const categoryData = Object.entries(categoryCounts).map(([cat, count]) => ({
      name:  categoryLabels[cat] || cat,
      value: totalRecent > 0 ? Math.round((count / totalRecent) * 100) : 0,
      color: categoryColors[cat] || '#737686',
    }));

    // tasksCompleted dari Notes, focusHours dari Activity DONE (all time)
    const [allNotes, allDoneActivities] = await Promise.all([
      prisma.notes.findMany({
        where: { userId, status: 'DONE' },
        select: { id: true },
      }),
      prisma.activity.findMany({
        where: { userId, status: 'DONE' },
        select: { startedAt: true, endedAt: true },
      }),
    ]);
    const focusHours = Math.round(
      allDoneActivities.filter(a => a.endedAt)
             .reduce((sum, a) => sum + diffHours(a.startedAt, a.endedAt), 0) * 10
    ) / 10;

    return res.status(200).json({
      data: {
        summary: {
          totalToday,
          productiveTime: `${productiveTime}h`,
          streak,
          targetCompletion,
          tasksCompleted: allNotes.length,
          focusHours,
        },
        timeline,
        weeklyData,
        categoryData,
      },
    });
  } catch (err) {
    console.error('[getDashboard]', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getDashboard };