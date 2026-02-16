"use client";

import React, { useState, useEffect, useRef } from 'react';

type LogEntry = {
  type: 'system' | 'user' | 'ai';
  content: string;
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'system', content: 'INITIALIZING DIGITAL TWIN PROTOCOL...' },
    { type: 'system', content: 'CONNECTION ESTABLISHED.' },
    { type: 'ai', content: 'Greetings. I am the Digital Twin of Sagar. Type "help" to see available commands.' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newLogs: LogEntry[] = [...logs, { type: 'user', content: cmd }];
    let response = "";
    
    if (cleanCmd === 'help') {
      response = "AVAILABLE COMMANDS: about, status, interview, contact, clear";
    } else if (cleanCmd === 'status') {
      response = "[SYSTEM SCAN] > Uptime: 99.9% > Security: Encrypted > MCP: Active";
    } else if (cleanCmd === 'about') {
      response = "PROFILE: Sagar is a Cybersecurity Architect specializing in Next.js security.";
    } else if (cleanCmd === 'interview') {
      response = "INTERVIEW MODULE: Specify role 'cybersecurity' or 'frontend'.";
    } else if (cleanCmd.includes('cyber')) {
      response = "QUERY: How would you mitigate an SQL Injection attack?";
    } else if (cleanCmd.includes('frontend')) {
      response = "QUERY: Explain React Virtual DOM.";
    } else if (cleanCmd === 'clear') {
      setLogs([]);
      setInput('');
      return;
    } else {
      response = `Command '${cleanCmd}' not recognized.`;
    }

    setTimeout(() => {
      setLogs(prev => [...prev, { type: 'ai', content: response }]);
    }, 400);

    setLogs(newLogs);
    setInput('');
  };

  return (
    <div style={{ 
      backgroundColor: '#000', 
      border: '1px solid #333', 
      borderRadius: '5px',
      padding: '20px', 
      fontFamily: 'Courier New, monospace',
      marginTop: '20px',
      height: '400px',
      overflowY: 'auto'
    }}>
      {logs.map((log, i) => (
        <div key={i} style={{ marginBottom: '10px', color: log.type === 'user' ? '#fff' : '#00ff41' }}>
          <span style={{ opacity: 0.7 }}>{log.type === 'user' ? '> USER: ' : '> SAGAR_AI: '}</span>
          {log.content}
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <span style={{ color: '#00ff41', marginRight: '10px' }}>{'>'}</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          autoFocus
          style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none' }} 
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
