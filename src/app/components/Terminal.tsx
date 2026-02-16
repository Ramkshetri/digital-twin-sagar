"use client"; // Critical for interactivity

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

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newLogs: LogEntry[] = [...logs, { type: 'user', content: cmd }];

    // --- THE "BRAIN" OF THE CHATBOT ---
    let response = "";
    
    if (cleanCmd === 'help') {
      response = `AVAILABLE COMMANDS:
- about       : Display profile summary
- status      : Check system integrity
- interview   : Start role-specific simulation
- contact     : Decrypt contact channels
- clear       : Clear terminal screen`;
    } else if (cleanCmd === 'status') {
      response = `[SYSTEM SCAN COMPLETE]
> Uptime: 99.99%
> Security: AES-256 Encrypted
> Location: Vercel Edge Network
> MCP Server: Connected`;
    } else if (cleanCmd === 'about') {
      response = "PROFILE: Sagar is a Cybersecurity Architect specializing in Next.js security hardening and automated threat detection.";
    } else if (cleanCmd === 'interview') {
      response = "INTERVIEW MODULE LOADED. Please specify target role: 'cybersecurity' or 'frontend'.";
    } else if (cleanCmd.includes('cyber')) {
      response = "QUERY: How would you mitigate an SQL Injection attack? [Answering this demonstrates threat modeling skills]";
    } else if (cleanCmd.includes('frontend')) {
      response = "QUERY: Explain the React Virtual DOM reconciliation process.";
    } else if (cleanCmd === 'clear') {
      setLogs([]);
      setInput('');
      return;
    } else {
      response = `Command '${cleanCmd}' not recognized. Type "help" for protocols.`;
    }

    // Add AI response with a slight "thinking" delay
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
      overflowY: 'auto',
      boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)'
    }}>
      {logs.map((log, i) => (
        <div key={i} style={{ marginBottom: '10px', color: log.type === 'user' ? '#fff' : '#00ff41' }}>
          <span style={{ opacity: 0.7 }}>{log.type === 'user' ? '> USER: ' : '> SAGAR_AI: '}</span>
          {log.content}
        </div>
      ))}
      
      {/* Input Area */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <span style={{ color: '#00ff41', marginRight: '10px' }}>{'>'}</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          autoFocus
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