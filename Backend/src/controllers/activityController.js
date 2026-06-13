const prisma = require('../config/prisma')

// GET /api/activity
const getAllActivities = async (req, res) => {
  try {
    const userId = req.user.id
    const { category, status } = req.query

    const filters = { userId }
    if (category) filters.category = category
    if (status) filters.status = status

    const activities = await prisma.activity.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    })

    return res.status(200).json({ data: activities })
  } catch (err) {
    console.error('[getAllActivities]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// GET /api/activity/:id
const getActivityById = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const activity = await prisma.activity.findUnique({ where: { id } })

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' })
    }

    if (activity.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    return res.status(200).json({ data: activity })
  } catch (err) {
    console.error('[getActivityById]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// POST /api/activity
const createActivity = async (req, res) => {
  try {
    const userId = req.user.id
    const { title, category, description, status, startedAt, endedAt } = req.body

    if (!title) return res.status(400).json({ message: "Field 'title' is required" })
    if (!category) return res.status(400).json({ message: "Field 'category' is required" })
    if (!description) return res.status(400).json({ message: "Field 'description' is required" })
    if (!startedAt) return res.status(400).json({ message: "Field 'startedAt' is required" })

    const activity = await prisma.activity.create({
      data: {
        userId,
        title,
        category,
        description,
        status: status || 'TODO',
        startedAt: new Date(startedAt),
        endedAt: endedAt ? new Date(endedAt) : null,
      },
    })

    return res.status(201).json({ message: 'Activity created', data: activity })
  } catch (err) {
    console.error('[createActivity]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// PUT /api/activity/:id
const updateActivity = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params
    const { title, category, description, status, startedAt, endedAt } = req.body

    const activity = await prisma.activity.findUnique({ where: { id } })

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' })
    }

    if (activity.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        title,
        category,
        description,
        status,
        startedAt: startedAt ? new Date(startedAt) : undefined,
        endedAt: endedAt ? new Date(endedAt) : null,
      },
    })

    return res.status(200).json({ message: 'Activity updated', data: updated })
  } catch (err) {
    console.error('[updateActivity]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// DELETE /api/activity/:id
const deleteActivity = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const activity = await prisma.activity.findUnique({ where: { id } })

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' })
    }

    if (activity.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    await prisma.activity.delete({ where: { id } })

    return res.status(200).json({ message: 'Activity deleted' })
  } catch (err) {
    console.error('[deleteActivity]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
}