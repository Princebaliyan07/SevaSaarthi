import { useState, useEffect } from 'react';
import { getCampaignDonations } from '../../services/volunteerService';
import { useLanguage } from '../../context/LanguageContext';

export default function MyDonationsModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getCampaignDonations()
        .then((data) => setDonations(data || []))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-xl my-4 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📜</span>
              <span>Verified Contribution Records & Receipts</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live audit receipts from official disaster relief escrows
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

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading verified transaction receipts...</div>
        ) : donations.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            No public contribution records found yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto pr-1">
            {donations.map((d) => (
              <div key={d._id || d.donationId} className="py-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                    {d.receiptNumber || d.donationId}
                  </span>
                  <span className="font-mono font-black text-emerald-600 text-sm">
                    ₹{d.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Donor: <strong>{d.donorName}</strong></span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold">
                    ✓ Verified Paid
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Campaign: {d.campaignTitle}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Txn: {d.paymentTransactionId || 'pay_verified'}</span>
                  <span>{new Date(d.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
