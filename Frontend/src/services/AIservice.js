const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const buildUrl = (path) => `${API_BASE_URL}${path}`

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

const handleResponse = async (res) => {
  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    const error = new Error(json.message || 'Something went wrong')
    error.status = res.status
    throw error
  }

  return json
}

export const getCareerInsight = async (payload = {}, options = {}) => {
  const res = await fetch(buildUrl('/api/ai/career-insight'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    signal: options.signal,
  })

  return handleResponse(res)
}



export const sendChatMessage = async (payload = {}, options = {}) => {
  const { file, ...rest } = payload

  let body
  let headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }

  if (file) {
    // Kirim sebagai multipart/form-data jika ada file
    const formData = new FormData()
    formData.append('file', file)
    // messages dan selected_context_items perlu di-stringify karena FormData hanya string
    if (rest.messages) formData.append('messages', JSON.stringify(rest.messages))
    if (rest.selected_context_items) formData.append('selected_context_items', JSON.stringify(rest.selected_context_items))
    if (rest.chat_session_id) formData.append('chat_session_id', rest.chat_session_id)
    body = formData
    // Jangan set Content-Type — browser akan otomatis set dengan boundary yang benar
  } else {
    // Kirim sebagai JSON jika tidak ada file
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(rest)
  }

  const res = await fetch(buildUrl('/api/ai/chat'), {
    method: 'POST',
    headers,
    body,
    signal: options.signal,
  })

  return handleResponse(res)
}


export const getChatSessions = async (options = {}) => {
  const res = await fetch(buildUrl('/api/ai/chat-sessions'), {
    method: 'GET',
    headers: getAuthHeaders(),
    signal: options.signal,
  })

  return handleResponse(res)
}

export const deleteChatSession = async (sessionId, options = {}) => {
  const res = await fetch(buildUrl(`/api/ai/chat-sessions/${sessionId}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
    signal: options.signal,
  })

  return handleResponse(res)
}
