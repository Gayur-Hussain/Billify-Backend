import { ZodError } from 'zod'

export const errorMiddleware = (err, req, res, next) => {
  // If validation error from Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    })
  }

  // If custom API error or general error
  const status = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Log error to server console for debugging
  console.error('❌ Server Error:', err)

  res.status(status).json({
    success: false,
    message
  })
}
