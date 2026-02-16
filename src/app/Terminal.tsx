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
    const cleanCmd = cmd.trim();
    const lowerCmd = cleanCmd.toLowerCase();
    const newLogs: LogEntry[] = [...logs, { type: 'user', content: cmd }];
    
    // --- FEATURE: SECRET ADMIN MODE ---
    if (lowerCmd === 'sudo login admin') {
      setTimeout(() => {
        setLogs(prev => [...prev, { type: 'ai', content: 'ACCESS GRANTED. WELCOME, COMMANDER.' }]);
        // You could even add state here to change the text color to red!
      }, 500);
      setLogs(newLogs);
      setInput('');
      return;
    }

    let response = "";
    
    // --- FEATURE: ENCRYPTION TOOL ---
    if (lowerCmd.startsWith('encrypt ')) {
      const textToEncrypt = cleanCmd.replace('encrypt ', '');
      const encrypted = btoa(textToEncrypt); // Native Base64 encoding
      response = `[ENCRYPTED OUTPUT]: ${encrypted}`;
    }
    // --- FEATURE: DECRYPTION TOOL ---
    else if (lowerCmd.startsWith('decrypt ')) {
      try {
        const textToDecrypt = cleanCmd.replace('decrypt ', '');
        const decrypted = atob(textToDecrypt);
        response = `[DECRYPTED DATA]: ${decrypted}`;
      } catch (e) {
        response = "[ERROR]: Invalid encryption string.";
      }
    }
    // --- FEATURE: TRACE SIMULATION ---
    else if (lowerCmd === 'trace') {
      setLogs(newLogs);
      setInput('');
      
      // Simulate a multi-step trace
      const hops = [
        "HOP 1: 192.168.1.1 (Localhost) - <1ms",
        "HOP 2: 10.0.0.5 (Vercel Edge) - 12ms",
        "HOP 3: 172.217.16.14 (Google DNS) - 24ms",
        "HOP 4: 142.250.183.14 (AWS US-EAST) - 45ms",
        "TARGET REACHED: SECURE_VAULT [ENCRYPTED]"
      ];

      // Print lines one by one for effect
      hops.forEach((hop, index) => {
        setTimeout(() => {
          setLogs(prev => [...prev, { type: 'ai', content: hop }]);
        }, index * 600); // 600ms delay between each line
      });
      return; // Return early so we don't trigger the default response
    }
    // --- EXISTING COMMANDS ---
    else if (lowerCmd === 'help') {
      response = "COMMANDS: status, about, interview, trace, encrypt [msg], decrypt [msg], clear";
    } 
    else if (lowerCmd === 'status') {
      response = "[SYSTEM SCAN] > Uptime: 99.9% > Security: AES-256 > MCP: Active";
    } 
    else if (lowerCmd === 'about') {
      response = "PROFILE: Sagar // Cybersecurity Architect // Specializing in Threat Detection.";
    } 
    else if (lowerCmd === 'interview') {
      response = "INTERVIEW MODULE: Specify role 'cybersecurity' or 'frontend'.";
    } 
    else if (lowerCmd.includes('cyber')) {
      response = "QUERY: How would you mitigate an SQL Injection attack?";
    } 
    else if (lowerCmd.includes('frontend')) {
      response = "QUERY: Explain React Virtual DOM.";
    } 
    else if (lowerCmd === 'clear') {
      setLogs([]);
      setInput('');
      return;
    } 
    else {
      response = `Command '${cleanCmd}' not recognized. Type "help" for protocols.`;
    }

    // Default response delay
    if (response) {
      setTimeout(() => {
        setLogs(prev => [...prev, { type: 'ai', content: response }]);
      }, 400);
    }

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
