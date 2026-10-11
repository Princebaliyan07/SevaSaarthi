import { useState } from 'react';

export default function AddGroundMapModal({ isOpen, onClose, onSave, onSaveMap, lang = 'en' }) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const saveCallback = onSave || onSaveMap;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for this ground map.');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Please upload or provide a map image URL.');
      return;
    }

    if (typeof saveCallback !== 'function') {
      setError('Save handler is not configured.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const generatedMapId = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_')
        .replace(/_+/g, '_');

      await saveCallback({
        mapId: generatedMapId || `map_${Date.now().toString().slice(-6)}`,
        name: name.trim(),
        imageUrl: imageUrl.trim(),
        description: description.trim(),
      });
      setName('');
      setImageUrl('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to add ground map');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-lg my-4 rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 text-lg">
              🗺️
            </span>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Add New Ground / Fair Map
              </h3>
              <p className="text-[11px] text-slate-500">
                Official Administrative Layout Provisioning
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-200">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ground Map Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Haridwar Kumbh Mela / Sangam Sector 4 Ground"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Riverfront pilgrimage sectors, bathing ghats and bridge layouts"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Map Image Upload / URL */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
            <label className="block font-bold text-slate-800 dark:text-slate-200">
              Map Layout Image *
            </label>

            {imageUrl ? (
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-indigo-500/40 bg-slate-950 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Ground map preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md flex items-center gap-1"
                >
                  <span>🗑️</span>
                  <span>Remove Image</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="ground-map-file"
                  className="border-2 border-dashed border-indigo-400 hover:border-indigo-600 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/20 dark:bg-indigo-950/20 hover:bg-indigo-50/40 transition-all text-center group"
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🗺️</span>
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    Click to Choose Blueprint Image from Device
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    JPG, PNG, WebP · Architectural, satellite, or schematic map image
                  </span>
                  <input
                    id="ground-map-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Or image URL:</span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/map-blueprint.jpg"
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Registering Map...' : 'Save & Publish Ground Map'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
