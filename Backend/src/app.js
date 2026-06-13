const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const activityRoutes = require('./routes/activityRoutes')
const userRoutes = require('./routes/userRoutes')
const notesRoutes = require('./routes/notesRoutes')
const searchRoutes = require('./routes/searchRoutes')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://prodactivity.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.use(express.json())

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Produktif Backend - OK' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/search', searchRoutes)

module.exports = app  