import { exec, ExecException } from 'node:child_process'

function checkPostgres() {
  exec(
    'docker exec process_search_db pg_isready --host localhost',
    handleReturn
  )

  function handleReturn(_err: ExecException | null, stdout: string) {
    if (stdout.search('accepting connections') === -1) {
      process.stdout.write('.')

      checkPostgres()
      return
    }

    console.log('\n🟢 PostgreSQL is ready and accepting connections!\n')
  }
}

process.stdout.write('\n\n🔴 Waiting for PostgreSQL to accept conections')
checkPostgres()
