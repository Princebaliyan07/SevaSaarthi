import { useLanguage } from '../../context/LanguageContext';

export default function ReliefCampaignCard({
  campaign,
  onDonateFunds = null,
  onSponsorSupplies = null,
}) {
  const { lang } = useLanguage();

  if (!campaign) return null;

  const target = campaign.targetAmount || 500000;
  const confirmed = campaign.confirmedAmount || 0;
  const percent = Math.min(100, Math.round((confirmed / target) * 100));

  return (
    <div className="glass-card p-5 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Disaster & Verification Tags */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                🚨 {campaign.disasterCategory || 'Disaster Relief'}
              </span>
              {campaign.isGovernmentFund && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                  🏛️ Official Relief Fund
                </span>
              )}
            </div>

            <h3 className="text-base font-black text-slate-900 dark:text-white pt-1">
              {campaign.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              📍 {campaign.affectedDistrict}, {campaign.affectedState} · Recipient: <span className="font-semibold text-slate-700 dark:text-slate-300">{campaign.recipientAgency}</span>
            </p>
          </div>

          <span className="shrink-0 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {campaign.donationCount || 0} Donors
          </span>
        </div>

        {campaign.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
            {campaign.description}
          </p>
        )}

        {/* Financial Progress */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>
              Raised: <strong className="text-teal-600 dark:text-teal-400 font-black">₹{confirmed.toLocaleString('en-IN')}</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono">
              Target: ₹{target.toLocaleString('en-IN')} ({percent}%)
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Verified Needs Pills */}
        {campaign.verifiedNeeds && campaign.verifiedNeeds.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Verified Emergency Supplies Needed:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {campaign.verifiedNeeds.map((need, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {need.itemName} ({need.fundedQty || 0}/{need.requestedQty} {need.unit})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        {onDonateFunds && (
          <button
            type="button"
            onClick={() => onDonateFunds(campaign)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/20 transition-all text-center"
          >
            💰 Donate Funds
          </button>
        )}
        {onSponsorSupplies && (
          <button
            type="button"
            onClick={() => onSponsorSupplies(campaign)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border border-teal-500/30 bg-teal-50/50 hover:bg-teal-50 text-teal-800 dark:bg-teal-950/30 dark:hover:bg-teal-900/40 dark:text-teal-200 transition-all text-center"
          >
            📦 Sponsor Supplies
          </button>
        )}
      </div>
    </div>
  );
}
