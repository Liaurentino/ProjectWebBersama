const express = require('express')
const router = express.Router()
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  onboardingStep1,
  completeOnboarding,
} = require('../controllers/authController')

const { authenticate } = require('../middlewares/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.put('/onboarding/step-1', authenticate, onboardingStep1)
router.put('/onboarding/step-2', authenticate, completeOnboarding)

module.exports = router