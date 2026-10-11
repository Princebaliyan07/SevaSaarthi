import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const PRESET_AMOUNTS = [100, 250, 500, 1000];

export default function DonateFundsModal({ campaign, isOpen, onClose, onConfirmDonation }) {
  const { lang } = useLanguage();
  const [amount, setAmount] = useState(500);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  if (!isOpen || !campaign) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount < 1) {
      setError('Please choose or enter a valid donation amount.');
      return;
    }
    if (!isAnonymous && !donorName.trim()) {
      setError('Please enter your full name or select Anonymous Contribution.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        amount: Number(amount),
        donorName: isAnonymous ? 'Anonymous Citizen' : donorName.trim(),
        donorPhone: donorPhone.trim(),
        donorEmail: donorEmail.trim(),
        isAnonymous,
        type: 'Monetary Contribution',
      };
      const res = await onConfirmDonation(campaign.campaignId, payload);
      setReceipt(res);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment processing failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-lg my-4 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>💳</span>
              <span>Disaster Relief Contribution</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Supporting: <strong className="text-teal-600 dark:text-teal-400">{campaign.title}</strong>
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

        {receipt ? (
          <div className="py-6 text-center space-y-4">
            <div className="text-5xl">🧾</div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              Donation Confirmed & Receipt Issued!
            </h4>
            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-500/30 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Reference:</span>
                <strong className="font-mono text-teal-800 dark:text-teal-300">{receipt.receiptNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <strong className="text-slate-900 dark:text-white font-bold">₹{amount}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient Agency:</span>
                <strong className="text-slate-900 dark:text-white">{campaign.recipientAgency}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-black">✓ Verified in MongoDB</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Your contribution has been counted into the verified campaign total and allocated toward emergency procurement.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Recipient Details & Transparency */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-500/30 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
                <span>🏛️</span>
                <span>Verified Recipient Authority</span>
              </div>
              <p className="text-blue-950/80 dark:text-blue-200/80">
                {campaign.recipientAgency} ({campaign.recipientAccountType || 'Official Treasury Escrow'})
              </p>
            </div>

            {/* Choose Amount */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose Contribution Amount (INR):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      amount === amt
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <div className="pt-1">
                <input
                  type="number"
                  min="1"
                  placeholder="Or enter custom amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Donor Information */}
            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Make this an Anonymous Contribution
                </span>
              </label>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Varma"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mobile (for Receipt)</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-400 pt-1">
              * Payment Gateway: Running in verified sandbox test environment. Once confirmed, payment is registered into MongoDB and the campaign total is updated automatically.
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
                {submitting ? 'Confirming Payment...' : `Contribute ₹${amount} Now →`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
