const logger = require("../lib/logger")
const prisma = require("../db/prisma");

/**
 * Helper: get start/end of the current calendar month in UTC.
 */
function monthRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
  return { start, end };
}

/**
 * Helper: calculate total hours from paired clock events.
 * Events must be sorted by timestamp ASC.
 */
function hoursFromClockEvents(events) {
  let total = 0;
  for (let i = 0; i < events.length; i++) {
    if (events[i].type === "CLOCK_IN") {
      const out = events.slice(i + 1).find((e) => e.type === "CLOCK_OUT");
      if (out) {
        total += (new Date(out.timestamp) - new Date(events[i].timestamp)) / 3600000;
      }
    }
  }
  return Math.round(total * 100) / 100;
}

// ── Manager: GET /api/analytics/summary ─────────────────────────────
async function summary(req, res) {
  try {
    const companyId = req.user.companyId;
    const { start, end } = monthRange();

    const [totalShifts, shiftsByStatus, clockEvents, applications] =
      await Promise.all([
        prisma.shift.count({ where: { companyId } }),
        prisma.shift.groupBy({
          by: ["status"],
          where: { companyId },
          _count: true,
        }),
        prisma.clockEvent.findMany({
          where: { companyId, timestamp: { gte: start, lt: end } },
          orderBy: { timestamp: "asc" },
        }),
        prisma.shiftApplication.findMany({
          where: { shift: { companyId } },
          select: { status: true },
        }),
      ]);

    const statusMap = {};
    for (const row of shiftsByStatus) statusMap[row.status] = row._count;

    const filled =
      (statusMap["ACTIVE"] || 0) + (statusMap["COMPLETED"] || 0);
    const fillRate =
      totalShifts > 0 ? Math.round((filled / totalShifts) * 100) : 0;

    const totalHours = hoursFromClockEvents(clockEvents);

    // Labour cost: sum pay (stored as string) for filled shifts this month
    const filledShifts = await prisma.shift.findMany({
      where: {
        companyId,
        status: { in: ["ACTIVE", "COMPLETED"] },
        date: { gte: start, lt: end },
      },
      select: { pay: true },
    });
    const labourCost = filledShifts.reduce((sum, s) => {
      const n = parseFloat(s.pay);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

    const accepted = applications.filter(
      (a) => a.status === "ACCEPTED"
    ).length;
    const acceptanceRate =
      applications.length > 0
        ? Math.round((accepted / applications.length) * 100)
        : 0;

    res.json({
      totalShifts,
      fillRate,
      totalHours,
      labourCost: Math.round(labourCost),
      acceptanceRate,
    });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
}

// ── Shared: GET /api/analytics/shifts-by-status ─────────────────────
async function shiftsByStatus(req, res) {
  try {
    const companyId = req.user.companyId;
    const groups = await prisma.shift.groupBy({
      by: ["status"],
      where: { companyId },
      _count: true,
    });
    const result = {};
    for (const g of groups) result[g.status] = g._count;
    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
}

// ── Shared: GET /api/analytics/hours-by-week ────────────────────────
async function hoursByWeek(req, res) {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.role === "EMPLOYEE" ? req.user.id : undefined;

    // Last 8 weeks
    const now = new Date();
    const eightWeeksAgo = new Date(now);
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const where = {
      companyId,
      timestamp: { gte: eightWeeksAgo },
    };
    if (userId) where.userId = userId;

    const events = await prisma.clockEvent.findMany({
      where,
      orderBy: { timestamp: "asc" },
    });

    // Group by ISO week
    const weeks = {};
    for (const ev of events) {
      const d = new Date(ev.timestamp);
      // Monday-based ISO week label (YYYY-Www)
      const jan4 = new Date(d.getFullYear(), 0, 4);
      const weekNum = Math.ceil(
        ((d - new Date(d.getFullYear(), 0, 1)) / 86400000 + jan4.getDay()) / 7
      );
      const label = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
      if (!weeks[label]) weeks[label] = [];
      weeks[label].push(ev);
    }

    const result = Object.entries(weeks)
      .map(([week, evts]) => ({ week, hours: hoursFromClockEvents(evts) }))
      .sort((a, b) => a.week.localeCompare(b.week));

    res.json(result);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
}

// ── Manager: GET /api/analytics/attendance-rate ─────────────────────
async function attendanceRate(req, res) {
  try {
    const companyId = req.user.companyId;
    const { start, end } = monthRange();

    const [scheduledCount, clockedInShiftIds] = await Promise.all([
      prisma.shift.count({
        where: {
          companyId,
          status: { in: ["ACTIVE", "COMPLETED"] },
          date: { gte: start, lt: end },
        },
      }),
      prisma.clockEvent.findMany({
        where: {
          companyId,
          type: "CLOCK_IN",
          timestamp: { gte: start, lt: end },
        },
        select: { shiftId: true },
        distinct: ["shiftId"],
      }),
    ]);

    const clockedIn = clockedInShiftIds.length;
    const rate =
      scheduledCount > 0
        ? Math.round((clockedIn / scheduledCount) * 100)
        : 0;

    res.json({ scheduled: scheduledCount, clockedIn, rate });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
}

// ── Worker: GET /api/analytics/worker-summary ───────────────────────
async function workerSummary(req, res) {
  try {
    const userId = req.user.id;
    const companyId = req.user.companyId;
    const { start, end } = monthRange();

    const [clockEvents, upcomingShifts, applications] = await Promise.all([
      prisma.clockEvent.findMany({
        where: { userId, companyId, timestamp: { gte: start, lt: end } },
        orderBy: { timestamp: "asc" },
      }),
      prisma.shift.findMany({
        where: {
          workerId: userId,
          companyId,
          status: "ACTIVE",
          date: { gte: new Date() },
        },
        select: { startTime: true, endTime: true, pay: true },
      }),
      prisma.shiftApplication.findMany({
        where: { userId },
        select: { status: true },
      }),
    ]);

    const hoursThisMonth = hoursFromClockEvents(clockEvents);

    // Estimate upcoming hours from shift start/end times
    let upcomingHours = 0;
    for (const s of upcomingShifts) {
      const [sh, sm] = (s.startTime || "0:0").split(":").map(Number);
      const [eh, em] = (s.endTime || "0:0").split(":").map(Number);
      let diff = eh + em / 60 - (sh + sm / 60);
      if (diff < 0) diff += 24; // overnight
      upcomingHours += diff;
    }
    upcomingHours = Math.round(upcomingHours * 100) / 100;

    // Pay estimate: sum pay for filled shifts this month
    const filledShifts = await prisma.shift.findMany({
      where: {
        workerId: userId,
        companyId,
        date: { gte: start, lt: end },
      },
      select: { pay: true },
    });
    const payEstimate = filledShifts.reduce((sum, s) => {
      const n = parseFloat(s.pay);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

    const accepted = applications.filter(
      (a) => a.status === "ACCEPTED"
    ).length;
    const successRate =
      applications.length > 0
        ? Math.round((accepted / applications.length) * 100)
        : 0;

    res.json({
      hoursThisMonth,
      upcomingHours,
      payEstimate: Math.round(payEstimate),
      successRate,
    });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
}

module.exports = {
  summary,
  shiftsByStatus,
  hoursByWeek,
  attendanceRate,
  workerSummary,
};
