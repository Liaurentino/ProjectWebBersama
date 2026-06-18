const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/authMiddleware')
const { getStatistics } = require('../controllers/statisticController')

router.get('/', authenticate, getStatistics)

module.exports = router