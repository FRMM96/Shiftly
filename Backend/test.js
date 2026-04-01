const { z } = require('zod');
const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2).max(50),
  password: z.string().min(6),
  role: z.enum(['BOSS', 'EMPLOYEE']),
  inviteCode: z.string().optional(),
  companyName: z.string().optional()
}).strict()

try {
  registerSchema.parse({
      email: "manager@example.com",
      username: "manager1",
      password: "password123",
      role: "BOSS",
      inviteCode: "",
      companyName: "Acme Corp",
      dob: "1990-01-01"
  })
} catch(err) {
  console.log(err.name);
  console.log(err instanceof z.ZodError);
}
