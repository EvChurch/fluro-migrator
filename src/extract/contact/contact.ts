import z from 'zod'

import { extractFromFluro } from '../lib'

const schema = z.object({
  _id: z.string(),
  dobDay: z.number().optional(),
  dobMonth: z.number().optional(),
  dobYear: z.number().optional(),
  dob: z.string().datetime().optional(),
  deceased: z.boolean(),
  deceasedDate: z.string().nullable(),
  emails: z.array(z.string()),
  firstName: z.string(),
  lastName: z.string(),
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
      'dobDay',
      'dobMonth',
      'dobYear',
      'dob',
      'deceased',
      'deceasedDate',
      'emails',
      'firstName',
      'lastName',
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
      'details.hsTrainingDetails.items'
    ]
  },
  schema
})
