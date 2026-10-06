import http from 'http';
import axios from 'axios';
import app from '../src/app.js';

async function runTests() {
  console.log('--- Starting SevaSaarthi Backend Automated Verification Suite ---\n');

  const testServer = http.createServer(app);
  const TEST_PORT = 5099;

  await new Promise((resolve) => testServer.listen(TEST_PORT, resolve));
  console.log(`[Test Server] Temporary test runner running on http://127.0.0.1:${TEST_PORT}\n`);

  const client = axios.create({
    baseURL: `http://127.0.0.1:${TEST_PORT}/api/v1`,
    timeout: 10000,
    validateStatus: () => true, // capture all statuses
  });

  const testCases = [
    { name: '1. Health Check', method: 'get', url: '/health', expectedStatus: 200 },
    { name: '2. Live Incidents Feed', method: 'get', url: '/incidents/live', expectedStatus: 200 },
    { name: '3. Incidents Stats', method: 'get', url: '/incidents/stats', expectedStatus: 200 },
    { name: '4. Hospitals List', method: 'get', url: '/hospitals', expectedStatus: 200 },
    { name: '5. Jan Aushadhi Medicines', method: 'get', url: '/medicines', expectedStatus: 200 },
    { name: '6. Doctors List', method: 'get', url: '/doctors', expectedStatus: 200 },
    { name: '7. Mela Crowd Overview', method: 'get', url: '/mela/crowd-status', expectedStatus: 200 },
    { name: '8. Command Stats', method: 'get', url: '/command/stats', expectedStatus: 200 },
    { name: '9. Volunteer Teams', method: 'get', url: '/volunteers/teams', expectedStatus: 200 },
    {
      name: '10. AI Chat Triage (Red Flag Check)',
      method: 'post',
      url: '/ai/chat',
      data: { message: 'Patient has severe chest pain and unconsciousness' },
      expectedStatus: 200,
      verify: (data) => data?.data?.isRedFlag === true,
    },
    {
      name: '11. AI Chat Triage (Disaster Query)',
      method: 'post',
      url: '/ai/chat',
      data: { message: 'Flood alert in Sangam, where to go?' },
      expectedStatus: 200,
      verify: (data) => typeof data?.data?.reply === 'string',
    },
    {
      name: '12. Report 112 SOS Incident',
      method: 'post',
      url: '/incidents',
      data: {
        title: 'Waterlogging near Sangam Gate 2',
        category: 'Flood',
        severity: 'high',
        location: 'Sangam Sector 2',
      },
      expectedStatus: 201,
      verify: (data) => data?.data?.id && data?.data?.status,
    },
    {
      name: '13. Report Missing Person',
      method: 'post',
      url: '/mela/missing-persons',
      data: {
        name: 'Gita Devi',
        age: 62,
        gender: 'Female',
        lastSeenLocation: 'Sangam Gate 1',
        clothing: 'Red saree with silver borders',
        contactPhone: '+91 98765 43210',
      },
      expectedStatus: 201,
      verify: (data) => data?.data?.caseId,
    },
    {
      name: '14. Book OPD Doctor Appointment',
      method: 'post',
      url: '/appointments',
      data: {
        doctorId: 'doc-1',
        patientName: 'Ramesh Gupta',
        phone: '+91 98765 12345',
        symptoms: 'Mild fever and cough',
      },
      expectedStatus: 201,
      verify: (data) => data?.data?.bookingId,
    },
    {
      name: '15. User Registration (Auth)',
      method: 'post',
      url: '/auth/register',
      data: {
        name: 'Arjun Citizen',
        phone: '+919876543299',
        password: 'Password123!',
        role: 'citizen',
      },
      expectedStatus: 201,
      verify: (data) => data?.data?.token && data?.data?.user?.phone === '+919876543299',
    },
    {
      name: '16. User Login (Auth)',
      method: 'post',
      url: '/auth/login',
      data: {
        phone: '+919876543299',
        password: 'Password123!',
      },
      expectedStatus: 200,
      verify: (data) => data?.data?.token,
    },
    {
      name: '17. GIS GeoJSON Layers',
      method: 'get',
      url: '/disasters/gis',
      expectedStatus: 200,
      verify: (data) => data?.data?.type === 'FeatureCollection',
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    try {
      const res = await client[tc.method](tc.url, tc.data);
      const isStatusOk = res.status === tc.expectedStatus;
      const isCustomOk = tc.verify ? tc.verify(res.data) : true;

      if (isStatusOk && isCustomOk) {
        console.log(`✅ [PASS] ${tc.name} -> Status: ${res.status}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${tc.name} -> Expected Status: ${tc.expectedStatus}, Got: ${res.status}`);
        console.error('Response Data:', JSON.stringify(res.data, null, 2));
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] ${tc.name} -> ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=================================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed out of ${testCases.length} Tests`);
  console.log(`=================================================\n`);

  await new Promise((resolve) => testServer.close(resolve));
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
