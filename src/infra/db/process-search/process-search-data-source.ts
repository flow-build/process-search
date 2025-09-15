import { ProcessDocument } from '@src/config/types'
import { processSearchDB } from './process-search-knexfile'

export async function insertProcessOnSearchTable(process: ProcessDocument) {
  return await processSearchDB
    .table('process_search')
    .insert({
      id: process.id,
      workflow_id: process.workflow_id,
      final_status: process.final_status,
      started_at: process.started_at,
      finished_at: process.finished_at,
      final_bag: process.final_bag_text,
      history: process.history_text,
    })
    .onConflict('id')
    .merge()
}

export async function fetchFinishedProcessesOnSearchTable() {
  return await processSearchDB.table('process_search').select('id')
}

export async function queryProcessOnSearchTable({
  query,
  limit = 10,
}: {
  query: string
  limit?: number
}) {
  return await processSearchDB
    .table('process_search')
    .whereRaw(
      `(final_bag_vector @@ plainto_tsquery('english', ?)) OR (history_vector @@ plainto_tsquery('english', ?))`,
      [query, query]
    )
    .limit(limit)
    .select(
      'id',
      'workflow_id',
      'final_status',
      'started_at',
      'finished_at',
      'final_bag',
      'history'
    )
}
