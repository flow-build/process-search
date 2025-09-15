import knex, { Knex } from 'knex'
import { envs } from '../../../config/envs'

export const flowbuildKnexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: envs.FLOWBUILD_DB_HOST,
    port: envs.FLOWBUILD_DB_PORT,
    user: envs.FLOWBUILD_DB_USER,
    password: envs.FLOWBUILD_DB_PASSWORD,
    database: envs.FLOWBUILD_DB_DB,
  },
}

export default flowbuildKnexConfig

export const flowbuildDB = knex(flowbuildKnexConfig)
