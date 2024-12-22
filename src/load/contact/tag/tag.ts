import f from 'odata-filter-builder'

import { entityTypes } from '../../../extract/attribute/entityTypes'
import type { components } from '../../client'
import { GET, POST, RockApiError } from '../../client'
import type { RockContact } from '../contact'

export async function load(
  contact: components['schemas']['Rock.Model.Person'],
  value: RockContact
): Promise<void> {
  if (contact.Guid == null) return

  const { data, error } = await GET('/api/TaggedItems', {
    params: {
      query: {
        $filter: f()
          .eq('EntityTypeId', entityTypes['Rock.Model.Person'])
          .eq('EntityGuid', `guid'${contact.Guid}'`, false)
          .toString()
      }
    }
  })

  if (error != null)
    throw new RockApiError(error, { cause: { EntityGuid: contact.Guid } })

  const existingTagIds = data.map((taggedItem) => taggedItem.TagId)

  const TagIds = value.data.TagIds.filter(
    (tagId) => !existingTagIds.includes(tagId)
  )

  for (const TagId of TagIds) {
    const { error } = await POST('/api/TaggedItems', {
      body: {
        TagId,
        EntityTypeId: entityTypes['Rock.Model.Person'],
        EntityGuid: contact.Guid,
        IsSystem: false
      }
    })

    if (error != null)
      throw new RockApiError(error, {
        cause: { TagId, EntityGuid: contact.Guid }
      })
  }
}
