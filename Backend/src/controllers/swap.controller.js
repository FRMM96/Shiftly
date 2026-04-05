const logger = require("../lib/logger")
const prisma = require('../db/prisma')
const { createNotification, notifyManagers } = require('../helpers/notification')

exports.proposeSwap = async (req, res) => {
  try {
    const { requesterShiftId, targetWorkerId, targetShiftId } = req.body

    if (!requesterShiftId || !targetWorkerId || !targetShiftId) {
      return res.status(400).json({
        message: 'requesterShiftId, targetWorkerId, and targetShiftId are required'
      })
    }

    // Verify requester owns their shift
    const requesterShift = await prisma.shift.findUnique({ where: { id: requesterShiftId } })
    if (!requesterShift || requesterShift.workerId !== req.user.id) {
      return res.status(403).json({ message: 'You are not assigned to this shift' })
    }

    // Verify target owns their shift and is in same company
    const targetShift = await prisma.shift.findUnique({ where: { id: targetShiftId } })
    if (!targetShift || targetShift.workerId !== targetWorkerId) {
      return res.status(400).json({ message: 'Target worker is not assigned to that shift' })
    }
    if (targetShift.companyId !== req.user.companyId) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const swap = await prisma.shiftSwapRequest.create({
      data: {
        requesterId: req.user.id,
        requesterShiftId,
        targetWorkerId,
        targetShiftId,
        companyId: req.user.companyId
      }
    })

    // Notify the target worker
    await createNotification(
      targetWorkerId,
      req.user.companyId,
      'SWAP_REQUEST',
      `${req.user.username} wants to swap shifts with you`,
      '/worker/swapshift'
    )

    // Notify managers
    await notifyManagers(
      req.user.companyId,
      'SWAP_REQUEST',
      `${req.user.username} requested a shift swap`,
      '/manager'
    )

    return res.status(201).json({ swap })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.listSwaps = async (req, res) => {
  try {
    const where = { companyId: req.user.companyId }

    if (req.user.role === 'EMPLOYEE') {
      where.OR = [
        { requesterId: req.user.id },
        { targetWorkerId: req.user.id }
      ]
    }

    const swaps = await prisma.shiftSwapRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        requester: { select: { id: true, email: true, username: true } },
        targetWorker: { select: { id: true, email: true, username: true } }
      }
    })

    return res.json({ swaps })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

exports.updateSwap = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ message: 'status must be ACCEPTED, REJECTED, or CANCELLED' })
    }

    const swap = await prisma.shiftSwapRequest.findUnique({ where: { id } })
    if (!swap) return res.status(404).json({ message: 'Swap request not found' })
    if (swap.companyId !== req.user.companyId) return res.status(403).json({ message: 'Forbidden' })
    if (swap.status !== 'PENDING') return res.status(400).json({ message: 'Swap already processed' })

    // Only managers can accept; target worker or requester can reject/cancel
    if (status === 'ACCEPTED' && req.user.role !== 'BOSS') {
      return res.status(403).json({ message: 'Only managers can approve swaps' })
    }

    if (status === 'ACCEPTED') {
      // Perform the swap in a transaction
      const result = await prisma.$transaction(async (tx) => {
        await tx.shift.update({
          where: { id: swap.requesterShiftId },
          data: { workerId: swap.targetWorkerId }
        })
        await tx.shift.update({
          where: { id: swap.targetShiftId },
          data: { workerId: swap.requesterId }
        })
        return tx.shiftSwapRequest.update({
          where: { id },
          data: { status: 'ACCEPTED' }
        })
      })

      await createNotification(swap.requesterId, swap.companyId, 'SWAP_ACCEPTED', 'Your shift swap has been approved', '/worker/calendar')
      await createNotification(swap.targetWorkerId, swap.companyId, 'SWAP_ACCEPTED', 'A shift swap involving you has been approved', '/worker/calendar')

      return res.json({ swap: result })
    }

    const updated = await prisma.shiftSwapRequest.update({
      where: { id },
      data: { status }
    })

    await createNotification(swap.requesterId, swap.companyId, 'SWAP_REJECTED', `Your shift swap was ${status.toLowerCase()}`, '/worker/swapshift')

    return res.json({ swap: updated })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
