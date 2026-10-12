/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CarListing, 
  EvaluatedCar, 
  EvaluationConfig, 
  SortCriteria, 
  SortDirection 
} from './types/car';
import { 
  evaluateAllCars, 
  DEFAULT_EVALUATION_CONFIG, 
  SAMPLE_CAR_LISTINGS 
} from './utils/evaluator';
import { TopBar } from './components/TopBar';
import { SummaryStatsStrip } from './components/SummaryStatsStrip';
import { BestDealCard } from './components/BestDealCard';
import { RankedComparisonTable } from './components/RankedComparisonTable';
import { ListingModal } from './components/ListingModal';
import { HeadToHeadDuel } from './components/HeadToHeadDuel';
import { SettingsDrawer } from './components/SettingsDrawer';
import { ExportImportModal } from './components/ExportImportModal';
import { Plus, SlidersHorizontal, Info, ShieldCheck, Check } from 'lucide-react';

const STORAGE_KEY_LISTINGS = 'autovalue_car_listings_v1';
const STORAGE_KEY_CONFIG = 'autovalue_config_v1';

export default function App() {
  // 1. Core State with LocalStorage persistence
  const [listings, setListings] = useState<CarListing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LISTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved listings, loading default samples', e);
    }
    return SAMPLE_CAR_LISTINGS;
  });

  const [config, setConfig] = useState<EvaluationConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved config, loading default config', e);
    }
    return DEFAULT_EVALUATION_CONFIG;
  });

  // Save to LocalStorage whenever listings or config change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  }, [config]);

  // 2. Sorting & Filtering State
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [activeTab, setActiveTab] = useState<'all' | 'top_deals' | 'budget'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [titleFilter, setTitleFilter] = useState('all');

  // 3. Selection & Modal State
  const [selectedDuelIds, setSelectedDuelIds] = useState<string[]>([]);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<CarListing | null>(null);
  const [isDuelOpen, setIsDuelOpen] = useState(false);
  const [duelCarA, setDuelCarA] = useState<EvaluatedCar | null>(null);
  const [duelCarB, setDuelCarB] = useState<EvaluatedCar | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 4. Evaluation Calculations
  const allEvaluatedCars = useMemo(() => {
    return evaluateAllCars(listings, config);
  }, [listings, config]);

  // Filtered & Sorted Listings
  const filteredAndSortedCars = useMemo(() => {
    let result = [...allEvaluatedCars];

    // Tab Filters
    if (activeTab === 'top_deals') {
      result = result.filter((c) => c.valueScore >= 75);
    } else if (activeTab === 'budget') {
      result = result.filter((c) => c.effectivePrice <= 15000);
    }

    // Condition Filter
    if (conditionFilter !== 'all') {
      result = result.filter((c) => c.listing.condition === conditionFilter);
    }

    // Title Filter
    if (titleFilter !== 'all') {
      result = result.filter((c) => c.listing.titleStatus === titleFilter);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.listing.make.toLowerCase().includes(q) ||
          c.listing.model.toLowerCase().includes(q) ||
          c.listing.year.toString().includes(q) ||
          (c.listing.notes && c.listing.notes.toLowerCase().includes(q))
      );
    }

    // Apply Sorting
    result.sort((a, b) => {
      let diff = 0;
      switch (sortCriteria) {
        case 'score':
          diff = a.valueScore - b.valueScore;
          break;
        case 'cprMile':
          diff = a.costPerRemainingMile - b.costPerRemainingMile;
          break;
        case 'price':
          diff = a.effectivePrice - b.effectivePrice;
          break;
        case 'mileage':
          diff = a.listing.mileage - b.listing.mileage;
          break;
        case 'year':
          diff = a.listing.year - b.listing.year;
          break;
        case 'ppm':
          diff = a.pricePerOdometerMile - b.pricePerOdometerMile;
          break;
        case 'annualized':
          diff = a.annualizedCost - b.annualizedCost;
          break;
        case 'remainingLife':
          diff = a.remainingMiles - b.remainingMiles;
          break;
        default:
          diff = a.valueScore - b.valueScore;
      }
      return sortDirection === 'asc' ? diff : -diff;
    });

    return result;
  }, [allEvaluatedCars, activeTab, conditionFilter, titleFilter, searchQuery, sortCriteria, sortDirection]);

  // Overall best deal (#1 in overall dataset)
  const bestOverallCar = allEvaluatedCars.length > 0 ? allEvaluatedCars[0] : null;
  const runnerUpCar = allEvaluatedCars.length > 1 ? allEvaluatedCars[1] : undefined;

  // Sorting Handler
  const handleSortChange = (newCriteria: SortCriteria) => {
    if (sortCriteria === newCriteria) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCriteria(newCriteria);
      // Sensible default directions for criteria
      if (['price', 'cprMile', 'mileage', 'ppm', 'annualized'].includes(newCriteria)) {
        setSortDirection('asc'); // lower is better
      } else {
        setSortDirection('desc'); // higher score / year / remaining life is better
      }
    }
  };

  // Duel Selection
  const handleToggleDuelSelect = (id: string) => {
    setSelectedDuelIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id]; // keep newest 2
      }
      return [...prev, id];
    });
  };

  const handleLaunchDuelFromSelection = () => {
    if (selectedDuelIds.length >= 2) {
      const carA = allEvaluatedCars.find((c) => c.listing.id === selectedDuelIds[0]);
      const carB = allEvaluatedCars.find((c) => c.listing.id === selectedDuelIds[1]);
      if (carA && carB) {
        setDuelCarA(carA);
        setDuelCarB(carB);
        setIsDuelOpen(true);
      }
    }
  };

  const handleOpenDuelDirect = (c1: EvaluatedCar, c2: EvaluatedCar) => {
    setDuelCarA(c1);
    setDuelCarB(c2);
    setIsDuelOpen(true);
  };

  // CRUD Handlers
  const handleSaveListing = (
    data: Omit<CarListing, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setListings((prev) =>
        prev.map((item) =>
          item.id === existingId
            ? { ...item, ...data }
            : item
        )
      );
      showToast(`Updated ${data.year} ${data.make} ${data.model}`);
    } else {
      const newListing: CarListing = {
        ...data,
        id: `car-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: Date.now(),
      };
      setListings((prev) => [newListing, ...prev]);
      showToast(`Added ${data.year} ${data.make} ${data.model} to evaluation`);
    }
  };

  const handleDuplicateListing = (car: EvaluatedCar) => {
    const clone: CarListing = {
      ...car.listing,
      id: `car-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      model: `${car.listing.model} (Offer Option)`,
      price: Math.max(1000, car.listing.price - 1000), // pre-seed $1,000 negotiated discount
      notes: `Negotiation scenario ($1,000 off): original asking was $${car.listing.price.toLocaleString()}`,
      createdAt: Date.now(),
    };
    setListings((prev) => [clone, ...prev]);
    showToast(`Created negotiated clone ($1,000 off) for what-if testing`);
  };

  const handleDeleteListing = (id: string) => {
    const target = listings.find((l) => l.id === id);
    setListings((prev) => prev.filter((l) => l.id !== id));
    setSelectedDuelIds((prev) => prev.filter((item) => item !== id));
    if (target) {
      showToast(`Removed ${target.year} ${target.make} ${target.model}`);
    }
  };

  const handleEditListing = (car: EvaluatedCar) => {
    setEditingListing(car.listing);
    setIsListingModalOpen(true);
  };

  const handleResetToSamples = () => {
    setListings(SAMPLE_CAR_LISTINGS);
    setSelectedDuelIds([]);
    showToast('Restored 7 curated sample used car listings');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* 1. Strict 3-Zone Top Navigation Bar */}
      <TopBar
        onOpenAddModal={() => {
          setEditingListing(null);
          setIsListingModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenDuel={handleLaunchDuelFromSelection}
        selectedDuelCount={selectedDuelIds.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 dark:border-slate-200">
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Used Car Deal Evaluator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Ranks listings by cost-per-remaining-mile, age, odometer pace, condition, and estimated repair burdens.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setEditingListing(null);
                setIsListingModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Listing</span>
            </button>
          </div>
        </div>

        {/* 2. Aggregate KPI Summary Strip */}
        <SummaryStatsStrip
          cars={allEvaluatedCars}
          onSelectBest={() => {
            if (bestOverallCar) {
              setSearchQuery(bestOverallCar.listing.model);
            }
          }}
        />

        {/* 3. #1 Best Deal Spotlight Banner */}
        {bestOverallCar && (
          <BestDealCard
            car={bestOverallCar}
            runnerUp={runnerUpCar}
            onOpenDuel={handleOpenDuelDirect}
            onEdit={handleEditListing}
            onDuplicate={handleDuplicateListing}
          />
        )}

        {/* 4. Ranked Data Grid / Comparison Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Ranked Comparison Table
              </h2>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                ({filteredAndSortedCars.length} of {listings.length} listings shown)
              </span>
            </div>

            <div className="text-xs text-slate-500 hidden sm:block">
              Select any 2 checkboxes to compare head-to-head
            </div>
          </div>

          <RankedComparisonTable
            cars={filteredAndSortedCars}
            sortCriteria={sortCriteria}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            selectedForDuel={selectedDuelIds}
            onToggleDuelSelect={handleToggleDuelSelect}
            onEdit={handleEditListing}
            onDuplicate={handleDuplicateListing}
            onDelete={handleDeleteListing}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            conditionFilter={conditionFilter}
            setConditionFilter={setConditionFilter}
            titleFilter={titleFilter}
            setTitleFilter={setTitleFilter}
            onOpenDuel={handleLaunchDuelFromSelection}
          />
        </div>

        {/* 5. Educational Metric Explainer Box */}
        <div className="mt-8 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-600" />
            How Deal Scoring & Lifespans Are Evaluated
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                1. Cost / Usable Mile (CPRM)
              </span>
              Calculates your true purchase cost (asking price + impending repairs) divided by estimated remaining miles left before retirement. Lower is much better.
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                2. Lifespan Benchmarks
              </span>
              Models total durability by manufacturer history (e.g. 250,000 miles for Toyota/Honda; 200,000 mi standard), adjusted for physical condition and title flags.
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                3. Value Score (0–100)
              </span>
              Actuarial grade combining price efficiency, annual mileage pace, branded title risk deductions, and immediate repair penalties.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">AutoValue</span>
            <span>·</span>
            <span>Used Car Deal Evaluator</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Baseline: 13,500 mi/yr</span>
            <span>·</span>
            <span>Year: 2026 Reference</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ListingModal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        onSave={handleSaveListing}
        initialData={editingListing}
        config={config}
      />

      <HeadToHeadDuel
        isOpen={isDuelOpen}
        onClose={() => setIsDuelOpen(false)}
        carA={duelCarA}
        carB={duelCarB}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={(newConfig) => {
          setConfig(newConfig);
          showToast('Updated evaluation benchmarks and presets');
        }}
        onResetDefaults={() => {
          setConfig(DEFAULT_EVALUATION_CONFIG);
          showToast('Reset evaluation rules to factory defaults');
        }}
      />

      <ExportImportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        listings={listings}
        evaluatedCars={allEvaluatedCars}
        onImportListings={(imported) => {
          setListings(imported);
          showToast(`Successfully imported ${imported.length} car listings`);
        }}
        onResetToSamples={handleResetToSamples}
      />
    </div>
  );
}
