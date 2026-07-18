const prisma = require('../config/prisma')
const cloudinary = require('../config/cloudinary')
const { PDFParse } = require('pdf-parse')
const { Readable } = require('stream')

// ─── Groq (career insight) ────────────────────────────────────
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-70b-versatile'
const GROQ_TIMEOUT_MS = (() => {
  const parsed = Number(process.env.GROQ_TIMEOUT_MS)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15000
})()

// ─── OpenRouter (chat + vision) ──────────────────────────────
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL   = process.env.OPENROUTER_MODEL || 'openrouter/free'
const OPENROUTER_TIMEOUT_MS = 30000

const toISOString = (value) => {
  if (!value) return null
  if (value instanceof Date) return value.toISOString()

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

const normalizeStringList = (value) => {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
}

const normalizePrimaryInterest = (interests) => {
  if (!Array.isArray(interests) || interests.length === 0) return null

  const primary = interests.find((item) => typeof item === 'string' && item.trim())
  return primary ? primary.trim() : null
}

const careerHintsByInterest = {
  'Software Development': ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Mobile Developer', 'Software Engineer'],
  'Data Science': ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'BI Analyst', 'Analytics Engineer'],
  'UI/UX Design': ['UI/UX Designer', 'Product Designer', 'UX Researcher', 'Interaction Designer', 'Design System Designer'],
  'Project Management': ['Project Coordinator', 'Project Manager', 'Scrum Master', 'Product Manager', 'Operations Associate'],
}

const getCareerHints = (primaryInterest) => {
  if (!primaryInterest) return []

  const matchedHints = careerHintsByInterest[primaryInterest]
  if (Array.isArray(matchedHints)) return matchedHints

  return [primaryInterest]
}

const buildCareerOptions = ({ primaryInterest, careerHints, prediksiKarir }) => {
  const options = []

  if (prediksiKarir) {
    options.push(prediksiKarir)
  }

  const fallbackSecond = careerHints.find((hint) => hint && hint !== prediksiKarir) || null
  if (fallbackSecond) {
    options.push(fallbackSecond)
  }

  if (options.length === 0 && primaryInterest) {
    options.push(primaryInterest)
  }

  return options.slice(0, 2)
}

const serializeActivity = (activity) => ({
  id: activity.id,
  title: activity.title,
  category: activity.category,
  description: activity.description,
  project: activity.project || null,
  status: activity.status,
  startedAt: toISOString(activity.startedAt),
  endedAt: toISOString(activity.endedAt),
})

const serializeNote = (note) => ({
  id: note.id,
  title: note.title,
  category: note.category || null,
  status: note.status,
  description: note.description || null,
  dueDate: toISOString(note.dueDate),
  todoList: note.todoList || [],
  createdAt: toISOString(note.createdAt),
  updatedAt: toISOString(note.updatedAt),
})

const buildPrompt = ({ activities, notes, primaryInterest, careerHints }) => {
  const payload = {
    instructions: [
      'Analisis data pengguna untuk memprediksi arah karir yang paling masuk akal.',
      'Primary interest dari profil user harus menjadi kompas utama prediksi.',
      'Jika primary interest tersedia, prioritaskan karir yang masih satu domain dengan interest tersebut kecuali evidence aktivitas sangat kuat mengarah ke domain lain.',
      'Jawab HANYA dengan JSON valid tanpa markdown, tanpa penjelasan tambahan, dan tanpa teks di luar objek JSON.',
      'Gunakan key persis: prediksi_karir, alasan, skills_to_develop, next_steps.',
      'prediksi_karir harus berupa satu jabatan/arah karir utama dalam Bahasa Indonesia.',
      'alasan harus singkat, jelas, dan berbasis bukti dari data yang tersedia.',
      'skills_to_develop dan next_steps harus berupa array string yang singkat dan konkret.',
      'Jika ada data yang tidak cukup kuat, tetap buat prediksi paling masuk akal berdasarkan pola dominan kegiatan dan primary interest.'
    ],
    data: {
      primary_interest: primaryInterest,
      career_hints: careerHints,
      activities,
      notes,
    },
  }

  return JSON.stringify(payload, null, 2)
}

const normalizeInsight = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('INVALID_GROQ_RESPONSE')
  }

  const prediksiKarir = typeof value.prediksi_karir === 'string' ? value.prediksi_karir.trim() : ''
  const alasan = typeof value.alasan === 'string' ? value.alasan.trim() : ''
  const skillsToDevelop = normalizeStringList(value.skills_to_develop)
  const nextSteps = normalizeStringList(value.next_steps)

  if (!prediksiKarir || !alasan) {
    throw new Error('INVALID_GROQ_RESPONSE')
  }

  return {
    prediksi_karir: prediksiKarir,
    alasan,
    skills_to_develop: skillsToDevelop,
    next_steps: nextSteps,
  }
}

const requestGroqInsight = async (prompt) => {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    const error = new Error('GROQ_API_KEY is not configured')
    error.code = 'GROQ_NOT_CONFIGURED'
    throw error
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS)

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        max_tokens: 600,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: [
              'Kamu adalah mesin analisis karir untuk mahasiswa.',
              'Keluarkan hanya JSON valid.',
              'Jangan gunakan markdown, bullet, atau teks tambahan di luar JSON.',
              'Pastikan output selalu memiliki key: prediksi_karir, alasan, skills_to_develop, next_steps.'
            ].join(' '),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '')
      const error = new Error(`Groq request failed with status ${response.status}`)
      error.code = 'GROQ_REQUEST_FAILED'
      error.status = response.status
      error.details = errorBody
      throw error
    }

    const responseBody = await response.json()
    const content = responseBody?.choices?.[0]?.message?.content

    if (!content) {
      const error = new Error('INVALID_GROQ_RESPONSE')
      error.code = 'INVALID_GROQ_RESPONSE'
      throw error
    }

    const parsed = typeof content === 'string' ? JSON.parse(content) : content
    return normalizeInsight(parsed)
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('GROQ_TIMEOUT')
      timeoutError.code = 'GROQ_TIMEOUT'
      throw timeoutError
    }

    if (error instanceof SyntaxError) {
      const parseError = new Error('INVALID_GROQ_RESPONSE')
      parseError.code = 'INVALID_GROQ_RESPONSE'
      throw parseError
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

const normalizeChatMessages = (messages) => {
  if (!Array.isArray(messages)) return []

  return messages
    .map((message) => {
      const role = message?.role === "assistant" ? "assistant" : "user"
      const content = typeof message?.content === "string" ? message.content.trim() : ""

      if (!content) return null

      return { role, content }
    })
    .filter(Boolean)
    .slice(-12)
}

const normalizeSelectedContextItems = (items) => {
  if (!Array.isArray(items)) return []

  return items
    .map((item) => {
      if (!item || typeof item !== "object") return null

      const title = typeof item.title === "string" ? item.title.trim() : ""
      const type = typeof item.type === "string" ? item.type.trim() : ""
      const description = typeof item.description === "string" ? item.description.trim() : ""

      if (!title) return null

      return { title, type, description }
    })
    .filter(Boolean)
    .slice(0, 6)
}

const buildContextSummary = ({ primaryInterest, activities, notes, selectedContextItems }) => {
  const sections = []

  if (primaryInterest) {
    sections.push("Primary interest: " + primaryInterest)
  }

  if (selectedContextItems.length > 0) {
    const selectedSummary = selectedContextItems
      .map((item) => {
        const bits = [item.title]
        if (item.type) bits.push("type: " + item.type)
        if (item.description) bits.push("desc: " + item.description)
        return "- " + bits.join(" | ")
      })
      .join("\n")

    sections.push("Context tambahan dari user:\n" + selectedSummary)
  }

  if (activities.length > 0) {
    const activitySummary = activities.slice(0, 5)
      .map((activity) => {
        let line = "- " + activity.title
        if (activity.category) line += " (" + activity.category + ")"
        if (activity.description) line += ": " + activity.description
        return line
      })
      .join("\n")

    sections.push("Aktivitas done terbaru:\n" + activitySummary)
  }

  if (notes.length > 0) {
    const noteSummary = notes.slice(0, 4)
      .map((note) => {
        let line = "- " + note.title
        if (note.category) line += " (" + note.category + ")"
        if (note.description) line += ": " + note.description
        return line
      })
      .join("\n")

    sections.push("Notes terbaru:\n" + noteSummary)
  }

  return sections.join("\n\n")
}

const buildChatMessages = ({ primaryInterest, activities, notes, selectedContextItems, conversationMessages }) => {
  const contextSummary = buildContextSummary({ primaryInterest, activities, notes, selectedContextItems })

  const systemInstructions = [
    "Kamu adalah AI mentor yang ngobrol santai, jelas, dan membantu mahasiswa.",
    "Balas dalam Bahasa Indonesia.",
    "Jawaban harus relevan dengan konteks percakapan dan data pengguna.",
    "Kalau user minta saran karir, prioritaskan primary interest dan aktivitas yang tersedia.",
    "Kalau user minta bantuan belajar, berikan langkah praktis, contoh singkat, dan struktur yang mudah diikuti.",
    "Jangan mengarang data pribadi yang tidak ada di konteks.",
    "Gunakan markdown ringan seperti **bold** untuk penekanan jika membantu.",
    "Jika jawaban akan lebih jelas dengan grafik, sertakan satu blok ```chart``` di akhir jawaban. Isi blok harus JSON valid dengan key: title, type, labels, values, seriesLabel.",
    "Untuk chart, pakai type bar kecuali line benar-benar lebih cocok.",
  ].join(" ")

  const messages = [
    {
      role: "system",
      content: contextSummary
        ? systemInstructions + "\n\nKonteks pengguna:\n" + contextSummary
        : systemInstructions,
    },
    ...conversationMessages,
  ]

  return messages.slice(-13)
}

/**
 * Upload buffer ke Cloudinary.
 * @param {Buffer} buffer - file buffer
 * @param {string} mimetype - e.g. 'image/png' | 'application/pdf'
 * @param {string} originalName - nama file asli
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadFileToCloudinary = (buffer, mimetype, originalName) => {
  const isPdf = mimetype === 'application/pdf'
  const resourceType = isPdf ? 'raw' : 'image'
  const folder = isPdf ? 'chat_pdfs' : 'chat_images'

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
        public_id: `${Date.now()}_${originalName.replace(/[^a-z0-9._-]/gi, '_')}`,
        use_filename: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )

    const readable = new Readable()
    readable.push(buffer)
    readable.push(null)
    readable.pipe(uploadStream)
  })
}

/**
 * Ekstrak teks dari PDF buffer menggunakan pdf-parse.
 * Return teks yang terpotong max 8000 karakter agar tidak overflow token.
 */
const extractPdfText = async (buffer) => {
  try {
    const parser = new PDFParse({ data: buffer })
    await parser.load()
    const result = await parser.getText()
    const text = (result.text || '').trim()
    console.log('[PDF Extract Debug] Success. Characters extracted:', text.length)
    return text.slice(0, 8000)
  } catch (err) {
    console.error('[PDF Extract Debug] Failed to parse PDF:', err)
    return ''
  }
}

/**
 * Kirim request ke OpenRouter (mendukung vision untuk gambar).
 * messages bisa berisi content berupa string atau array (multimodal).
 */
const requestOpenRouterChatCompletion = async (messages) => {
  const apiKey = process.env.OPENROUTER_API_KEY
  
  // Debug log untuk memeriksa status API key
  console.log('[OpenRouter Auth Debug]:', {
    hasKey: !!apiKey,
    keyLength: apiKey ? apiKey.length : 0,
    keyPrefix: apiKey ? apiKey.slice(0, 10) + '...' : 'none'
  })

  if (!apiKey || apiKey === 'isi_api_key_openrouter_disini' || apiKey.trim() === '') {
    const error = new Error('OPENROUTER_API_KEY is not configured')
    error.code = 'GROQ_NOT_CONFIGURED'
    throw error
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS)

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'AI Mentor Chat',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        temperature: 0.5,
        max_tokens: 1024,
        messages,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '')
      const error = new Error(`OpenRouter request failed with status ${response.status}`)
      error.code = 'GROQ_REQUEST_FAILED'
      error.status = response.status
      error.details = errorBody
      throw error
    }

    const responseBody = await response.json()
    const content = responseBody?.choices?.[0]?.message?.content

    if (!content || typeof content !== 'string') {
      const error = new Error('INVALID_GROQ_RESPONSE')
      error.code = 'INVALID_GROQ_RESPONSE'
      throw error
    }

    return content.trim()
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('GROQ_TIMEOUT')
      timeoutError.code = 'GROQ_TIMEOUT'
      throw timeoutError
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

const truncateChatTitle = (text, maxLength = 48) => {
  const normalized = typeof text === 'string' ? text.replace(/\s+/g, ' ').trim() : ''

  if (!normalized) return 'Chat'
  if (normalized.length <= maxLength) return normalized

  return normalized.slice(0, maxLength).trimEnd() + '...'
}

const normalizeChatPayloadMessages = (messages) => {
  if (!Array.isArray(messages)) return []

  return messages
    .map((message) => {
      const role = message?.role === 'assistant' ? 'assistant' : 'user'
      const content = typeof message?.content === 'string' ? message.content.trim() : ''

      if (!content) return null

      return { role, content }
    })
    .filter(Boolean)
}

const buildChatSessionTitle = (messages, fallback = 'Chat') => {
  const firstUserMessage = messages.find((message) => message.role === 'user' && message.content)
  return truncateChatTitle(firstUserMessage?.content || fallback)
}

const mapChatMessageToDb = (message) => ({
  role: message.role === 'assistant' ? 'ASSISTANT' : 'USER',
  content: message.content,
  fileUrl:  message.fileUrl  || null,
  fileName: message.fileName || null,
  fileType: message.fileType || null,
})

const serializeChatMessage = (message) => ({
  id:        message.id,
  role:      message.role === 'ASSISTANT' ? 'assistant' : 'user',
  content:   message.content,
  fileUrl:   message.fileUrl  || null,
  fileName:  message.fileName || null,
  fileType:  message.fileType || null,
  createdAt: toISOString(message.createdAt),
})

const serializeChatSession = (session) => ({
  id: session.id,
  title: session.title || 'Chat',
  createdAt: toISOString(session.createdAt),
  updatedAt: toISOString(session.updatedAt),
  messages: Array.isArray(session.messages)
    ? [...session.messages]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map(serializeChatMessage)
    : [],
})

const persistChatSession = async ({ userId, chatSessionId, title, messages }) => {
  const normalizedMessages = normalizeChatPayloadMessages(messages)
  const sessionTitle = truncateChatTitle(title || buildChatSessionTitle(normalizedMessages))

  if (chatSessionId) {
    const existingSession = await prisma.chatSession.findFirst({
      where: { id: chatSessionId, userId },
    })

    if (existingSession) {
      const persisted = await prisma.$transaction(async (tx) => {
        await tx.chatMessage.deleteMany({ where: { chatSessionId: existingSession.id } })

        await tx.chatSession.update({
          where: { id: existingSession.id },
          data: { title: sessionTitle },
        })

        if (normalizedMessages.length > 0) {
          await tx.chatMessage.createMany({
            data: normalizedMessages.map((message) => ({
              chatSessionId: existingSession.id,
              ...mapChatMessageToDb(message),
            })),
          })
        }

        return tx.chatSession.findUnique({
          where: { id: existingSession.id },
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
        })
      })

      return persisted
    }
  }

  return prisma.chatSession.create({
    data: {
      userId,
      title: sessionTitle,
      messages: normalizedMessages.length > 0
        ? {
            create: normalizedMessages.map((message) => mapChatMessageToDb(message)),
          }
        : undefined,
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

const getChatSessions = async (req, res) => {
  try {
    const userId = req.user.id

    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return res.status(200).json({
      chat_sessions: sessions.map(serializeChatSession),
    })
  } catch (error) {
    console.error('[getChatSessions]', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const deleteChatSession = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const session = await prisma.chatSession.findFirst({
      where: { id, userId },
    })

    if (!session) {
      return res.status(404).json({ message: 'Chat session not found' })
    }

    await prisma.chatSession.delete({ where: { id: session.id } })

    return res.status(200).json({ message: 'Chat session deleted' })
  } catch (error) {
    console.error('[deleteChatSession]', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
const getChatResponse = async (req, res) => {
  try {
    const userId = req.user.id

    // ── Parse body (JSON atau multipart/form-data) ──────────────
    // Multer mengubah semua field FormData menjadi string,
    // jadi kita perlu coba JSON.parse jika bukan array.
    const rawMessagesField = req.body?.messages
    let parsedMessages
    if (Array.isArray(rawMessagesField)) {
      parsedMessages = rawMessagesField
    } else if (typeof rawMessagesField === 'string') {
      try { parsedMessages = JSON.parse(rawMessagesField) } catch { parsedMessages = [] }
    } else {
      parsedMessages = []
    }

    const selectedContextItems = normalizeSelectedContextItems(
      req.body?.selected_context_items
        ? (typeof req.body.selected_context_items === 'string'
            ? JSON.parse(req.body.selected_context_items)
            : req.body.selected_context_items)
        : []
    )

    // normalizeChatMessages memfilter pesan dengan content kosong.
    // Kalau ada file tapi teks kosong, inject placeholder agar tidak error.
    const hasPendingFile = !!req.file
    if (hasPendingFile && Array.isArray(parsedMessages) && parsedMessages.length > 0) {
      const last = parsedMessages[parsedMessages.length - 1]
      if (last && (last.role === 'user' || !last.role) && (!last.content || !last.content.trim())) {
        parsedMessages[parsedMessages.length - 1] = { ...last, content: 'Analisis file ini.' }
      }
    }

    const conversationMessages = normalizeChatMessages(parsedMessages)

    if (conversationMessages.length === 0) {
      return res.status(400).json({ message: 'Messages are required' })
    }

    // ── Handle file upload (jika ada) ────────────────────────
    let uploadedFileUrl  = null
    let uploadedFileName = null
    let uploadedFileType = null
    let pdfTextContext   = ''

    if (req.file) {
      const { buffer, mimetype, originalname } = req.file
      const isPdf   = mimetype === 'application/pdf'
      const isImage = ['image/jpeg', 'image/jpg', 'image/png'].includes(mimetype)

      // Upload ke Cloudinary
      const uploaded = await uploadFileToCloudinary(buffer, mimetype, originalname)
      uploadedFileUrl  = uploaded.url
      uploadedFileName = originalname
      uploadedFileType = isPdf ? 'pdf' : 'image'

      // Untuk PDF: ekstrak teks sebagai konteks
      if (isPdf) {
        pdfTextContext = await extractPdfText(buffer)
      }
    }

    // ── Fetch user data ───────────────────────────────────────
    const [userProfile, activities, notes] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { interests: true },
      }),
      prisma.activity.findMany({
        where: { userId, status: 'DONE' },
        select: {
          id: true, title: true, category: true, description: true,
          project: true, status: true, startedAt: true, endedAt: true,
        },
        orderBy: { startedAt: 'desc' },
      }),
      prisma.notes.findMany({
        where: { userId },
        select: {
          id: true, title: true, category: true, status: true,
          todoList: true, dueDate: true, description: true,
          createdAt: true, updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const primaryInterest = normalizePrimaryInterest(userProfile?.interests)

    // ── Build messages untuk OpenRouter ──────────────────────
    // Ambil pesan terakhir user (yang sudah termasuk teks prompt)
    const lastUserMessage = conversationMessages[conversationMessages.length - 1]
    const contextMessages = conversationMessages.slice(0, -1)

    // Bangun context messages (tanpa pesan terakhir)
    const baseMessages = buildChatMessages({
      primaryInterest,
      activities: activities.map(serializeActivity),
      notes: notes.map(serializeNote),
      selectedContextItems,
      conversationMessages: contextMessages,
    })

    // Buat user message terakhir (mungkin multimodal)
    let lastMessageContent

    if (uploadedFileType === 'image' && uploadedFileUrl) {
      // Multimodal: teks + gambar
      lastMessageContent = [
        { type: 'text', text: lastUserMessage.content || 'Analisis gambar ini.' },
        { type: 'image_url', image_url: { url: uploadedFileUrl } },
      ]
    } else if (uploadedFileType === 'pdf' && pdfTextContext) {
      // PDF: sertakan teks ekstrak sebagai konteks tambahan
      lastMessageContent =
        `${lastUserMessage.content}\n\n[Konten PDF: ${uploadedFileName}]\n${pdfTextContext}`
    } else {
      lastMessageContent = lastUserMessage.content
    }

    const finalMessages = [
      ...baseMessages,
      { role: 'user', content: lastMessageContent },
    ]

    // ── Request ke OpenRouter ─────────────────────────────────
    const reply = await requestOpenRouterChatCompletion(finalMessages)

    // ── Persist session ───────────────────────────────────────
    // Tambahkan metadata file ke pesan user terakhir
    const userMessageWithFile = {
      ...lastUserMessage,
      fileUrl:  uploadedFileUrl,
      fileName: uploadedFileName,
      fileType: uploadedFileType,
    }

    const allMessagesForDb = [
      ...contextMessages,
      userMessageWithFile,
      { role: 'assistant', content: reply },
    ]

    const savedSession = await persistChatSession({
      userId,
      chatSessionId: req.body?.chat_session_id,
      title: buildChatSessionTitle(conversationMessages),
      messages: allMessagesForDb,
    })

    return res.status(200).json({
      message: reply,
      chat_session: serializeChatSession(savedSession),
    })
  } catch (error) {
    console.error('[getChatResponse Error Details]:', {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
      stack: error.stack
    })

    if (error.code === 'GROQ_TIMEOUT') {
      return res.status(503).json({ message: 'AI Engine is currently busy.' })
    }
    if (error.code === 'GROQ_REQUEST_FAILED') {
      return res.status(503).json({ message: 'AI Engine is currently busy.' })
    }
    if (error.code === 'INVALID_GROQ_RESPONSE') {
      return res.status(503).json({ message: 'AI Engine is currently busy.' })
    }
    if (error.code === 'GROQ_NOT_CONFIGURED') {
      return res.status(500).json({ message: 'OpenRouter API key belum dikonfigurasi.' })
    }

    return res.status(500).json({ message: 'Internal server error' })
  }
}

// POST /api/ai/career-insight
const getCareerInsight = async (req, res) => {
  try {
    const userId = req.user.id

    const [userProfile, activities, notes] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { interests: true },
      }),
      prisma.activity.findMany({
        where: {
          userId,
          status: 'DONE',
        },
        select: {
          id: true,
          title: true,
          category: true,
          description: true,
          project: true,
          status: true,
          startedAt: true,
          endedAt: true,
        },
        orderBy: {
          startedAt: 'desc',
        },
      }),
      prisma.notes.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          todoList: true,
          dueDate: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])

    const primaryInterest = normalizePrimaryInterest(userProfile?.interests)
    const careerHints = getCareerHints(primaryInterest)

    if (activities.length === 0) {
      return res.status(400).json({ message: 'Insufficient data to analyze career' })
    }

    const prompt = buildPrompt({
      primaryInterest,
      careerHints,
      activities: activities.map(serializeActivity),
      notes: notes.map(serializeNote),
    })

    const insight = await requestGroqInsight(prompt)
    const careerOptions = buildCareerOptions({
      primaryInterest,
      careerHints,
      prediksiKarir: insight.prediksi_karir,
    })

    return res.status(200).json({
      ...insight,
      career_options: careerOptions,
    })
  } catch (error) {
    if (error.code === 'GROQ_TIMEOUT') {
      return res.status(503).json({ message: 'AI Engine is currently busy.' })
    }

    if (error.code === 'GROQ_REQUEST_FAILED') {
      return res.status(503).json({ message: 'AI Engine is currently busy.' })
    }

    if (error.code === 'INVALID_GROQ_RESPONSE') {
      return res.status(503).json({ message: 'AI Engine is currently busy.' })
    }

    if (error.code === 'GROQ_NOT_CONFIGURED') {
      console.error('[getCareerInsight]', error)
      return res.status(500).json({ message: 'GROQ_API_KEY is not configured' })
    }

    console.error('[getCareerInsight]', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getCareerInsight, getChatResponse, getChatSessions, deleteChatSession }






