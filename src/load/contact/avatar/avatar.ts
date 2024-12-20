import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

import { client } from '../../../extract/client'
import type { RockContact } from '../contact'

export async function load(
  data: { [key: string]: unknown; Guid?: string; PhotoId?: number },
  value: RockContact
): Promise<void> {
  if (data.PhotoId != null) return

  const basePath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'tmp',
    'cache',
    'contact'
  )
  if (!existsSync(basePath)) mkdirSync(basePath, { recursive: true })

  const avatarPath = path.join(basePath, `avatar_${value.ForeignKey}.jpg`)
  if (!existsSync(avatarPath)) {
    const avatarResponse = await client.get(
      `/get/avatar/contact/${value.ForeignKey}`,
      {
        params: { w: 400, h: 400, upscale: true },
        responseType: 'arraybuffer'
      }
    )
    writeFileSync(avatarPath, avatarResponse.data as unknown as DataView)
  }

  const defaultBuf = readFileSync(path.join(__dirname, 'default.jpg'))
  const avatarBuf = readFileSync(avatarPath)

  if (
    Buffer.compare(new Uint8Array(defaultBuf), new Uint8Array(avatarBuf)) === 0
  )
    return

  await fetch(
    `https://rock.ev.church/api/People/UpdatePersonProfilePhoto?personGuid=${data.Guid}&filename=avatar_${value.ForeignKey}.jpg`,
    {
      method: 'POST',
      headers: new Headers({
        accept: 'application/json',
        'Authorization-Token': process.env.ROCK_API_TOKEN ?? '',
        'Content-Type': 'image/jpeg'
      }),
      body: readFileSync(avatarPath)
    }
  )
}
