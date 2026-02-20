import Terminal from "./Terminal";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020202] text-green-400 p-6 md:p-12 font-mono selection:bg-green-900 selection:text-green-100 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col">
        
        {/* HEADER */}
        <header className="border-b border-green-500/30 pb-6 mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-100 tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              {'>'} DIGITAL_TWIN: SAGAR_
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              [Role: Cybersecurity Architect | Status: <span className="text-green-500 animate-pulse drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">Protected</span>]
            </p>
          </div>
          <div className="text-xs text-gray-600 text-left md:text-right">
            SERVER_TIME: {new Date().toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney' })} AEDT<br/>
            NODE: SYD_EDGE_01
          </div>
        </header>

        {/* METRICS DASHBOARD */}
        <section className="mb-10">
          <h3 className="text-gray-400 mb-4 text-sm tracking-widest border-l-2 border-green-500 pl-2">SYSTEM_METRICS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-[#0a0a0a] border border-gray-800 p-4 rounded-lg shadow-inner">
            <div className="flex justify-between md:block">
              <span className="text-gray-500">● STATUS:</span> <span className="text-gray-100 font-semibold drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] ml-2">ONLINE</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-gray-500">● DEPLOYMENT:</span> <span className="text-gray-100 font-semibold ml-2">VERCEL_EDGE</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-gray-500">● INTERFACE:</span> <span className="text-gray-100 font-semibold ml-2">SagarOS_CLI_v2.0</span>
            </div>
          </div>
        </section>

        {/* TERMINAL SECTION */}
        <section className="flex-grow flex flex-col">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-gray-400 text-sm tracking-widest border-l-2 border-green-500 pl-2">SECURE_COMMUNICATION_CHANNEL</h3>
            <p className="text-xs text-gray-500 hidden md:block">
              // Initiate interaction via CLI.
            </p>
          </div>
          
          <div className="flex-grow shadow-[0_0_30px_rgba(0,255,65,0.03)] rounded-xl">
            <Terminal />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 text-center text-xs text-gray-600 border-t border-gray-900 pt-6">
          © 2026 SAGAR // SOLA_FIDE_EXECUTION // CLASS_OF_2026
        </footer>

      </div>
    </div>
  );
}