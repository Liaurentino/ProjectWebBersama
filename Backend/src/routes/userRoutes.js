const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/authMiddleware')
const upload = require('../middlewares/upload')
const { onboarding, getProfile, updateProfile, getSettings, updateSettings, uploadPhoto, deleteAccount } = require('../controllers/userController')

router.post('/onboarding', authenticate, onboarding)
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)
router.get('/settings', authenticate, getSettings)
router.put('/settings', authenticate, updateSettings)
router.delete('/account', authenticate, deleteAccount)
router.post('/profile/photo', authenticate, upload.single('photo'), uploadPhoto)

module.exports = router