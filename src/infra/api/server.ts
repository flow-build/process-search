import cron from 'node-cron'
import { envs } from '@src/config/envs'
import { logger } from '@src/utils/logger'
import { indexFlowBuildProcesses } from '@src/jobs/index-flow-build-processes'
import app from '@src/infra/api/express'
import { initializeDatabase } from '../db/process-search/process-search-data-source'

const PORT: number = parseInt(envs.BACKEND_PORT, 10)

;(async () => {
  await initializeDatabase()

  const task = cron.schedule('* * * * *', indexFlowBuildProcesses, {
    noOverlap: true,
  })
  task.execute()

  app.listen(PORT, () => {
    logger.info(`FlowBuild Process Search app running on port ${PORT} 🚀`)
  })
})()
