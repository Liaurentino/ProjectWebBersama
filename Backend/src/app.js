const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const activityRoutes = require('./routes/activityRoutes')
const userRoutes = require('./routes/userRoutes')
const notesRoutes = require('./routes/notesRoutes')
const searchRoutes = require('./routes/searchRoutes')
const statisticsRoutes = require('./routes/statisticsRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express()

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []

app.use(cors({
  origin: allowedOrigins,
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
app.use('/api/statistics', statisticsRoutes)
app.use('/api/dashboard', dashboardRoutes)

module.exports = app  