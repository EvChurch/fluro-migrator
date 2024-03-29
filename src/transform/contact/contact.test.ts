import type { FluroContact } from '../../extract/contact'
import type { RockContact } from '../../load/contact'
import type { Cache } from '../../load/types'

import { transform } from '.'

describe('contact', () => {
  describe('translate', () => {
    const fluroContact = {
      _id: '1',
      firstName: 'John',
      lastName: 'Smith',
      gender: 'male',
      emails: { 0: 'example@example.com' },
      definition: 'visitor',
      phoneNumbers: [],
      status: 'active'
    } as unknown as FluroContact
    const rockContact: RockContact = {
      BirthMonth: undefined,
      BirthYear: undefined,
      BirthDate: undefined,
      BirthDay: undefined,
      PhoneNumber: [],
      DeceasedDate: undefined,
      Email: 'example@example.com',
      FirstName: 'John',
      FamilyRole: 3,
      ForeignKey: '1',
      Gender: 'Male',
      IsDeceased: undefined,
      IsSystem: false,
      LastName: 'Smith',
      PrimaryFamilyId: undefined,
      ConnectionStatusValueId: 1,
      FluroRecordStatus: 'active'
    } as RockContact
    it('should translate a fluro api contact to a rock contact', () => {
      const cache: Cache = {
        'definition/contact': {
          fluroId: {
            data: {
              definitionName: 'visitor'
            },
            rockId: 1
          }
        }
      }
      expect(transform(cache, fluroContact)).toEqual(rockContact)
    })
  })
})
