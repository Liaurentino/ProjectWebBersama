const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/authMiddleware')
const { onboarding, getProfile, updateProfile } = require('../controllers/userController')

router.post('/onboarding', authenticate, onboarding)
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)

module.exports = router