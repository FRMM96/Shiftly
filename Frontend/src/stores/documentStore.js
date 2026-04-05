import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useDocumentStore = defineStore('documents', () => {
  const documents = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchDocuments(category) {
    loading.value = true
    error.value = null
    try {
      const params = category ? { category } : {}
      const res = await api.get('/documents', { params })
      documents.value = res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load documents'
    } finally {
      loading.value = false
    }
  }

  async function uploadDocument(file, category) {
    loading.value = true
    error.value = null
    try {
      const form = new FormData()
      form.append('file', file)
      if (category) form.append('category', category)
      const res = await api.post('/documents/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      documents.value.unshift(res.data)
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Upload failed'
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function deleteDocument(id) {
    try {
      await api.delete(`/documents/${id}`)
      documents.value = documents.value.filter(d => d.id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Delete failed'
      throw new Error(error.value)
    }
  }

  function downloadUrl(id) {
    const base = api.defaults.baseURL
    return `${base}/documents/${id}/download`
  }

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    downloadUrl,
  }
})
