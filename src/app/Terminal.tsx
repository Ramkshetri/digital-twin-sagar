"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getRecentThreats } from './actions';
import { ThreatMap } from '../components/ThreatMap';

// UPDATED: Content now accepts ReactNode to allow the ThreatMap component
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
    const args = rawCmd.split(' ');
    const command = args[0].toLowerCase();
    const target = args[1]; 
    const extra = rawCmd.substring(command.length + 1).trim(); 

    const newLogs: LogEntry[] = [...logs, { 
      type: 'user', 
      content: `${isRoot ? 'root' : 'visitor'}@sagar:${currentPath} $ ${rawCmd}` 
    }];

    let response = "";
    let type: LogEntry['type'] = 'ai';

    // --- COMMAND: HELP ---
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
    
    // --- COMMAND: CV ---
    else if (command === 'cv' || command === 'whoami') {
      response = `
======================================================
:: PROFILE ::
Name:         Sagar Aryal
Title:        Cybersecurity Graduate | Security Engineering Focus
Location:     Sydney, NSW
Graduation:   Bachelor of Cybersecurity (Victoria University) — Apr 2026
Availability: Graduate / Junior Roles (SOC, SecEng, Cloud Sec)

:: SUMMARY ::
Hands-on cybersecurity student building and deploying secure web systems.
Experience implementing edge-layer protections, threat telemetry logging,
and secure cloud architectures using modern full-stack tooling.
Strong foundation in networking, OWASP testing, and incident-minded thinking.

:: CORE STRENGTHS ::
> Defensive Security: Edge middleware controls, WAF concepts, traffic analysis
> AppSec:            OWASP Top 10 testing (XSS/SQLi), secure session patterns
> Cloud & Infra:     Vercel deployments, Neon Postgres, environment hardening
> Networking:        Subnetting/VLANs, NAT/routing basics, Wireshark analysis

:: PROJECT HIGHLIGHTS ::
Digital Twin III (Next.js + Vercel + Neon)
  - Built a CLI-style security portfolio site with threat-intel dashboard
  - Implemented request filtering + telemetry capture for suspicious patterns
  - Designed for least-privilege, production configuration, and auditability
  SecureShare (Flask Secure File Sharing)
  - AES encryption for files at rest
  - OTP-based login verification workflow
  - Secure upload/download logic + access controls

:: CERTIFICATION ::
CompTIA Security+ — In Progress

:: TARGET ROLES ::
SOC Analyst (L1) | Junior Security Engineer | Cybersecurity Graduate
Cloud Security Associate | Security Operations / Monitoring
:: LINKS ::
GitHub:  github.com/Ramkshetri
Live:    digital-twin-sagar.vercel.app
======================================================`;
      type = 'success';
    }

    // --- COMMAND: THREAT-INTEL ---
    else if (command === 'threat-intel') {
      setLogs(newLogs);
      setInput('');
      
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
          
          // ADDING THE VISUAL RADAR MAP
          setLogs(prev => [...prev, { 
            type: 'component', 
            content: <ThreatMap threats={threats} /> 
          }]);
        }, threats.length * 300 + 500);

      }).catch(() => {
        setLogs(prev => [...prev, { type: 'error', content: 'FATAL: COULD NOT REACH DATABASE.' }]);
      });
      
      return;
    }

    // --- COMMAND: ATTACK ---
    else if (command === 'attack') {
      if (!target) {
        response = "usage: attack [sqli | xss | ddos]";
        type = 'error';
      } else {
        setLogs(newLogs);
        setInput('');
        setLogs(prev => [...prev, { type: 'system', content: `[WAF_TEST] Transmitting malicious payload: ${target.toUpperCase()}...` }]);

        fetch('/api/alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            attackType: target.toUpperCase(), 
            payload: `Simulated ${target.toUpperCase()} payload from Terminal UI` 
          })
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
        return;
      }
    }

    // --- COMMAND: LS ---
    else if (command === 'ls') {
      let files = fileSystem[currentPath] || [];
      response = files.length > 0 ? files.join("    ") : "";
    }

    // --- COMMAND: CD ---
    else if (command === 'cd') {
      if (!target || target === "~") {
        setCurrentPath("~");
      } else if (target === "..") {
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

    // --- COMMAND: CAT ---
    else if (command === 'cat') {
      if (!target) {
        response = "usage: cat [filename]";
      } else if (fileContents[target]) {
        response = fileContents[target];
        type = 'success';
      } else {
        response = `cat: ${target}: No such file or directory`;
        type = 'error';
      }
    }

    // --- COMMAND: CLEAR ---
    else if (command === 'clear') {
      setLogs([]);
      setInput('');
      return;
    }

    // Update Logs
    if (response) {
      setTimeout(() => {
        setLogs(prev => [...prev, { type, content: response }]);
      }, 100);
    }
    
    setLogs(newLogs);
    setInput('');
  };

  return (
    <div style={{ 
      backgroundColor: '#050505', 
      border: '1px solid #333', 
      borderRadius: '8px', 
      padding: '20px', 
      fontFamily: 'Courier New, monospace', 
      height: '600px', 
      overflowY: 'auto' 
    }}>
      {logs.map((log, i) => (
        <div key={i} style={{ 
          marginBottom: '8px', 
          lineHeight: '1.4',
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-word', 
          color: log.type === 'user' ? '#fff' : 
                 log.type === 'error' ? '#ff3333' : 
                 log.type === 'success' ? '#00ff41' : 
                 log.type === 'component' ? 'inherit' : '#00ff41' 
        }}>
          {log.type !== 'user' && log.type !== 'component' && (
            <span style={{ marginRight: '10px', opacity: 0.7 }}>{'>'}</span>
          )}
          {log.content}
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <span style={{ color: isRoot ? '#ff3333' : '#00ff41', marginRight: '10px' }}>
          {isRoot ? 'root' : 'visitor'}@sagar:{currentPath} $
        </span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          autoFocus
          spellCheck={false}
          style={{ 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: '#fff', 
            fontFamily: 'inherit',
            fontSize: '1rem', 
            width: '100%', 
            outline: 'none' 
          }} 
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}