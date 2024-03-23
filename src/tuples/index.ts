import { contactEtl } from './contact/contact'
import { definitionContactEtl } from './definition/contact/contact'
import { definitionTeamEtl } from './definition/team/team'
import { demographicDetailsETL } from './detailSheets/detailSheets'
import { familyEtl } from './family/family'

export const tuples = [
  definitionContactEtl,
  definitionTeamEtl,
  demographicDetailsETL,
  familyEtl,
  contactEtl
]
