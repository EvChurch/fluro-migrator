import type { FluroDefinitionContact } from '../../../extract/definition/contact'
import type { RockDefinitionContact } from '../../../load/definition/contact'
import type { Cache } from '../../../load/types'

function transformTitle(title: string): string {
  switch (title) {
    case 'Attender':
      return 'Attendee'
    default:
      return title
  }
}

export function transform(
  _cache: Cache,
  value: FluroDefinitionContact
): RockDefinitionContact {
  return {
    IsSystem: false,
    Order: 0,
    Value: transformTitle(value.title),
    Description: value.firstLine,
    IsActive: value.status === 'active',
    CreatedDateTime: value.created,
    ModifiedDateTime: value.updated,
    ForeignKey: value._id,
    cache: {
      definitionName: value.definitionName
    }
  }
}
