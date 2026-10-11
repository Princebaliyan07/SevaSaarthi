import { useLanguage } from '../../context/LanguageContext';

export default function CampaignDetailsModal({
  campaign,
  isOpen,
  onClose,
  onDonateClick,
  onSponsorClick,
}) {
  const { lang } = useLanguage();

  if (!isOpen || !campaign) return null;

  const target = campaign.targetAmount || 500000;
  const confirmed = campaign.confirmedAmount || 0;
  const percent = Math.min(100, Math.round((confirmed / target) * 100));
  const remaining = Math.max(0, target - confirmed);

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-2xl my-4 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                🚨 {campaign.disasterCategory || 'Disaster Relief'}
              </span>
              {campaign.isGovernmentFund && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                  🏛️ Official Government Relief Fund
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                ✓ Verified Campaign
              </span>
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
              {campaign.title}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              📍 {campaign.affectedDistrict}, {campaign.affectedState} · Official Custodian: <strong className="text-slate-800 dark:text-slate-200">{campaign.recipientAgency}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Narrative & Purpose */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Campaign Purpose & Incident Context
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {campaign.description}
          </p>
        </div>

        {/* Progress & Financial Status Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Verified Financial Progress</span>
            <span className="text-teal-600 dark:text-teal-400 font-mono font-bold">{percent}% achieved</span>
          </h4>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Confirmed Raised</span>
              <span className="text-sm font-black text-teal-600 dark:text-teal-400">
                ₹{confirmed.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Funding Target</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                ₹{target.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Remaining Gap</span>
              <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                ₹{remaining.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Contributions</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">
                {campaign.donationCount || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Verified Supplies Needed Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Essential Supplies Fulfillment Status
          </h4>

          <div className="space-y-2">
            {campaign.verifiedNeeds?.map((need, idx) => {
              const req = need.requestedQty || 1;
              const funded = need.fundedQty || 0;
              const delivered = need.deliveredQty || 0;
              const fundPct = Math.min(100, Math.round((funded / req) * 100));

              return (
                <div key={idx} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-slate-900 dark:text-white font-bold">{need.itemName}</strong>
                    <span className="font-mono text-slate-500 font-semibold">
                      ₹{need.unitPrice || 100} / {need.unit}
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${fundPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Sponsored: <strong className="text-slate-800 dark:text-slate-200">{funded}</strong> / {req}</span>
                    <span>Delivered to Ground: <strong className="text-emerald-600">{delivered}</strong> {need.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verified Incident Updates */}
        {campaign.verifiedUpdates && campaign.verifiedUpdates.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Official Ground Bulletins & Updates
            </h4>
            <div className="space-y-2">
              {campaign.verifiedUpdates.map((upd, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-teal-900 dark:text-teal-200">{upd.title}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(upd.timestamp).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{upd.text}</p>
                  <span className="block text-[10px] text-teal-700 dark:text-teal-400 font-semibold pt-1">
                    Verified By: {upd.author}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onDonateClick) onDonateClick(campaign);
            }}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all text-center"
          >
            💰 Donate Money to Fund
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onSponsorClick) onSponsorClick(campaign);
            }}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border border-teal-500/40 bg-teal-50/60 hover:bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200 transition-all text-center"
          >
            📦 Sponsor Essential Goods
          </button>
        </div>
      </div>
    </div>
  );
}
