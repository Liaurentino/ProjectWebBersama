const prisma = require('../config/prisma')

// GET /api/search?q=keyword
const search = async (req, res) => {
  try {
    const userId = req.user.id
    const { q } = req.query

    if (!q) return res.status(200).json({ data: [] })

    const [activities, notes] = await Promise.all([
      prisma.activity.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.notes.findMany({
        where: {
          userId,
          title: { contains: q, mode: 'insensitive' },
        },
      }),
    ])

    return res.status(200).json({
      data: {
        activities,
        notes,
      },
    })
  } catch (err) {
    console.error('[search]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { search }