import { entityTypes } from '../../extract/attribute/entityTypes'
import type { FluroTag } from '../../extract/tag'
import type { RockTag } from '../../load/tag'
import type { Cache } from '../../load/types'

export function transform(_cache: Cache, value: FluroTag): RockTag {
  return {
    IsSystem: false,
    Name: value.title,
    Order: 0,
    ForeignKey: value._id,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    EntityTypeQualifierColumn: '',
    EntityTypeQualifierValue: '',
    IsActive: value.status === 'active',
    BackgroundColor: '#4F63FF'
  }
}
