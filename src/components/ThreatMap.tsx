import React from 'react';

interface Threat {
  geoRegion?: string;
  attackType?: string;
}

export const ThreatMap = ({ threats }: { threats: Threat[] }) => {
  // Logic to detect if specific regions are under attack based on your Neon data
  const hasAU = threats.some(t => t.geoRegion?.includes('AU') || t.geoRegion?.includes('Australia'));
  const hasUS = threats.some(t => t.geoRegion?.includes('US') || t.geoRegion?.includes('United States'));

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      color: '#00ff41', 
      margin: '15px 0', 
      borderLeft: '2px solid #00ff41', 
      paddingLeft: '15px',
      backgroundColor: 'rgba(0, 255, 65, 0.05)',
      padding: '10px'
    }}>
      <pre style={{ fontSize: '12px', lineHeight: '1.2', margin: 0 }}>
{`       _..-''-._                            
     .' .'_  _  '.          ${hasUS ? "🚨 [ TARGET: NORTH AMERICA ]" : "[ NORTH AMER: SECURE ]"}
    /  /   ''    \\ \\        ______________________
   |  |  _  _  |  |  |      ${hasAU ? "🚨 [ TARGET: AUSTRALIA  ]" : "[ AUSTRALIA: SECURE  ]"}
    \\  \\  ''  /  /    /     ______________________
     '. '-..-' .'           ${threats.length > 5 ? "⚠️ [ BUSY ]" : "[ LOAD: NORMAL ]"}
       '-....-'             ______________________`}
      </pre>
      <div style={{ 
        color: threats.length > 0 ? '#ff3333' : '#00ff41', 
        fontSize: '11px', 
        marginTop: '10px',
        fontWeight: 'bold' 
      }}>
        {threats.length > 0 
          ? `>>> ALERT: ${threats.length} MALICIOUS NODES DETECTED IN RECENT TELEMETRY` 
          : ">>> SYSTEM STATUS: ALL REGIONS NOMINAL"}
      </div>
    </div>
  );
};