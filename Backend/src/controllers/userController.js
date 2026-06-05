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

module.exports = { onboarding }