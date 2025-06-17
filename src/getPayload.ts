import payload from 'payload'
import config from '@payload-config'

interface CachedPayload {
  client: typeof payload | null
  promise: Promise<typeof payload> | null
}

declare global {
  // eslint-disable-next-line no-var
  var payload: CachedPayload | undefined
}

let cached = global.payload

if (!cached) {
  cached = global.payload = {
    client: null,
    promise: null,
  }
}

export const getPayloadClient = async () => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is missing')
  }

  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      config,
    })
  }

  try {
    cached.client = await cached.promise
  } catch (e: unknown) {
    cached.promise = null
    throw e
  }

  return cached.client
}
