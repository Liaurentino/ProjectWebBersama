const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export const searchAll = async (query) => {
  if (!query?.trim()) return { activities: [], notes: [] }

  const res = await fetch(
    `${API_BASE}/api/search?q=${encodeURIComponent(query)}`,
    { headers: getAuthHeaders() }
  )
  if (!res.ok) throw new Error('Pencarian gagal')
  const { data } = await res.json()
  return data
}