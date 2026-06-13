// src/services/activityService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Helper: ambil token dari localStorage
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Helper: handle response & error secara konsisten
 */
const handleResponse = async (res) => {
  const data = await res.json()
  if (!res.ok) {
    const error = new Error(data.message || 'Something went wrong')
    error.status = res.status
    throw error
  }
  return data
}

// ─── GET /api/activity ────────────────────────────────────────────────────────
// Mendukung filter opsional: { category, status }
// Contoh: getAllActivities({ category: 'AKADEMIK', status: 'TODO' })
export const getAllActivities = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.category) params.append('category', filters.category)
  if (filters.status) params.append('status', filters.status)

  const queryString = params.toString() ? `?${params.toString()}` : ''
  const res = await fetch(`${API_BASE_URL}/api/activity${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse(res) // returns { data: Activity[] }
}

// ─── GET /api/activity/:id ────────────────────────────────────────────────────
export const getActivityById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/activity/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse(res) // returns { data: Activity }
}

// ─── POST /api/activity ───────────────────────────────────────────────────────
// Payload wajib: title, category, description, startedAt
// Payload opsional: status (default 'TODO'), endedAt
//
// Catatan field (sesuai Prisma schema):
//   - category : 'AKADEMIK' | 'ORGANISASI' | 'SKILL' | 'KEPANITIAAN' | 'LAINNYA'
//   - status   : 'TODO' | 'IN_PROGRESS' | 'DONE'
//   - startedAt: ISO string  (e.g. new Date().toISOString())
//   - endedAt  : ISO string | null
export const createActivity = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/api/activity`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(res) // returns { message, data: Activity }
}

// ─── PUT /api/activity/:id ────────────────────────────────────────────────────
// Semua field opsional — kirim hanya yang berubah
export const updateActivity = async (id, payload) => {
  const res = await fetch(`${API_BASE_URL}/api/activity/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(res) // returns { message, data: Activity }
}

// ─── DELETE /api/activity/:id ─────────────────────────────────────────────────
export const deleteActivity = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/activity/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  return handleResponse(res) // returns { message }
}