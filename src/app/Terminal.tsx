"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getRecentThreats } from './actions';
import { ThreatMap } from '../components/ThreatMap';

type LogEntry = {
  type: 'system' | 'user' | 'ai' | 'error' | 'success' | 'component';
  content: string | React.ReactNode;
};

// --- MOCK FILE SYSTEM ---
const fileSystem: Record<string, string[]> = {
  "~": ["projects", "skills", "contact", "system"],
  "~/projects": ["digital-twin.txt", "mcp-server.md"],
  "~/skills": ["cybersecurity.md", "react.ts"],
  "~/contact": ["email.txt"],
  "~/system": ["config.json"]
};

const fileContents: Record<string, string> = {
  "digital-twin.txt": "STATUS: Production Ready. Stack: Next.js 16+, Vercel, Neon Postgres.",
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

  const handleCommand = (cmd: string) => {
    const rawCmd = cmd.trim();
    if (!rawCmd) return; // Prevent empty commands

    const args = rawCmd.split(' ');
    const command = args[0].toLowerCase();
    const target = args[1]; 
    const extra = rawCmd.substring(command.length + 1).trim(); 

    // 1. Immediately push the user's command to the terminal logs and clear input
    setLogs(prev => [...prev, { 
      type: 'user', 
      content: `${isRoot ? 'root' : 'visitor'}@sagar:${currentPath} $ ${rawCmd}` 
    }]);
    setInput('');

    let response: string | React.ReactNode = "";
    let type: LogEntry['type'] = 'ai';

    // --- COMMAND ROUTING ---
    if (command === 'help') {
      response = `AVAILABLE BINARIES:
  cv            View professional resume / profile
  ls            List directory contents
  cd [dir]      Change directory
  cat [file]    Read file content
  status        Check system integrity
  threat-intel  View active blocked attacks (SOC Mode)
  attack [type] Simulate cyber attack to test WAF (e.g., attack sqli)
  trace         Run network trace simulation
  encrypt [txt] Encrypt string (Base64)
  decrypt [txt] Decrypt string
  sudo su       Elevate privileges
  clear         Clear terminal`;
    }
    
    else if (command === 'cv' || command === 'whoami') {
      response = `
======================================================
:: PROFILE ::
Name:         Sagar Aryal
Title:        Cybersecurity Graduate | Security Engineering Focus
Location:     Sydney, NSW
Graduation:   Bachelor of Cybersecurity (Victoria University) — Apr 2026

:: SUMMARY ::
Hands-on cybersecurity student building and deploying secure web systems.
Experience implementing edge-layer protections, threat telemetry logging,
and secure cloud architectures using modern full-stack tooling.

:: PROJECT HIGHLIGHTS ::
Digital Twin III (Next.js + Vercel + Neon)
  - Built a CLI-style security portfolio site with threat-intel dashboard
  - Implemented request filtering + telemetry capture for suspicious patterns
  - Designed for least-privilege, production configuration, and auditability

:: TARGET ROLES ::
SOC Analyst (L1) | Junior Security Engineer | Cybersecurity Graduate
Cloud Security Associate | Security Operations / Monitoring
======================================================`;
      type = 'success';
    }

    // --- NEW COMMANDS ADDED HERE ---
    else if (command === 'status') {
      response = `[SYSTEM METRICS]\n> Uptime: 99.99%\n> Gateway: ACTIVE (Vercel Edge)\n> Database: CONNECTED (Neon)\n> Security Level: ${isRoot ? 'ROOT' : 'USER'}`;
      type = 'success';
    }

    else if (command === 'trace') {
      response = `Tracing route to target...\n  1  1ms  Vercel Edge Gateway\n  2  3ms  ap-southeast-2 Node (Sydney)\n  3  12ms Neon Database Cluster\nTrace complete.`;
      type = 'system';
    }

    else if (command === 'encrypt') {
      if (!extra) { response = "usage: encrypt [text]"; type = 'error'; }
      else { response = `[OUTPUT]: ${btoa(extra)}`; type = 'success'; }
    }

    else if (command === 'decrypt') {
      if (!extra) { response = "usage: decrypt [base64_text]"; type = 'error'; }
      else {
        try { response = `[OUTPUT]: ${atob(extra)}`; type = 'success'; }
        catch { response = "ERROR: Invalid Base64 string."; type = 'error'; }
      }
    }

    else if (command === 'sudo') {
      if (target === 'su') {
        setIsRoot(true);
        response = "ROOT ACCESS GRANTED. SYSTEM UNLOCKED.";
        type = 'success';
      } else {
        response = "usage: sudo su";
        type = 'error';
      }
    }

    else if (command === 'threat-intel') {
      setLogs(prev => [...prev, { type: 'system', content: 'ESTABLISHING SECURE CONNECTION TO NEON POSTGRES...' }]);

      getRecentThreats().then((threats) => {
        if (threats.length === 0) {
          setLogs(prev => [...prev, { type: 'ai', content: 'STATUS: PERIMETER SECURE. NO RECENT THREATS RECORDED.' }]);
          return;
        }

        setLogs(prev => [...prev, { type: 'system', content: 'ANALYZING REAL-TIME TRAFFIC...' }]);

        threats.forEach((threat, i) => {
          setTimeout(() => {
            const time = new Date(threat.timestamp || Date.now()).toLocaleTimeString();
            const logLine = `[BLOCKED] IP: ${threat.ipAddress} | TIME: ${time} | RULE: ${threat.attackType}`;
            setLogs(prev => [...prev, { type: 'error', content: logLine }]);
          }, i * 300);
        });

        setTimeout(() => {
          setLogs(prev => [...prev, { type: 'success', content: `STATUS: ${threats.length} CRITICAL THREATS MITIGATED FROM EDGE WAF.` }]);
          setLogs(prev => [...prev, { type: 'component', content: <ThreatMap threats={threats} /> }]);
        }, threats.length * 300 + 500);

      }).catch(() => {
        setLogs(prev => [...prev, { type: 'error', content: 'FATAL: COULD NOT REACH DATABASE.' }]);
      });
      return; // Exit early since async handles logs
    }

    else if (command === 'attack') {
      if (!target) {
        response = "usage: attack [sqli | xss | ddos]";
        type = 'error';
      } else {
        setLogs(prev => [...prev, { type: 'system', content: `[WAF_TEST] Transmitting malicious payload: ${target.toUpperCase()}...` }]);

        fetch('/api/alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attackType: target.toUpperCase(), payload: `Simulated ${target.toUpperCase()} payload from Terminal UI` })
        })
        .then(async (res) => {
          if (res.status === 403 || res.status === 200) {
            const data = await res.json();
            setLogs(prev => [...prev, { type: 'error', content: `[CONNECTION DROPPED] ${data.message}` }]);
            setTimeout(() => {
              setLogs(prev => [...prev, { type: 'success', content: "🚨 ALERT DISPATCHED: SOC Admin notified via secure SMTP." }]);
            }, 600);
          } else {
            setLogs(prev => [...prev, { type: 'error', content: "ERROR: WAF failed to respond correctly." }]);
          }
        })
        .catch(() => {
          setLogs(prev => [...prev, { type: 'error', content: "FATAL: Connection to Edge WAF severed." }]);
        });
        return; // Exit early
      }
    }

    else if (command === 'ls') {
      let files = fileSystem[currentPath] || [];
      response = files.length > 0 ? files.join("    ") : "";
    }

    else if (command === 'cd') {
      if (!target || target === "~" || target === "..") {
        setCurrentPath("~");
      } else {
        const potentialPath = currentPath === "~" ? `~/${target}` : `${currentPath}/${target}`;
        if (fileSystem[potentialPath]) {
          setCurrentPath(potentialPath);
        } else {
          response = `cd: ${target}: No such file or directory`;
          type = 'error';
        }
      }
    }

    else if (command === 'cat') {
      if (!target) {
        response = "usage: cat [filename]";
        type = 'error';
      } else if (fileContents[target]) {
        response = fileContents[target];
        type = 'success';
      } else {
        response = `cat: ${target}: No such file or directory`;
        type = 'error';
      }
    }

    else if (command === 'clear') {
      setLogs([]);
      return;
    }

    // --- THE FALLBACK BLOCK (Fixes the "nothing happens" issue) ---
    else {
      response = `Command not found: '${command}'. Type 'help' for available commands.`;
      type = 'error';
    }

    // 2. Render standard responses
    if (response) {
      setLogs(prev => [...prev, { type, content: response }]);
    }
  };

  return (
    <div style={{ backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px', padding: '20px', fontFamily: 'Courier New, monospace', height: '600px', overflowY: 'auto' }}>
      {logs.map((log, i) => (
        <div key={i} style={{ marginBottom: '8px', lineHeight: '1.4', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: log.type === 'user' ? '#fff' : log.type === 'error' ? '#ff3333' : log.type === 'success' ? '#00ff41' : log.type === 'component' ? 'inherit' : '#00ff41' }}>
          {log.type !== 'user' && log.type !== 'component' && (<span style={{ marginRight: '10px', opacity: 0.7 }}>{'>'}</span>)}
          {log.content}
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <span style={{ color: isRoot ? '#ff3333' : '#00ff41', marginRight: '10px' }}>
          {isRoot ? 'root' : 'visitor'}@sagar:{currentPath} $
        </span>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)} autoFocus spellCheck={false} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontFamily: 'inherit', fontSize: '1rem', width: '100%', outline: 'none' }} />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}