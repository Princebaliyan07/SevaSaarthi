import { useEffect, useState } from 'react';
import Badge from '../common/Badge';
import { bookAppointment } from '../../services/hospitalService';
import { useLanguage } from '../../context/LanguageContext';

export default function DoctorConsultModal({ doctor, isVideo = false, onClose }) {
  const { lang } = useLanguage();
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!doctor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName || !phone) return;
    setIsSubmitting(true);
    const res = await bookAppointment({
      doctorId: doctor.id,
      doctorName: doctor.name,
      patientName,
      phone,
      symptoms,
      mode: isVideo ? 'Video Consultation' : 'In-person OPD',
      timeSlot: doctor.nextSlot,
    });
    setIsSubmitting(false);
    setBookingSuccess(res);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {isVideo
                ? lang === 'hi'
                  ? '📹 वीडियो परामर्श बुक करें'
                  : '📹 Book Video Consultation'
                : lang === 'hi'
                ? '🩺 ओपीडी अपॉइंटमेंट बुक करें'
                : '🩺 Book OPD Appointment'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{doctor.name} · {doctor.specialty}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {bookingSuccess ? (
          <div className="mt-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'अपॉइंटमेंट सफलतापूर्वक बुक हो गया!' : 'Appointment Confirmed!'}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Booking Reference ID: <span className="font-mono font-bold text-brand dark:text-brand-light">{bookingSuccess.bookingId}</span>
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-left text-xs space-y-2 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
              <p><strong>Doctor:</strong> {doctor.name}</p>
              <p><strong>Scheduled Slot:</strong> {doctor.nextSlot}</p>
              <p><strong>Consultation Mode:</strong> {isVideo ? 'Encrypted Video Room' : 'Hospital OPD Counter 3'}</p>
              <p><strong>Center:</strong> {doctor.hospitalAffiliation}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary w-full py-3"
            >
              {lang === 'hi' ? 'पूर्ण करें' : 'Done'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-3.5 text-xs text-teal-900 dark:border-teal-500/30 dark:bg-teal-500/15 dark:text-teal-200">
              <div className="flex items-center justify-between">
                <span className="font-bold">{doctor.hospitalAffiliation}</span>
                <Badge type="verified" />
              </div>
              <p className="mt-1 text-[11px] text-teal-700 dark:text-teal-300">Next available slot: {doctor.nextSlot}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'hi' ? 'मरीज का नाम' : 'Patient Name'} *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Prince Baliyan"
                className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'hi' ? 'लक्षण या समस्या' : 'Symptoms or Concern'}
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={lang === 'hi' ? 'उदा. 2 दिन से बुखार और सिरदर्द' : 'e.g. Fever and mild joint pain for 2 days'}
                className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline flex-1 py-2.5"
              >
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !patientName || !phone}
                className="btn-primary flex-1 py-2.5"
              >
                {isSubmitting
                  ? lang === 'hi'
                    ? 'बुकिंग जारी...'
                    : 'Booking...'
                  : lang === 'hi'
                  ? 'पुष्टि करें'
                  : 'Confirm Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
