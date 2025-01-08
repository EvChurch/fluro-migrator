import fetchRetry from 'fetch-retry'
import createClient from 'openapi-fetch'

import type { paths } from './__generated__/v1'

const fetch = fetchRetry(global.fetch, {
  retries: 5,
  retryDelay: 800,
  retryOn: [502, 503]
})

// eslint-disable-next-line @typescript-eslint/unbound-method
export const { GET, POST, PATCH, DELETE } = createClient<paths>({
  baseUrl: 'https://rock.ev.church/',
  headers: { 'Authorization-Token': `${process.env.ROCK_API_TOKEN}` },
  fetch: fetch as unknown as typeof global.fetch
})
