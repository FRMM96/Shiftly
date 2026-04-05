/**
 * Integration test: register → login → create shift → apply
 *
 * Requires a running PostgreSQL with DATABASE_URL set and migrations applied.
 * Run: DATABASE_URL=... npx vitest run
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

// Ensure env is loaded before app initializes
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-for-ci'

const app = require('../app')

const unique = Date.now()
const managerCreds = { email: `boss_${unique}@test.com`, username: `boss_${unique}`, password: 'Test1234!', role: 'BOSS', companyName: `TestCo_${unique}` }
let managerToken = ''
let inviteCode = ''
const workerCreds = { email: `emp_${unique}@test.com`, username: `emp_${unique}`, password: 'Test1234!', role: 'EMPLOYEE' }
let workerToken = ''
let shiftId = ''

describe('Core flow: register → login → create shift → apply', () => {
  // --- Manager registration ---
  it('registers a manager and creates a company', async () => {
    const res = await request(app).post('/api/auth/register').send(managerCreds)
    expect(res.status).toBe(201)
    expect(res.body.token).toBeDefined()
    expect(res.body.companyInviteCode).toBeDefined()
    managerToken = res.body.token
    inviteCode = res.body.companyInviteCode
  })

  // --- Manager login ---
  it('logs in the manager', async () => {
    const res = await request(app).post('/api/auth/login').send({ emailOrUsername: managerCreds.email, password: managerCreds.password })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    managerToken = res.body.token
  })

  // --- Worker registration ---
  it('registers a worker using the invite code', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...workerCreds, inviteCode })
    expect(res.status).toBe(201)
    expect(res.body.token).toBeDefined()
    workerToken = res.body.token
  })

  // --- Create shift (manager) ---
  it('manager creates an OPEN shift', async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    const res = await request(app)
      .post('/api/shifts')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ business: 'TestCo', roleName: 'Barista', date: tomorrow, startTime: '09:00', endTime: '17:00', status: 'OPEN' })
    expect(res.status).toBe(201)
    expect(res.body.shift || res.body).toHaveProperty('id')
    shiftId = (res.body.shift || res.body).id
  })

  // --- Worker applies to the shift ---
  it('worker applies to the open shift', async () => {
    const res = await request(app)
      .post(`/api/marketplace/shifts/${shiftId}/apply`)
      .set('Authorization', `Bearer ${workerToken}`)
    expect(res.status).toBe(201)
    expect(res.body.application).toBeDefined()
  })

  // --- Duplicate apply is idempotent (upsert) ---
  it('duplicate apply is idempotent', async () => {
    const res = await request(app)
      .post(`/api/marketplace/shifts/${shiftId}/apply`)
      .set('Authorization', `Bearer ${workerToken}`)
    expect(res.status).toBe(201)
    expect(res.body.application).toBeDefined()
  })

  // --- Unauthenticated access is blocked ---
  it('rejects unauthenticated shift creation', async () => {
    const res = await request(app).post('/api/shifts').send({ business: 'X', roleName: 'Y', date: '2026-01-01', startTime: '09:00', endTime: '17:00' })
    expect(res.status).toBe(401)
  })
})
