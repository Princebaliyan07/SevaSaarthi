import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import DisasterAlert from '../models/DisasterAlert.model.js';
import Incident from '../models/Incident.model.js';
import { approximateIndiaState } from '../utils/geoUtils.js';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  trimValues: true,
});

// Cache for ETags to avoid unnecessary bandwidth and load
const etagStore = new Map();

/**
 * Fetch and parse NDMA SACHET CAP / RSS feeds with ETag support
 */
export async function fetchSachetAlerts() {
  const feeds = [
    {
      name: 'NDMA SACHET RSS',
      url: process.env.NDMA_SACHET_URL || 'https://sachet.ndma.gov.in/cap_feed/rss',
    },
    {
      name: 'IMD National Warning Feed',
      url: 'https://mausam.imd.gov.in/responsive/rss/national_weather.xml',
    },
  ];

  const processedAlerts = [];

  for (const feed of feeds) {
    try {
      const headers = {
        'User-Agent': 'SevaSaarthi-EmergencyPlatform/1.0',
        Accept: 'application/rss+xml, application/xml, text/xml',
      };

      const cachedEtag = etagStore.get(feed.url);
      if (cachedEtag) {
        headers['If-None-Match'] = cachedEtag;
      }

      const response = await axios.get(feed.url, {
        timeout: 9000,
        headers,
        validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
      });

      if (response.status === 304) {
        console.log(`[SACHET Service] Feed ${feed.name} not modified (304 Not Modified). Using cached data.`);
        continue;
      }

      if (response.headers.etag) {
        etagStore.set(feed.url, response.headers.etag);
      }

      if (!response.data) continue;

      const parsed = xmlParser.parse(response.data);
      const channel = parsed.rss?.channel || parsed.feed;
      const rawItems = channel?.item || channel?.entry;

      if (!rawItems) continue;

      const items = Array.isArray(rawItems) ? rawItems : [rawItems];

      for (const item of items) {
        const title = item.title || 'NDMA Disaster Advisory';
        const description = (item.description || item.summary || '').replace(/<[^>]*>?/gm, '').trim();
        const link = item.link || 'https://sachet.ndma.gov.in/';
        const guid = item.guid?.['#text'] || item.guid || item.id || `SACHET-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        let lat = 25.4358;
        let lng = 81.8463;

        if (item['geo:lat'] && item['geo:long']) {
          lat = Number(item['geo:lat']);
          lng = Number(item['geo:long']);
        } else if (item['georss:point']) {
          const parts = String(item['georss:point']).trim().split(/\s+/);
          if (parts.length >= 2) {
            lat = Number(parts[0]);
            lng = Number(parts[1]);
          }
        }

        const textLower = (title + ' ' + description).toLowerCase();
        let disasterType = 'heavyRain';
        let category = 'Monsoon Flood';
        let severity = 'Orange Alert';
        let incidentSeverity = 'high';

        if (textLower.includes('landslide') || textLower.includes('slope failure')) {
          disasterType = 'landslide';
          category = 'Landslide Hazard';
          severity = 'Orange Alert';
          incidentSeverity = 'high';
        } else if (textLower.includes('cyclone') || textLower.includes('depression') || textLower.includes('squall')) {
          disasterType = 'cyclone';
          category = 'Tropical Cyclone';
          severity = 'Red Alert';
          incidentSeverity = 'critical';
        } else if (textLower.includes('flood') || textLower.includes('inundat')) {
          disasterType = 'flood';
          category = 'Monsoon Flood';
          severity = 'Red Alert';
          incidentSeverity = 'critical';
        } else if (textLower.includes('heat') || textLower.includes('loo')) {
          disasterType = 'heatwave';
          category = 'Heatwave Thermal';
          severity = 'Orange Alert';
          incidentSeverity = 'high';
        } else if (textLower.includes('earthquake')) {
          disasterType = 'earthquake';
          category = 'Earthquake';
          severity = 'Red Alert';
          incidentSeverity = 'critical';
        }

        const state = approximateIndiaState(lat, lng);
        const alertId = `NDMA-${String(guid).replace(/[^a-zA-Z0-9-_]/g, '').slice(-24)}`;

        // 1. Upsert DisasterAlert document
        await DisasterAlert.findOneAndUpdate(
          { alertId },
          {
            alertId,
            category,
            title,
            season: 'Monsoon',
            affectedRegion: `${state} Disaster Zone`,
            severity,
            agency: 'NDMA SACHET / IMD',
            leadTime: 'Immediate to 48 Hours',
            dosAndDonts: [
              'Follow official alerts from district administration.',
              'Avoid travel through waterlogged roads and high-risk slopes.',
              'Keep emergency contact 112 / 1078 handy.',
            ],
            reliefCenterNearby: `District Emergency Operations Centre, ${state}`,
            coords: { lat, lng },
          },
          { upsert: true, new: true }
        );

        // 2. Upsert Incident document
        const incidentId = `NDMA-SACHET-${String(guid).replace(/[^a-zA-Z0-9-_]/g, '').slice(-24)}`;
        const incidentDoc = {
          incidentId,
          disasterType,
          title,
          description,
          latitude: lat,
          longitude: lng,
          location: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          state,
          district: `${state} District`,
          locationName: `${state} Warning Sector`,
          severity: incidentSeverity,
          status: 'active',
          source: 'NDMA SACHET / IMD',
          sourceUrl: link,
          sourceType: 'official_gov',
          verified: true,
          alertCode: alertId,
          actionRequired: 'Follow district administration advisories. Keep emergency kits ready.',
          updatedAt: new Date(),
        };

        await Incident.findOneAndUpdate({ incidentId }, incidentDoc, { upsert: true, new: true });
        processedAlerts.push(incidentDoc);
      }
    } catch (err) {
      console.warn(`[SACHET Service Warning] Could not fetch ${feed.name}: ${err.message}`);
    }
  }

  return processedAlerts;
}

export default { fetchSachetAlerts };
