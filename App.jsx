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
      
          <p style={styles.subtitle}>
            REAL-TIME ELECTORAL MONITORING SYSTEM
          </p>
      
          <div style={styles.dashboard}>
      
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
      
                <div
                  key={table.id}
      
                  style={{
                    ...styles.card,
      
                    ...(fraud
                      ? styles.cardFraud
                      : {})
                  }}
                >
      
                  <h2 style={styles.tableTitle}>
                    TABLE #{table.table_id}
                  </h2>
      
                  <p style={styles.text}>
                    TOTAL VOTES: {totalVotes}
                  </p>
      
                  <p style={styles.text}>
                    LEGAL LIMIT: {limit}
                  </p>
      
                  <p style={styles.text}>
                    STATUS:
                  </p>
      
                  {fraud ? (
      
                    <p style={styles.alert}>
                      ⚠ ELECTORAL FRAUD DETECTED
                    </p>
      
                  ) : (
      
                    <p style={styles.statusSafe}>
                      ✔ TABLE VERIFIED
                    </p>
      
                  )}
      
                </div>
              )
            })}
      
          </div>
      
          <div style={styles.buttonContainer}>
      
            <button
              style={styles.button}
              onClick={runAudit}
            >
              [ RUN FORENSIC AUDIT ]
            </button>
      
          </div>
      
        </div>
      )
    }

const styles = {

  container: {
    background:
      'radial-gradient(circle at top, #031b1b 0%, #000000 70%)',

    minHeight: '100vh',

    padding: '30px',

    color: '#00ffcc',

    fontFamily: 'monospace'
  },

  title: {
    color: '#00ffff',

    textAlign: 'center',

    fontSize: '42px',

    letterSpacing: '4px',

    textShadow: '0 0 15px #00ffff',

    marginBottom: '10px'
  },

  subtitle: {
    textAlign: 'center',

    color: '#00ff99',

    marginBottom: '40px',

    opacity: 0.8
  },

  dashboard: {
    display: 'grid',

    gridTemplateColumns:
      'repeat(auto-fit, minmax(280px, 1fr))',

    gap: '20px'
  },

  card: {
    backgroundColor: '#071111',

    border: '1px solid #00ffcc',

    borderRadius: '12px',

    padding: '20px',

    boxShadow:
      '0 0 15px rgba(0,255,200,0.25)',

    transition: '0.3s'
  },

  cardFraud: {
    border: '1px solid #ff004c',

    boxShadow:
      '0 0 20px rgba(255,0,76,0.5)'
  },

  tableTitle: {
    color: '#00ffff',

    marginBottom: '15px',

    fontSize: '22px'
  },

  text: {
    marginBottom: '10px',

    color: '#b6fff2'
  },

  statusSafe: {
    marginTop: '15px',

    color: '#00ff99',

    fontWeight: 'bold'
  },

  alert: {
    marginTop: '15px',

    color: '#ff3366',

    fontWeight: 'bold',

    textShadow: '0 0 10px #ff004c'
  },

  buttonContainer: {
    display: 'flex',

    justifyContent: 'center',

    marginTop: '40px'
  },

  button: {
    background:
      'linear-gradient(90deg, #00ffff, #00ff99)',

    color: '#000',

    border: 'none',

    padding: '18px 35px',

    fontWeight: 'bold',

    fontSize: '18px',

    borderRadius: '10px',

    cursor: 'pointer',

    boxShadow:
      '0 0 20px rgba(0,255,255,0.5)',

    transition: '0.3s'
  }
}