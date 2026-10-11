import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function SponsorSuppliesModal({
  campaign,
  suppliers = [],
  isOpen,
  onClose,
  onSubmitSponsorship,
}) {
  const { lang } = useLanguage();
  const [selectedItemKey, setSelectedItemKey] = useState(
    campaign?.verifiedNeeds?.[0]?.itemKey || 'ors_packets'
  );
  const [quantity, setQuantity] = useState(10);
  const [donorName, setDonorName] = useState('Compassionate Citizen');
  const [selectedSupplierId, setSelectedSupplierId] = useState(
    suppliers?.[0]?.supplierId || 'SUP-01'
  );
  const [destinationCamp, setDestinationCamp] = useState('Sector 4 Flood Relief Camp');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderReceipt, setOrderReceipt] = useState(null);

  if (!isOpen || !campaign) return null;

  const currentNeed =
    campaign.verifiedNeeds?.find((n) => n.itemKey === selectedItemKey) ||
    campaign.verifiedNeeds?.[0] || {
      itemName: 'Emergency Relief Pack',
      unitPrice: 150,
      unit: 'Units',
    };

  const totalPrice = (currentNeed.unitPrice || 150) * Number(quantity);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity < 1) {
      setError('Please choose at least 1 unit to sponsor.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        campaignId: campaign.campaignId,
        campaignTitle: campaign.title,
        donorName: donorName.trim() || 'Anonymous Supporter',
        supplierId: selectedSupplierId,
        destinationCamp,
        items: [
          {
            itemKey: currentNeed.itemKey || selectedItemKey,
            name: currentNeed.itemName,
            unit: currentNeed.unit || 'Units',
            quantity: Number(quantity),
            unitPrice: currentNeed.unitPrice || 150,
          },
        ],
      };
      const res = await onSubmitSponsorship(payload);
      setOrderReceipt(res);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place supply sponsorship order');
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
              <span>📦</span>
              <span>Sponsor Essential Relief Supplies</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Donate actual food, water, or medicines instead of cash
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

        {orderReceipt ? (
          <div className="py-6 text-center space-y-4">
            <div className="text-5xl">🚚</div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              Supplies Sponsored Successfully!
            </h4>
            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-500/30 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Supply Order Ref:</span>
                <strong className="font-mono text-teal-800 dark:text-teal-300 font-bold">{orderReceipt.orderId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sponsored Item:</span>
                <strong className="text-slate-900 dark:text-white">{quantity} x {currentNeed.itemName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Sponsored Cost:</span>
                <strong className="text-slate-900 dark:text-white font-bold">₹{totalPrice}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Procurement Supplier:</span>
                <strong className="text-slate-900 dark:text-white">{orderReceipt.supplierName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Target:</span>
                <strong className="text-slate-900 dark:text-white">{destinationCamp}</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              This order has entered the verified logistics pipeline. A volunteer delivery driver will be assigned to pick up and deliver the items to the camp.
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
            {/* Step 1: Select Need */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                1. Select Verified Essential Item:
              </label>
              <select
                value={selectedItemKey}
                onChange={(e) => setSelectedItemKey(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              >
                {campaign.verifiedNeeds?.map((n) => (
                  <option key={n.itemKey} value={n.itemKey}>
                    {n.itemName} — ₹{n.unitPrice} / {n.unit}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  2. Quantity ({currentNeed.unit}):
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Total Cost:
                </label>
                <div className="px-3 py-2 text-sm rounded-xl border border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/30 font-black text-teal-800 dark:text-teal-300">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Step 3: Local Certified Supplier */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                3. Certified Local Fulfillment Supplier:
              </label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {suppliers.map((s) => (
                  <option key={s.supplierId} value={s.supplierId}>
                    {s.businessName} ({s.supplierCategory}) · {s.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Relief Camp */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                4. Destination Relief Center:
              </label>
              <input
                type="text"
                value={destinationCamp}
                onChange={(e) => setDestinationCamp(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sponsor Name / Organization:
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Varma or Anonymous"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

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
                {submitting ? 'Placing Order...' : `Sponsor ₹${totalPrice} of Supplies →`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
