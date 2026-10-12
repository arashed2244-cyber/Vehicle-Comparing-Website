import React, { useState, useEffect } from 'react';
import { CarListing, EvaluationConfig, VehicleCondition, TitleStatus } from '../types/car';
import { evaluateCar, lookupMakeLifespan } from '../utils/evaluator';
import { X, Sparkles, Check, AlertCircle } from 'lucide-react';

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (listing: Omit<CarListing, 'id' | 'createdAt'>, existingId?: string) => void;
  initialData?: CarListing | null;
  config: EvaluationConfig;
}

const COMMON_MAKES = [
  'Toyota',
  'Honda',
  'Subaru',
  'Mazda',
  'Ford',
  'Chevrolet',
  'Hyundai',
  'Kia',
  'Nissan',
  'BMW',
  'Volkswagen',
  'Lexus',
  'Acura',
  'Audi',
  'Mercedes-Benz',
  'Jeep',
];

export const ListingModal: React.FC<ListingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  config,
}) => {
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2019);
  const [price, setPrice] = useState<number>(15000);
  const [mileage, setMileage] = useState<number>(65000);
  const [condition, setCondition] = useState<VehicleCondition>('good');
  const [titleStatus, setTitleStatus] = useState<TitleStatus>('clean');
  const [estimatedRepairs, setEstimatedRepairs] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [listingUrl, setListingUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setMake(initialData.make);
      setModel(initialData.model);
      setYear(initialData.year);
      setPrice(initialData.price);
      setMileage(initialData.mileage);
      setCondition(initialData.condition);
      setTitleStatus(initialData.titleStatus);
      setEstimatedRepairs(initialData.estimatedRepairs || 0);
      setNotes(initialData.notes || '');
      setListingUrl(initialData.listingUrl || '');
    } else {
      setMake('Toyota');
      setModel('');
      setYear(2019);
      setPrice(16500);
      setMileage(62000);
      setCondition('good');
      setTitleStatus('clean');
      setEstimatedRepairs(0);
      setNotes('');
      setListingUrl('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Live calculation preview
  const livePreviewCar = evaluateCar(
    {
      id: 'preview',
      make,
      model: model || 'Model',
      year,
      price: price || 0,
      mileage: mileage || 0,
      condition,
      titleStatus,
      estimatedRepairs: estimatedRepairs || 0,
      notes,
      listingUrl,
      createdAt: Date.now(),
    },
    config
  );

  const detectedLifespan = lookupMakeLifespan(make, config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!make.trim()) newErrors.make = 'Make is required';
    if (!model.trim()) newErrors.model = 'Model is required';
    if (!year || year < 1980 || year > 2026) newErrors.year = 'Enter a year between 1980 and 2026';
    if (price <= 0) newErrors.price = 'Price must be greater than 0';
    if (mileage < 0) newErrors.mileage = 'Mileage cannot be negative';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        make: make.trim(),
        model: model.trim(),
        year,
        price,
        mileage,
        condition,
        titleStatus,
        estimatedRepairs,
        notes: notes.trim(),
        listingUrl: listingUrl.trim(),
      },
      initialData ? initialData.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl w-full overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {initialData ? 'Edit Car Listing' : 'Add Used Car Listing'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter vehicle pricing, odometer, and condition to compute live deal metrics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Live Evaluation Preview Callout */}
            <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                  Live Value Preview
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Preset baseline: <span className="font-semibold font-mono tabular-nums">{detectedLifespan.toLocaleString()} mi</span>
                  {' · '}
                  Remaining: <span className="font-semibold font-mono tabular-nums">{livePreviewCar.remainingMiles.toLocaleString()} mi ({livePreviewCar.remainingYears} yrs)</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">Cost/Remaining Mi</div>
                  <div className="font-mono tabular-nums font-bold text-sm text-blue-700 dark:text-blue-300">
                    ${livePreviewCar.costPerRemainingMile.toFixed(2)}/mi
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-center">
                  <div className="font-mono tabular-nums font-extrabold text-base" style={{ color: livePreviewCar.scoreTier.colorHex }}>
                    {livePreviewCar.valueScore}
                  </div>
                  <div className="text-[9px] font-semibold text-slate-500 uppercase">
                    {livePreviewCar.scoreTier.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Make & Quick Suggestions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Make (Manufacturer) *
              </label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Toyota, Honda, Ford"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              {errors.make && <p className="text-[11px] text-rose-500 mt-1">{errors.make}</p>}
              
              {/* Quick make buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {COMMON_MAKES.slice(0, 8).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMake(m)}
                    className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                      make.toLowerCase() === m.toLowerCase()
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Model & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Model & Trim *
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. RAV4 XLE, Civic EX"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                {errors.model && <p className="text-[11px] text-rose-500 mt-1">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Model Year *
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) || 2018)}
                  min={1980}
                  max={2026}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                {errors.year && <p className="text-[11px] text-rose-500 mt-1">{errors.year}</p>}
              </div>
            </div>

            {/* Asking Price & Mileage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Asking Price ($ USD) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                  step={100}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                {errors.price && <p className="text-[11px] text-rose-500 mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Odometer Mileage (miles) *
                </label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(Math.max(0, parseInt(e.target.value) || 0))}
                  step={500}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                {errors.mileage && <p className="text-[11px] text-rose-500 mt-1">{errors.mileage}</p>}
              </div>
            </div>

            {/* Condition & Title Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Overall Vehicle Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as VehicleCondition)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="excellent">Excellent (+5% lifespan bonus)</option>
                  <option value="good">Good (Standard baseline)</option>
                  <option value="fair">Fair (-12% lifespan penalty)</option>
                  <option value="poor">Poor (-28% lifespan penalty)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title Status
                </label>
                <select
                  value={titleStatus}
                  onChange={(e) => setTitleStatus(e.target.value as TitleStatus)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="clean">Clean Title</option>
                  <option value="rebuilt">Rebuilt Title (-20% lifespan penalty)</option>
                  <option value="salvage">Salvage Title (-35% lifespan penalty)</option>
                </select>
              </div>
            </div>

            {/* Estimated Immediate Repairs */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Estimated Pending Repairs / Maintenance ($ USD)
                </label>
                <span className="text-[11px] text-slate-500">
                  e.g. brakes, tires, timing belt
                </span>
              </div>
              <input
                type="number"
                value={estimatedRepairs}
                onChange={(e) => setEstimatedRepairs(Math.max(0, parseInt(e.target.value) || 0))}
                step={50}
                placeholder="0"
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Effective total price will be <span className="font-mono tabular-nums font-semibold">${(price + estimatedRepairs).toLocaleString()}</span>.
              </p>
            </div>

            {/* Notes / Comments */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Listing Notes & Seller Details (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Private party seller, 1-owner, garage kept, highway commuter miles"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              {initialData ? 'Save Changes' : 'Add Listing & Evaluate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
