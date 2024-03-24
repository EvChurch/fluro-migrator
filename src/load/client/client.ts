import createClient from 'openapi-fetch'

import type { paths } from './__generated__/v1'

// eslint-disable-next-line @typescript-eslint/unbound-method
export const { GET, PUT, POST, DELETE } = createClient<paths>({
  baseUrl: 'https://rock.aucklandev.co.nz/',
  headers: { 'Authorization-Token': `${process.env.ROCK_API_TOKEN}` }
})
