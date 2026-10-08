import { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// Real govt hospitals list (matches MOCK_HOSPITALS in hospitalService)
const GOVT_HOSPITALS = [
  { id: 'HOSP-GN-001', name: 'Government Institute of Medical Sciences (GIMS)', city: 'Greater Noida', departments: ['General Medicine', 'Trauma & Emergency', 'Surgery', 'Paediatrics', 'Orthopaedics'] },
  { id: 'HOSP-GN-002', name: 'Sharda Hospital & Medical College', city: 'Greater Noida', departments: ['Trauma & Emergency', 'Critical Care', 'Cardiology', 'Neurology', 'Nephrology'] },
  { id: 'HOSP-NOI-006', name: 'District Combined Hospital, Sector 39 Noida', city: 'Noida', departments: ['Trauma & Emergency', 'Medicine', 'Surgery', 'Gynaecology', 'Paediatrics'] },
  { id: 'HOSP-LKO-001', name: "King George's Medical University (KGMU) Trauma Center", city: 'Lucknow', departments: ['Emergency Trauma', 'Resuscitation', 'Neuro Surgery', 'Burns', 'Orthopaedics'] },
  { id: 'HOSP-VNS-001', name: 'Sir Sunderlal Hospital, IMS BHU', city: 'Varanasi', departments: ['Trauma Center', 'General Medicine', 'General Surgery', 'Paediatrics', 'Gynaecology'] },
  { id: 'hosp-1', name: 'District Government Hospital (Swaroop Rani Nehru)', city: 'Prayagraj', departments: ['Medicine', 'Surgery', 'Paediatrics', 'Orthopaedics', 'Gynaecology'] },
  { id: 'AIIMS-NEW-DELHI', name: 'AIIMS New Delhi', city: 'New Delhi', departments: ['All Super-Specialty', 'Trauma', 'Cardiology', 'Oncology', 'Neurology'] },
  { id: 'SAFDARJUNG', name: 'Safdarjung Hospital', city: 'New Delhi', departments: ['Emergency', 'Medicine', 'Surgery', 'Gynaecology', 'Paediatrics'] },
  { id: 'RML-DELHI', name: 'Dr. Ram Manohar Lohia Hospital', city: 'New Delhi', departments: ['Emergency', 'Medicine', 'Cardiology', 'Orthopaedics', 'Neurology'] },
  { id: 'GTB-DELHI', name: 'Guru Teg Bahadur (GTB) Hospital', city: 'East Delhi', departments: ['Trauma & Emergency', 'Medicine', 'Surgery', 'Burns', 'Paediatrics'] },
  { id: 'LNJP-DELHI', name: 'Lok Nayak Jai Prakash (LNJP) Hospital', city: 'New Delhi', departments: ['Emergency', 'Medicine', 'Gynaecology', 'Psychiatry', 'Paediatrics'] },
];

// Random Indian doctor name generator
const FIRST_NAMES = ['Dr. Rajesh', 'Dr. Priya', 'Dr. Amit', 'Dr. Sunita', 'Dr. Vikram', 'Dr. Ananya', 'Dr. Manoj', 'Dr. Kavita', 'Dr. Sanjay', 'Dr. Nandita', 'Dr. Rohit', 'Dr. Meera', 'Dr. Arun'];
const LAST_NAMES = ['Sharma', 'Verma', 'Singh', 'Gupta', 'Patel', 'Kumar', 'Yadav', 'Mishra', 'Tiwari', 'Joshi', 'Agarwal', 'Srivastava', 'Pandey'];

function getRandomName(seed) {
  const f = FIRST_NAMES[(seed * 7 + 3) % FIRST_NAMES.length];
  const l = LAST_NAMES[(seed * 13 + 5) % LAST_NAMES.length];
  return `${f} ${l}`;
}

const SLOT_SESSIONS = [
  { label: 'Morning OPD', labelHi: 'सुबह ओपीडी', time: '8:00 AM – 11:00 AM', icon: '🌅' },
  { label: 'Afternoon OPD', labelHi: 'दोपहर ओपीडी', time: '12:00 PM – 3:00 PM', icon: '☀️' },
  { label: 'Evening Emergency', labelHi: 'शाम आपातकाल', time: '4:00 PM – 7:00 PM', icon: '🌆' },
];

// Simulate occupied slots
function getSlotStatus(hospId, docIdx, slotIdx) {
  const hash = (hospId.charCodeAt(0) + docIdx * 13 + slotIdx * 7) % 10;
  if (hash < 3) return 'full';
  if (hash < 5) return 'filling';
  return 'available';
}

function generateDoctors(hospital) {
  if (!hospital) return [];
  return hospital.departments.slice(0, 5).map((dept, idx) => ({
    id: `${hospital.id}-doc-${idx}`,
    name: getRandomName(hospital.id.charCodeAt(0) + idx),
    specialization: dept,
    experience: 5 + ((hospital.id.charCodeAt(0) + idx * 3) % 16),
    slots: SLOT_SESSIONS.map((s, si) => ({
      ...s,
      status: getSlotStatus(hospital.id, idx, si),
    })),
  }));
}

const STATUS_CONFIG = {
  available: { label: 'Available', labelHi: 'उपलब्ध', color: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300' },
  filling: { label: 'Filling Fast', labelHi: 'जल्दी भर रहा है', color: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300' },
  full: { label: 'Slot Full', labelHi: 'स्लॉट भर गया', color: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300' },
};

export default function HospitalAppointmentSection() {
  const { lang } = useLanguage();
  const hi = lang === 'hi';

  const [hospitalSearch, setHospitalSearch] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [bookingState, setBookingState] = useState(null); // { doctor, slot }
  const [form, setForm] = useState({ name: '', contact: '', age: '', gender: '', problem: '', daysSuffering: '' });
  const [booked, setBooked] = useState(null);
  const dropdownRef = useRef(null);

  const suggestions = hospitalSearch.length >= 2
    ? GOVT_HOSPITALS.filter(h =>
        h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
        h.city.toLowerCase().includes(hospitalSearch.toLowerCase())
      )
    : [];

  const handleSelectHospital = (hosp) => {
    setSelectedHospital(hosp);
    setHospitalSearch(hosp.name);
    setShowDropdown(false);
    setDoctors(generateDoctors(hosp));
    setBookingState(null);
    setBooked(null);
  };

  const handleBookSlot = (doctor, slot) => {
    if (slot.status === 'full') return;
    setBookingState({ doctor, slot });
    setBooked(null);
    setForm({ name: '', contact: '', age: '', gender: '', problem: '', daysSuffering: '' });
    setTimeout(() => {
      document.getElementById('appointment-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingId = `APPT-${Date.now().toString().slice(-6)}`;
    setBooked({ ...form, ...bookingState, bookingId });
    setBookingState(null);
  };

  return (
    <section className="space-y-6">
      {/* Unified Master Card: DEMO Online Govt Hospital Slot Booking */}
      <div className="glass-card overflow-hidden border-2 border-teal-500/30 p-6 md:p-7 space-y-6 shadow-sm">
        {/* Header inside the unified section */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-2xl text-white shadow-lg shadow-teal-500/30">
              <span>🏛️</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-400 px-2 py-0.5 text-[11px] font-black tracking-wider text-slate-950 uppercase shadow-xs">
                  ⚡ DEMO
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/50 px-2.5 py-0.5 rounded-full border border-teal-300 dark:border-teal-700">
                  {hi ? 'भविष्य की योजना / कमिंग सून' : 'Future Scope / Coming Soon'}
                </span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-bold px-2 py-0.5">
                  🚧 Prototype
                </span>
              </div>
              <h2 className="mt-1 text-xl md:text-2xl font-black text-slate-900 dark:text-white flex flex-wrap items-center gap-2.5">
                <span className="bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-lg text-xs md:text-sm tracking-wider uppercase shadow-xs">
                  DEMO
                </span>
                <span>{hi ? 'ऑनलाइन सरकारी अस्पताल स्लॉट बुकिंग' : 'Online Govt Hospital Slot Booking'}</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
                {hi
                  ? 'सरकारी अस्पतालों में कतारें व भीड़ कम करने और आपातकालीन मरीजों को समय पर स्लॉट देने की आगामी पहल — अस्पताल खोजें, डॉक्टर देखें और आपातकालीन स्लॉट बुक करें।'
                  : 'An upcoming initiative to eliminate long queues in govt hospitals & ensure emergency patients get timely care — Search hospital, view doctors & book your slot below.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 px-3 py-1.5 rounded-full shadow-xs">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              {hi ? 'लाइव स्लॉट ट्रायल' : 'Live Slot Trial'}
            </span>
          </div>
        </div>

        {/* Hospital Search Box inside the same card */}
        <div className="space-y-4">
          <div className="relative">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 block">
              🏥 {hi ? 'सरकारी अस्पताल का नाम लिखें' : 'Search Government Hospital'}
            </label>
          <div className="relative">
            <input
              type="text"
              value={hospitalSearch}
              onChange={(e) => {
                setHospitalSearch(e.target.value);
                setShowDropdown(true);
                if (!e.target.value) { setSelectedHospital(null); setDoctors([]); }
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder={hi ? 'उदा. AIIMS, GIMS, KGMU, Safdarjung...' : 'e.g. AIIMS, GIMS, KGMU, Safdarjung...'}
              className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 pl-10 text-sm font-medium text-slate-900 dark:text-white focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔍</span>
            {hospitalSearch && (
              <button
                type="button"
                onClick={() => { setHospitalSearch(''); setSelectedHospital(null); setDoctors([]); setShowDropdown(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >✕</button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 z-50 mt-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden"
            >
              {suggestions.map((hosp) => (
                <button
                  key={hosp.id}
                  type="button"
                  onClick={() => handleSelectHospital(hosp)}
                  className="w-full text-left px-4 py-3 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                >
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{hosp.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">📍 {hosp.city}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick hospital chips */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] font-bold text-slate-400">Quick Select:</span>
          {GOVT_HOSPITALS.slice(0, 5).map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => handleSelectHospital(h)}
              className={`rounded-xl px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                selectedHospital?.id === h.id
                  ? 'bg-brand text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-100 dark:hover:bg-teal-900/30'
              }`}
            >
              {h.name.split(' ').slice(0, 3).join(' ')}...
            </button>
          ))}
        </div>
      </div>
    </div>

      {/* Doctors Grid */}
      {selectedHospital && doctors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🩺</span>
              <span>
                {hi ? `${selectedHospital.name} के डॉक्टर` : `Doctors at ${selectedHospital.name}`}
              </span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {doctors.length} {hi ? 'डॉक्टर उपलब्ध' : 'doctors available'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="glass-card p-5 space-y-4 hover:shadow-xl transition-shadow"
              >
                {/* Doctor Info */}
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-brand text-xl font-black text-white shadow-lg">
                    {doc.name.split(' ')[1]?.[0]}{doc.name.split(' ')[2]?.[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                    <p className="text-xs text-brand font-semibold">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{doc.experience} years experience</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-1 rounded-full">
                    ✓ Verified
                  </span>
                </div>

                {/* Time Slots */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    {hi ? 'आपातकालीन स्लॉट' : 'Emergency Slots'}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {doc.slots.map((slot) => {
                      const cfg = STATUS_CONFIG[slot.status];
                      const canBook = slot.status !== 'full';
                      return (
                        <button
                          key={slot.label}
                          type="button"
                          disabled={!canBook}
                          onClick={() => canBook && handleBookSlot(doc, slot)}
                          className={`rounded-xl border px-2 py-2 text-center transition-all text-[10px] font-bold ${cfg.color} ${canBook ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-not-allowed opacity-80'}`}
                          title={slot.time}
                        >
                          <div className="text-base leading-none mb-1">{slot.icon}</div>
                          <div className="leading-tight">{hi ? slot.labelHi : slot.label}</div>
                          <div className="text-[9px] font-medium opacity-80 mt-0.5">{slot.time}</div>
                          <div className="mt-1 text-[9px] font-black">
                            {hi ? cfg.labelHi : cfg.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Book Button */}
                <button
                  type="button"
                  onClick={() => handleBookSlot(doc, doc.slots.find(s => s.status !== 'full') || doc.slots[0])}
                  className="w-full rounded-xl bg-gradient-to-r from-brand to-teal-600 text-white py-2.5 text-xs font-bold shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                >
                  📅 {hi ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Form */}
      {bookingState && (
        <div id="appointment-form" className="glass-card border-2 border-brand/30 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📝</span>
                <span>{hi ? 'अपॉइंटमेंट फॉर्म' : 'Appointment Booking Form'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {bookingState.doctor.name} · {bookingState.slot.icon} {hi ? bookingState.slot.labelHi : bookingState.slot.label} · {bookingState.slot.time}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBookingState(null)}
              className="text-slate-400 hover:text-slate-600 text-xl"
            >✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  👤 {hi ? 'पूरा नाम *' : 'Full Name *'}
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={hi ? 'आपका नाम लिखें' : 'Your full name'}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  📱 {hi ? 'मोबाइल नंबर *' : 'Contact Number *'}
                </label>
                <input
                  required
                  type="tel"
                  pattern="[6-9][0-9]{9}"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>

              {/* Age */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  🎂 {hi ? 'आयु *' : 'Age *'}
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  max="120"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder={hi ? 'आयु वर्षों में' : 'Age in years'}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  ⚧ {hi ? 'लिंग *' : 'Gender *'}
                </label>
                <select
                  required
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  <option value="">{hi ? 'चुनें...' : 'Select...'}</option>
                  <option value="Male">{hi ? 'पुरुष' : 'Male'}</option>
                  <option value="Female">{hi ? 'महिला' : 'Female'}</option>
                  <option value="Other">{hi ? 'अन्य' : 'Other'}</option>
                </select>
              </div>

              {/* Days Suffering */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  📅 {hi ? 'कितने दिनों से परेशान हैं? *' : 'How many days suffering? *'}
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.daysSuffering}
                  onChange={(e) => setForm({ ...form, daysSuffering: e.target.value })}
                  placeholder={hi ? 'दिनों की संख्या' : 'Number of days'}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                🩺 {hi ? 'समस्या का विवरण *' : 'Problem Description *'}
              </label>
              <textarea
                required
                rows={3}
                value={form.problem}
                onChange={(e) => setForm({ ...form, problem: e.target.value })}
                placeholder={hi ? 'अपने लक्षण और समस्या विस्तार से लिखें...' : 'Describe your symptoms and problem in detail...'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-brand to-teal-600 text-white py-3.5 text-sm font-black shadow-xl hover:shadow-brand/30 hover:opacity-90 transition-all active:scale-[0.98]"
            >
              ✅ {hi ? 'अपॉइंटमेंट कन्फर्म करें' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      )}

      {/* Booking Confirmation */}
      {booked && (
        <div className="glass-card border-2 border-emerald-400/50 bg-emerald-50/80 dark:bg-emerald-950/20 p-6 text-center space-y-3">
          <div className="text-5xl">🎉</div>
          <h3 className="text-lg font-black text-emerald-700 dark:text-emerald-300">
            {hi ? 'अपॉइंटमेंट सफलतापूर्वक बुक हो गया!' : 'Appointment Booked Successfully!'}
          </h3>
          <div className="inline-block bg-white dark:bg-slate-900 rounded-2xl border border-emerald-300 dark:border-emerald-700 px-6 py-4 text-sm space-y-1 text-left">
            <p><span className="font-bold text-slate-500">Booking ID:</span> <span className="font-black text-brand">{booked.bookingId}</span></p>
            <p><span className="font-bold text-slate-500">Patient:</span> {booked.name}</p>
            <p><span className="font-bold text-slate-500">Doctor:</span> {booked.doctor.name} ({booked.doctor.specialization})</p>
            <p><span className="font-bold text-slate-500">Slot:</span> {booked.slot.icon} {booked.slot.label} · {booked.slot.time}</p>
            <p><span className="font-bold text-slate-500">Hospital:</span> {selectedHospital?.name}</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {hi ? 'कृपया अपना बुकिंग आईडी लिख लें और निर्धारित समय पर अस्पताल पहुँचें।' : 'Please save your Booking ID and arrive at the hospital at the scheduled time.'}
          </p>
          <button
            type="button"
            onClick={() => { setBooked(null); setSelectedHospital(null); setHospitalSearch(''); setDoctors([]); }}
            className="text-sm font-bold text-brand hover:underline"
          >
            {hi ? 'नई बुकिंग करें' : 'Book Another Appointment'}
          </button>
        </div>
      )}
    </section>
  );
}
