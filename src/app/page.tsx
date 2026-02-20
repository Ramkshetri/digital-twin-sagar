import Terminal from "./Terminal";

export default function Home() {
  return (
    <div style={{ 
      backgroundColor: '#0a0a0a', 
      color: '#00ff41', 
      minHeight: '100vh', 
      padding: '50px', 
      fontFamily: 'Courier New, monospace' 
    }}>
      <header style={{ borderBottom: '1px solid #00ff41', marginBottom: '30px', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#fff' }}>{'>'} DIGITAL_TWIN: SAGAR_</h1>
        <p style={{ color: '#888', margin: 0 }}>
          [Role: Cybersecurity Architect | Status: <span style={{ color: '#00ff41' }}>Protected</span>]
        </p>
        <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '10px' }}>
          SERVER_TIME: {new Date().toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney' })} AEDT<br/>
          NODE: SYD_EDGE_01
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#888', borderLeft: '2px solid #00ff41', paddingLeft: '10px', letterSpacing: '2px' }}>SYSTEM_METRICS</h3>
        <ul style={{ listStyle: 'none', padding: '15px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '5px' }}>
          <li style={{ marginBottom: '10px' }}><span style={{ color: '#555' }}>● STATUS:</span> <span style={{ color: '#fff', fontWeight: 'bold' }}>ONLINE</span></li>
          <li style={{ marginBottom: '10px' }}><span style={{ color: '#555' }}>● DEPLOYMENT:</span> <span style={{ color: '#fff', fontWeight: 'bold' }}>VERCEL_EDGE</span></li>
          <li><span style={{ color: '#555' }}>● INTERFACE:</span> <span style={{ color: '#fff', fontWeight: 'bold' }}>SagarOS_CLI_v2.0</span></li>
        </ul>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
          <h3 style={{ color: '#888', borderLeft: '2px solid #00ff41', paddingLeft: '10px', letterSpacing: '2px', margin: 0 }}>SECURE_COMMUNICATION_CHANNEL</h3>
          <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>
            // Initiate interaction via CLI.
          </p>
        </div>
        
        <Terminal />
        
      </section>

      <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #222', fontSize: '0.8rem', color: '#444', textAlign: 'center' }}>
        © 2026 SAGAR // SOLA_FIDE_EXECUTION // CLASS_OF_2026
      </footer>
    </div>
  );
}