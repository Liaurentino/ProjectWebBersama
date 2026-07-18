const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/authMiddleware')
const { upload, validateFileSize } = require('../middlewares/uploadMiddleware')
const { getCareerInsight, getChatResponse, getChatSessions, deleteChatSession } = require('../controllers/aiController')

router.post('/career-insight', authenticate, getCareerInsight)
router.get('/chat-sessions', authenticate, getChatSessions)
router.delete('/chat-sessions/:id', authenticate, deleteChatSession)

// Support multipart/form-data (dengan file) dan JSON (tanpa file)
router.post('/chat', authenticate, upload.single('file'), validateFileSize, getChatResponse)

module.exports = router



