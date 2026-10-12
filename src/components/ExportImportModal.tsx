import React, { useState } from 'react';
import { CarListing, EvaluatedCar } from '../types/car';
import { X, Download, Upload, RotateCcw, Copy, Check, FileSpreadsheet } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: CarListing[];
  evaluatedCars: EvaluatedCar[];
  onImportListings: (imported: CarListing[]) => void;
  onResetToSamples: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  listings,
  evaluatedCars,
  onImportListings,
  onResetToSamples,
}) => {
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const headers = [
      'Rank',
      'Make',
      'Model',
      'Year',
      'Asking Price',
      'Pending Repairs',
      'Effective Total Price',
      'Current Mileage',
      'Condition',
      'Title Status',
      'Remaining Usable Miles',
      'Remaining Usable Years',
      'Price Per Odometer Mile',
      'Cost Per Remaining Usable Mile',
      'Annualized Cost',
      'Value Score',
      'Score Tier',
      'Notes',
    ];

    const rows = evaluatedCars.map((c) => [
      c.rank,
      `"${c.listing.make}"`,
      `"${c.listing.model}"`,
      c.listing.year,
      c.listing.price,
      c.listing.estimatedRepairs,
      c.effectivePrice,
      c.listing.mileage,
      `"${c.listing.condition}"`,
      `"${c.listing.titleStatus}"`,
      c.remainingMiles,
      c.remainingYears,
      c.pricePerOdometerMile.toFixed(3),
      c.costPerRemainingMile.toFixed(3),
      c.annualizedCost,
      c.valueScore,
      `"${c.scoreTier.label}"`,
      `"${(c.listing.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `autovalue_car_deal_evaluations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(listings, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        setImportError('Imported data must be an array of car listings.');
        return;
      }
      onImportListings(parsed);
      onClose();
    } catch (err) {
      setImportError('Invalid JSON format. Please check syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Export, Import & Reset
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Export Actions */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-white block">
              Export Data & Reports
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-semibold transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Download CSV</span>
              </button>

              <button
                onClick={handleCopyJSON}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-semibold transition-colors shadow-2xs"
              >
                {copied ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Import JSON */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-white block">
              Import Listings (JSON)
            </label>
            <textarea
              value={importJsonText}
              onChange={(e) => {
                setImportJsonText(e.target.value);
                setImportError('');
              }}
              rows={4}
              placeholder="Paste valid JSON array of car listings here..."
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {importError && <p className="text-[11px] text-rose-500">{importError}</p>}
            <button
              onClick={handleImportSubmit}
              disabled={!importJsonText.trim()}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Listings</span>
            </button>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Reset to Curated Samples */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                Restore Curated Sample Cars
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Load the default 7 realistic used car listings for testing.
              </p>
            </div>
            <button
              onClick={() => {
                onResetToSamples();
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
