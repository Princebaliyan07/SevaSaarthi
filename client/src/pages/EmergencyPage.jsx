import { useState } from 'react';
import EmergencyTileGrid from '../components/emergency/EmergencyTileGrid';
import GpsLocationCard from '../components/emergency/GpsLocationCard';
import VoiceSosRecorder from '../components/emergency/VoiceSosRecorder';
import IncidentStatusTracker from '../components/emergency/IncidentStatusTracker';
import { reportIncident } from '../services/incidentService';
import { useEmergency } from '../context/EmergencyContext';
import { useLanguage } from '../context/LanguageContext';

const OFFICIAL_NUMBERS = [
  { name: 'National Unified Emergency', nameHi: 'एकीकृत आपातकालीन सेवा', num: '112' },
  { name: 'Ambulance First Response', nameHi: 'एम्बुलेंस सेवा', num: '108' },
  { name: 'Fire & Rescue Service', nameHi: 'अग्निशमन सेवा', num: '101' },
  { name: 'Women Safety Helpline', nameHi: 'महिला हेल्पलाइन', num: '1091' },
  { name: 'Child Safety Helpline', nameHi: 'चाइल्ड हेल्पलाइन', num: '1098' },
  { name: 'National Disaster Helpline', nameHi: 'आपदा प्रबंधन हेल्पलाइन', num: '1078' },
];

export default function EmergencyPage() {
  const { lang, t } = useLanguage();
  const { geo, activeIncident, setActiveIncident } = useEmergency();
  const [createdIncident, setCreatedIncident] = useState(activeIncident || null);

  const handleTileClick = async (tile) => {
    const res = await reportIncident({
      title: `${tile.title}: report created`,
      category: tile.id,
      severity: tile.id === 'medical' || tile.id === 'road' || tile.id === 'fire' ? 'critical' : 'high',
      location: geo.coords
        ? `Lat ${geo.coords.lat.toFixed(4)}, Lng ${geo.coords.lng.toFixed(4)}`
        : 'Prayagraj Zone 4',
    });

    const newTicket = {
      id: res.data.incidentId || res.data.id,
      title: `${tile.title}: report created`,
      status: 'assigned',
    };
    setCreatedIncident(newTicket);
    setActiveIncident(newTicket);
  };

  return (
    <div className="container-page py-10 space-y-8">
      {/* Page Title & Warning Banner */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-4 w-4 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600"></span>
          </span>
          <h1 className="page-title text-rose-600 dark:text-rose-400">
            {t('emergency.title')}
          </h1>
        </div>

        <div className="rounded-2xl border border-rose-300 bg-rose-50/90 p-4 text-xs font-bold text-rose-800 shadow-sm backdrop-blur-sm dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200 sm:text-sm">
          🚨 {t('emergency.warningBanner')}
        </div>
      </div>

      {/* Main Grid: 9-Tile SOS Grid on Left, Numbers & Location on Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: 9 Tactile Tiles + Voice SOS */}
        <div className="space-y-6 lg:col-span-7">
          <EmergencyTileGrid onSelectTile={handleTileClick} />
          <VoiceSosRecorder onRecordComplete={(audio) => console.log('Voice note:', audio)} />
        </div>

        {/* Right Column: Official Numbers, Your Location, Created Report */}
        <div className="space-y-6 lg:col-span-5">
          {/* Official Numbers List */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📞</span>
              <span>{t('emergency.officialNumbers')}</span>
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {OFFICIAL_NUMBERS.map((item) => (
                <div
                  key={item.num}
                  className="flex items-center justify-between py-3 text-xs"
                >
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {lang === 'hi' ? item.nameHi : item.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-sm">
                      {item.num}
                    </span>
                    <a
                      href={`tel:${item.num}`}
                      className="rounded-xl bg-gradient-to-r from-red-600 to-rose-700 px-3.5 py-1.5 font-bold text-white shadow-xs hover:from-red-500 hover:to-rose-600 transition-all"
                    >
                      {t('emergency.call')}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Location Card */}
          <GpsLocationCard />

          {/* Live Incident Tracker Card */}
          {createdIncident ? (
            <IncidentStatusTracker
              incidentId={createdIncident.id}
              title={createdIncident.title}
              status={createdIncident.status}
            />
          ) : (
            <div className="glass-card p-5 space-y-2 text-center border-dashed border-slate-300 dark:border-slate-800">
              <span className="text-2xl">🛡️</span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {lang === 'hi' ? 'कोई सक्रिय आपातकाल रिपोर्ट नहीं' : 'No Active Emergency Ticket'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'hi'
                  ? 'तत्काल 112 सहायता और रिस्पांडर डिस्पैच के लिए बाईं ओर किसी भी लाल टाइल पर टैप करें।'
                  : 'Tap any emergency tile on the left to trigger immediate GPS dispatch to police, ambulance, and disaster response teams.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
