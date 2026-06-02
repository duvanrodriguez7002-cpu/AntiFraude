import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eihwduksmwsghftlgdmq.supabase.co'
const supabaseKey = 'sb_publishable_WxwZZGV7IL4Gd-eowVMviw_zWiJfBmP'

const supabase = createClient(
  supabaseUrl,
  supabaseKey
)

describe('E-14 FORENSIC ENGINE', () => {

  test('Detect fraudulent voting tables', async () => {

    const { data, error } = await supabase
      .from('e14_forms')
      .select(`
        *,
        polling_tables!inner (
          registered_voters
        )
      `)

    expect(error).toBeNull()

    const fraudulentTables = data.filter((table) => {

      const totalVotes =
        table.candidate_a_votes +
        table.candidate_b_votes +
        table.blank_votes +
        table.null_votes

      return (
        totalVotes >
        table.polling_tables.registered_voters
      )
    })

    console.log('\nFRAUD DETECTED:\n')

    console.table(
      fraudulentTables.map((table) => {
    
        const totalVotes =
          table.candidate_a_votes +
          table.candidate_b_votes +
          table.blank_votes +
          table.null_votes
    
        return {
          mesa: table.table_id,
          total_votos: totalVotes,
          limite_legal: table.polling_tables.registered_voters,
          fraude: totalVotes > table.polling_tables.registered_voters
        }
      })
    )

    expect(fraudulentTables.length).toBeGreaterThan(0)
  })
})