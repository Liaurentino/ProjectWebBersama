const API_BASE = import.meta.env.VITE_API_URL 

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

// Status mapping FE → BE
export const toDbStatus = (feStatus) => {
  const map = { all: 'TODO', 'in-progress': 'IN_PROGRESS', done: 'DONE' }
  return map[feStatus] ?? 'TODO'
}

// Status mapping BE → FE
export const toFeStatus = (dbStatus) => {
  const map = { TODO: 'all', IN_PROGRESS: 'in-progress', DONE: 'done' }
  return map[dbStatus] ?? 'all'
}

// Transform data DB → shape yang dipakai FE
export const transformNote = (note) => ({
  id: note.id,
  title: note.title,
  category: note.category ?? 'ACADEMIC',
  status: toFeStatus(note.status),
  dueDate: note.dueDate
    ? new Date(note.dueDate).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : 'No date',
  dueDateRaw: note.dueDate ? new Date(note.dueDate).toISOString().split('T')[0] : '',
  description: note.description ?? '',
  tasks: Array.isArray(note.todoList) ? note.todoList : [],
  taskCount: Array.isArray(note.todoList) ? note.todoList.length : 0,
  isExpanded: false,
  progress: calcProgress(Array.isArray(note.todoList) ? note.todoList : []),
})

export const calcProgress = (tasks) => {
  if (!tasks.length) return 0
  return Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
}

export const getAllNotes = async () => {
  const res = await fetch(`${API_BASE}/api/notes`, { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Gagal mengambil notes')
  const { data } = await res.json()
  return data.map(transformNote)
}

export const createNote = async (payload) => {
  const res = await fetch(`${API_BASE}/api/notes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Gagal membuat note')
  const { data } = await res.json()
  return transformNote(data)
}

export const updateNote = async (id, payload) => {
  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Gagal mengupdate note')
  const { data } = await res.json()
  return transformNote(data)
}

export const deleteNote = async (id) => {
  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error('Gagal menghapus note')
}