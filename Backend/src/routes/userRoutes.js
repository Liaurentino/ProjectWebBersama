const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/authMiddleware')
const { onboarding } = require('../controllers/userController')

router.post('/onboarding', authenticate, onboarding)

module.exports = router