const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    const user = await prisma.user.findFirst({ select: { id: true, email: true, username: true, role: true, companyId: true, phone: true, department: true, location: true, emergencyContact: true, onboarded: true } });
    console.log("Success:", !!user);
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
run();
