import knex, { Knex } from 'knex'
import { envs } from '../../../config/envs'

export const processSearchKnexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: envs.POSTGRES_HOST,
    port: envs.POSTGRES_PORT,
    user: envs.POSTGRES_USER,
    password: envs.POSTGRES_PASSWORD,
    database: envs.POSTGRES_DB,
  },
  migrations: {
    directory: './migrations',
  },
}

export default processSearchKnexConfig

export const processSearchDB = knex(processSearchKnexConfig)
