<div align="center">

# 🛡️ SevaSaarthi
### *Technology for Safer Communities*

**An Integrated Civic Emergency, Healthcare & Disaster Mitigation Platform for India**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-sevasaarthiindia.vercel.app-teal?style=for-the-badge)](https://sevasaarthiindia.vercel.app/)
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
│   │   ├── components/
│   │   │   ├── common/          # Badge, shared UI
│   │   │   ├── command/         # Command Centre: agency cards, analytics, incident queue
│   │   │   ├── disaster/        # Disaster and relief module
│   │   │   ├── mela/            # Kumbh Mela: interactive map, crowd zones
│   │   │   └── ai/              # AI features
│   │   ├── context/             # AuthContext, LanguageContext (Hindi/English)
│   │   ├── pages/               # Route-level pages
│   │   └── utils/               # Axios config, helpers
│   └── vite.config.js
├── server/                      # Node.js + Express backend (Render)
│   ├── controllers/             # Business logic (e.g. incident.controller.js)
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API route definitions
│   ├── middleware/              # Auth, error handling
│   ├── jobs/                    # node-cron scheduled tasks
│   ├── .env.example             # Required environment variables
│   └── server.js
├── render.yaml                  # Render deployment config
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js ≥ 18, npm ≥ 9
- MongoDB Atlas cluster (free tier works)
- Cloudinary account (for file uploads)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/SevaSaarthi.git
cd SevaSaarthi

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Configure environment variables (see below)
cp server/.env.example server/.env

# 4. Start development servers
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Frontend: `http://localhost:5173` · Backend: `http://localhost:5000`

---

## 🔐 Environment Variables

> [!CAUTION]
> Never commit `.env` files or real credentials to version control. Add `.env` to `.gitignore`.

Create `server/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<your-database-name>

# Authentication
JWT_SECRET=<your-strong-random-jwt-secret>
JWT_EXPIRES_IN=7d

# Cloudinary (file uploads)
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Client origin (CORS)
CLIENT_URL=http://localhost:5173

# External feeds (no keys required — public endpoints)
NASA_EONET_URL=https://eonet.gsfc.nasa.gov/api/v3/events
NDMA_SACHET_URL=https://sachet.ndma.gov.in/cap_public_website/FetchAllAlertDetails

# Admin seed (optional — for initial setup only, remove after first run)
ADMIN_EMAIL=<your-admin-email>
ADMIN_PASSWORD=<your-strong-admin-password>
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
