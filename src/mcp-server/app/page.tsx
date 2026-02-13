export default function Home() {
    return (
      <div style={{ 
        backgroundColor: '#0a0a0a', 
        color: '#00ff41', 
        minHeight: '100-vh', 
        padding: '50px', 
        fontFamily: 'Courier New, monospace' 
      }}>
        <header style={{ borderBottom: '1px solid #00ff41', marginBottom: '30px' }}>
          <h1>{'>'} DIGITAL_TWIN: SAGAR_</h1>
          <p style={{ color: '#888' }}>[Role: Cybersecurity Architect | Status: Protected]</p>
        </header>
  
        <section style={{ marginBottom: '40px' }}>
          <h3>SYSTEM_METRICS</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>● STATUS: <span style={{ color: '#fff' }}>ONLINE</span></li>
            <li>● MCP_SERVER: <span style={{ color: '#fff' }}>ACTIVE</span></li>
            <li>● ENCRYPTION: <span style={{ color: '#fff' }}>AES-256-GCM</span></li>
            <li>● DEPLOYMENT: <span style={{ color: '#fff' }}>VERCEL_EDGE</span></li>
          </ul>
        </section>
  
        <section>
          <h3>ACTIVE_TOOLS</h3>
          <p>Simulation Engine: <strong>Refined Interview v2.0</strong></p>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>
            Running role-specific heuristic analysis for Cybersecurity and Frontend engineering.
          </p>
        </section>
  
        <footer style={{ marginTop: '50px', fontSize: '0.8rem', color: '#444' }}>
          © 2026 SAGAR // UNAUTHORIZED ACCESS PROHIBITED
        </footer>
      </div>
    );
  }