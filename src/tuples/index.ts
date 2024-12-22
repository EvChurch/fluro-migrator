import { attributeEtl } from './attribute/attribute'
import { campusEtl } from './campus/campus'
import { contactEtl } from './contact/contact'
import { maritalStatusEtl } from './definedValues/maritalStatus/maritalStatus'
import { definitionContactEtl } from './definition/contact/contact'
// import { definitionTeamEtl } from './definition/team/team'
import { familyEtl } from './family/family'
import { tagEtl } from './tag/tag'

export const tuples = [
  tagEtl,
  attributeEtl,
  definitionContactEtl,
  // definitionTeamEtl,
  campusEtl,
  familyEtl,
  maritalStatusEtl,
  contactEtl
]
