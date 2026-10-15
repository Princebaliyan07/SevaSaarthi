<div align="center">

# 🛡️ SevaSaarthi
### *Technology for Safer Communities*

**An Integrated Civic Emergency, Healthcare & Disaster Mitigation Platform for India**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-sevasaarthiindia.vercel.app-teal?style=for-the-badge)](https://sevasaarthiindia.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Technical Design](https://img.shields.io/badge/Docs-Technical_Design-blue?style=for-the-badge)](docs/TECHNICAL_DESIGN_DOCUMENT.md)
[![Tests](https://img.shields.io/badge/Tests-17%20Passed-brightgreen?style=for-the-badge)](TEST_CASES.md)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com/)

> *"Stronger Communities. Safer, Healthier India."*

</div>

---

## 🌟 Overview

**SevaSaarthi** *(seva = service, saarthi = companion/guide)* is a full-stack civic emergency portal that connects citizens, first responders, and authorities across emergency healthcare, real-time disaster monitoring, mass-gathering safety, and relief logistics — all on a single platform built for India.

### Core Pillars

| Pillar | Description |
|--------|-------------|
| 🩺 **Healthcare & Medical** | Emergency hospital routing, Jan Aushadhi medicines, first-aid dispatch |
| ⚡ **First Responder Network** | "Uber for First Aid" — verified responders arrive in 2–3 minutes |
| 🌪️ **Disaster Saarthi & GIS** | NDMA SACHET, NASA EONET, IMD satellite telemetry + victim relief schemes |
| 🕉️ **Mela Suraksha** | Crowd density heatmaps & missing person reunification for mass gatherings |

---

## 🌐 Live Platform

| Service | URL |
|---------|-----|
| 🖥️ Frontend (Vercel) | [https://sevasaarthiindia.vercel.app/](https://sevasaarthiindia.vercel.app/) |
| ⚙️ Backend (Render) | Deployed via `render.yaml` |

---

## 🚀 Key Features

### 1. 🚨 Emergency SOS & 112 Dispatch
- One-tap GPS incident reporting with auto-generated IDs (`SS-EMG-YYYY-XXXXX`)
- Multi-agency routing: **Police · 108 ALS Ambulance · SDRF · Fire Brigade**
- Real-time SLA timer with automatic Magistrate escalation on breach
- WebSocket-powered live status tracking for citizens and responders

### 2. 🏥 Healthcare & Jan Aushadhi
- **Geospatial hospital finder** — nearest verified 24×7 hospital via 2dsphere proximity search
- Filter by category: `General · Trauma · Children · Maternity`; one-tap Google Maps directions
- **PM Jan Aushadhi catalog** — 50+ generic medicines, up to **75% cheaper** than branded alternatives
- Autocomplete medicine search with animated savings ring chart and stock-status indicator
- **Instant First Responder Network** — Doctors, Nurses, NCC/NSS Volunteers, Ex-Army Medics, Paramedics, and NDRF/SDRF-trained responders
- Every responder verified via **Aadhaar OTP (UIDAI)** + mandatory Govt ID upload; approved by Admin before going live
- Duty doctor roster, OPD teleconsultation booking, and optional video-call link for remote guidance

### 3. 📡 Disaster Early Warning & GIS Radar
- **Multi-feed aggregation**: NASA EONET v3 · NDMA SACHET CAP/RSS · IMD Mausam Bhavan
- Deduplication engine with `incidentId` indexing; periodic auto-sync via `node-cron`
- Seasonal GIS risk maps, mock drill simulator, emergency-kit checklist, shelter finder
- **Government relief schemes** for disaster victims — PMFBY, SDRF, PMAY-G, DAY-NRLM, PMJDY, NHM & Aapda Mitra — with direct one-click Apply links

### 4. 🕉️ Mela Suraksha — Mass Gathering Safety
- Real-time crowd density grid for sectors: `Sangam Ghat · Parade Ground · Pontoon Bridges`
- Zone status indicators: `Critical · High · Moderate · Normal` with live telemetry
- Integrated **Lost & Found registry** broadcasting across CCTV & NDRF helpdesks
- AI face-tag missing-person reunification with photo upload and registration workflow
- Interactive facility map: Medical Posts, Toilets, Parking, Entry/Exit Gates, CCTV nodes

### 5. 🤝 Volunteer & Relief Logistics
- Community response battalion with skill tagging: `First Aid · Boat Rescue · Evacuation`
- Volunteer status tracking: `Active · On Mission · Standby · Offline`
- Prescription & flood-relief delivery pipeline with 6-stage fulfillment tracking
- Relief campaign management with crowdfunding, donor tracking, and live progress bars
- Supplier registration and supply-order management for relief materials

### 6. 🗺️ GIS Disaster Radar
- Interactive Leaflet map with clustered incident markers and severity overlays
- Layer toggles for flood zones, wildfire perimeters, cyclone tracks, landslide alerts
- Filter by disaster type, date range, and affected district

### 7. 🖥️ Command Centre Dashboard *(Admin Only)*
- Unified admin panel: manages SOS alerts, volunteer dispatch, Mela safety, and relief operations
- Receives real-time alerts from Mela sectors, volunteer teams, and emergency responders
- First Responder approval queue — review Aadhaar-verified applicants and approve/reject
- Edit and update all registry data: hospitals, medicines, volunteers, suppliers, and relief campaigns
- Role-based access control with JWT authentication

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React + Vite)                    │
│  Emergency · Healthcare · GIS · Mela · Volunteers · Admin   │
└──────────────────────────┬──────────────────────────────────┘
                           │  REST API + WebSocket (Socket.IO)
┌──────────────────────────▼──────────────────────────────────┐
│                  SERVER (Node.js + Express)                  │
│   Auth · SOS · Hospital · Responder · Disaster · Mela       │
│   Volunteer · Relief · Supplier · Admin · Cron Jobs         │
└──────┬──────────────┬───────────────┬────────────────────────┘
       │              │               │
  MongoDB Atlas   External Feeds   Cloudinary / Multer
  (Mongoose)    (NASA · NDMA · IMD)  (File Uploads)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, React Router v6 |
| **Maps & Charts** | Leaflet.js, Recharts |
| **Real-time** | Socket.IO (client + server) |
| **Backend** | Node.js ≥18, Express 4 |
| **Database** | MongoDB Atlas + Mongoose (2dsphere geospatial indexes) |
| **Auth** | JWT + BCryptJS |
| **File Storage** | Multer + Cloudinary |
| **Scheduling** | node-cron (disaster feed sync) |
| **Security** | Helmet, express-rate-limit, CORS |
| **Deployment** | Vercel (frontend) · Render (backend) |

---

## 📁 Project Structure

```
SevaSaarthi/
├── client/                      # React + Vite frontend (Vercel)
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Command centre, disaster radar, mela, AI triage
│   │   ├── context/             # AuthContext, LanguageContext (Hindi/English)
│   │   ├── pages/               # Route-level pages
│   │   └── services/            # Axios API & Socket.IO client integrations
│   ├── .env.example             # Client environment configuration
│   └── vite.config.js
├── server/                      # Node.js + Express backend (Render)
│   ├── src/
│   │   ├── controllers/         # SOS, hospital, disaster, mela, volunteer controllers
│   │   ├── models/              # Mongoose schemas (2dsphere geospatial)
│   │   ├── routes/              # Express API route endpoints
│   │   ├── services/            # NASA, NDMA SACHET, IMD ingestion & AI guardrails
│   │   └── jobs/                # node-cron scheduled telemetry tasks
│   ├── scripts/
│   │   ├── seed.js              # Database seeder (hospitals, medicines, teams)
│   │   └── test-api.js          # Automated 17-point test runner
│   ├── .env.example             # Backend environment template
│   └── src/server.js
├── data/
│   └── sample_data.json         # Offline sample dataset for evaluators
├── docs/
│   └── TECHNICAL_DESIGN_DOCUMENT.md # Full architecture & design specifications
├── ARCHITECTURE.md              # Architectural diagrams & system overview
├── TEST_CASES.md                # 17 Automated & manual test scenarios
├── LICENSE                      # Open-source MIT License
├── package.json                 # Unified root npm run scripts
├── render.yaml                  # Render deployment configuration
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js ≥ 18, npm ≥ 9
- MongoDB Atlas cluster (free tier or local `mongodb://127.0.0.1:27017/sevasaarthi`)

### Setup & Run

```bash
# 1. Clone the repository
git clone https://github.com/Princebaliyan07/SevaSaarthi.git
cd SevaSaarthi

# 2. Install dependencies (Root, Server & Client)
npm install
cd server && npm install
cd ../client && npm install
cd ..

# 3. Configure environment variables (see below)
cp server/.env.example server/.env
cp client/.env.example client/.env

# 4. (Optional) Seed Sample Data into MongoDB
npm run seed

# 5. Run Automated Test Suite (17 Scenarios)
npm test

# 6. Start development servers
# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
npm run client
```

Frontend: `http://localhost:5173` · Backend: `http://localhost:5000`

---

## 🧪 Testing & Verification

SevaSaarthi includes an automated end-to-end verification suite running 17 test cases covering 112 SOS dispatch, geospatial hospital queries, Jan Aushadhi generic discovery, AI red-flag clinical guardrails, and authentication.

```bash
npm test
```

> 📄 For full assertion details, expected payloads, and manual cURL commands, see [TEST_CASES.md](TEST_CASES.md).

---

## 🔐 Environment Variables

> [!CAUTION]
> Never commit `.env` files or real credentials to version control. Keep `.env` in `.gitignore`.

### 1. Backend (`server/.env`):
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sevasaarthi

# Authentication & Security
ACCESS_TOKEN_SECRET=sevasaarthi_dev_secret_key_2026_super_secure
ACCESS_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# Periodic Telemetry Synchronization (minutes)
SYNC_INTERVAL_MINUTES=5

# Official External Emergency Feeds (Public Endpoints)
NASA_EONET_API_URL=https://eonet.gsfc.nasa.gov/api/v3/events
NDMA_SACHET_URL=https://sachet.ndma.gov.in/cap_feed/rss
IMD_WEATHER_URL=https://mausam.imd.gov.in/responsive/rss/national_weather.xml

# Command Centre Official Administration Credentials (Optional)
ADMIN_PHONE_1=
ADMIN_PHONE_2=
ADMIN_PASSWORD=
```

### 2. Frontend (`client/.env`):
```env
# Point to backend (relative proxy or deployed Render URL)
VITE_API_URL=/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | JWT login |
| `POST` | `/api/sos` | Submit emergency SOS |
| `GET` | `/api/sos` | List all SOS incidents (admin) |
| `PATCH` | `/api/sos/:id/status` | Update SOS status |
| `GET` | `/api/hospitals/nearby` | Geospatial hospital search |
| `GET` | `/api/medicines` | Jan Aushadhi catalogue |
| `GET` | `/api/responders/nearby` | Nearby verified responders |
| `POST` | `/api/responders/register` | Register as first responder |
| `GET` | `/api/disasters` | Aggregated multi-feed disaster events |
| `GET` | `/api/mela/density` | Crowd density telemetry |
| `POST` | `/api/mela/missing` | Report missing person |
| `GET` | `/api/volunteers` | Volunteer directory |
| `GET` | `/api/relief/campaigns` | Active relief campaigns |
| `GET` | `/api/admin/dashboard` | Admin summary stats (protected) |

---

## 🔌 WebSocket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `sos:new` | Server → Client | New SOS incident object |
| `sos:statusUpdate` | Server → Client | `{ id, status, responder }` |
| `mela:crowdUpdate` | Server → Client | Sector density data |
| `disaster:alert` | Server → Client | New disaster event |
| `responder:assigned` | Server → Client | Responder assignment confirmation |

---

## 🚀 Deployment

### Frontend — Vercel
```bash
# From /client
vercel --prod
# Set VITE_API_URL=<your-render-backend-url> in Vercel environment settings
```

### Backend — Render
```yaml
# render.yaml (already configured)
services:
  - type: web
    name: sevasaarthi-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    rootDir: server
```
Add all environment variables from `server/.env` in the Render dashboard.

---

## 📊 Platform Impact

| Metric | Value |
|--------|-------|
| Emergency Response Time | < 3 minutes (first responder target) |
| Medicine Savings | Up to 75% vs branded alternatives |
| Disaster Feeds | 3 live sources (NASA · NDMA · IMD) |
| Government Schemes Indexed | 8+ direct-apply disaster relief schemes |
| Responder Cadres Supported | 6 (Doctor · Nurse · NCC/NSS · Ex-Army · Paramedic · NDRF/SDRF) |
| Crowd Zones Monitored | Configurable per event (Kumbh: 15+ sectors) |

---

## 🔒 Security

- JWT authentication with BCrypt password hashing
- Helmet HTTP security headers + CORS whitelist
- Express rate-limiting on all public endpoints
- Aadhaar OTP (UIDAI) verification for first responders
- Mandatory Govt ID upload — no proof, no activation
- Admin approval queue before any responder goes live
- All secrets managed via environment variables — none hardcoded

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request

---

<div align="center">

**Built with ❤️ for India's citizens, first responders, and civic authorities**

*SevaSaarthi — सेवा सारथी*

</div>
