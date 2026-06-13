const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/authMiddleware')
const { search } = require('../controllers/searchController')

router.get('/', authenticate, search)

module.exports = router