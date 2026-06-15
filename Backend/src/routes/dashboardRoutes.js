const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/authMiddleware')
const { getDashboard } = require('../controllers/dashboardController')

router.get('/', authenticate, getDashboard)

module.exports = router