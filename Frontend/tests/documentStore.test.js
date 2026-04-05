import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDocumentStore } from '../src/stores/documentStore'

// Mock the api module
vi.mock('../src/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    defaults: { baseURL: 'http://localhost:4000/api' },
  },
}))

import api from '../src/services/api'

describe('documentStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('starts with empty state', () => {
    const store = useDocumentStore()
    expect(store.documents).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchDocuments populates documents', async () => {
    const mockDocs = [{ id: '1', name: 'contract.pdf', size: 1024, category: 'Contracts' }]
    api.get.mockResolvedValueOnce({ data: mockDocs })

    const store = useDocumentStore()
    await store.fetchDocuments()

    expect(api.get).toHaveBeenCalledWith('/documents', { params: {} })
    expect(store.documents).toEqual(mockDocs)
    expect(store.loading).toBe(false)
  })

  it('fetchDocuments with category filter', async () => {
    api.get.mockResolvedValueOnce({ data: [] })

    const store = useDocumentStore()
    await store.fetchDocuments('Contracts')

    expect(api.get).toHaveBeenCalledWith('/documents', { params: { category: 'Contracts' } })
  })

  it('fetchDocuments handles errors', async () => {
    api.get.mockRejectedValueOnce({ response: { data: { message: 'Unauthorized' } } })

    const store = useDocumentStore()
    await store.fetchDocuments()

    expect(store.error).toBe('Unauthorized')
    expect(store.documents).toEqual([])
  })

  it('uploadDocument adds to list', async () => {
    const mockDoc = { id: '2', name: 'cert.pdf', size: 2048, category: 'Certifications' }
    api.post.mockResolvedValueOnce({ data: mockDoc })

    const store = useDocumentStore()
    const file = new File(['content'], 'cert.pdf', { type: 'application/pdf' })
    const result = await store.uploadDocument(file, 'Certifications')

    expect(result).toEqual(mockDoc)
    expect(store.documents[0]).toEqual(mockDoc)
  })

  it('deleteDocument removes from list', async () => {
    api.delete.mockResolvedValueOnce({ data: { ok: true } })

    const store = useDocumentStore()
    store.documents = [{ id: '1', name: 'a.pdf' }, { id: '2', name: 'b.pdf' }]

    await store.deleteDocument('1')

    expect(store.documents).toEqual([{ id: '2', name: 'b.pdf' }])
  })

  it('downloadUrl returns correct path', () => {
    const store = useDocumentStore()
    expect(store.downloadUrl('abc123')).toBe('http://localhost:4000/api/documents/abc123/download')
  })
})
