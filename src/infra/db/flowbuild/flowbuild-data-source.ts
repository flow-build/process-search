import { Process } from '@src/config/types'
import { flowbuildDB } from '@src/infra/db/flowbuild/flowbuild-knexfile'
import { chunkArray } from '@src/utils/chunks'

const MAX_PARAMETERS = 32767 // PostgreSQL parameters limit

export async function fetchFinishedProcessesWithExceptions(
  exceptionIds: string[]
): Promise<Process[]> {
  if (exceptionIds.length === 0) {
    return await flowbuildDB
      .table('process')
      .whereIn('current_status', [
        'finished',
        'interrupted',
        'error',
        'expired',
      ])
      .whereNotIn('id', exceptionIds)
      .orderBy('created_at', 'desc')
  }

  const chunks = chunkArray<string>(exceptionIds, MAX_PARAMETERS)
  const processes: Process[] = []

  for (const chunk of chunks) {
    const fetchedProcesses = await flowbuildDB
      .table('process')
      .whereIn('current_status', [
        'finished',
        'interrupted',
        'error',
        'expired',
      ])
      .whereNotIn('id', chunk)
      .orderBy('created_at', 'desc')

    processes.push(...fetchedProcesses.filter((p) => !exceptionIds.includes(p.id)))
  }

  return processes
}

export async function fetchProcessStatesByProcessId(processId: string) {
  return await flowbuildDB
    .table('process_state')
    .where('process_id', processId)
    .orderBy('created_at', 'asc')
}

export async function fetchWorkflow(id: string) {
  return await flowbuildDB.table('workflow').where('id', id).first()
}
