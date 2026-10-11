import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function CreateTeamModal({
  isOpen,
  onClose,
  onCreateTeam,
  initialCity = '',
  initialDistrict = '',
  initialState = '',
}) {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamCategory: 'Citizen Action Group',
    supportedDisasters: ['Floods', 'General Emergency'],
    location: '',
    city: initialCity || 'Prayagraj',
    district: initialDistrict || initialCity || 'Prayagraj',
    state: initialState || 'Uttar Pradesh',
    pincode: '',
    serviceArea: 'Within 25 km radius',
    leaderName: '',
    leaderPhone: '',
    aadhaarNumber: '',
    idProofType: 'Aadhaar Card',
    idProofPhoto: '',
    capacity: 50,
    skills: ['First Aid', 'Food Distribution'],
    registrationDocRef: '',
    lat: null,
    lng: null,
  });
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [locDetectedMsg, setLocDetectedMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && initialCity) {
      setFormData((p) => ({
        ...p,
        city: initialCity,
        district: initialDistrict || initialCity,
        state: initialState || p.state,
      }));
    }
  }, [isOpen, initialCity, initialDistrict, initialState]);

  const handleDetectModalLocation = async () => {
    setDetectingLoc(true);
    setLocDetectedMsg('');
    try {
      const getGps = () =>
        new Promise((resolve, reject) => {
          if (!navigator.geolocation) return reject(new Error('No GPS'));
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 60000,
          });
        });

      let lat = null;
      let lng = null;
      try {
        const pos = await getGps();
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (gpsErr) {
        console.warn('GPS failed in modal, falling back to IP...', gpsErr);
      }

      const url =
        lat && lng
          ? `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          : 'https://api.bigdatacloud.net/data/reverse-geocode-client';

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const city = data.locality || data.city || data.principalSubdivision || '';
        const district = data.city || data.locality || data.principalSubdivision || '';
        const state = data.principalSubdivision || '';
        const coords = {
          lat: data.latitude ? Number(data.latitude) : lat,
          lng: data.longitude ? Number(data.longitude) : lng,
        };

        setFormData((p) => ({
          ...p,
          city: city || p.city,
          district: district || p.district,
          state: state || p.state,
          location: p.location || (city ? `${city} Base` : p.location),
          lat: coords.lat,
          lng: coords.lng,
        }));
        setLocDetectedMsg(`✓ Detected: ${city || district}${state ? ', ' + state : ''}`);
      }
    } catch (err) {
      console.warn('Modal location detection error:', err);
      setLocDetectedMsg('⚠️ Could not auto-detect location. Please type manually.');
    } finally {
      setDetectingLoc(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim() || !formData.leaderName.trim() || !formData.leaderPhone.trim()) {
      setError('Please provide team name, location, and leader contact details.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onCreateTeam(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create team');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-xl my-4 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Create a Volunteer Team
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Form a new disaster relief unit in your district
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-semibold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Team Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Yamuna Flood Rescue & Relief Squad"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={formData.teamCategory}
                onChange={(e) => setFormData((p) => ({ ...p, teamCategory: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option>Citizen Action Group</option>
                <option>Community NGO</option>
                <option>Red Cross / Medical Corps</option>
                <option>Civil Defence</option>
                <option>NDRF/SDRF Affiliate</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Capacity</label>
              <input
                type="number"
                min="5"
                max="200"
                value={formData.capacity}
                onChange={(e) => setFormData((p) => ({ ...p, capacity: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            {/* Headquarters / Location */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Headquarters / Base Location *</label>
                <button
                  type="button"
                  disabled={detectingLoc}
                  onClick={handleDetectModalLocation}
                  className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <span>{detectingLoc ? '⏳' : '🎯'}</span>
                  <span>{detectingLoc ? 'Detecting Location...' : 'Auto-Detect City & District'}</span>
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Sector 3, Relief Base"
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              {locDetectedMsg && (
                <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {locDetectedMsg}
                </p>
              )}
            </div>

            {/* City Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City / Town *</label>
              <input
                type="text"
                required
                placeholder="e.g. Greater Noida, Prayagraj"
                value={formData.city}
                onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            {/* District Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">District *</label>
              <input
                type="text"
                required
                placeholder="e.g. Gautam Budh Nagar, Prayagraj"
                value={formData.district}
                onChange={(e) => setFormData((p) => ({ ...p, district: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            {/* State Field */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">State *</label>
              <input
                type="text"
                required
                placeholder="e.g. Uttar Pradesh, Bihar"
                value={formData.state}
                onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Team Leader Name *</label>
              <input
                type="text"
                required
                placeholder="Leader full name"
                value={formData.leaderName}
                onChange={(e) => setFormData((p) => ({ ...p, leaderName: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Leader Phone *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.leaderPhone}
                onChange={(e) => setFormData((p) => ({ ...p, leaderPhone: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Leader Aadhaar Number *</label>
              <input
                type="text"
                required
                maxLength={14}
                placeholder="XXXX-XXXX-XXXX"
                value={formData.aadhaarNumber || ''}
                onChange={(e) => setFormData((p) => ({ ...p, aadhaarNumber: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
              <span className="text-[10px] text-slate-400">12-digit Aadhaar for identity verification</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ID Proof Type *</label>
              <select
                value={formData.idProofType || 'Aadhaar Card'}
                onChange={(e) => setFormData((p) => ({ ...p, idProofType: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Driving License">Driving License</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Government Service ID">Government Service ID</option>
                <option value="Other Valid Govt ID">Other Valid Govt ID</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Upload Photo of ID Proof * (Aadhaar / Voter ID / Govt Card)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-2xl border border-dashed border-teal-500/40 bg-teal-50/30 dark:bg-teal-950/20">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert('Image must be smaller than 5MB');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setFormData((p) => ({ ...p, idProofPhoto: ev.target.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-600 file:text-white hover:file:bg-teal-500 cursor-pointer"
                />
                {formData.idProofPhoto && (
                  <div className="relative group shrink-0">
                    <img
                      src={formData.idProofPhoto}
                      alt="ID Proof Preview"
                      className="h-12 w-20 object-cover rounded-lg border border-teal-500 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, idProofPhoto: '' }))}
                      className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400">Photo will be saved for admin identity verification.</span>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ID Proof / Document Reference Number</label>
              <input
                type="text"
                placeholder="e.g. DOC-REF-2024-9988 or Document ID"
                value={formData.registrationDocRef}
                onChange={(e) => setFormData((p) => ({ ...p, registrationDocRef: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mission Description</label>
              <textarea
                rows={2}
                placeholder="Explain the purpose and focus of this volunteer team..."
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            * Note: New teams are registered with <strong>Pending Verification</strong> status until reviewed by District Command.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-60 shadow-md shadow-teal-600/20"
            >
              {submitting ? 'Creating Team...' : 'Submit Team for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
