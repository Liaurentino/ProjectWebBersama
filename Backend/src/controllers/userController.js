const prisma = require('../config/prisma')

// POST /api/user/onboarding
const onboarding = async (req, res) => {
  try {
    const { department, semester } = req.body
    const userId = req.user.id

    if (semester !== undefined && typeof semester !== 'number') {
      return res.status(400).json({ message: 'Invalid data format' })
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        jurusan: department,
        semester: semester,
        isOnboarded: true,
      },
    })

    return res.status(200).json({ message: 'Onboarding data saved successfully' })
  } catch (err) {
    console.error('[onboarding]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        photoUrl: true,
        jurusan: true,
        semester: true,
        interests: true,
        bio: true,
        isOnboarded: true,
        createdAt: true,
      },
    })

    if (!user) return res.status(404).json({ message: 'User not found' })

    return res.status(200).json({ data: user })
  } catch (err) {
    console.error('[getProfile]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, username, photoUrl, jurusan, semester, interests, bio } = req.body

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        photoUrl,
        jurusan,
        semester,
        interests,
        bio,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        photoUrl: true,
        jurusan: true,
        semester: true,
        interests: true,
        bio: true,
        isOnboarded: true,
      },
    })

    return res.status(200).json({ message: 'Profile updated', data: updated })
  } catch (err) {
    console.error('[updateProfile]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// GET /api/user/settings
const getSettings = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    })

    if (!user) return res.status(404).json({ message: 'User not found' })

    // Kembalikan settings dengan default value jika belum pernah disimpan
    const defaultSettings = {
      emailNotification: true,
      activityReminders: true,
      allowAiAnalyze: true,
    }

    return res.status(200).json({
      data: { ...defaultSettings, ...(user.settings || {}) },
    })
  } catch (err) {
    console.error('[getSettings]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// PUT /api/user/settings
const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id
    const { emailNotification, activityReminders, allowAiAnalyze } = req.body

    // Validasi tipe boolean
    const fields = { emailNotification, activityReminders, allowAiAnalyze }
    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined && typeof val !== 'boolean') {
        return res.status(400).json({ message: `${key} must be a boolean` })
      }
    }

    // Ambil settings lama dulu, lalu merge — supaya partial update aman
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    })

    const merged = {
      ...(existing?.settings || {}),
      ...fields,
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { settings: merged },
      select: { settings: true },
    })

    return res.status(200).json({ message: 'Settings updated', data: updated.settings })
  } catch (err) {
    console.error('[updateSettings]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { onboarding, getProfile, updateProfile, getSettings, updateSettings }