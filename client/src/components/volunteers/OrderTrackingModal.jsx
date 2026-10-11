import { useLanguage } from '../../context/LanguageContext';

const PIPELINE_STEPS = [
  { key: 'Requested', label: '1. Requested', desc: 'Disaster supply demand logged' },
  { key: 'Paid', label: '2. Funded / Paid', desc: 'Donor confirmed payment' },
  { key: 'Accepted', label: '3. Store Accepted', desc: 'Shop verified stock availability' },
  { key: 'Preparing', label: '4. Preparing', desc: 'Package being assembled & packed' },
  { key: 'Ready for Pickup', label: '5. Ready for Pickup', desc: 'Awaiting local volunteer driver' },
  { key: 'Assigned for Delivery', label: '6. Volunteer Assigned', desc: 'Courier accepted mission' },
  { key: 'Dispatched', label: '7. In Transit', desc: 'En route to designated relief camp' },
  { key: 'Delivered', label: '8. Handed Over', desc: 'Confirmed by camp officer on ground' },
];

export default function OrderTrackingModal({ order, isOpen, onClose }) {
  const { lang } = useLanguage();

  if (!isOpen || !order) return null;

  const currentStatusIndex = PIPELINE_STEPS.findIndex((s) => s.key === order.orderStatus);
  const activeIdx = currentStatusIndex !== -1 ? currentStatusIndex : 1;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-xl my-4 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                {order.orderId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-800 dark:text-teal-200 border border-teal-500/30">
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Campaign: <strong className="text-slate-800 dark:text-slate-200">{order.campaignTitle || 'Disaster Relief'}</strong>
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

        {/* Order Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Donor / Sponsor:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{order.donorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Fulfilling Supplier:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{order.supplierName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Relief Destination:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{order.destinationCamp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Assigned Volunteer:</span>
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {order.assignedVolunteerName || 'Pending volunteer assignment'}
            </span>
          </div>
          <div className="border-t pt-2 border-slate-200 dark:border-slate-700 flex justify-between font-bold">
            <span>Total Value Sponsored:</span>
            <span className="text-emerald-600 font-mono text-sm">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Itemised Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Sponsored Supplies in Shipment
          </h4>
          <div className="space-y-1">
            {order.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{it.name}</span>
                <span className="font-mono text-slate-500">{it.quantity} {it.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 8-Stage Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            10-Step Supply Pipeline Progress
          </h4>
          <div className="space-y-2">
            {PIPELINE_STEPS.map((st, idx) => {
              const isPast = idx < activeIdx;
              const isCurrent = idx === activeIdx;
              return (
                <div key={st.key} className="flex items-center gap-3 text-xs">
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-teal-600 text-white ring-4 ring-teal-500/20 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1">
                    <span className={`font-bold ${isCurrent ? 'text-teal-600 dark:text-teal-400' : isPast ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                      {st.label}
                    </span>
                    <span className="block text-[10px] text-slate-400">{st.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
