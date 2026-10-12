import React from 'react';
import { EvaluatedCar } from '../types/car';
import { X, Trophy, Check, ArrowRight, ShieldCheck, AlertCircle, Zap } from 'lucide-react';

interface HeadToHeadDuelProps {
  isOpen: boolean;
  onClose: () => void;
  carA: EvaluatedCar | null;
  carB: EvaluatedCar | null;
}

export const HeadToHeadDuel: React.FC<HeadToHeadDuelProps> = ({
  isOpen,
  onClose,
  carA,
  carB,
}) => {
  if (!isOpen || !carA || !carB) return null;

  // Determine winner by value score
  const isAWinner = carA.valueScore >= carB.valueScore;
  const winner = isAWinner ? carA : carB;
  const loser = isAWinner ? carB : carA;
  const scoreDiff = Math.abs(carA.valueScore - carB.valueScore);

  // Economic analysis
  const priceDiff = carA.effectivePrice - carB.effectivePrice; // positive if A costs more
  const cprmDiff = Number(Math.abs(carA.costPerRemainingMile - carB.costPerRemainingMile).toFixed(3));
  const remainingMilesDiff = Math.abs(carA.remainingMiles - carB.remainingMiles);
  const remainingYearsDiff = Math.abs(carA.remainingYears - carB.remainingYears);

  // Over 50,000 miles driving scenario
  const costOver50k_A = Math.round(50000 * carA.costPerRemainingMile);
  const costOver50k_B = Math.round(50000 * carB.costPerRemainingMile);
  const diffOver50k = Math.abs(costOver50k_A - costOver50k_B);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-4xl w-full overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Head-to-Head Deal Duel
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side actuarial comparison of long-term costs, remaining life, and overall value.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Winner Announcement Banner */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border-b border-blue-200/80 dark:border-blue-900/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Trophy className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
              Recommended Winner: {winner.listing.year} {winner.listing.make} {winner.listing.model}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Wins by <span className="font-semibold font-mono tabular-nums">+{scoreDiff} pts</span> with a lower cost of{' '}
              <span className="font-semibold font-mono tabular-nums">${winner.costPerRemainingMile.toFixed(2)} / usable mile</span>{' '}
              (vs ${loser.costPerRemainingMile.toFixed(2)}/mi).
            </p>
          </div>
        </div>

        {/* Side by Side Grid */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {/* Vehicle A Card */}
            <div
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                isAWinner
                  ? 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-500 uppercase tracking-wider">Car A</span>
                {isAWinner && (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Best Value
                  </span>
                )}
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {carA.listing.year} {carA.listing.make} {carA.listing.model}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 capitalize">
                <span>{carA.listing.condition} condition</span>
                <span>·</span>
                <span className="uppercase">{carA.listing.titleStatus} title</span>
              </div>

              {/* Big Value Score */}
              <div className="mt-4 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Value Score</div>
                  <div className="text-xs font-medium" style={{ color: carA.scoreTier.colorHex }}>
                    {carA.scoreTier.label}
                  </div>
                </div>
                <div className="font-mono tabular-nums text-3xl font-extrabold" style={{ color: carA.scoreTier.colorHex }}>
                  {carA.valueScore}
                </div>
              </div>
            </div>

            {/* Vehicle B Card */}
            <div
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                !isAWinner
                  ? 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-500 uppercase tracking-wider">Car B</span>
                {!isAWinner && (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Best Value
                  </span>
                )}
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {carB.listing.year} {carB.listing.make} {carB.listing.model}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 capitalize">
                <span>{carB.listing.condition} condition</span>
                <span>·</span>
                <span className="uppercase">{carB.listing.titleStatus} title</span>
              </div>

              {/* Big Value Score */}
              <div className="mt-4 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Value Score</div>
                  <div className="text-xs font-medium" style={{ color: carB.scoreTier.colorHex }}>
                    {carB.scoreTier.label}
                  </div>
                </div>
                <div className="font-mono tabular-nums text-3xl font-extrabold" style={{ color: carB.scoreTier.colorHex }}>
                  {carB.valueScore}
                </div>
              </div>
            </div>
          </div>

          {/* Metric By Metric Comparison Rows */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {/* Row 1: Effective Price */}
            <div className="grid grid-cols-3 p-3 text-xs items-center bg-slate-50/50 dark:bg-slate-800/40 font-semibold text-slate-500 uppercase tracking-wider text-center">
              <span>Car A</span>
              <span>Metric</span>
              <span>Car B</span>
            </div>

            <div className="grid grid-cols-3 p-3 text-xs items-center">
              <div className="text-center font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                ${carA.effectivePrice.toLocaleString()}
                <div className="text-[10px] text-slate-500 font-normal">
                  (${carA.listing.price.toLocaleString()} + ${carA.listing.estimatedRepairs.toLocaleString()} rep.)
                </div>
              </div>
              <div className="text-center text-slate-500 font-medium">Effective Total Price</div>
              <div className="text-center font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                ${carB.effectivePrice.toLocaleString()}
                <div className="text-[10px] text-slate-500 font-normal">
                  (${carB.listing.price.toLocaleString()} + ${carB.listing.estimatedRepairs.toLocaleString()} rep.)
                </div>
              </div>
            </div>

            {/* Row 2: CPRM */}
            <div className="grid grid-cols-3 p-3 text-xs items-center bg-blue-50/30 dark:bg-blue-950/20">
              <div className={`text-center font-mono tabular-nums text-sm font-bold ${carA.costPerRemainingMile <= carB.costPerRemainingMile ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>
                ${carA.costPerRemainingMile.toFixed(2)} / mi
              </div>
              <div className="text-center font-semibold text-blue-800 dark:text-blue-300">
                Cost / Remaining Usable Mile
              </div>
              <div className={`text-center font-mono tabular-nums text-sm font-bold ${carB.costPerRemainingMile <= carA.costPerRemainingMile ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>
                ${carB.costPerRemainingMile.toFixed(2)} / mi
              </div>
            </div>

            {/* Row 3: Current Mileage */}
            <div className="grid grid-cols-3 p-3 text-xs items-center">
              <div className="text-center font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                {carA.listing.mileage.toLocaleString()} mi
              </div>
              <div className="text-center text-slate-500 font-medium">Current Odometer</div>
              <div className="text-center font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                {carB.listing.mileage.toLocaleString()} mi
              </div>
            </div>

            {/* Row 4: Remaining Usable Lifespan */}
            <div className="grid grid-cols-3 p-3 text-xs items-center">
              <div className={`text-center font-mono tabular-nums font-bold ${carA.remainingMiles >= carB.remainingMiles ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                {carA.remainingMiles.toLocaleString()} mi (~{carA.remainingYears} yrs)
              </div>
              <div className="text-center text-slate-500 font-medium">Remaining Usable Lifespan</div>
              <div className={`text-center font-mono tabular-nums font-bold ${carB.remainingMiles >= carA.remainingMiles ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                {carB.remainingMiles.toLocaleString()} mi (~{carB.remainingYears} yrs)
              </div>
            </div>

            {/* Row 5: Price per Odometer Mile */}
            <div className="grid grid-cols-3 p-3 text-xs items-center">
              <div className="text-center font-mono tabular-nums text-slate-700 dark:text-slate-300">
                ${carA.pricePerOdometerMile.toFixed(2)} / mi
              </div>
              <div className="text-center text-slate-500 font-medium">Price / Odometer Mile (PPM)</div>
              <div className="text-center font-mono tabular-nums text-slate-700 dark:text-slate-300">
                ${carB.pricePerOdometerMile.toFixed(2)} / mi
              </div>
            </div>

            {/* Row 6: Annualized Cost */}
            <div className="grid grid-cols-3 p-3 text-xs items-center">
              <div className={`text-center font-mono tabular-nums font-semibold ${carA.annualizedCost <= carB.annualizedCost ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                ${carA.annualizedCost.toLocaleString()} / yr
              </div>
              <div className="text-center text-slate-500 font-medium">Projected Annual Cost</div>
              <div className={`text-center font-mono tabular-nums font-semibold ${carB.annualizedCost <= carA.annualizedCost ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                ${carB.annualizedCost.toLocaleString()} / yr
              </div>
            </div>
          </div>

          {/* Long-term Financial Math Insight */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Long-Term Ownership Economic Projection
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <p>
                • Over <strong>50,000 miles</strong> of normal driving, driving{' '}
                <strong>{winner.listing.year} {winner.listing.make}</strong> is projected to cost approximately{' '}
                <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                  ${Math.min(costOver50k_A, costOver50k_B).toLocaleString()}
                </span>{' '}
                in vehicle purchase depreciation, compared to{' '}
                <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                  ${Math.max(costOver50k_A, costOver50k_B).toLocaleString()}
                </span>{' '}
                for the alternative—saving you{' '}
                <span className="font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                  ${diffOver50k.toLocaleString()}
                </span>.
              </p>
              {remainingMilesDiff > 5000 && (
                <p>
                  • The {winner.listing.make} also provides{' '}
                  <span className="font-mono tabular-nums font-semibold">
                    +{remainingMilesDiff.toLocaleString()} more usable miles
                  </span>{' '}
                  (~{remainingYearsDiff} additional years of service) before reaching its projected retirement threshold.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
