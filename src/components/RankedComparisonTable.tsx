import React from 'react';
import { EvaluatedCar, SortCriteria, SortDirection, VehicleCondition, TitleStatus } from '../types/car';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Edit3, 
  Copy, 
  Trash2, 
  Scale, 
  HelpCircle,
  ExternalLink,
  CheckCircle,
  Filter
} from 'lucide-react';

interface RankedComparisonTableProps {
  cars: EvaluatedCar[];
  sortCriteria: SortCriteria;
  sortDirection: SortDirection;
  onSortChange: (criteria: SortCriteria) => void;
  selectedForDuel: string[];
  onToggleDuelSelect: (id: string) => void;
  onEdit: (car: EvaluatedCar) => void;
  onDuplicate: (car: EvaluatedCar) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  conditionFilter: string;
  setConditionFilter: (val: string) => void;
  titleFilter: string;
  setTitleFilter: (val: string) => void;
  onOpenDuel: () => void;
}

export const RankedComparisonTable: React.FC<RankedComparisonTableProps> = ({
  cars,
  sortCriteria,
  sortDirection,
  onSortChange,
  selectedForDuel,
  onToggleDuelSelect,
  onEdit,
  onDuplicate,
  onDelete,
  searchQuery,
  setSearchQuery,
  conditionFilter,
  setConditionFilter,
  titleFilter,
  setTitleFilter,
  onOpenDuel,
}) => {
  const renderSortIcon = (criteria: SortCriteria) => {
    if (sortCriteria !== criteria) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Table Toolbar: Search, Filters, and Sorting Segment */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Bar */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by make, model, or notes..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Condition Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="hidden sm:inline font-medium text-slate-500">Condition:</span>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Conditions</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          {/* Title Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="hidden sm:inline font-medium text-slate-500">Title:</span>
            <select
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Titles</option>
              <option value="clean">Clean Only</option>
              <option value="rebuilt">Rebuilt</option>
              <option value="salvage">Salvage</option>
            </select>
          </div>
        </div>

        {/* Duel Selection Status */}
        {selectedForDuel.length > 0 && (
          <div className="flex items-center gap-2 text-xs bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-lg shrink-0">
            <span className="font-medium text-blue-700 dark:text-blue-300">
              {selectedForDuel.length} of 2 cars selected for duel
            </span>
            {selectedForDuel.length === 2 && (
              <button
                onClick={onOpenDuel}
                className="px-2 py-0.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
              >
                Launch Duel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold select-none">
              <th className="py-3 px-3 w-12 text-center">Duel</th>
              <th 
                onClick={() => onSortChange('score')}
                className="py-3 px-3 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Rank</span>
                  {renderSortIcon('score')}
                </div>
              </th>
              <th className="py-3 px-4 min-w-[200px]">Vehicle Listing</th>
              <th 
                onClick={() => onSortChange('price')}
                className="py-3 px-3 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Effective Price</span>
                  {renderSortIcon('price')}
                </div>
              </th>
              <th 
                onClick={() => onSortChange('mileage')}
                className="py-3 px-3 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Odometer / Age</span>
                  {renderSortIcon('mileage')}
                </div>
              </th>
              <th 
                onClick={() => onSortChange('remainingLife')}
                className="py-3 px-3 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Projected Life</span>
                  {renderSortIcon('remainingLife')}
                </div>
              </th>
              <th 
                onClick={() => onSortChange('ppm')}
                className="py-3 px-3 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                title="Asking Price divided by current Odometer Miles"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Price / Mile</span>
                  {renderSortIcon('ppm')}
                </div>
              </th>
              <th 
                onClick={() => onSortChange('cprMile')}
                className="py-3 px-3 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors text-right bg-blue-50/50 dark:bg-blue-950/20"
                title="Effective Price divided by Remaining Usable Miles"
              >
                <div className="flex items-center justify-end gap-1.5 font-bold text-blue-700 dark:text-blue-300">
                  <span>Cost / Usable Mile</span>
                  {renderSortIcon('cprMile')}
                </div>
              </th>
              <th 
                onClick={() => onSortChange('annualized')}
                className="py-3 px-3 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Annual Cost</span>
                  {renderSortIcon('annualized')}
                </div>
              </th>
              <th 
                onClick={() => onSortChange('score')}
                className="py-3 px-4 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors min-w-[130px]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Value Score</span>
                  {renderSortIcon('score')}
                </div>
              </th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {cars.map((car) => {
              const isDuelSelected = selectedForDuel.includes(car.listing.id);
              return (
                <tr
                  key={car.listing.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                    car.isBestOverall ? 'bg-blue-50/30 dark:bg-blue-950/15' : ''
                  }`}
                >
                  {/* Duel Select Checkbox */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isDuelSelected}
                      onChange={() => onToggleDuelSelect(car.listing.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      title="Select for side-by-side comparison"
                    />
                  </td>

                  {/* Rank Column */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-mono tabular-nums font-bold">
                      {car.rank === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-black">
                          1
                        </span>
                      ) : (
                        <span className="text-slate-500 font-semibold px-1">
                          #{car.rank}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Vehicle Identity */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {car.listing.year} {car.listing.make} {car.listing.model}
                    </div>
                    {/* Zero-Pill Unboxed Metadata with middots */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="capitalize">{car.listing.condition}</span>
                      <span aria-hidden="true">·</span>
                      <span className="uppercase">{car.listing.titleStatus} title</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">~{car.observedAnnualMiles.toLocaleString()} mi/yr</span>
                    </div>
                    {car.listing.notes && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1 italic">
                        "{car.listing.notes}"
                      </div>
                    )}
                  </td>

                  {/* Effective Price */}
                  <td className="py-3 px-3 text-right">
                    <div className="font-mono tabular-nums font-bold text-slate-900 dark:text-white text-sm">
                      ${car.effectivePrice.toLocaleString()}
                    </div>
                    {car.listing.estimatedRepairs > 0 ? (
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono tabular-nums">
                        ${car.listing.price.toLocaleString()} + ${car.listing.estimatedRepairs.toLocaleString()} rep.
                      </div>
                    ) : (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        No pending repairs
                      </div>
                    )}
                  </td>

                  {/* Mileage & Age */}
                  <td className="py-3 px-3 text-right">
                    <div className="font-mono tabular-nums font-medium text-slate-900 dark:text-white">
                      {car.listing.mileage.toLocaleString()} mi
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {car.vehicleAge} yrs old
                    </div>
                  </td>

                  {/* Projected Remaining Life */}
                  <td className="py-3 px-3 text-right">
                    <div className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                      {car.remainingMiles.toLocaleString()} mi
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                      ~{car.remainingYears} years left
                    </div>
                  </td>

                  {/* Price per Odometer Mile (PPM) */}
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    ${car.pricePerOdometerMile.toFixed(2)}
                  </td>

                  {/* Cost per Remaining Usable Mile (CPRM) - Primary highlighted metric */}
                  <td className="py-3 px-3 text-right bg-blue-50/40 dark:bg-blue-950/15">
                    <div className="font-mono tabular-nums font-bold text-sm text-blue-700 dark:text-blue-300">
                      ${car.costPerRemainingMile.toFixed(2)}
                      <span className="text-[10px] font-normal text-slate-500 ml-0.5">/mi</span>
                    </div>
                  </td>

                  {/* Annualized Cost */}
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    ${car.annualizedCost.toLocaleString()}
                    <span className="text-[10px] font-normal text-slate-500 ml-0.5">/yr</span>
                  </td>

                  {/* Value Score (0 - 100) */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="font-mono tabular-nums font-extrabold text-sm min-w-[28px] text-right" style={{ color: car.scoreTier.colorHex }}>
                        {car.valueScore}
                      </div>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden max-w-[80px]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(5, car.valueScore))}%`,
                            backgroundColor: car.scoreTier.colorHex,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-[10px] font-medium mt-0.5" style={{ color: car.scoreTier.colorHex }}>
                      {car.scoreTier.label}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onDuplicate(car)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Duplicate for price negotiation experiment"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(car)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Edit listing details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(car.listing.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {cars.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm font-medium">No car listings match your filter criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
