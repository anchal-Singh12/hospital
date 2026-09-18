# 🏥 HealthQueue AI - Smart Hospital Queue & Emergency Triage System

HealthQueue AI is a full-stack real-time hospital queue management system designed for hackathons and modern healthcare facilities. It utilizes AI-powered symptom triage, digital token generation, real-time WebSocket state synchronization, and dynamic waiting time estimation to eliminate hospital waiting room bottlenecks and prioritize critical emergency cases.

---

## 🌟 Features Included

1. **Patient Registration & AI Triage Assistant**:
   - Dynamic clinical risk assessment based on symptoms, pain rating (1-10 scale), age vulnerability, and vital flags.
   - Calculates a 1-100 Priority Index and assigns Triage Tiers (Critical Emergency, High Urgency, Standard Care, Minor/Routine).
2. **Doctor Registration & Multi-Doctor Roster**:
   - Onboard new physicians by department and consultation room.
   - Switch active doctor profiles in 1-click for quick hackathon demonstrations.
3. **Digital Token Generation**:
   - Produces department-coded digital pass tokens (e.g. `ER-001`, `CARD-002`, `GEN-003`).
4. **Real-Time Queue Status**:
   - Live WebSocket synchronization powered by Socket.IO across all client devices.
   - Updates instantly when tokens are issued, called, or completed.
5. **Dynamic Estimated Waiting Time**:
   - Recalculates live wait times based on doctor consultation rates, active queue count ahead, and priority score decay.
6. **Doctor Dashboard**:
   - Priority-ranked patient queue (Emergency cases highlighted on top).
   - 1-Click "Call Next Patient" with audio chime broadcast to waiting room displays.
   - Digital Prescription and Clinical Notes pad.
7. **Admin Command Center**:
   - Executive metrics (Total patients, Active doctors, Avg wait time, Emergency alerts).
   - Department load distribution cards.
   - Live system audit logs and manual queue priority override escalation.
8. **Emergency Priority Handling**:
   - Instant emergency bump functionality. Critical triage cases automatically bypass non-urgent patients with real-time audio & visual alerts.
9. **Public Waiting Room TV Display**:
   - High-contrast lobby TV mode displaying "NOW SERVING" room numbers, upcoming tokens, and audio notification visualizers.
10. **Role Switcher Demo Bar**:
    - Top bar allows hackathon judges to effortlessly toggle between **Patient**, **Doctor**, **Admin**, and **Public TV** views without requiring multiple logins.

---

## 🚀 How to Run the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (installed with Node.js)

### Step 1: Install Dependencies
In the root project folder (`hospital`), run:
```bash
npm install
```

### Step 2: Start Full-Stack Dev Server (Backend + Frontend)
Run the unified dev command:
```bash
npm run dev
```

This starts:
- **Backend API & Socket Server** on `http://localhost:5000`
- **Vite React Frontend** on `http://localhost:3000`

### Step 3: Open Application in Browser
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🎯 Quick Hackathon Testing Guide

1. **Patient View**:
   - Click **"Generate New Digital Token"**.
   - Input patient name, select department, type symptoms (e.g. *"chest pain"* or *"high fever"*), slide pain rating to 9/10.
   - Notice the AI Triage preview instantly assigning a **CRITICAL EMERGENCY** rating.
   - Click **"Issue Digital Token"** to see your live ticket with position counter and wait time.

2. **Doctor View**:
   - Click **"Doctor"** in the top navigation bar.
   - Select **"Dr. Sarah Jenkins (Bay 1)"**.
   - Click **"Call Room Bay 1"** to call the highest priority patient. Notice the audio chime sound!

3. **Admin View**:
   - Click **"Admin"** to monitor real-time hospital analytics, view live audit logs, and onboard new doctors.

4. **Public TV Display**:
   - Click **"Waiting Room TV"** to see the big-screen lobby mode showing active room calls.

---

## 🛠️ Built With

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, Socket.IO (WebSockets), In-Memory / File JSON Database (zero-config DB setup).
