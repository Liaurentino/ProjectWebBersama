const express = require('express')
const router = express.Router()
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  completeOnboarding,
} = require('../controllers/authController')

const { authenticate } = require('../middlewares/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.put('/onboarding', authenticate, completeOnboarding)

module.exports = router