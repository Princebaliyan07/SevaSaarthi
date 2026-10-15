# 🏛️ SevaSaarthi — Technical Design Document (TDD)
### *Technology for Safer Communities — Integrated Civic Emergency, Healthcare & Disaster Mitigation Platform*

---

## 1. Executive Summary & System Objectives

**SevaSaarthi** (*सेवा सारथी*) is a mission-critical civic platform designed to tackle fragmentation across emergency healthcare, natural disaster management, mass gathering crowd safety, and relief logistics in India. 

### Core System Objectives
1. **Sub-3 Minute Emergency Dispatch**: Connect citizens to the nearest verified first responder and multi-agency 112 dispatch (Police, 108 ALS Ambulance, SDRF, Fire).
2. **Unified Early Warning Telemetry**: Ingest and deduplicate real-time disaster alerts from NASA EONET v3, NDMA SACHET (CAP/RSS), and IMD Mausam Bhavan.
3. **Affordable Healthcare Accessibility**: Geospatial 2dsphere indexing for nearest hospitals and Pradhan Mantri Jan Aushadhi generic medicine discovery offering up to 75% cost savings.
4. **Mass-Gathering Safety (Mela Suraksha)**: Real-time sector-wise crowd density telemetry, AI-assisted lost & found registry, and missing-person reunification.
5. **High Availability & Low-Bandwidth Resilience**: Offline-tolerant caching, ETag conditional queries, and WebSocket real-time broadcast.

---

## 2. High-Level System Architecture

```mermaid
graph TD
    subgraph ClientLayer ["Client Layer (React 18 + Vite + Tailwind)"]
        UI_Citizen["Citizen Portal (SOS, Hospitals, Medicines)"]
        UI_Responder["Responder App (Tasks, GPS, Triage)"]
        UI_Admin["Command Centre Dashboard (Magistrate / Police)"]
        UI_Mela["Mela Suraksha (Crowd Grid, Lost & Found)"]
    end

    subgraph GatewayLayer ["Network & Edge Gateway (Vercel / Reverse Proxy)"]
        Edge["CDN & HTTPS Edge Gateway"]
    end

    subgraph ApplicationLayer ["Application Layer (Node.js ≥18 + Express REST & Socket.IO)"]
        AuthSvc["Auth & RBAC Service (JWT + BCrypt)"]
        SOS_Engine["112 Emergency Dispatch & SLA Engine"]
        HospitalSvc["Geospatial Hospital & Jan Aushadhi Service"]
        MelaSvc["Mela Telemetry & Reunification Service"]
        VolunteerSvc["Volunteer & Relief Logistics Engine"]
        AISaarthi["AI Saarthi Triage & Clinical Guardrail Service"]
        SocketServer["Socket.IO Real-Time Dispatch Hub"]
    end

    subgraph IngestionPipeline ["External Ingestion & Telemetry Workers"]
        CronWorker["node-cron Scheduler (Every 5 mins)"]
        NASA_Worker["NASA EONET v3 Ingestion"]
        NDMA_Worker["NDMA SACHET (CAP / RSS Feed)"]
        IMD_Worker["IMD Mausam Bhavan Telemetry"]
        DedupeEngine["Deduplication & Geo-Indexing Engine"]
    end

    subgraph PersistenceLayer ["Data & Storage Layer"]
        MongoDB[("MongoDB Atlas (2dsphere Geospatial Indices)")]
        Cloudinary["Cloudinary (Aadhaar / Photo Storage)"]
    end

    ClientLayer -->|HTTPS / REST API| Edge
    ClientLayer <-->|WSS / Socket.IO| SocketServer
    Edge --> ApplicationLayer

    CronWorker --> NASA_Worker & NDMA_Worker & IMD_Worker
    NASA_Worker & NDMA_Worker & IMD_Worker --> DedupeEngine
    DedupeEngine --> MongoDB
    DedupeEngine -.->|disaster:alert| SocketServer

    ApplicationLayer --> MongoDB
    ApplicationLayer --> Cloudinary
    SOS_Engine -.->|sos:new & statusUpdate| SocketServer
    MelaSvc -.->|mela:crowdUpdate| SocketServer
```

---

## 3. Data Ingestion & Deduplication Pipeline

Disaster feeds are ingested on an automated cron schedule (`*/5 * * * *`). The engine handles XML and JSON responses with ETag caching to prevent redundant bandwidth consumption.

```mermaid
sequenceDiagram
    autonumber
    participant Cron as node-cron Scheduler
    participant Svc as DisasterSync Service
    participant External as NASA / NDMA / IMD Endpoints
    participant DB as MongoDB Atlas
    participant Socket as Socket.IO Hub
    participant Client as Command Centre & Citizens

    Cron->>Svc: Trigger periodic sync (Every 5 mins)
    par Fetch NASA EONET
        Svc->>External: GET /api/v3/events
        External-->>Svc: 200 OK (GeoJSON events)
    and Fetch NDMA SACHET
        Svc->>External: GET /cap_feed/rss (If-None-Match ETag)
        External-->>Svc: 200 OK or 304 Not Modified
    and Fetch IMD Nowcast
        Svc->>External: GET /responsive/rss/national_weather.xml
        External-->>Svc: 200 OK (XML Alerts)
    end

    Svc->>Svc: Parse XML via fast-xml-parser & normalize schema
    Svc->>Svc: Generate deterministic incidentId (e.g., SACHET-CAP-YYYY-XXXX)
    Svc->>DB: Bulk Upsert (updateOne with upsert: true)
    
    alt New Alert Detected
        Svc->>Socket: Emit 'disaster:alert' (severity, bbox, coordinates)
        Socket-->>Client: Real-time visual overlay on GIS Map
    end
```

---

## 4. 112 SOS Incident Lifecycle & SLA Escalation State Machine

Every emergency incident is governed by an automated SLA clock. If first responders or official agencies fail to acknowledge within 3 minutes, the incident escalates to the District Magistrate Command Officer.

```mermaid
stateDiagram-v2
    [*] --> REPORTED: Citizen presses SOS (GPS coordinates captured)
    
    REPORTED --> DISPATCHED: Multi-agency alert broadcast (Police, 108, SDRF)
    
    state DISPATCHED {
        [*] --> RespondersNotified
        RespondersNotified --> TimerRunning: SLA Timer Starts (180s)
        TimerRunning --> Responded: First Responder Accepts
        TimerRunning --> Escalated: Timeout > 180s (Auto-Escalate to DM)
    }

    DISPATCHED --> ON_ROUTE: Responder en route with live GPS
    ON_ROUTE --> ON_SCENE: First responder / Ambulance arrives
    ON_SCENE --> RESOLVED: Patient stabilized / incident handled
    RESOLVED --> [*]
```

---

## 5. Geospatial 2dsphere Query Architecture

To ensure millisecond response times when querying nearest hospitals and first responders, MongoDB's `2dsphere` geospatial indexing is utilized:

```mermaid
flowchart LR
    A["User GPS Location [lng, lat]"] --> B["$nearSphere Query"]
    B --> C["Filter: isOpen = true"]
    C --> D["Filter: category (Trauma/General/Maternity)"]
    D --> E["Sort by spherical distance (meters)"]
    E --> F["Return top N hospitals with available ICU & O2 beds"]
```

### Geospatial Index Definition
```javascript
// Hospital Schema Geospatial Index
HospitalSchema.index({ location: "2dsphere" });

// First Responder Live GPS Index
FirstResponderSchema.index({ currentLocation: "2dsphere" });
```

---

## 6. Real-Time WebSocket Protocol Matrix

All real-time communications are coordinated via Socket.IO across specialized channels:

| Event Name | Direction | Payload Structure | Purpose |
| :--- | :--- | :--- | :--- |
| `sos:new` | Server → Client | `{ incidentId, title, category, severity, coordinates, timestamp }` | Broadcast new emergency to Command Centre & nearby responders |
| `sos:statusUpdate` | Server → Client | `{ incidentId, status, responderId, responderName, eta }` | Real-time status update to citizen tracking screen |
| `mela:crowdUpdate` | Server → Client | `{ zoneId, zoneName, densityLevel, currentOccupancy, riskScore }` | Live updates to Kumbh Mela crowd density heatmap |
| `disaster:alert` | Server → Client | `{ incidentId, source, title, severity, coordinates, radius }` | Immediate GIS banner and map marker update |
| `responder:location` | Client → Server | `{ responderId, coordinates: [lng, lat] }` | Continuous telemetry during active dispatch missions |

---

## 7. Database Entity Relationship (ER) Model

```mermaid
erDiagram
    USER ||--o{ INCIDENT : reports
    USER ||--o| FIRST_RESPONDER : profiles
    USER ||--o{ VOLUNTEER_REGISTRATION : submits
    
    INCIDENT ||--o{ FIRST_RESPONDER : assigned_to
    INCIDENT }|--|| CROWD_ZONE : located_in
    
    HOSPITAL ||--o{ MEDICINE : stocks
    
    MELA_MAP ||--|{ CROWD_ZONE : contains
    MELA_MAP ||--|{ MELA_FACILITY : contains
    
    RELIEF_CAMPAIGN ||--o{ CAMPAIGN_DONATION : receives
    RELIEF_CAMPAIGN ||--o{ SUPPLY_ORDER : fulfills

    USER {
        string _id
        string name
        string phone
        string role
        string password
    }
    INCIDENT {
        string incidentId
        string title
        string category
        string severity
        string status
        geojson location
        date createdAt
    }
    HOSPITAL {
        string hospitalId
        string name
        string category
        int totalBeds
        int icuBedsAvailable
        geojson location
    }
    FIRST_RESPONDER {
        string responderId
        string cadre
        string verificationStatus
        string aadhaarVerified
        geojson currentLocation
    }
```

---

## 8. Security, Verification & Clinical Safety Architecture

1. **Authentication & Authorization**:
   - Industry-standard JSON Web Tokens (JWT) using `ACCESS_TOKEN_SECRET` with configurable expiry.
   - BCrypt salted password hashing (work factor 10).
   - Strict Role-Based Access Control (`citizen`, `responder`, `admin`, `magistrate`).
2. **First Responder Credentialing**:
   - Verification workflow ensuring all voluntary responders undergo Aadhaar OTP validation.
   - Mandatory official government photo ID upload stored on Cloudinary with encrypted signed URLs.
   - Mandatory admin approval gate before a responder can be dispatched to live incidents.
3. **AI Saarthi Clinical Safety Guardrails**:
   - Rule-based regex filter identifying life-threatening emergency symptoms (`chest pain`, `profuse bleeding`, `unconscious`, `snake bite`, `stroke`).
   - Emergency red flags trigger an immediate 112 SOS bypass modal rather than plain-text medical advice.
   - Non-prescriptive clinical disclaimers enforced across all AI responses.

---

## 9. Technology Stack & Deployment Architecture

| Layer | Component | Hosting / Service |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Leaflet.js, Recharts | Vercel (Edge CDN) |
| **Backend API** | Node.js ≥ 18, Express 4.x | Render (Container Web Service) |
| **Realtime Engine** | Socket.IO 4.x WebSocket Server | Render Web Service |
| **Database** | MongoDB Atlas with 2dsphere indexes | MongoDB Atlas Cloud (M0 / Dedicated) |
| **Media Storage** | Cloudinary CDN | Cloudinary Secure Assets API |
| **Scheduled Tasks** | node-cron (5-minute intervals) | Node.js Background Worker |
