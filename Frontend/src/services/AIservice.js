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
  const res = await fetch(buildUrl('/api/ai/chat'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
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
