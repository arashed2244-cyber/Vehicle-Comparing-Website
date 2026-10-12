import React, { useState } from 'react';
import { EvaluationConfig } from '../types/car';
import { DEFAULT_EVALUATION_CONFIG, DEFAULT_MAKE_LIFESPANS } from '../utils/evaluator';
import { X, RotateCcw, Check, Sliders, Shield, Car } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: EvaluationConfig;
  onSaveConfig: (newConfig: EvaluationConfig) => void;
  onResetDefaults: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetDefaults,
}) => {
  const [benchmarkAnnualMiles, setBenchmarkAnnualMiles] = useState(config.benchmarkAnnualMiles);
  const [defaultTotalLifespan, setDefaultTotalLifespan] = useState(config.defaultTotalLifespan);
  const [toyotaLifespan, setToyotaLifespan] = useState(config.makeLifespanPresets.toyota || 250000);
  const [hondaLifespan, setHondaLifespan] = useState(config.makeLifespanPresets.honda || 250000);
  const [subaruLifespan, setSubaruLifespan] = useState(config.makeLifespanPresets.subaru || 220000);
  const [fordLifespan, setFordLifespan] = useState(config.makeLifespanPresets.ford || 200000);
  const [bmwLifespan, setBmwLifespan] = useState(config.makeLifespanPresets.bmw || 175000);
  const [salvageMult, setSalvageMult] = useState(config.titleMultipliers.salvage || 0.65);
  const [rebuiltMult, setRebuiltMult] = useState(config.titleMultipliers.rebuilt || 0.80);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: EvaluationConfig = {
      ...config,
      benchmarkAnnualMiles,
      defaultTotalLifespan,
      makeLifespanPresets: {
        ...config.makeLifespanPresets,
        toyota: toyotaLifespan,
        lexus: toyotaLifespan + 10000,
        honda: hondaLifespan,
        acura: hondaLifespan,
        subaru: subaruLifespan,
        ford: fordLifespan,
        bmw: bmwLifespan,
      },
      titleMultipliers: {
        ...config.titleMultipliers,
        rebuilt: rebuiltMult,
        salvage: salvageMult,
      },
    };
    onSaveConfig(updated);
    onClose();
  };

  const handleReset = () => {
    onResetDefaults();
    setBenchmarkAnnualMiles(DEFAULT_EVALUATION_CONFIG.benchmarkAnnualMiles);
    setDefaultTotalLifespan(DEFAULT_EVALUATION_CONFIG.defaultTotalLifespan);
    setToyotaLifespan(DEFAULT_MAKE_LIFESPANS.toyota);
    setHondaLifespan(DEFAULT_MAKE_LIFESPANS.honda);
    setSubaruLifespan(DEFAULT_MAKE_LIFESPANS.subaru);
    setFordLifespan(DEFAULT_MAKE_LIFESPANS.ford);
    setBmwLifespan(DEFAULT_MAKE_LIFESPANS.bmw);
    setSalvageMult(DEFAULT_EVALUATION_CONFIG.titleMultipliers.salvage);
    setRebuiltMult(DEFAULT_EVALUATION_CONFIG.titleMultipliers.rebuilt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl w-full overflow-hidden my-8">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Evaluation Rules & Lifespan Benchmarks
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Annual Driving Baseline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  Expected Annual Driving Distance
                </label>
                <p className="text-[11px] text-slate-500">
                  Used to estimate remaining usable years for each car.
                </p>
              </div>
              <span className="font-mono tabular-nums text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded">
                {benchmarkAnnualMiles.toLocaleString()} miles / yr
              </span>
            </div>
            <input
              type="range"
              min={6000}
              max={25000}
              step={500}
              value={benchmarkAnnualMiles}
              onChange={(e) => setBenchmarkAnnualMiles(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>6,000 mi (Light city)</span>
              <span>13,500 mi (US avg)</span>
              <span>25,000 mi (Heavy commuter)</span>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Section 2: Standard Total Lifespan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  Default Vehicle Lifespan Baseline
                </label>
                <p className="text-[11px] text-slate-500">
                  Total expected mileage for standard makes (Ford, Chevy, Hyundai, etc.).
                </p>
              </div>
              <span className="font-mono tabular-nums text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded">
                {defaultTotalLifespan.toLocaleString()} miles
              </span>
            </div>
            <input
              type="range"
              min={150000}
              max={275000}
              step={5000}
              value={defaultTotalLifespan}
              onChange={(e) => setDefaultTotalLifespan(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Section 3: Brand Longevity Presets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-slate-500" />
              <label className="text-xs font-bold text-slate-900 dark:text-white">
                Manufacturer Longevity Presets
              </label>
            </div>
            <p className="text-[11px] text-slate-500">
              Customize expected total lifetime miles by brand tier:
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Toyota / Lexus</span>
                <input
                  type="number"
                  step={5000}
                  value={toyotaLifespan}
                  onChange={(e) => setToyotaLifespan(parseInt(e.target.value) || 250000)}
                  className="w-full px-2 py-1 text-xs font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Honda / Acura</span>
                <input
                  type="number"
                  step={5000}
                  value={hondaLifespan}
                  onChange={(e) => setHondaLifespan(parseInt(e.target.value) || 250000)}
                  className="w-full px-2 py-1 text-xs font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Subaru / Mazda</span>
                <input
                  type="number"
                  step={5000}
                  value={subaruLifespan}
                  onChange={(e) => setSubaruLifespan(parseInt(e.target.value) || 220000)}
                  className="w-full px-2 py-1 text-xs font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">BMW / Luxury Tiers</span>
                <input
                  type="number"
                  step={5000}
                  value={bmwLifespan}
                  onChange={(e) => setBmwLifespan(parseInt(e.target.value) || 175000)}
                  className="w-full px-2 py-1 text-xs font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Section 4: Title Status Penalties */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <label className="text-xs font-bold text-slate-900 dark:text-white">
                Branded Title Lifespan Penalties
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Rebuilt Title Multiplier (e.g. 0.80 = -20% lifespan)
                </label>
                <input
                  type="number"
                  step={0.05}
                  min={0.4}
                  max={1.0}
                  value={rebuiltMult}
                  onChange={(e) => setRebuiltMult(parseFloat(e.target.value) || 0.8)}
                  className="w-full px-2 py-1 text-xs font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Salvage Title Multiplier (e.g. 0.65 = -35% lifespan)
                </label>
                <input
                  type="number"
                  step={0.05}
                  min={0.3}
                  max={1.0}
                  value={salvageMult}
                  onChange={(e) => setSalvageMult(parseFloat(e.target.value) || 0.65)}
                  className="w-full px-2 py-1 text-xs font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Factory Defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Apply & Recalculate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
