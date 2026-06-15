const prisma = require('../config/prisma')

// GET /api/notes
const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id
    const notes = await prisma.notes.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json({ data: notes })
  } catch (err) {
    console.error('[getAllNotes]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// POST /api/notes
const createNote = async (req, res) => {
  try {
    const userId = req.user.id
    const { title, category, status, todoList, dueDate, description } = req.body

    if (!title) return res.status(400).json({ message: "Field 'title' is required" })

    const note = await prisma.notes.create({
      data: {
        userId,
        title,
        category: category || null,
        status: status || 'TODO',
        todoList: todoList || [],
        dueDate: dueDate ? new Date(dueDate) : null,
        description: description || null,
      },
    })
    return res.status(201).json({ message: 'Note created', data: note })
  } catch (err) {
    console.error('[createNote]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params
    const { title, category, status, todoList, dueDate, description } = req.body

    const note = await prisma.notes.findUnique({ where: { id } })
    if (!note) return res.status(404).json({ message: 'Note not found' })
    if (note.userId !== userId) return res.status(403).json({ message: 'Forbidden' })

    const updated = await prisma.notes.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(status !== undefined && { status }),
        ...(todoList !== undefined && { todoList }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(description !== undefined && { description }),
      },
    })
    return res.status(200).json({ message: 'Note updated', data: updated })
  } catch (err) {
    console.error('[updateNote]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const note = await prisma.notes.findUnique({ where: { id } })
    if (!note) return res.status(404).json({ message: 'Note not found' })
    if (note.userId !== userId) return res.status(403).json({ message: 'Forbidden' })

    await prisma.notes.delete({ where: { id } })
    return res.status(200).json({ message: 'Note deleted' })
  } catch (err) {
    console.error('[deleteNote]', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getAllNotes, createNote, updateNote, deleteNote }