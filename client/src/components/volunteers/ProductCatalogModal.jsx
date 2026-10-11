import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function ProductCatalogModal({
  supplier,
  isOpen,
  onClose,
  onSponsorProduct,
}) {
  const { lang } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQty, setOrderQty] = useState(5);
  const [donorName, setDonorName] = useState('Compassionate Citizen');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen || !supplier) return null;

  const catalog = supplier.catalog || [];

  const handleSponsorSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSubmitting(true);
    try {
      await onSponsorProduct({
        supplierId: supplier.supplierId,
        donorName,
        items: [
          {
            itemKey: selectedProduct.itemId || selectedProduct.name,
            name: selectedProduct.name,
            unit: selectedProduct.unit || 'Units',
            quantity: Number(orderQty),
            unitPrice: selectedProduct.unitPrice || 100,
          },
        ],
      });
      setSuccessMsg(`Successfully sponsored ${orderQty} x ${selectedProduct.name}! Order generated.`);
      setSelectedProduct(null);
    } catch (err) {
      alert('Failed to sponsor item: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-2xl my-4 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {supplier.businessName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                {supplier.supplierCategory || 'Verified Store'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                ✓ Certified Local Supplier
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              📍 {supplier.address}, {supplier.city} · License: <span className="font-mono text-slate-700 dark:text-slate-300">{supplier.licenseNumber || 'DL-GOV-REG'}</span>
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

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-between">
            <span>✓ {successMsg}</span>
            <button type="button" onClick={() => setSuccessMsg(null)} className="text-xs underline font-bold">Close</button>
          </div>
        )}

        {/* Catalog Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Available Disaster Relief Stock
          </h4>

          {catalog.length === 0 ? (
            <p className="text-xs text-slate-400 p-4 text-center">No inventory items listed currently.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-400">
                  <tr>
                    <th className="p-2.5">Product Name</th>
                    <th className="p-2.5">Unit Price</th>
                    <th className="p-2.5">Stock Available</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {catalog.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                        {prod.name}
                        <span className="block text-[10px] text-slate-400 font-normal">{prod.category || 'Essential'}</span>
                      </td>
                      <td className="p-2.5 font-mono font-bold text-teal-600 dark:text-teal-400">
                        ₹{prod.unitPrice} / {prod.unit || 'Pack'}
                      </td>
                      <td className="p-2.5 font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">
                          {prod.availableStock} in stock
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProduct(prod);
                            setSuccessMsg(null);
                          }}
                          className="px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px]"
                        >
                          Sponsor Item
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Product Direct Sponsor Form */}
        {selectedProduct && (
          <form onSubmit={handleSponsorSubmit} className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-500/30 space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-teal-500/20">
              <strong className="text-xs font-black text-teal-900 dark:text-teal-100">
                Sponsor Direct Goods: {selectedProduct.name}
              </strong>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity ({selectedProduct.unit || 'Units'})
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.availableStock || 500}
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name / Donor Handle
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-xs font-semibold">
                Total Order Value:{' '}
                <strong className="font-mono text-teal-700 dark:text-teal-300 text-sm">
                  ₹{(selectedProduct.unitPrice || 100) * Number(orderQty)}
                </strong>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-md"
              >
                {submitting ? 'Confirming...' : 'Confirm & Proceed to Payment'}
              </button>
            </div>
          </form>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
