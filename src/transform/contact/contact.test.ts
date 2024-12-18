import type { FluroContact } from '../../extract/contact'
import type { RockContact } from '../../load/contact'
import type { Cache } from '../../load/types'

import { transform } from '.'

describe('contact', () => {
  describe('translate', () => {
    const fluroContact: FluroContact = {
      _id: '1',
      firstName: 'John',
      lastName: 'Smith',
      gender: 'male',
      emails: ['example@example.com'],
      definition: 'visitor',
      phoneNumbers: [],
      status: 'active',
      preferredName: 'JS',
      maritalStatus: 'single',
      householdRole: 'child',
      deceased: false,
      deceasedDate: null,
      details: {
        evPathwayDetails: {
          data: {
            '1stVisit': '2021-01-01',
            '2ndVisit': '2021-01-02',
            memberapprovaldate: '2021-01-03'
          }
        }
      }
    }
    const rockContact: RockContact = {
      BirthMonth: undefined,
      BirthYear: undefined,
      BirthDate: undefined,
      BirthDay: undefined,
      DeceasedDate: undefined,
      Email: 'example@example.com',
      FirstName: 'John',
      ForeignKey: '1',
      Gender: 'Male',
      IsDeceased: false,
      IsSystem: false,
      LastName: 'Smith',
      PrimaryFamilyId: undefined,
      ConnectionStatusValueId: 1,
      NickName: 'JS',
      MaritalStatusValueId: 144,
      data: {
        PhoneNumber: [],
        FluroRecordStatus: 'active',
        GroupRoleId: 4,
        AttributeValues: {
          FirstVisit: '2021-01-01',
          SecondVisit: '2021-01-02',
          MembershipDate: '2021-01-03'
        }
      }
    }
    it('should translate a fluro api contact to a rock contact', () => {
      const cache: Cache = {
        'definition/contact': {
          fluroId: {
            data: {
              definitionName: 'visitor'
            },
            rockId: 1
          }
        },
        'definedValues/maritalStatus': {
          single: {
            rockId: 144
          }
        }
      }
      expect(transform(cache, fluroContact)).toEqual(rockContact)
    })
  })
})
