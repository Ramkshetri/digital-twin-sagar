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
      <header style={{ borderBottom: '1px solid #00ff41', marginBottom: '30px' }}>
        <h1>{'>'} DIGITAL_TWIN: SAGAR_</h1>
        <p style={{ color: '#888' }}>[Role: Cybersecurity Architect | Status: Protected]</p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h3>SYSTEM_METRICS</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>● STATUS: <span style={{ color: '#fff' }}>ONLINE</span></li>
          <li>● DEPLOYMENT: <span style={{ color: '#fff' }}>VERCEL_PRODUCTION</span></li>
          <li>● INTERFACE: <span style={{ color: '#fff' }}>INTERACTIVE_CLI_V2.0</span></li>
        </ul>
      </section>

      <section>
        <h3>SECURE_COMMUNICATION_CHANNEL</h3>
        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px' }}>
          // Initiate interaction with the Digital Twin AI below.
        </p>
        
        {/* This is your new AI Chatbot */}
        <Terminal />
        
      </section>

      <footer style={{ marginTop: '50px', fontSize: '0.8rem', color: '#444' }}>
        © 2026 SAGAR // SOLA_FIDE_EXECUTION
      </footer>
    </div>
  );
}