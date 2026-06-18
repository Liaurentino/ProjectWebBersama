const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')
const { sendResetEmail } = require('../utils/email')

const SALT_ROUNDS = 10

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const username = email.split('@')[0]

    const user = await prisma.user.create({
      data: {
        name: fullName,
        username,
        email,
        password: hashedPassword,
      },
    })

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
      },
    })
  } catch (err) {
    console.error('[register]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Email is not registered' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
        jurusan: user.jurusan,
      },
    })
  } catch (err) {
    console.error('[login]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(200).json({ message: 'Password reset link sent to email' })
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET + user.password,
      { expiresIn: '15m' }
    )

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    await sendResetEmail(email, resetUrl)

    return res.status(200).json({ message: 'Password reset link sent to email' })
  } catch (err) {
    console.error('[forgotPassword]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' })
    }

    const decoded = jwt.decode(token)
    if (!decoded || !decoded.id) {
      return res.status(400).json({ message: 'Invalid token' })
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' })
    }

    jwt.verify(token, process.env.JWT_SECRET + user.password)

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return res.status(200).json({ message: 'Password reset successfully' })
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset link has expired' })
    }
    console.error('[resetPassword]', err)
    return res.status(400).json({ message: 'Invalid or expired token' })
  }
}

// PUT /api/auth/onboarding/step-1
const onboardingStep1 = async (req, res) => {
  try {
    const { jurusan, semester } = req.body
    const userId = req.user.id

    if (!jurusan || !semester) {
      return res.status(400).json({ message: 'Jurusan dan semester wajib diisi' })
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        jurusan,
        semester: semester === '8+' ? 8 : parseInt(semester),
      },
    })

    return res.status(200).json({ message: 'Step 1 saved' })
  } catch (err) {
    console.error('[onboardingStep1]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// PUT /api/auth/onboarding/step-2
const completeOnboarding = async (req, res) => {
  try {
    const { jurusan, semester, interests } = req.body
    const userId = req.user.id

    if (!interests?.length) {
      return res.status(400).json({ message: 'Pilih minimal satu interest' })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(jurusan && { jurusan }),
        ...(semester && { semester: parseInt(semester) }),
        interests,
        isOnboarded: true,
      },
    })

    return res.status(200).json({
      message: 'Onboarding completed',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
      },
    })
  } catch (err) {
    console.error('[completeOnboarding]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { register, login, forgotPassword, resetPassword, onboardingStep1, completeOnboarding }