import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function DeliveryMissionModal({
  order,
  isOpen,
  onClose,
  onConfirmPickup,
  onConfirmDelivery,
}) {
  const { lang } = useLanguage();
  const [deliveryNote, setDeliveryNote] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('Signed by Sector Officer on Ground');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handlePickup = async () => {
    setSubmitting(true);
    try {
      await onConfirmPickup(order.orderId);
      onClose();
    } catch (err) {
      alert('Error confirming pickup: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelivery = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirmDelivery(order.orderId, {
        deliveryConfirmationNote: deliveryNote || 'Handover verified at relief camp',
        deliveryEvidenceUrl: evidenceNote,
      });
      onClose();
    } catch (err) {
      alert('Error confirming delivery: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-lg my-4 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🚚</span>
              <span>Volunteer Dispatch Control</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Order: <strong className="font-mono text-teal-600">{order.orderId}</strong>
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

        {/* Dispatch Route Cards */}
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <span>🏪 Pickup Location (Supplier):</span>
            </div>
            <p className="font-semibold text-slate-900 dark:text-white pl-4">{order.supplierName}</p>
            <p className="text-slate-500 pl-4">{order.supplierAddress || 'City Center Medical Hub'}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <span>📍 Drop-off Destination (Relief Camp):</span>
            </div>
            <p className="font-semibold text-emerald-600 pl-4">{order.destinationCamp}</p>
          </div>

          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-500/20">
            <strong className="block text-teal-900 dark:text-teal-200 mb-1">Items to Deliver:</strong>
            {order.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>{it.name}</span>
                <span className="font-mono font-bold">{it.quantity} {it.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step-specific Action */}
        {order.orderStatus === 'Assigned for Delivery' || order.orderStatus === 'Ready for Pickup' ? (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Have you arrived at the supplier store and inspected the supplies?
            </p>
            <button
              type="button"
              disabled={submitting}
              onClick={handlePickup}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
            >
              {submitting ? 'Updating...' : 'Confirm Store Pickup & Mark In-Transit'}
            </button>
          </div>
        ) : order.orderStatus === 'Dispatched' ? (
          <form onSubmit={handleDelivery} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Handover Note / Receiving Officer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Handed to Officer Verma at Camp Gate 3"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Delivery Evidence / Receipt Ref
              </label>
              <input
                type="text"
                value={evidenceNote}
                onChange={(e) => setEvidenceNote(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md"
            >
              {submitting ? 'Confirming...' : 'Confirm Delivery to Victims & Update Shortage'}
            </button>
          </form>
        ) : (
          <div className="p-3 text-center text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
            ✓ Order already delivered and confirmed on ground!
          </div>
        )}

        <div className="flex justify-end pt-1">
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
