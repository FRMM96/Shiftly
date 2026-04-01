const { ZodError } = require('zod')

/**
 * Express middleware that validates req.body against a Zod schema.
 * Usage: router.post('/route', validate(mySchema), controller)
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (err) {
      if (err.name === 'ZodError') {
        const issues = err.issues || [];
        const messages = issues.map(e => `${e.path.join('.')}: ${e.message}`)
        return res.status(400).json({ message: 'Validation error', errors: messages })
      }
      next(err)
    }
  }
}

module.exports = { validate }
