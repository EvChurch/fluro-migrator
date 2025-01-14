import { attributeEtl } from './attribute/attribute'
import { campusEtl } from './campus/campus'
import { checkinEtl } from './checkin/checkin'
import { contactEtl } from './contact/contact'
import { maritalStatusEtl } from './definedValues/maritalStatus/maritalStatus'
import { definitionContactEtl } from './definition/contact/contact'
// import { definitionTeamEtl } from './definition/team/team'
import { familyEtl } from './family/family'
import { serviceEtl } from './service/service'
import { tagEtl } from './tag/tag'
import { totalIndividualEtl } from './totalIndividual/totalIndividual'

export const tuples = [
  tagEtl,
  attributeEtl,
  definitionContactEtl,
  // definitionTeamEtl,
  campusEtl,
  familyEtl,
  maritalStatusEtl,
  contactEtl,
  totalIndividualEtl,
  serviceEtl,
  checkinEtl
]
