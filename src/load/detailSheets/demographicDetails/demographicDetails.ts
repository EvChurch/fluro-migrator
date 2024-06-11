import { omit } from 'lodash'
import f from 'odata-filter-builder'

import type { Field } from '../../../extract/detailSheets/types'
import type { components } from '../../client'
import { GET, POST, PUT, RockApiError } from '../../client'
import type {
  AttributeQualifierApiInput,
  CacheObject,
  CategoriesApiInput
} from '../../types'

let EntityTypeIdAttribute: number
let EntityTypeIdPerson: number
let FieldTypeId: number

export type RockDemographicDetails = Omit<
  components['schemas']['Rock.Model.Category'],
  'EntityTypeId'
> & { Fields: Field[] }

export async function load(
  value: RockDemographicDetails
): Promise<CacheObject> {
  if (EntityTypeIdAttribute === undefined) {
    const { data, error } = await GET('/api/EntityTypes', {
      params: {
        query: {
          $filter: f().eq('Name', 'Rock.Model.Attribute').toString(),
          $select: 'Id'
        }
      }
    })
    if (error != null) throw new RockApiError(error)

    if (data[0].Id == null)
      throw new Error(
        "Couldn't find EntityTypeId for Rock.Model.Attribute in Demographic Details Sheet"
      )

    EntityTypeIdAttribute = data?.[0].Id
  }

  const { data, error } = await GET('/api/Categories', {
    params: {
      query: {
        $filter: f().eq('Name', 'Demographics Details').toString(),
        $select: 'Id'
      }
    }
  })
  if (error != null) throw new RockApiError(error)
  // check if records exists, if it exsits = update, else = add the record
  if (data != null && data.length > 0 && data[0].Id != null) {
    // update the record
    const { error } = await PUT('/api/Categories/{id}', {
      params: {
        path: {
          id: data[0].Id
        }
      },
      body: omit(
        { ...value, Id: data[0].Id, EntityTypeId: EntityTypeIdAttribute },
        'cache',
        'Fields'
      )
    })
    if (error != null)
      throw new Error(
        (error as { Message: string })?.Message ?? 'Unknown Error'
      )
    return {
      rockId: data[0].Id,
      data: {
        log: `${value.ForeignKey} already exsits, updated entry`
      }
    }
  } else {
    // get id for entity type person
    if (EntityTypeIdPerson === undefined) {
      const { data, error } = await GET('/api/EntityTypes', {
        params: {
          query: {
            $filter: f().eq('Name', 'Rock.Model.Person').toString(),
            $select: 'Id'
          }
        }
      })
      if (error != null) throw new RockApiError(error)

      if (data[0].Id == null)
        throw new Error(
          "Couldn't find EntityTypeId for Rock.Model.Person in Demographic Details Sheet"
        )

      EntityTypeIdPerson = data?.[0].Id
    }

    // create a new record for categories
    const { data, error } = await POST('/api/Categories', {
      body: omit(
        {
          ...value,
          EntityTypeId: EntityTypeIdAttribute,
          EntityTypeQualifierColumn: 'EntityTypeId',
          EntityTypeQualifierValue: EntityTypeIdPerson.toString()
        },
        'cache',
        'Fields'
      )
    })
    if (error != null) throw new RockApiError(error)

    const { data: fieldTypesRes, error: fieldTypesError } = await GET(
      '/api/FieldTypes',
      {
        params: {
          query: {
            $filter: f().eq('Name', 'Single-Select').toString(),
            $select: 'Id'
          }
        }
      }
    )
    if (fieldTypesError != null) throw new RockApiError(fieldTypesError)
    if (fieldTypesRes[0].Id == null)
      throw new Error(
        "Couldn't find FieldTypeId for Rock.Model.Attribute in Demographic Details Sheet"
      )

    const attributesResData = []
    for (const field of value.Fields) {
      const attributeQualifierValues = {
        Key: 'values',
        Values: ''
      }
      field.options.forEach((option, index) => {
        attributeQualifierValues.Values =
          index === 0
            ? option.title
            : attributeQualifierValues.Values + ',' + option.title
      })
      const { data: resData, error } = await POST('/api/Attributes', {
        body: {
          IsSystem: false,
          FieldTypeId,
          EntityTypeId: EntityTypeIdPerson,
          Key: field.key,
          Name: field.title,
          IsActive: true,
          Order: 0,
          IsGridColumn: false,
          IsMultiValue: field.maximum > 1,
          IsRequired: false,
          AllowSearch: false,
          AttributeQualifiers: [
            // fieldType needs to be set
            {
              Key: 'fieldtype',
              Value: 'rb'
            },
            attributeQualifierValues
          ] as AttributeQualifierApiInput[],
          Categories: [
            {
              Id: data as unknown as number,
              Name: value.Name
            }
          ] as CategoriesApiInput[]
        }
      })
      if (error != null) throw new RockApiError(error)

      attributesResData.push({
        detailSheet: value.Name,
        rockAttributeId: resData as unknown as number,
        fieldName: field.title
      })
    }

    return {
      rockId: data as unknown as number,
      data: {
        log: `${value.Name} created,`,
        detailSheetAttributeData: attributesResData
      }
    }
  }
}
