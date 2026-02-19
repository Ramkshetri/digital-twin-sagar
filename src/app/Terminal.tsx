"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getRecentThreats } from './actions';
type LogEntry = {
  type: 'system' | 'user' | 'ai' | 'error' | 'success';
  content: string;
};

// --- MOCK FILE SYSTEM ---
const fileSystem: Record<string, string[]> = {
  "~": ["projects", "skills", "contact", "secrets"],
  "~/projects": ["digital-twin.txt", "mcp-server.md"],
  "~/skills": ["cybersecurity.md", "react.ts"],
  "~/contact": ["email.txt"],
  "~/secrets": ["encrypted-flag.bin"]
};

const fileContents: Record<string, string> = {
  "digital-twin.txt": "STATUS: Production Ready. Stack: Next.js 16+, Vercel, Neon Postgres.",
  "mcp-server.md": "Architecture: Decoupled logic using Model Context Protocol.",
  "cybersecurity.md": "Skills: Penetration Testing, WAF Configuration, Threat Analysis.",
  "react.ts": "Proficiency: Hooks, Context API, Server Components.",
  "email.txt": "contact@sagar.dev (Simulated)",
  "encrypted-flag.bin": "FATAL: ROOT ACCESS REQUIRED TO DECRYPT.",
  // --- CTF HIDDEN FILE CONTENT ---
  ".env.local": "FLAG{unsecured_env_variables_found_1337}" 
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
  trace         Run network trace simulation
  encrypt [txt] Encrypt string (Base64)
  decrypt [txt] Decrypt string
  sudo su       Elevate privileges
  clear         Clear terminal`;
    }
    
    // --- COMMAND: CV (RECRUITER MODE) ---
    else if (command === 'cv' || command === 'whoami') {
      response = `======================================================
:: PROFILE ::
Name:        Sagar
Role:        Cybersecurity Architect & Full-Stack Developer
Status:      International Student | Graduating May 2026
Target Base: Sydney, Australia

:: CORE COMPETENCIES ::
> Defensive Security: Edge Middleware WAF, Traffic Analysis
> Infrastructure:     Next.js App Router, Vercel Edge, Neon Postgres
> Offensive Skills:   Ethical Hacking, OWASP Vulnerability Testing

:: CURRENT INITIATIVE ::
Developing "Digital Twin III" — A cyber-hardened application 
designed to detect, log, and mitigate real-time threat activity.
======================================================`;
      type = 'success';
    }

    // --- COMMAND: THREAT-INTEL (SOC DASHBOARD) ---
    // --- COMMAND: THREAT-INTEL (LIVE SOC DASHBOARD) ---
    else if (command === 'threat-intel') {
      setLogs(newLogs);
      setInput('');
      
      // Initial loading message
      setLogs(prev => [...prev, { type: 'system', content: 'ESTABLISHING SECURE CONNECTION TO NEON POSTGRES...' }]);

      // Fetch the real data asynchronously
      getRecentThreats().then((threats) => {
        if (threats.length === 0) {
          setLogs(prev => [...prev, { type: 'ai', content: 'STATUS: PERIMETER SECURE. NO RECENT THREATS RECORDED.' }]);
          return;
        }

        setLogs(prev => [...prev, { type: 'system', content: 'ANALYZING REAL-TIME TRAFFIC...' }]);
        setLogs(prev => [...prev, { type: 'ai', content: '---------------------------------------------------' }]);

        threats.forEach((threat, i) => {
          setTimeout(() => {
            // Format the timestamp nicely
            const time = new Date(threat.timestamp || Date.now()).toLocaleTimeString();
            const logLine = `[BLOCKED] IP: ${threat.ipAddress} | TIME: ${time} | RULE: ${threat.attackType}`;
            setLogs(prev => [...prev, { type: 'error', content: logLine }]);
          }, i * 400);
        });

        setTimeout(() => {
          setLogs(prev => [...prev, { type: 'ai', content: '---------------------------------------------------' }]);
          setLogs(prev => [...prev, { type: 'success', content: `STATUS: ${threats.length} CRITICAL THREATS MITIGATED FROM EDGE WAF.` }]);
        }, threats.length * 400 + 200);

      }).catch(() => {
        setLogs(prev => [...prev, { type: 'error', content: 'FATAL: COULD NOT REACH DATABASE.' }]);
      });
      
      return;
    }

    // --- COMMAND: LS (WITH HIDDEN CTF FLAG) ---
    else if (command === 'ls') {
      let files = fileSystem[currentPath] || [];
      // If user types 'ls -a' in the root directory, show the hidden file
      if (target === '-a' && currentPath === "~") {
        files = [...files, ".env.local"];
      } else if (target === '-a') {
        files = [...files, ".hidden"];
      }
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
      } else if (target === "encrypted-flag.bin" && !isRoot) {
        response = "PERMISSION DENIED: Root access required.";
        type = 'error';
      } else if (fileContents[target]) {
        response = fileContents[target];
        // Make the flag turn green if they find it
        if (target === ".env.local") type = 'success'; 
      } else {
        response = `cat: ${target}: No such file or directory`;
        type = 'error';
      }
    }

    // --- COMMAND: STATUS ---
    else if (command === 'status') {
      response = `[SYSTEM METRICS]
> Uptime: 99.999%
> Firewall: ACTIVE (Middleware WAF)
> Security: ${isRoot ? 'ROOT ACCESS DETECTED' : 'Standard User'}
> Connection: Encrypted (TLS 1.3)`;
    }

    // --- COMMAND: TRACE ---
    else if (command === 'trace') {
      setLogs(newLogs);
      setInput('');
      const hops = [
        "TRACEROUTE to target-vault (192.168.X.X), 30 hops max",
        "1  10.0.0.1 (gateway)       0.452 ms",
        "2  172.16.254.1 (isp-node)  12.4 ms",
        "3  45.33.12.9 (backbone)    24.1 ms",
        "4  104.22.4.1 (vercel-edge) 11.2 ms",
        "5  TARGET [SECURED] REACHED."
      ];
      hops.forEach((hop, i) => {
        setTimeout(() => {
          setLogs(prev => [...prev, { type: 'ai', content: hop }]);
        }, i * 500);
      });
      return; 
    }

    // --- COMMAND: ENCRYPT ---
    else if (command === 'encrypt') {
      if (!extra) {
        response = "usage: encrypt [text]";
      } else {
        response = `[OUTPUT]: ${btoa(extra)}`;
        type = 'success';
      }
    }

    // --- COMMAND: DECRYPT ---
    else if (command === 'decrypt') {
      if (!extra) {
        response = "usage: decrypt [text]";
      } else {
        try {
          response = `[OUTPUT]: ${atob(extra)}`;
          type = 'success';
        } catch {
          response = "ERROR: Invalid Base64 string.";
          type = 'error';
        }
      }
    }

    // --- COMMAND: SUDO ---
    else if (command === 'sudo' && target === 'su') {
      setIsRoot(true);
      response = "ROOT ACCESS GRANTED. USE WITH CAUTION.";
      type = 'success';
    }

    // --- COMMAND: CLEAR ---
    else if (command === 'clear') {
      setLogs([]);
      setInput('');
      return;
    }

    // --- UNKNOWN ---
    else if (rawCmd !== "") {
      response = `Command '${command}' not found. Type 'help' for list.`;
      type = 'error';
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
      backgroundColor: '#0a0a0a', 
      border: '1px solid #333', 
      borderRadius: '8px', 
      padding: '20px', 
      fontFamily: 'Courier New, monospace', 
      height: '500px', 
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
                 log.type === 'success' ? '#00ff41' : '#00ff41' 
        }}>
          {log.type === 'user' ? '' : <span style={{ marginRight: '10px' }}>{'>'}</span>}
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