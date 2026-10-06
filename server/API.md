# SevaSaarthi Backend API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api/v1`  
**Authentication Scheme:** `Bearer <JWT_TOKEN>` in `Authorization` header.

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### 1.1 Register User
- **Method:** `POST /api/v1/auth/register`
- **Rate Limit:** 10 requests / 15 min
- **Request Body:**
```json
{
  "name": "Arjun Sharma",
  "phone": "+919876543210",
  "email": "arjun@example.com",
  "password": "SecurePassword123!",
  "role": "citizen",
  "bloodGroup": "O+",
  "emergencyContact": {
    "name": "Sunita Sharma",
    "phone": "+919876543211",
    "relation": "Mother"
  }
}
```
- **Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "user": {
      "_id": "6701a...",
      "name": "Arjun Sharma",
      "phone": "+919876543210",
      "role": "citizen"
    },
    "token": "eyJhbGciOi..."
  },
  "message": "User registered successfully",
  "success": true
}
```

### 1.2 Login User
- **Method:** `POST /api/v1/auth/login`
- **Request Body:**
```json
{
  "phone": "+919876543210",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK):** Returns user profile and signed JWT token.

### 1.3 Current User (`/me`)
- **Method:** `GET /api/v1/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Current sanitized user record.

---

## 2. Disaster & Live Telemetry (`/api/v1/incidents/live`)

### 2.1 Get Live Disaster Telemetry
- **Method:** `GET /api/v1/incidents/live`
- **Query Params:**
  - `disasterType` (e.g. `landslide`, `flood`, `cyclone`, `heatwave`)
  - `state` (e.g. `Uttar Pradesh`, `Uttarakhand`)
  - `severity` (`critical`, `high`, `moderate`)
  - `status` (`active`, `closed`, `all`)
  - `sourceType` (`official_gov`, `external_scientific`)
  - `limit` (default: 50)
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 4,
  "lastUpdated": "2026-10-06T15:00:00.000Z",
  "data": [
    {
      "incidentId": "NASA-EONET-5120",
      "disasterType": "landslide",
      "title": "NASA EONET: Chamoli NH-58 Rockfall",
      "description": "Slope failure detected by satellite telemetry.",
      "latitude": 30.4074,
      "longitude": 79.3275,
      "state": "Uttarakhand",
      "district": "Chamoli",
      "severity": "high",
      "status": "active",
      "source": "NASA EONET v3",
      "sourceUrl": "https://eonet.gsfc.nasa.gov/",
      "sourceType": "external_scientific",
      "verified": true,
      "actionRequired": "SDRF clearance underway."
    }
  ]
}
```

### 2.2 Trigger Disaster Telemetry Sync
- **Method:** `POST /api/v1/incidents/sync`
- **Response (200 OK):** Multi-source sync status across NASA EONET and NDMA SACHET.

---

## 3. Emergency SOS & Incidents (`/api/v1/incidents`)

### 3.1 Report 112 SOS Incident
- **Method:** `POST /api/v1/incidents`
- **Rate Limit:** 30 requests / 15 min
- **Request Body:**
```json
{
  "title": "Severe Waterlogging near Sangam Gate",
  "category": "Flood",
  "severity": "critical",
  "location": "Sangam Ghat Sector 2",
  "lat": 25.4298,
  "lng": 81.8791,
  "notes": "Pilgrim group stranded near water edge. Urgent boat evacuation requested."
}
```
- **Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "id": "SS-EMG-2026-84920",
    "incidentId": "SS-EMG-2026-84920",
    "title": "Severe Waterlogging near Sangam Gate",
    "category": "Flood",
    "severity": "critical",
    "status": "Assigned",
    "team": "112 Rapid Police & 108 ALS Ambulance",
    "eta": "12 min",
    "location": "Sangam Ghat Sector 2"
  },
  "message": "Emergency incident dispatched successfully",
  "success": true
}
```

### 3.2 Update Incident Status
- **Method:** `PATCH /api/v1/incidents/:id/status`
- **Request Body:**
```json
{ "status": "Responding" }
```

---

## 4. Healthcare & Hospitals (`/api/v1/hospitals`, `/medicines`, `/doctors`)

### 4.1 Search Hospitals
- **Method:** `GET /api/v1/hospitals`
- **Query Params:**
  - `category` (`All`, `General`, `Trauma`, `Children`, `Maternity`)
  - `lat`, `lng` (performs geospatial proximity search)
  - `traumaOnly` (`true`)

### 4.2 Jan Aushadhi Medicines & Price Match
- **Method:** `GET /api/v1/medicines`
- **Query Params:** `q=Paracetamol`
- **Response (200 OK):** Returns generic medicines with MRP and up to 75% savings comparison.

### 4.3 Duty Doctors & OPD Appointment
- **Method:** `GET /api/v1/doctors`
- **Method:** `POST /api/v1/appointments`

---

## 5. Kumbh Mela Management (`/api/v1/mela`)

### 5.1 Crowd Density & Sector Overview
- **Method:** `GET /api/v1/mela/crowd-status`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "crowdStatus": "High Inflow (Amavasya Snan)",
    "medicalCamps": 14,
    "zones": [
      {
        "id": "z-sangam",
        "name": "Sangam Ghat",
        "status": "Critical",
        "densityPercent": 92
      }
    ]
  }
}
```

### 5.2 Report Missing Person
- **Method:** `POST /api/v1/mela/missing-persons`
- **Request Body:**
```json
{
  "name": "Radha Devi",
  "age": 65,
  "gender": "Female",
  "lastSeenLocation": "Sangam Gate 3",
  "clothing": "Yellow Saree with red border",
  "contactPhone": "+919876599001"
}
```

---

## 6. Volunteer & Relief Logistics (`/api/v1/volunteers`)

- `GET /api/v1/volunteers/teams` - Active relief battalions and volunteer groups.
- `POST /api/v1/volunteers/register` - Volunteer skill registration.
- `GET /api/v1/volunteers/deliveries` - Medicine delivery queue.
- `POST /api/v1/volunteers/deliveries` - Citizen delivery request.
- `PATCH /api/v1/volunteers/deliveries/:id/claim` - Volunteer accepts task.

---

## 7. AI Saarthi Triage (`/api/v1/ai`)

### 7.1 AI Chat & Red-Flag Screening
- **Method:** `POST /api/v1/ai/chat`
- **Request Body:**
```json
{
  "message": "Patient is having severe chest pain and unconsciousness",
  "history": []
}
```
- **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "reply": "⚠️ EMERGENCY ALERT: This symptom may indicate a life-threatening medical emergency. Do NOT wait. Call 112 or 108 immediately.",
    "isRedFlag": true,
    "urgency": "critical",
    "actions": [
      { "label": "🚨 Call 112 / 108 Now", "type": "call", "value": "112", "danger": true }
    ],
    "disclaimer": "AI Saarthi provides civic guidance only and is not a medical prescription."
  },
  "success": true
}
```

---

## 8. Command Centre Analytics (`/api/v1/command/stats`)

- **Method:** `GET /api/v1/command/stats`
- Returns unified metrics: active emergencies, response time trends, agency deployment levels, and hospital bed pressure.

---

## 9. Real-Time WebSockets (`Socket.IO`)

- `incidents:updated` - Dispatched on disaster sync.
- `incidents:new` - Dispatched when citizen reports 112 SOS.
- `mela:missing_person` - Dispatched across Kumbh Mela desks on missing case.
- `delivery:new` - Dispatched when medicine relief request created.
- `incidents:sla_breach` - Dispatched when SLA expires.
