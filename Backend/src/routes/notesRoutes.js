const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/authMiddleware')
const { getAllNotes, createNote, updateNote, deleteNote } = require('../controllers/notesController')

router.get('/', authenticate, getAllNotes)
router.post('/', authenticate, createNote)
router.put('/:id', authenticate, updateNote)
router.delete('/:id', authenticate, deleteNote)

module.exports = router