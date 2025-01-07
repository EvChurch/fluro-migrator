import type { components } from '../../load/client'
import type { ExtractIterator } from '../types'

import { entityTypes } from './entityTypes'
import { fieldTypes } from './fieldTypes'

export type FluroAttribute = Omit<
  components['schemas']['Rock.Model.Attribute'],
  'Key'
> & {
  _id: string
}

const attributes: FluroAttribute[] = [
  {
    _id: 'EmergencyContactName',
    AbbreviatedName: 'Emergency Contact Name',
    FieldTypeId: fieldTypes.Text,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Emergency Contact Name',
    Description: 'If Parent/Guardian cannot be reached',
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 54,
        Name: 'Childhood Information',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 1,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'EmergencyContactRelationship',
    AbbreviatedName: 'Emergency Contact Relationship',
    FieldTypeId: fieldTypes.Text,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Emergency Contact Relationship',
    Description: "Emergency Contact's Relationship to the child",
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 54,
        Name: 'Childhood Information',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 2,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'EmergencyContactNumber',
    AbbreviatedName: 'Emergency Contact Number',
    FieldTypeId: fieldTypes.PhoneNumber,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Emergency Contact Number',
    Description: "Emergency Contact's Phone Number",
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 54,
        Name: 'Childhood Information',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 3,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'MediaPermission',
    AbbreviatedName: 'Media Permission',
    FieldTypeId: fieldTypes.Boolean,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Media (Video/Photo) Permission',
    Description:
      'Is the parent/guardian happy for Ev Church to take and use photos and/or videos of their child for official church use?',
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 54,
        Name: 'Childhood Information',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 4,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'MailPermission',
    AbbreviatedName: 'Mail Permission',
    FieldTypeId: fieldTypes.Boolean,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Mail Permission',
    Description:
      "Is the parent/guardian happy for their child's leader to send mail to their child (e.g. birthday cards, get well soon, special invitations, etc.). All mail will be addressed care of parents.",
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 54,
        Name: 'Childhood Information',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 5,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'MembershipRemovalDate',
    AbbreviatedName: 'Membership Removal Date',
    FieldTypeId: fieldTypes.Date,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Membership Removal Date',
    Description:
      "The date the person's membership was removed from the register",
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 16,
        Name: 'Membership',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 0,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'BasicHealthAndSafetyTrainingDate',
    AbbreviatedName: 'Basic H&S Training Date',
    FieldTypeId: fieldTypes.Date,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Basic H&S Training Date',
    Description:
      'The date the person completed basic health and safety training',
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 161,
        Name: 'Safety & Security',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 0,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'FirstAidTrainingCertificateExpiryDate',
    AbbreviatedName: 'First Aid Training Certificate Expiry Date',
    FieldTypeId: fieldTypes.Date,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'First Aid Training Certificate Expiry Date',
    Description: "The date the person's first aid training certificate expires",
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 161,
        Name: 'Safety & Security',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 1,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'HealthAndSafetyRiskManagementAndAssessmentTrainingDate',
    AbbreviatedName: 'H&S Risk Management & Assessment Training Date',
    FieldTypeId: fieldTypes.Date,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'H&S Risk Management & Assessment Training Date',
    Description:
      'The date the person completed H&S risk management & assessment training',
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 161,
        Name: 'Safety & Security',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 2,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'SafeMinistryLeadersTrainingDate',
    AbbreviatedName: 'Safe Ministry Leaders Training Date',
    FieldTypeId: fieldTypes.Date,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Safe Ministry Leaders Training Date',
    Description: 'The date the person completed safe ministry leaders training',
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 161,
        Name: 'Safety & Security',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 3,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'PoliceVettingCompletionDate',
    AbbreviatedName: 'Police Vetting Completion Date',
    FieldTypeId: fieldTypes.Date,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Police Vetting Completion Date',
    Description: 'The date the person completed the police vetting process',
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 161,
        Name: 'Safety & Security',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 5,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'PoliceVettingRequest',
    AbbreviatedName: 'Police Vetting Request',
    FieldTypeId: fieldTypes.SingleSelect,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Police Vetting Request',
    Description: 'The state of the police vetting request',
    AttributeQualifiers: [
      {
        IsSystem: false,
        Key: 'values',
        Value:
          'Not asked,Rejected to undergo Police Vetting,Accepted to undergo Police Vetting'
      } as components['schemas']['Rock.Model.AttributeQualifier']
    ],
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 161,
        Name: 'Safety & Security',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 6,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'TertiaryInstitution',
    AbbreviatedName: 'Tertiary Institution',
    FieldTypeId: fieldTypes.SingleSelect,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Tertiary Institution',
    Description: 'The tertiary institution the person is attending or attended',
    AttributeQualifiers: [
      {
        IsSystem: false,
        Key: 'values',
        Value:
          'University of Auckland,AUT North Campus,AUT South Campus,AUT City Campus,Other'
      } as components['schemas']['Rock.Model.AttributeQualifier']
    ],
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 75,
        Name: 'Education',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 0,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'TertiaryCurrentlyStudying',
    AbbreviatedName: 'Currently Studying at a Tertiary Level?',
    FieldTypeId: fieldTypes.Boolean,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Currently Studying at a Tertiary Level?',
    Description: 'Is the person currently studying at a tertiary institution?',
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 75,
        Name: 'Education',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 1,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'TertiaryStudentIdNumber',
    AbbreviatedName: 'Tertiary Student ID Number',
    FieldTypeId: fieldTypes.Text,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Tertiary Student ID Number',
    Description: "The person's tertiary student ID number",
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 75,
        Name: 'Education',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 2,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'EthnicName',
    AbbreviatedName: 'Ethnic Name',
    FieldTypeId: fieldTypes.Text,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Ethnic Name',
    Description: "The person's ethnic name",
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 288,
        Name: 'Basic',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 0,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'BirthDateVerified',
    AbbreviatedName: 'Birth Date Verified',
    FieldTypeId: fieldTypes.Boolean,
    EntityTypeId: entityTypes['Rock.Model.Person'],
    Name: 'Birth Date Verified',
    Description: 'Has the person verified their birth date?',
    Categories: [
      {
        EntityTypeId: entityTypes['Rock.Model.Attribute'],
        Order: 0,
        Id: 288,
        Name: 'Basic',
        IsSystem: true
      }
    ],
    IsSystem: false,
    Order: 1,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false
  },
  {
    _id: 'BaptismType',
    AbbreviatedName: 'Baptism Type',
    FieldTypeId: fieldTypes.SingleSelect,
    EntityTypeId: entityTypes['Rock.Model.Step'],
    Name: 'Baptism Type',
    AttributeQualifiers: [
      {
        IsSystem: false,
        Key: 'values',
        Value: 'Infant,Adult'
      } as components['schemas']['Rock.Model.AttributeQualifier']
    ],
    Description: 'The type of baptism the person underwent',
    EntityTypeQualifierColumn: 'StepTypeId',
    EntityTypeQualifierValue: '1',
    IsSystem: false,
    Order: 0,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false,
    ShowOnBulk: true
  },
  {
    _id: 'CommitmentType',
    AbbreviatedName: 'Commitment Type',
    FieldTypeId: fieldTypes.SingleSelect,
    EntityTypeId: entityTypes['Rock.Model.Step'],
    Name: 'Commitment Type',
    AttributeQualifiers: [
      {
        IsSystem: false,
        Key: 'values',
        Value: 'Dechurched,Unchurched'
      } as components['schemas']['Rock.Model.AttributeQualifier']
    ],
    Description: 'The type of commitment the person made',
    EntityTypeQualifierColumn: 'StepTypeId',
    EntityTypeQualifierValue: '5',
    IsSystem: false,
    Order: 0,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false,
    ShowOnBulk: true
  },
  {
    _id: 'Magnification',
    AbbreviatedName: 'Magnification Completion Date',
    FieldTypeId: fieldTypes.Date,
    EntityTypeId: entityTypes['Rock.Model.Step'],
    Name: 'Magnification Completion Date',
    Description:
      'The date the person completed the magnification newish session',
    EntityTypeQualifierColumn: 'StepTypeId',
    EntityTypeQualifierValue: '2',
    IsSystem: false,
    Order: 0,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false,
    ShowOnBulk: true
  },
  {
    _id: 'Mission',
    AbbreviatedName: 'Mission Completion Date',
    FieldTypeId: fieldTypes.Date,
    EntityTypeId: entityTypes['Rock.Model.Step'],
    Name: 'Mission Completion Date',
    Description: 'The date the person completed the mission newish session',
    EntityTypeQualifierColumn: 'StepTypeId',
    EntityTypeQualifierValue: '2',
    IsSystem: false,
    Order: 1,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false,
    ShowOnBulk: true
  },
  {
    _id: 'Membership',
    AbbreviatedName: 'Membership Completion Date',
    FieldTypeId: fieldTypes.Date,
    EntityTypeId: entityTypes['Rock.Model.Step'],
    Name: 'Membership Completion Date',
    Description: 'The date the person completed the membership newish session',
    EntityTypeQualifierColumn: 'StepTypeId',
    EntityTypeQualifierValue: '2',
    IsSystem: false,
    Order: 0,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false,
    ShowOnBulk: true
  },
  {
    _id: 'Maturity',
    AbbreviatedName: 'Maturity Completion Date',
    FieldTypeId: fieldTypes.Date,
    EntityTypeId: entityTypes['Rock.Model.Step'],
    Name: 'Maturity Completion Date',
    Description: 'The date the person completed the maturity newish session',
    EntityTypeQualifierColumn: 'StepTypeId',
    EntityTypeQualifierValue: '2',
    IsSystem: false,
    Order: 0,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false,
    ShowOnBulk: true
  },
  {
    _id: 'Ministry',
    AbbreviatedName: 'Ministry Completion Date',
    FieldTypeId: fieldTypes.Date,
    EntityTypeId: entityTypes['Rock.Model.Step'],
    Name: 'Ministry Completion Date',
    Description: 'The date the person completed the ministry newish session',
    EntityTypeQualifierColumn: 'StepTypeId',
    EntityTypeQualifierValue: '2',
    IsSystem: false,
    Order: 0,
    IsGridColumn: false,
    IsMultiValue: false,
    IsRequired: false,
    AllowSearch: false,
    ShowOnBulk: true
  }
]

export async function extract(): Promise<
  AsyncIterator<ExtractIterator<FluroAttribute>>
> {
  let repeat = 1

  return await Promise.resolve({
    next: async (): Promise<{
      value: { collection: FluroAttribute[]; max: number }
      done: boolean
    }> => {
      if (repeat === 0) {
        return await Promise.resolve({
          value: { collection: [], max: attributes.length },
          done: true
        })
      } else {
        repeat -= 1
        return await Promise.resolve({
          value: { collection: attributes, max: attributes.length },
          done: false
        })
      }
    }
  })
}
