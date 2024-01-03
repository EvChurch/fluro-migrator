import { FluroContactDefinition } from '../../../extract/definition/contact'
import { Mapper } from '../../../load/types'

export function transform(_mapper: Mapper, value: FluroContactDefinition) {
  return {
    DefinedTypeId: 4,
    Value: value.title,
    Description: value.firstLine,
    IsActive: value.status === 'active',
    CreatedDateTime: value.created,
    ModifiedDateTime: value.updated,
    DefinitionName: value.definitionName
    // ModifiedByPersonAliasId: null,
    // Attributes: null,
    // AttributeValues: null,
    // ForeignId: null,
    // ForeignGuid: null,
    // ForeignKey: null
  }
}