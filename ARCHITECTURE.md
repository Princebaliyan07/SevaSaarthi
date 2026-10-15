# 🏛️ SevaSaarthi System Architecture & Technical Design

This document provides a direct overview and links to the comprehensive Technical Design Document.

> 📄 **Full Technical Design Document**: Please refer to [docs/TECHNICAL_DESIGN_DOCUMENT.md](docs/TECHNICAL_DESIGN_DOCUMENT.md) for the complete design specification including data ingestion pipelines, ER models, and SLA escalation state machines.

---

## High-Level Architecture Overview

```mermaid
graph TD
    subgraph ClientLayer ["Client Layer (React 18 + Vite + Tailwind)"]
        UI_Citizen["Citizen Portal (SOS, Hospitals, Medicines)"]
        UI_Responder["Responder App (Tasks, GPS, Triage)"]
        UI_Admin["Command Centre Dashboard (Magistrate / Police)"]
        UI_Mela["Mela Suraksha (Crowd Grid, Lost & Found)"]
    end

    subgraph ApplicationLayer ["Application Layer (Node.js Express + Socket.IO)"]
        AuthSvc["Auth & RBAC Service (JWT + BCrypt)"]
        SOS_Engine["112 Emergency Dispatch & SLA Engine"]
        HospitalSvc["Geospatial Hospital & Jan Aushadhi Service"]
        MelaSvc["Mela Telemetry & Reunification Service"]
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

    ClientLayer -->|HTTPS / REST API| ApplicationLayer
    ClientLayer <-->|WSS / Socket.IO| SocketServer

    CronWorker --> NASA_Worker & NDMA_Worker & IMD_Worker
    NASA_Worker & NDMA_Worker & IMD_Worker --> DedupeEngine
    DedupeEngine --> MongoDB
    DedupeEngine -.->|disaster:alert| SocketServer

    ApplicationLayer --> MongoDB
    ApplicationLayer --> Cloudinary
```

---

## Key Modules
1. **Disaster Saarthi & GIS Radar**: Multi-source telemetry ingestion from NASA EONET v3, NDMA SACHET, and IMD Mausam Bhavan with 5-minute cron sync and duplicate filtering.
2. **112 Emergency Dispatch & Triage**: Sub-3 minute SLA timer with magistrate escalation on breach.
3. **Healthcare & Jan Aushadhi**: 2dsphere proximity search for 24x7 hospitals, blood banks, and generic medicines up to 75% cheaper.
4. **Mela Suraksha**: Crowd density grid monitoring, CCTV integration, and missing-person reunification.
5. **Security & Compliance**: JWT authentication, Aadhaar verification for first responders, and clinical red-flag triage guardrails.
