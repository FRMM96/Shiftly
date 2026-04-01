const { z } = require('zod')

// Reusable patterns
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')
const timeString = z.string().min(1, 'Required')
const cuidOrUuid = z.string().min(1, 'Required')

// --- Auth ---
const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2).max(50),
  password: z.string().min(6),
  role: z.enum(['BOSS', 'EMPLOYEE']),
  inviteCode: z.string().optional(),
  companyName: z.string().optional()
}).strict()

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required')
}).strict()

// --- Shifts ---
const createShiftSchema = z.object({
  business: z.string().min(1).max(200),
  roleName: z.string().min(1).max(200),
  date: dateString,
  startTime: timeString,
  endTime: timeString,
  pay: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'URGENT']).optional(),
  workerId: z.string().nullable().optional(),
  status: z.enum(['ACTIVE', 'OPEN']).optional()
}).strict()

const updateShiftSchema = z.object({
  business: z.string().min(1).max(200).optional(),
  roleName: z.string().min(1).max(200).optional(),
  date: dateString.optional(),
  startTime: timeString.optional(),
  endTime: timeString.optional(),
  pay: z.string().nullable().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'URGENT']).optional(),
  workerId: z.string().nullable().optional(),
  status: z.enum(['ACTIVE', 'OPEN', 'CANCELED', 'COMPLETED']).optional()
}).strict()

// --- Marketplace ---
const assignApplicantSchema = z.object({
  applicationId: cuidOrUuid
}).strict()

// --- Profile ---
const updateProfileSchema = z.object({
  username: z.string().min(2).max(50).optional(),
  phone: z.string().max(30).optional(),
  department: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  emergencyContact: z.string().max(200).optional(),
  onboarded: z.boolean().optional()
}).strict()

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(6)
}).strict()

// --- Clock ---
const clockInOutSchema = z.object({
  shiftId: cuidOrUuid,
  type: z.enum(['CLOCK_IN', 'CLOCK_OUT']),
  location: z.string().max(500).optional()
}).strict()

// --- Time Off ---
const createTimeOffSchema = z.object({
  startDate: dateString,
  endDate: dateString,
  type: z.enum(['ANNUAL', 'SICK', 'PERSONAL']).optional(),
  notes: z.string().max(1000).optional()
}).strict()

const updateTimeOffSchema = z.object({
  status: z.enum(['APPROVED', 'DENIED'])
}).strict()

// --- Sick Leave ---
const reportSickSchema = z.object({
  date: dateString,
  reason: z.string().max(1000).optional(),
  shiftId: z.string().optional()
}).strict()

// --- Swap ---
const proposeSwapSchema = z.object({
  requesterShiftId: cuidOrUuid,
  targetWorkerId: cuidOrUuid,
  targetShiftId: cuidOrUuid
}).strict()

const updateSwapSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED', 'CANCELLED'])
}).strict()

module.exports = {
  registerSchema,
  loginSchema,
  createShiftSchema,
  updateShiftSchema,
  assignApplicantSchema,
  updateProfileSchema,
  changePasswordSchema,
  clockInOutSchema,
  createTimeOffSchema,
  updateTimeOffSchema,
  reportSickSchema,
  proposeSwapSchema,
  updateSwapSchema
}
