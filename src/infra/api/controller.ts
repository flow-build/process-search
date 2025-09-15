import type { Request, Response } from 'express'
import { logger } from '@src/utils/logger'
import { queryProcessOnSearchTable } from '../db/process-search/process-search-data-source'

export async function searchProcessesPostgres(req: Request, res: Response) {
  logger.info('Called searchProcessesPostgres controller')

  try {
    const { query, limit } = req.body

    const results = await queryProcessOnSearchTable({
      query: query ?? '',
      limit,
    })

    return res.status(200).json({
      count: results.length,
      results,
    })
  } catch (error) {
    logger.error('searchProcessesPostgres error', error)

    return res.status(500).json({ error: 'Internal server error' })
  }
}
