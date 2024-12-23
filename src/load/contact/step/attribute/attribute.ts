import { DELETE, POST, RockApiError, type components } from '../../../client'

export async function load(
  AttributeValues: {
    [key: string]: string | null | undefined
  },
  data: components['schemas']['Rock.Model.Step']
): Promise<void> {
  if (data.Id == null) return

  for (const attributeKey of Object.keys(AttributeValues)) {
    const attributeValue = AttributeValues[attributeKey]

    if (data.AttributeValues?.[attributeKey].Value != attributeValue) {
      if (attributeValue == null || attributeValue == '') {
        // delete attribute value
        const params = {
          path: {
            id: data.Id
          },
          query: {
            attributeKey
          }
        }
        const { error } = await DELETE('/api/Steps/AttributeValue/{id}', {
          params
        })
        if (error != null)
          throw new RockApiError(error, {
            cause: { path: params.path, query: params.query }
          })
      } else {
        // update attribute value
        const params = {
          path: {
            id: data.Id
          },
          query: {
            attributeKey,
            attributeValue: attributeValue
          }
        }
        const { error } = await POST('/api/Steps/AttributeValue/{id}', {
          params
        })
        if (error != null)
          throw new RockApiError(error, {
            cause: { path: params.path, query: params.query }
          })
      }
    }
  }
}
