import { find, truncate } from 'lodash'

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
        BaptismDate: value.details?.faithInfo?.data?.dateofBaptism,
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
