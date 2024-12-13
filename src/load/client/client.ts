import createClient from 'openapi-fetch'

import type { paths } from './__generated__/v1'

// eslint-disable-next-line @typescript-eslint/unbound-method
export const { GET, POST, PATCH } = createClient<paths>({
  baseUrl: 'https://rock.ev.church/',
  headers: { 'Authorization-Token': `${process.env.ROCK_API_TOKEN}` }
})
