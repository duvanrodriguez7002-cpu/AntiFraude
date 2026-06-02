import { useEffect, useState } from 'react'
import { supabase } from './src/supabaseClient'

export default function App() {

  const [tables, setTables] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

    async function fetchData() {

        const { data, error } = await supabase
        .from('e14_forms')
        .select(`
            id,
            table_id,
            candidate_a_votes,
            candidate_b_votes,
            blank_votes,
            null_votes,
            polling_tables!inner (
            registered_voters
            )
        `)
    
        if (error) {
        console.log(error)
        return
        }
    
        console.log(data)
    
        setTables(data)
    }

    function runAudit() {

        const fraudulentTables = tables.filter((table) => {
      
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
      
        alert(
          `TOTAL DE MESAS FRAUDULENTAS: ${fraudulentTables.length}`
        )
      }

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>
        E-14 FORENSIC ENGINE
      </h1>

      {tables.map((table) => {

        const totalVotes =
          table.candidate_a_votes +
          table.candidate_b_votes +
          table.blank_votes +
          table.null_votes

        const limit =
          table.polling_tables.registered_voters

        const fraud =
          totalVotes > limit

        return (
          <div key={table.id} style={styles.card}>

            <p>MESA: {table.table_id}</p>

            <p>
              TOTAL VOTOS: {totalVotes}
            </p>

            <p>
              LÍMITE LEGAL: {limit}
            </p>

            {fraud && (
              <p style={styles.alert}>
                ⚠ FRAUDE DETECTADO
              </p>
            )}

          </div>
        )
      })}

      <button
        style={styles.button}
        onClick={runAudit}
      >
        RUN FORENSIC AUDIT
      </button>

    </div>
  )
}

const styles = {

  container: {
    backgroundColor: '#000000',
    minHeight: '100vh',
    padding: '20px',
    color: '#00FF00',
    fontFamily: 'monospace'
  },

  title: {
    color: '#00FFFF',
    marginBottom: '30px'
  },

  card: {
    border: '1px solid #00FF00',
    padding: '15px',
    marginBottom: '15px'
  },

  alert: {
    color: '#ff0000',
    fontWeight: 'bold'
  },

  button: {
    backgroundColor: '#000000',
    color: '#00FFFF',
    border: '1px solid #00FFFF',
    padding: '15px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '16px'
  }
}