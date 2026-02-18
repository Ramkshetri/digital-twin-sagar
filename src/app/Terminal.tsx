"use client";

import React, { useState, useEffect, useRef } from 'react';

type LogEntry = {
  type: 'system' | 'user' | 'ai' | 'error' | 'success';
  content: string;
};

const fileSystem: Record<string, string[]> = {
  "~": ["projects", "skills", "contact", "secrets"],
  "~/projects": ["digital-twin.txt", "mcp-server.md"],
  "~/skills": ["cybersecurity.md", "react.ts"],
  "~/contact": ["email.txt"],
  "~/secrets": ["encrypted-flag.bin"]
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'system', content: 'INITIALIZING SECURITY PROTOCOLS...' },
    { type: 'ai', content: 'SagarOS v2.0 Online. Type "help".' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const clean = cmd.trim().toLowerCase();
    const newLogs: LogEntry[] = [...logs, { type: 'user', content: cmd }];
    let response = "";
    
    if (clean === 'help') response = "COMMANDS: ls, cd, cat, trace, help, clear";
    else if (clean === 'ls') response = "projects  skills  contact  secrets";
    else if (clean === 'trace') response = "TRACING ROUTE... [PROTECTED]";
    else if (clean === 'clear') { setLogs([]); setInput(''); return; }
    else response = `Command '${clean}' not found.`;

    setTimeout(() => setLogs(p => [...p, { type: 'ai', content: response }]), 200);
    setLogs(newLogs);
    setInput('');
  };

  return (
    <div style={{ 
      backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', 
      padding: '20px', fontFamily: 'Courier New', height: '400px', overflowY: 'auto' 
    }}>
      {logs.map((log, i) => (
        <div key={i} style={{ 
          marginBottom: '8px', whiteSpace: 'pre-wrap', 
          color: log.type === 'user' ? '#fff' : '#00ff41' 
        }}>
          {log.type === 'user' ? '> ' : ''}{log.content}
        </div>
      ))}
      <input 
        value={input} onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
        autoFocus style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none' }} 
      />
      <div ref={bottomRef} />
    </div>
  );
}
