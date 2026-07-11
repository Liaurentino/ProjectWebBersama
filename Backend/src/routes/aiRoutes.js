const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/authMiddleware')
const { getCareerInsight, getChatResponse, getChatSessions, deleteChatSession } = require('../controllers/aiController')

router.post('/career-insight', authenticate, getCareerInsight)
router.get('/chat-sessions', authenticate, getChatSessions)
router.delete('/chat-sessions/:id', authenticate, deleteChatSession)
router.post('/chat', authenticate, getChatResponse)

module.exports = router


