import React from 'react';
import { EvaluatedCar } from '../types/car';
import { Award, DollarSign, Gauge, CalendarClock, TrendingUp } from 'lucide-react';

interface SummaryStatsStripProps {
  cars: EvaluatedCar[];
  onSelectBest: () => void;
}

export const SummaryStatsStrip: React.FC<SummaryStatsStripProps> = ({ cars, onSelectBest }) => {
  if (cars.length === 0) return null;

  const bestCar = cars[0]; // First is ranked #1

  const avgPrice = Math.round(
    cars.reduce((sum, c) => sum + c.effectivePrice, 0) / cars.length
  );

  const avgCprm = (
    cars.reduce((sum, c) => sum + c.costPerRemainingMile, 0) / cars.length
  ).toFixed(2);

  const avgRemainingYears = (
    cars.reduce((sum, c) => sum + c.remainingYears, 0) / cars.length
  ).toFixed(1);

  const avgScore = Math.round(
    cars.reduce((sum, c) => sum + c.valueScore, 0) / cars.length
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* 1. Best Overall Deal */}
      <div 
        onClick={onSelectBest}
        className="cursor-pointer group p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-900 dark:to-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 shadow-xs hover:border-blue-300 transition-all"
      >
        <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-400 font-medium mb-1.5">
          <span className="flex items-center gap-1.5 font-semibold">
            <Award className="w-4 h-4 text-amber-500" />
            Best Overall Deal
          </span>
          <span className="font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
            {bestCar.valueScore} pts
          </span>
        </div>
        <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors">
          {bestCar.listing.year} {bestCar.listing.make} {bestCar.listing.model}
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2 font-mono tabular-nums">
          <span>${bestCar.costPerRemainingMile.toFixed(2)} / usable mi</span>
          <span>·</span>
          <span>{bestCar.remainingYears} yrs left</span>
        </div>
      </div>

      {/* 2. Average Cost Per Usable Mile */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            Avg. Cost / Remaining Mile
          </span>
        </div>
        <div className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl font-mono tabular-nums">
          ${avgCprm}
          <span className="text-xs font-normal text-slate-500 ml-1">/ mile</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Target baseline: $0.16 – $0.22/mi
        </div>
      </div>

      {/* 3. Average Price */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            Avg. Effective Purchase
          </span>
        </div>
        <div className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl font-mono tabular-nums">
          ${avgPrice.toLocaleString()}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Includes anticipated repairs
        </div>
      </div>

      {/* 4. Average Usable Lifespan */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5">
            <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
            Avg. Projected Life
          </span>
          <span className="font-mono tabular-nums text-xs text-slate-500">
            Avg Score: {avgScore}
          </span>
        </div>
        <div className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl font-mono tabular-nums">
          {avgRemainingYears}
          <span className="text-xs font-normal text-slate-500 ml-1">years remaining</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
          Across {cars.length} active listings
        </div>
      </div>
    </div>
  );
};
