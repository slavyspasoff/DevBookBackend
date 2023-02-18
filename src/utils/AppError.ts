export default class extends Error {
  statusCode: number
  status: string
  isOperational: boolean

  constructor(message: string, statusCode?: number) {
    super(message)
    this.statusCode = statusCode || 500
    this.status = this.statusCode < 500 ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}
