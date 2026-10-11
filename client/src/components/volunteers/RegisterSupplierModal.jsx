import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const SUPPLIER_CATEGORIES = [
  'Medical Store / Pharmacy',
  'Grocery & Dry Food',
  'Packaged Water & Beverages',
  'Clothing & Blankets',
  'Emergency Hardware & Tools',
];

export default function RegisterSupplierModal({ isOpen, onClose, onRegisterSuccess }) {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    businessName: '',
    supplierCategory: 'Medical Store / Pharmacy',
    licenseNumber: '',
    city: 'Prayagraj',
    district: 'Prayagraj',
    state: 'Uttar Pradesh',
    address: '',
    contactPerson: '',
    contactPhone: '',
    initialStockItems: 'Oral Rehydration Salts (ORS 100 packs), Sterile Bandages (50 rolls), Antiseptic Liquid (25 bottles)',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessName.trim() || !formData.licenseNumber.trim() || !formData.address.trim() || !formData.contactPerson.trim() || !formData.contactPhone.trim()) {
      setError('Please provide business name, valid license number, address, and contact details.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      // Parse sample stock
      const catalog = formData.initialStockItems
        .split(',')
        .map((s, idx) => {
          const trimmed = s.trim();
          return {
            itemId: `item-${idx + 1}`,
            name: trimmed,
            category: formData.supplierCategory.includes('Medical') ? 'Medicine' : 'Essentials',
            unit: 'Pack',
            unitPrice: 100,
            availableStock: 50,
          };
        })
        .filter((i) => i.name.length > 0);

      await onRegisterSuccess({
        businessName: formData.businessName.trim(),
        supplierCategory: formData.supplierCategory,
        licenseNumber: formData.licenseNumber.trim(),
        city: formData.city.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        address: formData.address.trim(),
        contactPerson: formData.contactPerson.trim(),
        contactPhone: formData.contactPhone.trim(),
        catalog,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-xl my-4 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🏪</span>
              <span>Register as a Local Supplier</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Medical stores, ration hubs, and drinking water suppliers for disaster relief
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
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-semibold border border-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Store / Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sanjeevani Medical Store & Surgical Hub"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Supplier Category *
              </label>
              <select
                value={formData.supplierCategory}
                onChange={(e) => setFormData({ ...formData, supplierCategory: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                {SUPPLIER_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Government License / GST / Drug Lic. No. *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DL-UP-PRY-2024-99881"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Authorized Proprietor / Contact Person *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Kumar Sharma"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile / Phone *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">District *</label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Shop Physical Address & Landmark *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Shop 12, Sangam Marg, Daraganj, Prayagraj"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Initial Stock / Available Essential Items (comma-separated)
            </label>
            <textarea
              rows={2}
              value={formData.initialStockItems}
              onChange={(e) => setFormData({ ...formData, initialStockItems: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-500/20 text-[11px] text-teal-800 dark:text-teal-200">
            <strong>Verified Merchant Notice:</strong> Applications are validated by the Command Centre against official drug/FSSAI registries. No unauthorized prescription medicines may be dispensed.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black shadow-md flex items-center gap-1.5"
            >
              <span>{submitting ? 'Submitting...' : 'Submit Supplier Registration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
