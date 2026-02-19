# Digital Twin III: Cyber-Hardened SOC Portfolio
**Architected by Sagar | Cybersecurity Professional (Graduating May 2026)**

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-green)](https://digital-twin-sagar.vercel.app/)
[![Database-Neon](https://img.shields.io/badge/Database-Neon_Postgres-blue)](https://neon.tech/)

## 🛡️ Project Overview
Digital Twin III is a self-defending professional portfolio and Security Operations Center (SOC) simulation. Unlike static resumes, this platform actively monitors, logs, and mitigates Layer 7 threats in real-time using an Edge-based Web Application Firewall (WAF).

### **Key Security Features**
* **Edge-Level Defense:** Custom Middleware WAF that intercepts malicious scanners (SQLMap, Nikto, Nmap) before they reach the application.
* **Live Telemetry Pipeline:** Real-time logging of attacker IP addresses, geolocation (Sydney/Global), and attack signatures into a **Neon Postgres** database.
* **Interactive SOC Terminal:** A React-based CLI allowing users to query live threat intelligence and simulate privilege escalation (`sudo su`).
* **Sydney-Optimized Infrastructure:** Deployed on Vercel's Edge Network with a database hosted in **AWS Asia Pacific 2 (Sydney)** for ultra-low latency.

## 🛠️ Technical Stack
* **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
* **Backend/ORM:** Drizzle ORM (Serverless HTTP)
* **Database:** Neon Postgres (Serverless)
* **Security:** Vercel Edge Middleware, Layer 7 Threat Detection
* **Deployment:** Vercel CI/CD

## 🚀 Interactive Demo
Visit the [Live Terminal](https://digital-twin-sagar.vercel.app/) and try the following commands:
* `threat-intel`: Pulls the most recent 5 blocked attacks directly from the Postgres database.
* `sudo su`: Elevates privileges to root mode (Simulation).
* `status`: Performs a system integrity check on the SOC components.

## 📈 Security Implementation Detail
The WAF logic resides at the Edge, ensuring that malicious requests are dropped with a `403 Forbidden` status. Attackers are trapped with a custom CTF flag: `FLAG{layer_7_edge_defense_active}`.