import dotenv from 'dotenv'
dotenv.config({ path: '.env.development' })

export const envs = {
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  BACKEND_PORT: process.env.BACKEND_PORT ?? '4000',
  CRON_JOB_SCHEDULE: process.env.LOG_LEVEL ?? '* * * * *',
  FLOWBUILD_DB_USER: process.env.FLOWBUILD_DB_USER ?? 'postgres',
  FLOWBUILD_DB_PASSWORD: process.env.FLOWBUILD_DB_PASSWORD ?? 'postgres',
  FLOWBUILD_DB_DB: process.env.FLOWBUILD_DB_DB ?? 'workflow',
  FLOWBUILD_DB_HOST: process.env.FLOWBUILD_DB_HOST ?? 'localhost',
  FLOWBUILD_DB_PORT: parseInt(process.env.FLOWBUILD_DB_PORT ?? '5432'),
  POSTGRES_USER: process.env.POSTGRES_USER ?? 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? 'postgres',
  POSTGRES_DB: process.env.POSTGRES_DB ?? 'workflow',
  POSTGRES_HOST: process.env.POSTGRES_HOST ?? 'localhost',
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT ?? '5433'),
}
