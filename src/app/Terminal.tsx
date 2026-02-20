"use client";

import React, { useState, useEffect, useRef } from "react";
import { getRecentThreats } from "./actions";
import ThreatMap from "../components/ThreatMap";

type LogEntry = {
  type: "system" | "user" | "ai" | "error" | "success" | "component";
  content: string | React.ReactNode;
};

// --- FILE SYSTEM CONFIGURATION ---
const fileSystem: Record<string, string[]> = {
  "~": ["projects", "skills", "contact", "system"],
  "~/projects": ["digital-twin-iii.txt", "soc-simulator.md"],
  "~/skills": ["cybersecurity.md", "react.ts", "networking.pdf"],
  "~/contact": ["email.txt", "linkedin.url"],
  "~/system": ["config.json", "logs.db"],
};

const fileContents: Record<string, string> = {
  "digital-twin-iii.txt":
    "Project: Professional Identity Portfolio. Built with Next.js, Neon Postgres, and Tailwind.",
  "soc-simulator.md":
    "An integrated WAF/SOC simulation tool for real-time threat telemetry.",
  "cybersecurity.md":
    "Specialization: Network Security, OWASP Top 10, Incident Response.",
  "react.ts": "Proficiency: Server Components, Hooks, TypeScript Integration.",
  "email.txt": "contact@sagar.dev",
  "linkedin.url": "https://www.linkedin.com/in/your-profile (update me)",
  "config.json": '{"status":"secure","region":"ap-southeast-2","env":"prod"}',
};

export default function Terminal() {
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState("~");
  const [isRoot, setIsRoot] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "system", content: "INITIALIZING SAGAR_OS V3.0..." },
    { type: "system", content: "SECURE_SHELL ESTABLISHED OVER VERCEL EDGE." },
    {
      type: "ai",
      content: 'Welcome, Operator. Type "help" to view available security modules.',
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = async (cmd: string) => {
    const rawCmd = cmd.trim();
    if (!rawCmd) return;

    const args = rawCmd.split(" ");
    const command = (args[0] || "").toLowerCase();
    const target = args[1];
    const extra = rawCmd.substring(command.length + 1).trim();

    // Log user command
    const userPrompt = `${isRoot ? "root" : "visitor"}@sagar:${currentPath} $ ${rawCmd}`;
    setLogs((prev) => [...prev, { type: "user", content: userPrompt }]);
    setInput("");

    let response: string | React.ReactNode = "";
    let type: LogEntry["type"] = "ai";

    switch (command) {
      case "help":
        response = `AVAILABLE MODULES:
  cv            Display professional profile & resume
  ls            List files in current directory
  cd [dir]      Navigate filesystem
  cat [file]    Display file contents
  status        Check system & WAF integrity
  threat-intel  Fetch real-time threat telemetry from Neon
  attack [type] Simulate exploit to test WAF (sqli, xss)
  clear         Reset terminal interface`;
        break;

      case "cv":
      case "whoami":
        response = `======================================================
:: PROFILE ::
Name:         Sagar Aryal
Title:        Cybersecurity Graduate | Security Engineering Focus
Location:     Sydney, NSW
Graduation:   Bachelor of Cybersecurity (Victoria University) — Apr 2026
Availability: Graduate / Junior Roles (SOC, SecEng, Cloud Sec)

:: SUMMARY ::
Hands-on cybersecurity student building and deploying secure systems.
Experience implementing edge-layer protections, threat telemetry logging,
and secure cloud architectures using modern full-stack tooling.

:: CORE STRENGTHS ::
> Defensive Security: Edge middleware controls, WAF concepts, traffic analysis
> AppSec:            OWASP testing (XSS/SQLi), secure session patterns
> Cloud & Infra:     Vercel deployments, Neon Postgres, environment hardening
> Networking:        Subnetting/VLANs, NAT/routing basics, Wireshark analysis

:: PROJECT HIGHLIGHTS ::
Digital Twin III (Next.js + Vercel + Neon)
  - CLI-style security portfolio site + threat-intel dashboard
  - Request filtering + telemetry capture for suspicious patterns
  - Designed for least-privilege and auditability

SecureShare (Flask Secure File Sharing)
  - AES encryption for files at rest
  - OTP-based login verification workflow
  - Secure upload/download logic + access controls

:: CERTIFICATION ::
CompTIA Security+ — In Progress

:: TARGET ROLES ::
SOC Analyst (L1) | Junior Security Engineer | Cybersecurity Graduate
Cloud Security Associate | Security Operations / Monitoring
======================================================`;
        type = "success";
        break;

      case "status":
        response = `[INTEGRITY REPORT]
> GATEWAY: ACTIVE (Vercel Edge)
> DATABASE: CONNECTED (Neon ap-southeast-2)
> WAF_RULESET: ENABLED
> SESSION_TYPE: ${isRoot ? "ADMINISTRATIVE (ROOT)" : "STANDARD_USER"}`;
        break;

      case "ls": {
        const files = fileSystem[currentPath] || [];
        response = files.length > 0 ? files.join("    ") : "Directory is empty.";
        break;
      }

      case "cd": {
        if (!target || target === "~" || target === "..") {
          setCurrentPath("~");
        } else {
          const path = currentPath === "~" ? `~/${target}` : `${currentPath}/${target}`;
          if (fileSystem[path]) {
            setCurrentPath(path);
          } else {
            response = `cd: no such directory: ${target}`;
            type = "error";
          }
        }
        break;
      }

      case "cat": {
        if (!target) {
          response = "usage: cat [filename]";
          type = "error";
        } else if (fileContents[target]) {
          response = fileContents[target];
        } else {
          response = `cat: ${target}: No such file`;
          type = "error";
        }
        break;
      }

      case "threat-intel":
        setLogs((prev) => [
          ...prev,
          { type: "system", content: "COMMUNICATING WITH NEON CLUSTER..." },
        ]);

        try {
          const threats = await getRecentThreats();

          if (!threats || threats.length === 0) {
            response = "PERIMETER SECURE: No recent threats detected.";
            type = "success";
            break;
          }

          // Render component into terminal logs
          setLogs((prev) => [
            ...prev,
            { type: "success", content: `SYNC COMPLETE: ${threats.length} THREATS MITIGATED.` },
            { type: "component", content: <ThreatMap threats={threats} /> },
          ]);
          return; // handled

        } catch {
          response = "DB_SYNC_ERROR: Unable to reach telemetry cluster.";
          type = "error";
          break;
        }

      case "attack":
        if (!target) {
          response = "usage: attack [sqli | xss | brute-force]";
          type = "error";
          break;
        }

        setLogs((prev) => [
          ...prev,
          { type: "system", content: `TRANSMITTING ${target.toUpperCase()} PAYLOAD...` },
        ]);

        try {
          const res = await fetch("/api/alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ attackType: target.toUpperCase() }),
          });

          const data = await res.json().catch(() => ({ message: "Unknown response" }));

          setLogs((prev) => [
            ...prev,
            { type: "error", content: `[WAF_BLOCK] Connection reset by peer: ${data.message}` },
            { type: "success", content: "ALERT_DISPATCHED: Admin notified via email." },
          ]);
          return;
        } catch {
          response = "NETWORK_ERROR: WAF service unreachable.";
          type = "error";
          break;
        }

      case "clear":
        setLogs([]);
        return;

      case "sudo":
        if (target === "su") {
          setIsRoot(true);
          setLogs((prev) => [...prev, { type: "success", content: "ROOT ACCESS GRANTED. USE WITH CAUTION." }]);
          return;
        }
        response = "usage: sudo su";
        type = "error";
        break;

      case "exit":
        setIsRoot(false);
        setLogs((prev) => [...prev, { type: "system", content: "logout" }]);
        return;

      case "encrypt":
        if (!extra) {
          response = "usage: encrypt [text]";
          type = "error";
        } else {
          response = `[OUTPUT]: ${btoa(extra)}`;
          type = "success";
        }
        break;

      case "decrypt":
        if (!extra) {
          response = "usage: decrypt [text]";
          type = "error";
        } else {
          try {
            response = `[OUTPUT]: ${atob(extra)}`;
            type = "success";
          } catch {
            response = "ERROR: Invalid Base64 string.";
            type = "error";
          }
        }
        break;

      default:
        response = `Command not found: ${command}. Type 'help' for options.`;
        type = "error";
    }

    if (response) {
      setLogs((prev) => [...prev, { type, content: response }]);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#050505",
        padding: "25px",
        fontFamily: '"Courier New", monospace',
        height: "650px",
        overflowY: "auto",
        color: "#00ff41",
        border: "1px solid #1a1a1a",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            marginBottom: "10px",
            lineHeight: "1.5",
            whiteSpace: "pre-wrap",
            color:
              log.type === "error"
                ? "#ff3333"
                : log.type === "user"
                ? "#ffffff"
                : "#00ff41",
          }}
        >
          {log.type !== "user" && log.type !== "component" && (
            <span style={{ marginRight: "10px", opacity: 0.5 }}>{">"}</span>
          )}
          {log.content}
        </div>
      ))}

      <div style={{ display: "flex", marginTop: "15px" }}>
        <span style={{ color: "#00ff41", marginRight: "10px", fontWeight: "bold" }}>
          {isRoot ? "root" : "visitor"}@sagar:{currentPath} $
        </span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCommand(input)}
          spellCheck={false}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#ffffff",
            outline: "none",
            width: "100%",
            fontFamily: "inherit",
            fontSize: "1rem",
          }}
        />
      </div>

      <div ref={bottomRef} />
    </div>
  );
}