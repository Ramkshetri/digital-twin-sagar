import React from 'react';

interface Threat {
  geoRegion: string;
  attackType: string;
}

export const ThreatMap = ({ threats }: { threats: Threat[] }) => {
  // A simplified ASCII world map grid
  const worldMap = [
    "       _..-''-._                            ",
    "     .' .'_  _  '.          [ NORTH AMERICA ]  ",
    "    /  /   ''    \\ \\        ____________    ",
    "   |  |  _  _  |  |  |      [ EUROPE/ASIA]  ",
    "    \\  \\  ''  /  /    /     ____________    ",
    "     '. '-..-' .'           [ AUSTRALIA  ]  ",
    "       '-....-'             ____________    ",
  ];

  const hasAU = threats.some(t => t.geoRegion.includes('AU') || t.geoRegion.includes('Australia'));
  const hasUS = threats.some(t => t.geoRegion.includes('US') || t.geoRegion.includes('United States'));

  return (
    <div style={{ fontFamily: 'monospace', color: '#00ff00', lineHeight: '1.2' }}>
      <pre>
        {worldMap[0]}
        {worldMap[1]} {hasUS ? " <--- [ TARGET: US ]" : ""}
        {worldMap[2]}
        {worldMap[3]}
        {worldMap[4]}
        {worldMap[5]} {hasAU ? " <--- [ TARGET: AU ]" : ""}
        {worldMap[6]}
      </pre>
      <div style={{ color: '#ff0000', fontWeight: 'bold' }}>
        {threats.length > 0 ? `🚨 ${threats.length} ACTIVE THREAT NODES DETECTED` : "🛡️ PERIMETER SECURE"}
      </div>
    </div>
  );
};