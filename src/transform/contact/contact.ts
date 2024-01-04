import type { FluroContact } from '../../extract/contact'
import type { RockContact } from '../../load/contact'
import type { Mapper } from '../../load/types'

function transformGender(gender: string): 'Unknown' | 'Male' | 'Female' {
  switch (gender) {
    case 'male':
      return 'Male'
    case 'Female':
      return 'Female'
    default:
    case 'unknown':
      return 'Unknown'
  }
}

/**
 * transforms a fluro api contact object to a rock contact object
 */
export function transform(mapper: Mapper, contact: FluroContact): RockContact {
  const contactDefinitionsMapperToArray = Object.values(
    mapper['contactDefinition']
  )
  const contactDefinitionObject = contactDefinitionsMapperToArray.find(
    (val) => val?.data?.rockContactDefinition === contact.definition
  )

  // console.log(contactDefinitionObject)

  // console.log({
  //   IsSystem: false,
  //   BirthMonth: contact.dobMonth,
  //   BirthYear: contact.dobYear,
  //   IsDeceased: contact.deceased,
  //   DeceasedDate: contact.deceasedDate,
  //   Email: contact?.emails?.[0] ?? '',
  //   FirstName: contact.firstName,
  //   LastName: contact.lastName,
  //   ForeignKey: contact._id,
  //   Gender: transformGender(contact.gender),
  //   ConnectionStatusValueId: contactDefinitionObject?.rockId,
  //   PrimaryFamilyId:
  //     contact.family != null
  //       ? mapper['family'][contact.family._id]?.rockId
  //       : undefined,
  //   FamilyRole:
  //     contact?.householdRole != null && contact.householdRole === 'child'
  //       ? 4
  //       : 3
  // })

  return {
    IsSystem: false,
    BirthMonth: contact.dobMonth,
    BirthYear: contact.dobYear,
    IsDeceased: contact.deceased,
    DeceasedDate: contact.deceasedDate,
    Email: contact?.emails?.[0] ?? '',
    FirstName: contact.firstName,
    LastName: contact.lastName,
    ForeignKey: contact._id,
    Gender: transformGender(contact.gender),
    ConnectionStatusValueId: contactDefinitionObject?.rockId,
    PrimaryFamilyId:
      contact.family != null
        ? mapper['family'][contact.family._id]?.rockId
        : undefined,
    FamilyRole:
      contact?.householdRole != null && contact.householdRole === 'child'
        ? 4
        : 3
  }
}
