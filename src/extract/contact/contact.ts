import z from 'zod'

import { extractFromFluro } from '../lib'

const schema = z.object({
  _id: z.string(),
  dobDay: z.number().optional(),
  dobMonth: z.number().optional(),
  dobYear: z.number().optional(),
  dob: z.string().datetime().optional(),
  dobVerified: z
    .boolean()
    .transform((v) => {
      if (v == null) return v
      return v ? 'true' : 'false'
    })
    .optional(),
  middleName: z.string().optional(),
  ethnicName: z.string().optional(),
  deceased: z.boolean(),
  deceasedDate: z.string().nullable(),
  emails: z.array(z.string()),
  firstName: z.string(),
  lastName: z.string(),
  maidenName: z.string().optional(),
  gender: z.string(),
  family: z.object({ _id: z.string() }).optional(),
  householdRole: z.string().optional(),
  phoneNumbers: z.array(z.string()),
  status: z.string(),
  maritalStatus: z.string().optional(),
  preferredName: z.string().optional(),
  definition: z.string().nullish(),
  details: z
    .object({
      evPathwayDetails: z
        .object({
          data: z
            .object({
              evPathway: z
                .array(
                  z.enum([
                    'Explaining Christianity',
                    'Newish Connect',
                    'Member'
                  ])
                )
                .optional(),
              newishPathway: z
                .array(
                  z.enum([
                    'Ministry',
                    'Maturity',
                    'Membership',
                    'Mission',
                    'Magnification'
                  ])
                )
                .optional(),
              signed2030VisionCanvas: z.string().optional(),
              '1stVisit': z.string().datetime().optional(),
              '2ndVisit': z.string().datetime().optional(),
              memberapprovaldate: z.string().datetime().optional(),
              magNewish: z.string().datetime().optional(),
              misNewish: z.string().datetime().optional(),
              memNewish: z.string().datetime().optional(),
              matNewish: z.string().datetime().optional(),
              minNewish: z.string().datetime().optional(),
              newishStartDate: z.string().datetime().optional(),
              newishCompletionDate: z.string().datetime().optional(),
              memberremovaldate: z.string().datetime().nullable().optional()
            })
            .optional()
        })
        .optional(),
      childDetails: z
        .object({
          data: z
            .object({
              emergencyContactNameifparentguardiancannotbereached: z
                .string()
                .optional(),
              emergencyContactNumber: z.string().optional(),
              emergencyContactRelationship: z.string().optional(),
              istheparentguardianhappyforAucklandEvtotakeandusephotosandorvideosoftheirchildforofficialchurchuse:
                z
                  .string()
                  .optional()
                  .transform((v) => {
                    if (v == null) return v
                    return v === 'Yes' ? 'true' : 'false'
                  }),
              istheparentguardianhappyfortheirchildsleadertosendmailtotheirchildegbirthdaycardsgetwellsoonspecialinvitationsetcAllmailwillbeaddressedcareofparents:
                z
                  .string()
                  .optional()
                  .transform((v) => {
                    if (v == null) return v
                    return v === 'Yes' ? 'true' : 'false'
                  }),
              isthereanyonewhoislegallyrestrictedfromseeingthechild: z
                .string()
                .optional()
                .transform((v) => {
                  if (v == null) return v
                  return v === 'Yes' ? 'true' : 'false'
                }),
              nameofthepersons: z.string().optional()
            })
            .optional()
        })
        .optional(),
      hsTrainingDetails: z
        .object({
          data: z
            .object({
              basicHsTraining: z.string().datetime().nullish(),
              firstAidTrainingExpiryDate: z.string().datetime().nullish(),
              hsRiskManagementandAssessmentTraining: z
                .string()
                .datetime()
                .nullish(),
              safeMinistryLeadersTraining: z.string().datetime().nullish(),
              policeVettingCompletionDate: z.string().datetime().nullish(),
              responsetoPoliceVettingRequest: z
                .enum([
                  'Not asked',
                  'Rejected to undergo Police Vetting',
                  'Accepted to undergo Police Vetting'
                ])
                .optional()
            })
            .optional()
        })
        .optional(),
      faithInfo: z
        .object({
          data: z.object({
            dateofBaptism: z.string().datetime().nullish(),
            isaChristian: z.enum(['Yes', 'No', 'Unsure']).optional()
          })
        })
        .optional(),
      financialDetail: z
        .object({
          data: z.object({
            accountNumber: z.string().nullish()
          })
        })
        .optional(),
      demographicsDetails: z
        .object({
          data: z
            .object({
              adultDemographics: z.enum(['UoA', 'AUT', 'Other', '']).optional(),
              currentStudent: z
                .boolean()
                .transform((v) => {
                  if (v == null) return v
                  return v ? 'true' : 'false'
                })
                .optional(),
              demographics: z
                .enum(['Adult', 'Youth', 'Kids', 'Baby', ''])
                .optional(),
              studentIdNumber: z.string().optional(),
              whichcampus: z.enum(['City', 'North ', 'South', '']).optional()
            })
            .transform((v) => {
              if (v == null) return v
              let tertiaryInstitution:
                | 'University of Auckland'
                | 'AUT North Campus'
                | 'AUT South Campus'
                | 'AUT City Campus'
                | 'Other'
                | undefined
              switch (v.adultDemographics) {
                case 'UoA':
                  tertiaryInstitution = 'University of Auckland'
                  break
                case 'AUT':
                  switch (v.whichcampus) {
                    case 'North ':
                      tertiaryInstitution = 'AUT North Campus'
                      break
                    case 'South':
                      tertiaryInstitution = 'AUT South Campus'
                      break
                    default:
                      tertiaryInstitution = 'AUT City Campus'
                      break
                  }
                  break
                case 'Other':
                  tertiaryInstitution = 'Other'
                  break
              }
              return {
                ...v,
                tertiaryInstitution
              }
            })
            .optional()
        })
        .optional()
    })
    .optional()
})

export type FluroContact = z.infer<typeof schema>

export const extract = extractFromFluro<FluroContact>({
  contentType: 'contact',
  filterBody: {
    allDefinitions: true,
    includeArchived: true,
    search: '5c05059148890574c5395ccb' // tatai
    // search: '5fefe87196930a095efc8e88' // jeanny
  },
  multipleBody: {
    select: [
      '_id',
      'ethnicName',
      'middleName',
      'dobDay',
      'dobMonth',
      'dobYear',
      'dobVerified',
      'dob',
      'deceased',
      'deceasedDate',
      'emails',
      'firstName',
      'lastName',
      'maidenName',
      'gender',
      'family',
      'householdRole',
      'phoneNumbers',
      'status',
      'maritalStatus',
      'preferredName',
      'definition',
      'details.evPathwayDetails.items',
      'details.childDetails.items',
      'details.faithInfo.items',
      'details.financialDetail.items',
      'details.hsTrainingDetails.items',
      'details.demographicsDetails.items'
    ]
  },
  schema
})
