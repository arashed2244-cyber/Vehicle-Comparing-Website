import React from 'react';
import { EvaluatedCar } from '../types/car';
import { Trophy, CheckCircle2, AlertTriangle, ArrowRight, Copy, Edit3, ExternalLink } from 'lucide-react';

interface BestDealCardProps {
  car: EvaluatedCar;
  runnerUp?: EvaluatedCar;
  onOpenDuel: (car1: EvaluatedCar, car2: EvaluatedCar) => void;
  onEdit: (car: EvaluatedCar) => void;
  onDuplicate: (car: EvaluatedCar) => void;
}

export const BestDealCard: React.FC<BestDealCardProps> = ({
  car,
  runnerUp,
  onOpenDuel,
  onEdit,
  onDuplicate,
}) => {
  return (
    <div className="mb-6 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 p-5 sm:p-6 shadow-sm relative overflow-hidden">
      {/* Accent corner wash */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none rounded-bl-full" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Vehicle Identity & Evaluation Verdict */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              #1 Ranked Best Deal
            </span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {car.scoreTier.label} Value
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600 dark:text-slate-300 capitalize">
              {car.listing.condition} Condition
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600 dark:text-slate-300 uppercase">
              {car.listing.titleStatus} Title
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {car.listing.year} {car.listing.make} {car.listing.model}
            </h2>
            {car.listing.notes && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {car.listing.notes}
              </p>
            )}
          </div>

          {/* Highlights & Why it Won */}
          <div className="space-y-1.5 pt-1">
            {car.highlights.slice(0, 3).map((hl, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{hl}</span>
              </div>
            ))}
            {car.warnings.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 pt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Watch: {car.warnings[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Key Calculated Metrics Grid & CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-4 lg:gap-6 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shrink-0">
          {/* Metric 1: Value Score */}
          <div className="text-center sm:text-left pr-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 pb-3 sm:pb-0">
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Value Score
            </div>
            <div className="flex items-baseline gap-1 font-mono tabular-nums">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                {car.valueScore}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/100</span>
            </div>
            <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
              Rank #1 Overall
            </div>
          </div>

          {/* Metric 2: Cost Per Remaining Usable Mile */}
          <div className="space-y-1.5 text-xs min-w-[150px]">
            <div className="flex justify-between text-slate-500">
              <span>Cost / Usable Mile:</span>
              <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                ${car.costPerRemainingMile.toFixed(2)}/mi
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Remaining Lifespan:</span>
              <span className="font-mono tabular-nums font-medium text-slate-800 dark:text-slate-200">
                {car.remainingMiles.toLocaleString()} mi ({car.remainingYears} yrs)
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Effective Cost:</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                ${car.effectivePrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Odometer PPM:</span>
              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                ${car.pricePerOdometerMile.toFixed(2)}/mi
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
            {runnerUp && (
              <button
                onClick={() => onOpenDuel(car, runnerUp)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors shadow-2xs whitespace-nowrap"
              >
                <span>Duel vs #2 Deal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(car)}
                className="flex-1 sm:flex-none p-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit listing details"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDuplicate(car)}
                className="flex-1 sm:flex-none p-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Duplicate listing for price negotiation scenario"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
