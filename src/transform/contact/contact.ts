import { compact, find, truncate } from 'lodash'

import { GroupRoleId } from '../../defaults'
import type { FluroContact } from '../../extract/contact'
import type { RockContact } from '../../load/contact'
import type { Cache } from '../../load/types'

function transformGender(gender: string): 'Male' | 'Female' | 'Unknown' {
  switch (gender) {
    case 'male':
      return 'Male'
    case 'female':
      return 'Female'
    default:
    case 'unknown':
      return 'Unknown'
  }
}

function transformNewishStep(
  data: NonNullable<
    NonNullable<FluroContact['details']>['evPathwayDetails']
  >['data']
): RockContact['data']['NewishStep'] {
  if (data == null) return undefined

  const StartDateTime =
    // choose the earliest date between start date and all step dates and completion date
    compact([
      data.newishStartDate?.substring(0, 19),
      data.newishCompletionDate?.substring(0, 19),
      data.magNewish?.substring(0, 19),
      data.misNewish?.substring(0, 19),
      data.memNewish?.substring(0, 19),
      data.matNewish?.substring(0, 19),
      data.minNewish?.substring(0, 19)
    ]).sort()[0] ??
    // all step dates don't exist and start date doesn't exist but pathway exists
    // choose the earliest date
    (data.newishPathway != null && data.newishPathway?.length !== 0
      ? '1970-01-01T00:00:00'
      : undefined)

  const EndDateTime =
    // completion date exists
    // choose the latest date between start date and completion date
    (data.newishCompletionDate != null
      ? compact([StartDateTime, data.newishCompletionDate?.substring(0, 19)])
          .sort()
          .at(-1)
      : undefined) ??
    // completion date doesn't exist and all step dates exist
    // choose the latest date between start date and all step dates
    (compact([
      data.magNewish,
      data.misNewish,
      data.memNewish,
      data.matNewish,
      data.minNewish
    ]).length === 5
      ? compact([
          StartDateTime,
          data.magNewish?.substring(0, 19),
          data.misNewish?.substring(0, 19),
          data.memNewish?.substring(0, 19),
          data.matNewish?.substring(0, 19),
          data.minNewish?.substring(0, 19)
        ])
          .sort()
          .at(-1)
      : undefined) ??
    // completion date doesn't exist and some step dates don't exist but pathway exists
    // choose the latest date between start date and any step dates
    (data.newishPathway?.length === 5
      ? compact([
          '1970-01-01T00:00:00',
          StartDateTime,
          data.magNewish?.substring(0, 19),
          data.misNewish?.substring(0, 19),
          data.memNewish?.substring(0, 19),
          data.matNewish?.substring(0, 19),
          data.minNewish?.substring(0, 19)
        ])
          .sort()
          .at(-1)
      : undefined)

  const newishStep = {
    StartDateTime,
    EndDateTime,
    AttributeValues: {
      Magnification:
        data.magNewish ??
        (data.newishPathway?.includes('Magnification')
          ? StartDateTime ?? '1970-01-01T00:00:00'
          : undefined),
      Mission:
        data.misNewish ??
        (data.newishPathway?.includes('Mission')
          ? StartDateTime ?? '1970-01-01T00:00:00'
          : undefined),
      Membership:
        data.memNewish ??
        (data.newishPathway?.includes('Membership')
          ? StartDateTime ?? '1970-01-01T00:00:00'
          : undefined),
      Maturity:
        data.matNewish ??
        (data.newishPathway?.includes('Maturity')
          ? StartDateTime ?? '1970-01-01T00:00:00'
          : undefined),
      Ministry:
        data.minNewish ??
        (data.newishPathway?.includes('Ministry')
          ? StartDateTime ?? '1970-01-01T00:00:00'
          : undefined)
    }
  }

  if (newishStep.StartDateTime != null)
    return {
      ...newishStep,
      CompletedDateTime: newishStep.EndDateTime,
      StepStatusId: newishStep.EndDateTime == null ? 1 : 2
    }
}

function transformBaptismStep(
  data: NonNullable<NonNullable<FluroContact['details']>['faithInfo']>['data']
): RockContact['data']['NewishStep'] {
  if (data == null) return undefined

  if (data.dateofBaptism != null) {
    const date = new Date(data.dateofBaptism).toLocaleDateString('sv')
    return {
      CompletedDateTime: date,
      StartDateTime: date,
      EndDateTime: date,
      StepStatusId: 2,
      AttributeValues: {
        BaptismType: data.typeofBaptism == 'Infant' ? 'Infant' : 'Adult'
      }
    }
  }
}

/**
 * transforms a fluro api contact object to a rock contact object
 */
export function transform(cache: Cache, value: FluroContact): RockContact {
  const ConnectionStatusValueId = find(
    cache['definition/contact'],
    (cachedDefintion) => {
      switch (value.definition) {
        case 'leaderOfLeaders':
        case 'leader':
          return cachedDefintion.data?.definitionName === 'committed'
        case null:
        case undefined:
        case '':
        case 'inactive':
          return cachedDefintion.data?.definitionName === 'visitor'
        default:
          return cachedDefintion.data?.definitionName === value.definition
      }
    }
  )?.rockId

  if (ConnectionStatusValueId == null)
    throw new Error(
      `Couldn't find connection status value id for contact ${value._id} with definition ${value.definition}`
    )

  return {
    IsSystem: false,
    BirthDay: value?.dobDay,
    BirthMonth: value.dobMonth,
    BirthYear: value.dobYear,
    BirthDate: value?.dob,
    IsDeceased: value.deceased,
    DeceasedDate: value.deceasedDate ?? undefined,
    Email: value?.emails?.[0],
    FirstName: truncate(value.firstName, { length: 50 }),
    LastName: value.lastName,
    MiddleName: value.middleName,
    ForeignKey: value._id,
    Gender: transformGender(value.gender),
    ConnectionStatusValueId,
    PrimaryFamilyId:
      value.family != null
        ? cache['family'][value.family._id]?.rockId
        : undefined,
    MaritalStatusValueId:
      value.maritalStatus != null
        ? cache['definedValues/maritalStatus'][value.maritalStatus]?.rockId
        : undefined,
    NickName: value.preferredName,
    data: {
      GroupRoleId:
        (value.householdRole != null
          ? GroupRoleId[value.householdRole]
          : undefined) ?? GroupRoleId._default,
      PhoneNumber: value?.phoneNumbers,
      FluroRecordStatus: value.status,
      PersonPreviousName: value.maidenName,
      NewishStep: transformNewishStep(value.details?.evPathwayDetails?.data),
      BaptismStep: transformBaptismStep(value.details?.faithInfo?.data),
      TagIds: value.tags
        .map((tag) => cache['tag'][tag._id]?.rockId)
        .filter(Boolean),
      AttributeValues: {
        FirstVisit: value.details?.evPathwayDetails?.data?.['1stVisit'],
        SecondVisit: value.details?.evPathwayDetails?.data?.['2ndVisit'],
        MembershipDate:
          value.details?.evPathwayDetails?.data?.memberapprovaldate,
        MembershipRemovalDate:
          value.details?.evPathwayDetails?.data?.memberremovaldate ?? undefined,
        EmergencyContactName:
          value.details?.childDetails?.data
            ?.emergencyContactNameifparentguardiancannotbereached,
        EmergencyContactNumber:
          value.details?.childDetails?.data?.emergencyContactNumber,
        EmergencyContactRelationship:
          value.details?.childDetails?.data?.emergencyContactRelationship,
        LegalNotes: value.details?.childDetails?.data?.nameofthepersons,
        MediaPermission:
          value.details?.childDetails?.data
            ?.istheparentguardianhappyforAucklandEvtotakeandusephotosandorvideosoftheirchildforofficialchurchuse,
        MailPermission:
          value.details?.childDetails?.data
            ?.istheparentguardianhappyfortheirchildsleadertosendmailtotheirchildegbirthdaycardsgetwellsoonspecialinvitationsetcAllmailwillbeaddressedcareofparents,
        BasicHealthAndSafetyTrainingDate:
          value.details?.hsTrainingDetails?.data?.basicHsTraining,
        FirstAidTrainingCertificateExpiryDate:
          value.details?.hsTrainingDetails?.data?.firstAidTrainingExpiryDate,
        HealthAndSafetyRiskManagementAndAssessmentTrainingDate:
          value.details?.hsTrainingDetails?.data
            ?.hsRiskManagementandAssessmentTraining,
        SafeMinistryLeadersTrainingDate:
          value.details?.hsTrainingDetails?.data?.safeMinistryLeadersTraining,
        PoliceVettingCompletionDate:
          value.details?.hsTrainingDetails?.data?.policeVettingCompletionDate,
        PoliceVettingRequest:
          value.details?.hsTrainingDetails?.data
            ?.responsetoPoliceVettingRequest,
        core_GivingEnvelopeNumber:
          value.details?.financialDetail?.data?.accountNumber?.replace(
            /\D/g,
            ''
          ),
        TertiaryInstitution:
          value.details?.demographicsDetails?.data?.tertiaryInstitution,
        TertiaryCurrentlyStudying:
          value.details?.demographicsDetails?.data?.currentStudent,
        TertiaryStudentIdNumber:
          value.details?.demographicsDetails?.data?.studentIdNumber,
        EthnicName: value.ethnicName,
        BirthDateVerified: value.dobVerified
      }
    }
  }
}
