"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getRecentThreats } from './actions';
import { ThreatMap } from '../components/ThreatMap';

type LogEntry = {
  type: 'system' | 'user' | 'ai' | 'error' | 'success' | 'component';
  content: string | React.ReactNode;
};

const fileSystem: Record<string, string[]> = {
  "~": ["projects", "skills", "contact", "system"],
  "~/projects": ["digital-twin.txt", "mcp-server.md"],
  "~/skills": ["cybersecurity.md", "react.ts"],
  "~/contact": ["email.txt"],
  "~/system": ["config.json"]
};

const fileContents: Record<string, string> = {
  "digital-twin.txt": "STATUS: Production Ready. Stack: Next.js 14, Vercel, Neon Postgres.",
  "mcp-server.md": "Architecture: Decoupled logic using Model Context Protocol.",
  "cybersecurity.md": "Skills: Penetration Testing, WAF Configuration, Threat Analysis.",
  "react.ts": "Proficiency: Hooks, Context API, Server Components.",
  "email.txt": "contact@sagar.dev",
  "config.json": '{"waf_status": "active", "logging": "enabled", "env": "production"}'
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState("~");
  const [isRoot, setIsRoot] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'system', content: 'INITIALIZING SECURITY PROTOCOLS...' },
    { type: 'system', content: 'CONNECTING TO VERCEL EDGE NETWORK... [OK]' },
    { type: 'ai', content: 'SagarOS v2.0 Online. Type "help" or "cv" to begin.' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = async (cmd: string) => {
    const rawCmd = cmd.trim();
    if (!rawCmd) return;

    const args = rawCmd.split(' ');
    const command = args[0].toLowerCase();
    const target = args[1]; 
    const extra = rawCmd.substring(command.length + 1).trim(); 

    // 1. Immediately log the user's input to the terminal
    const userLog: LogEntry = { 
      type: 'user', 
      content: `${isRoot ? 'root' : 'visitor'}@sagar:${currentPath} $ ${rawCmd}` 
    };
    
    setLogs(prev => [...prev, userLog]);
    setInput('');

    let response = "";
    let type: LogEntry['type'] = 'ai';

    // --- COMMAND LOGIC ---
    if (command === 'help') {
      response = `AVAILABLE BINARIES:
  cv            View professional resume
  ls            List directory contents
  cd [dir]      Change directory
  cat [file]    Read file content
  status        Check system integrity
  threat-intel  View active blocked attacks
  attack [type] Simulate WAF trigger (sqli, xss)
  trace         Run network trace
  clear         Clear terminal`;
    }
    else if (command === 'cv') {
      response = `Sagar Aryal - Cybersecurity Graduate (2026) | Location: Sydney, NSW`;
      type = 'success';
    }
    else if (command === 'status') {
      response = `[SYSTEM METRICS]\n> Uptime: 99.99%\n> Firewall: ACTIVE\n> Security: ${isRoot ? 'ROOT' : 'USER'}`;
    }
    else if (command === 'clear') {
      setLogs([]);
      return;
    }
    else if (command === 'trace') {
      const hops = ["10.0.0.1", "172.16.254.1", "Vercel-Edge-Node", "Target Reached."];
      hops.forEach((hop, i) => {
        setTimeout(() => setLogs(prev => [...prev, { type: 'system', content: `HOP ${i+1}: ${hop}` }]), i * 400);
      });
      return;
    }
    else if (command === 'threat-intel') {
      setLogs(prev => [...prev, { type: 'system', content: 'CONNECTING TO NEON SYDNEY...' }]);
      try {
        const threats = await getRecentThreats();
        if (threats.length === 0) {
          setLogs(prev => [...prev, { type: 'ai', content: 'STATUS: PERIMETER SECURE.' }]);
        } else {
          setLogs(prev => [...prev, { type: 'success', content: `MITIGATED ${threats.length} THREATS.` }]);
          setLogs(prev => [...prev, { type: 'component', content: <ThreatMap threats={threats} /> }]);
        }
      } catch {
        setLogs(prev => [...prev, { type: 'error', content: 'DB_CONNECTION_ERROR' }]);
      }
      return;
    }
    else if (command === 'attack') {
        if (!target) {
          setLogs(prev => [...prev, { type: 'error', content: "usage: attack [sqli | xss]" }]);
        } else {
          setLogs(prev => [...prev, { type: 'system', content: `Injecting ${target.toUpperCase()}...` }]);
          fetch('/api/alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attackType: target.toUpperCase() })
          }).then(() => setLogs(prev => [...prev, { type: 'success', content: "ALERT DISPATCHED TO SOC." }]));
        }
        return;
    }
    else {
      response = `Command '${command}' not found.`;
      type = 'error';
    }

    // --- RENDER STANDARD RESPONSES ---
    if (response) {
      setLogs(prev => [...prev, { type, content: response }]);
    }
  };

  return (
    <div style={{ backgroundColor: '#050505', padding: '20px', fontFamily: 'monospace', height: '600px', overflowY: 'auto', color: '#00ff41' }}>
      {logs.map((log, i) => (
        <div key={i} style={{ marginBottom: '8px', color: log.type === 'error' ? '#ff3333' : log.type === 'user' ? '#fff' : '#00ff41' }}>
          {log.type !== 'user' && log.type !== 'component' && '> '}
          {log.content}
        </div>
      ))}
      <div style={{ display: 'flex' }}>
        <span style={{ marginRight: '10px' }}>{isRoot ? 'root' : 'visitor'}@sagar:{currentPath} $</span>
        <input 
          autoFocus 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}