import { Process } from '@src/config/types'
import { flowbuildDB } from '@src/infra/db/flowbuild/flowbuild-knexfile'

export async function fetchFinishedProcessesWithExceptions(
  exceptionIds: string[]
): Promise<Process[]> {
  return await flowbuildDB
    .table('process')
    .whereIn('current_status', ['finished', 'interrupted', 'error', 'expired'])
    .whereNotIn('id', exceptionIds)
    .orderBy('created_at', 'desc')
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
