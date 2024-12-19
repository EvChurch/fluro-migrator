import type { components } from '../../load/client'
import type { ExtractIterator } from '../types'

import { entityTypes } from './entityTypes'
import { fieldTypes } from './fieldTypes'

export type FluroAttribute = Omit<
  components['schemas']['Rock.Model.Attribute'],
  'Key'
> & {
  _id: string
}

const attributes: FluroAttribute[] = [
  {
    _id: 'EmergencyContactName',
    AbbreviatedName: 'Emergency Contact Name',
    FieldTypeId: fieldTypes.Text,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Emergency Contact Name',
    Description: 'If Parent/Guardian cannot be reached',
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 54,
        Name: 'Childhood Information',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 1,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'EmergencyContactRelationship',
    AbbreviatedName: 'Emergency Contact Relationship',
    FieldTypeId: fieldTypes.Text,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Emergency Contact Relationship',
    Description: "Emergency Contact's Relationship to the child",
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 54,
        Name: 'Childhood Information',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 2,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'EmergencyContactNumber',
    AbbreviatedName: 'Emergency Contact Number',
    FieldTypeId: fieldTypes.PhoneNumber,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Emergency Contact Number',
    Description: "Emergency Contact's Phone Number",
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 54,
        Name: 'Childhood Information',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 3,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  }
]

export async function extract(): Promise<
  AsyncIterator<ExtractIterator<FluroAttribute>>
> {
  let repeat = 1

  return await Promise.resolve({
    next: async (): Promise<{
      value: { collection: FluroAttribute[]; max: number }
      done: boolean
    }> => {
      if (repeat === 0) {
        return await Promise.resolve({
          value: { collection: [], max: attributes.length },
          done: true
        })
      } else {
        repeat -= 1
        return await Promise.resolve({
          value: { collection: attributes, max: attributes.length },
          done: false
        })
      }
    }
  })
}
