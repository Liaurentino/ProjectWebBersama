const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/authMiddleware')
const {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} = require('../controllers/activityController')

router.get('/', authenticate, getAllActivities)
router.get('/:id', authenticate, getActivityById)
router.post('/', authenticate, createActivity)
router.put('/:id', authenticate, updateActivity)
router.delete('/:id', authenticate, deleteActivity)

module.exports = router