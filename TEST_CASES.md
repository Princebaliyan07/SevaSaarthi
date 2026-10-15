# 🧪 SevaSaarthi Test Suite & Verification Cases

This document outlines the testing strategy, test scenarios, automated test runner, and sample test data for the **SevaSaarthi** platform.

---

## 1. Quick Start: Running Tests

The test suite automatically spins up an in-memory/isolated Express server instance on port `5099` and executes automated integration tests across all core endpoints.

### From Root Directory:
```bash
npm test
```

### Or From Server Directory:
```bash
cd server
npm test
```

### Running Sample Data Seeder:
```bash
# Seed hospitals, Jan Aushadhi medicines, volunteer teams, and crowd zones
npm run seed
```

---

## 2. Automated Test Matrix (17 Verified Scenarios)

The automated test script (`server/scripts/test-api.js`) executes the following end-to-end verification cases:

| # | Test Scenario | HTTP Method | Target Endpoint | Payload / Parameters | Expected Status | Success Assertion |
|---|---|---|---|---|---|---|
| **1** | Health Check & System Status | `GET` | `/api/v1/health` | None | `200 OK` | `status: "ok"` or valid health payload |
| **2** | Live Incidents Feed | `GET` | `/api/v1/incidents/live` | None | `200 OK` | Returns array of active incidents |
| **3** | Incidents Statistics | `GET` | `/api/v1/incidents/stats` | None | `200 OK` | Returns aggregated metrics by severity |
| **4** | Nearby Hospital Directory | `GET` | `/api/v1/hospitals` | None | `200 OK` | Returns verified 24x7 hospitals with bed counts |
| **5** | Jan Aushadhi Medicines Catalog | `GET` | `/api/v1/medicines` | None | `200 OK` | Returns generic medicines with savings % |
| **6** | Duty Doctor Roster | `GET` | `/api/v1/doctors` | None | `200 OK` | Returns active on-call medical practitioners |
| **7** | Kumbh Mela Crowd Telemetry | `GET` | `/api/v1/mela/crowd-status` | None | `200 OK` | Returns sector density levels & occupancy |
| **8** | Command Centre Metrics | `GET` | `/api/v1/command/stats` | None | `200 OK` | Returns dispatch stats, active SOS count |
| **9** | Volunteer Battalion Teams | `GET` | `/api/v1/volunteers/teams` | None | `200 OK` | Returns registered skill-tagged teams |
| **10** | AI Saarthi Red-Flag Clinical Triage | `POST` | `/api/v1/ai/chat` | `{"message": "Patient has severe chest pain and unconsciousness"}` | `200 OK` | **Critical Safety**: `data.isRedFlag === true` triggers immediate emergency modal |
| **11** | AI Saarthi Disaster Inquiry | `POST` | `/api/v1/ai/chat` | `{"message": "Flood alert in Sangam, where to go?"}` | `200 OK` | Returns contextual safety guidelines |
| **12** | 112 SOS Incident Dispatch | `POST` | `/api/v1/incidents` | `{"title": "Waterlogging near Sangam Gate 2", "category": "Flood", "severity": "high", "location": "Sangam Sector 2"}` | `201 Created` | Returns auto-generated ID (`SS-EMG-...`) & status `REPORTED` |
| **13** | Kumbh Mela Missing Person Report | `POST` | `/api/v1/mela/missing-persons` | `{"name": "Ramesh Kumar", "age": 58, "gender": "Male", "lastSeenLocation": "Parade Ground Sector 4", "contactPhone": "+91 98765 00000"}` | `201 Created` | Returns registered case ID for broadcast |
| **14** | Book OPD Doctor Appointment | `POST` | `/api/v1/appointments` | Doctor booking payload | `201 Created` | Confirms appointment reservation |
| **15** | User Registration (Auth) | `POST` | `/api/v1/auth/register` | User details (name, phone, role, password) | `201 Created` | Creates new user & returns JWT token |
| **16** | User Login (Auth) | `POST` | `/api/v1/auth/login` | Phone & password | `200 OK` | Verifies password & issues JWT token |
| **17** | GIS GeoJSON Layers | `GET` | `/api/v1/disasters/gis` | None | `200 OK` | Returns GeoJSON FeatureCollection for Leaflet radar |

### Test Execution Output:
```text
=================================================
Test Results: 17 Passed, 0 Failed out of 17 Tests
=================================================
```

---

## 3. Sample Data Overview

Sample datasets are located in:
- **`data/sample_data.json`**: Static reference data for offline verification and mock runs.
- **`server/scripts/seed.js`**: Database seeder script for MongoDB Atlas.

### Sample Data Breakdown:
1. **Verified 24x7 Hospitals (`HOSP-UP-001`, `HOSP-UP-002`)**:
   - Includes GeoJSON 2dsphere coordinates (`[lng, lat]`).
   - Bed counts: Total beds, ICU beds available, Oxygen beds available.
   - Emergency services: 24x7 Trauma Center, Blood Bank, Free Jan Aushadhi pharmacy.
2. **Jan Aushadhi Generic Medicines**:
   - Salt formulation, category, brand name equivalent, generic price vs market price, savings percentage (60–75%).
3. **Disaster Alerts (NASA EONET & NDMA SACHET)**:
   - Severity tags (`critical`, `high`, `moderate`), coordinates, affected districts, and CAP warning descriptions.
4. **Mela Crowd Zones**:
   - Sector name, capacity, real-time occupancy, risk scores (0–100), and crowd diversion status.

---

## 4. Manual Testing via cURL

### Test 1: Emergency SOS Submission
```bash
curl -X POST http://localhost:5000/api/v1/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Severe road accident near Civil Lines",
    "category": "Accident",
    "severity": "critical",
    "location": "Civil Lines Crossing, Prayagraj",
    "callerPhone": "+91 98765 43210"
  }'
```

### Test 2: AI Clinical Red-Flag Trigger
```bash
curl -X POST http://localhost:5000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "My father is having acute chest pain and difficulty breathing"
  }'
```
*Expected response contains `isRedFlag: true` triggering automatic emergency dispatch suggestions.*
