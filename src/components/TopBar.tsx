import React from 'react';
import { Plus, SlidersHorizontal, Sparkles, Scale, Download } from 'lucide-react';

interface TopBarProps {
  onOpenAddModal: () => void;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onOpenDuel: () => void;
  selectedDuelCount: number;
  activeTab: 'all' | 'top_deals' | 'budget';
  setActiveTab: (tab: 'all' | 'top_deals' | 'budget') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenAddModal,
  onOpenSettings,
  onOpenExport,
  onOpenDuel,
  selectedDuelCount,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            AV
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              AutoValue
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links & Filter Views */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Listings
          </button>
          <button
            onClick={() => setActiveTab('top_deals')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'top_deals'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Top Value Deals (Score ≥ 75)
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'budget'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Under $15k
          </button>
        </nav>

        {/* Zone 3: Primary Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {selectedDuelCount >= 2 && (
            <button
              onClick={onOpenDuel}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
              title="Compare selected listings side by side"
            >
              <Scale className="w-3.5 h-3.5" />
              Compare 2 Cars
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
            title="Adjust evaluation rules & lifespan presets"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Rules & Benchmarks</span>
          </button>

          <button
            onClick={onOpenExport}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Export or Import listings data"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs hover:shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Car</span>
          </button>
        </div>
      </div>
    </header>
  );
};
