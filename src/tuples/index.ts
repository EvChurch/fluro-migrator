import { contactEtl } from './contact/contact'
import { definitionContactEtl } from './definition/contact/contact'
// import { definitionTeamEtl } from './definition/team/team'
import { familyEtl } from './family/family'

export const tuples = [
  definitionContactEtl,
  // definitionTeamEtl,
  familyEtl,
  contactEtl
]
