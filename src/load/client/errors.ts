export class RockApiError extends Error {
  constructor(error: { Message?: string }, options?: { cause?: object }) {
    super(error.Message ?? 'UnknownError')
    this.name = 'RockApiError'
    this.cause = { ...options?.cause, error }
  }
}
