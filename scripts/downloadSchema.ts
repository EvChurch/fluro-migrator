import 'dotenv/config'
import fs from 'node:fs'

import axios from 'axios'

const client = axios.create({
  baseURL: 'https://rock.ev.church/api',
  timeout: 60000,
  headers: { 'Authorization-Token': `${process.env.ROCK_API_TOKEN}` }
})

async function downloadSchema(): Promise<void> {
  const REST_CONTROLLER_NAMES = [
    'Campuses',
    'Groups',
    'GroupTypes',
    'GroupTypeRoles',
    'People',
    'DefinedTypes',
    'DefinedValues',
    'PhoneNumbers'
  ]
  // const REST_CONTROLLER_NAMES = (await client.get(
  //   '/RestControllers/RestControllerNames?includeObsolete=false'
  // )).data

  const definitionsAndPathsArr = await Promise.all(
    REST_CONTROLLER_NAMES.map(async (name: string) => {
      const { data } = await client.get<{
        definitions: { [path: string]: unknown }
        paths: { [path: string]: unknown }
      }>(`/doc/v1?controllerName=${name}`)
      console.log(name, data)
      return { definitions: data.definitions, paths: data.paths }
    })
  )

  const definitionsAndPaths = definitionsAndPathsArr.reduce(
    function (accumulator, currentValue) {
      return {
        definitions: Object.assign(
          accumulator.definitions,
          currentValue.definitions
        ),
        paths: Object.assign(accumulator.paths, currentValue.paths)
      }
    },
    { definitions: {}, paths: {} }
  )

  const swagger = {
    swagger: '2.0',
    info: {
      version: 'v1',
      title: 'Rock Rest API v1'
    },
    host: 'rock.ev.church',
    schemes: ['https'],
    ...definitionsAndPaths
  }

  const req = await axios.post(
    'https://converter.swagger.io/api/convert',
    swagger
  )

  fs.writeFileSync('./swagger.json', JSON.stringify(req.data, null, 2))
}

void downloadSchema()
