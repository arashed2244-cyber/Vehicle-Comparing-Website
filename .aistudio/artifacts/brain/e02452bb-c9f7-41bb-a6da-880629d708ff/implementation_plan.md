# Used Car Deal Evaluator

A specialized automotive analytics and deal comparison tool that calculates price-per-mile, remaining lifespan value, and composite deal scores (0–100) across used car listings to identify and rank the best overall purchase.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The evaluation framework has been structured around your confirmed requirements from the planning interview:

- **Confirmed Decision 1 (Lifespan Evaluation Model)**: Remaining vehicle lifespan model evaluated against annual mileage baselines rather than raw age alone.
- **Confirmed Decision 2 (Vehicle History & Cost Factors)**: Title status (Clean vs. Rebuilt/Salvage), physical/mechanical condition rating (Excellent, Good, Fair, Poor), and upcoming estimated repair costs are incorporated directly into the effective price and remaining usable lifespan.
- **Confirmed Decision 3 (Longevity Benchmarks & Presets)**: Customizable lifespan benchmarks equipped with intelligent manufacturer presets (e.g., 250,000 miles for Toyota/Lexus/Honda; 220,000 for Subaru/Mazda; 200,000 for standard makes; 175,000 for high-maintenance luxury makes).
- **Confirmed Decision 4 (Scoring & Ranking Interface)**: Normalized 0–100 Value Score with instant toggleable sorting criteria (Best Value Score, Lowest Cost per Remaining Mile, Lowest Upfront Price, Lowest Mileage, Newest Year) and a prominent "Best Overall Deal" spotlight.

---

### 1. Overview & Core Concept

- **What It Does**: The Used Car Deal Evaluator enables car shoppers to input multiple vehicle listings (price, year, mileage, make/model, condition, title status, and estimated pending repairs) and instantaneously computes real purchase metrics: cost per remaining usable mile, estimated years of remaining life, price per odometer mile, and an objective 0–100 Value Score.
- **Target Audience / Persona**: Private used-car buyers, automotive enthusiasts, budget-conscious commuters, and family shoppers who need to evaluate whether paying $3,000 more for a newer car with fewer miles is actually a better financial decision.
- **Key Value**: Replaces subjective guesswork with an actuarial lifespan and value model, exposing hidden costs (e.g. a cheap salvage car with upcoming brake/timing belt work) and highlighting the true bargain.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Zero-State & Instant Exploration**: Shoppers land on a clean, high-density dashboard populated with realistic pre-loaded sample deals (e.g., *2019 Toyota RAV4 vs. 2017 Honda CR-V vs. 2020 Subaru Forester vs. 2016 Ford Escape*) so they immediately see the comparison table, ranking order, and metrics without starting from an empty screen.
2. **Adding & Editing Listings**:
   - Quick "Add Car Listing" modal with smart brand autofill (auto-detecting make presets).
   - Inputs: Make & Model, Year, Asking Price, Current Mileage, Condition (Excellent / Good / Fair / Poor), Title Status (Clean / Rebuilt / Salvage), and Estimated Immediate Repairs / Maintenance.
   - Live preview of calculated cost-per-remaining-mile and deal score as fields are typed.
3. **Ranked Leaderboard & Best Deal Spotlight**:
   - Prominent **Best Overall Deal** spotlight card detailing why that vehicle won (#1 Value Score, lowest cost per remaining mile, projected years of reliable use).
   - Full Comparison Table featuring sortable columns, tabular numeric alignment (`tabular-nums`), visual score meter (color-coded 0–100), and quick action buttons (Edit, Duplicate, Remove).
4. **Side-by-Side Head-to-Head Duel**:
   - Select any two cars to open a side-by-side comparison drawer highlighting the delta in cost per mile, remaining lifespan, upfront cash difference, and annual cost.
5. **Adjustable Evaluation Parameters Drawer**:
   - Sliders to fine-tune the buyer's expected annual driving (default: 13,500 miles/year), standard vehicle total lifespan (default: 200,000 miles), and custom brand longevity multipliers.
6. **Data Persistence & Sharing**:
   - Auto-saves listings locally in `localStorage`.
   - Export comparison summary to CSV or clean JSON, with a "Reset to Defaults" option.

#### Visual Identity & Theme
- **Aesthetic Direction**: High-density financial/automotive workstation inspired by modern data analytics tools. Clean, crisp, and trustworthy with zero visual clutter.
- **Color Palette & Surface Restraint**:
  - Background Canvas: Crisp neutral slate (`#F8FAFC` light / `#0B0F19` dark mode support).
  - Structural Surfaces: Pure white card surfaces with subtle 1px hairline dividers (`border-slate-200 / border-slate-800`).
  - Accent Color: Automotive Cobalt Blue (`#2563EB`) for interactive buttons and active states.
  - Semantic Value Grades:
    - 90–100: Emerald (`#16A34A` / "Exceptional Value")
    - 75–89: Teal/Blue (`#0D9488` / "Great Deal")
    - 60–74: Amber (`#D97706` / "Fair Market")
    - <60: Rose/Crimson (`#DC2626` / "Poor Value / High Risk")
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` font for crisp, confident titles.
  - Body & Form Controls: `DM Sans` or `Plus Jakarta Sans` for dense readability.
  - Numbers & Metrics: `font-mono tabular-nums` (`JetBrains Mono` style) for prices, mileages, percentages, and decimals.
- **Zero-Pill Discipline**:
  - Tags and metadata (years, mileage, condition) rendered as clean unboxed text separated by typographic middots (`·`).
  - No decorative pulse dots, no fake telemetry tickers, and no pill badge sandwiches.

---

### 3. Key Product Decisions & Mathematical Model

#### A. Mathematical Formulation
1. **Effective Total Price ($P_{\text{eff}}$)**:
   ```
   P_eff = Listing_Price + Estimated_Repair_Costs
   ```
2. **Vehicle Age & Annual Usage**:
   ```
   Age = max(0.5, Current_Year - Model_Year)
   Observed_Annual_Miles = Current_Mileage / Age
   ```
3. **Adjusted Total Lifespan ($L_{\text{adj}}$)**:
   - Base Lifespan ($L_{\text{base}}$) from make preset (Toyota/Honda = 250k, Subaru/Mazda = 220k, Average = 200k, Luxury = 175k).
   - Condition Multiplier ($M_{\text{cond}}$): Excellent (1.05), Good (1.00), Fair (0.88), Poor (0.72).
   - Title Multiplier ($M_{\text{title}}$): Clean (1.00), Rebuilt (0.80), Salvage (0.65).
   ```
   L_adj = L_base * M_cond * M_title
   ```
4. **Remaining Lifespan & Usable Years**:
   ```
   Remaining_Miles = max(1000, L_adj - Current_Mileage)
   Remaining_Years = Remaining_Miles / Benchmark_Annual_Miles (13,500 mi/yr)
   ```
5. **Cost Metrics**:
   - **Cost Per Remaining Usable Mile (CPRM)**: $P_{\text{eff}} / \text{Remaining\_Miles}$ (The primary economic efficiency metric).
   - **Price-Per-Odometer-Mile (PPM)**: $\text{Listing\_Price} / \text{Current\_Mileage}$ (User's explicitly requested metric).
   - **Annualized Purchase Cost**: $P_{\text{eff}} / \text{Remaining\_Years}$.
6. **Composite Value Score (0–100)**:
   - Calibrated against a benchmark standard of $0.16–$0.22 per usable mile for typical market deals.
   - Bonus for low mileage-for-age, high reliability tier, and clean title.
   - Penalties for heavy mileage-for-age, structural salvage risks, and steep repair burdens.
   - Clamped strictly between 0 and 100.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Used Car Deal Evaluator                         │
│                                                                        │
│  ┌───────────────────────┐  ┌──────────────────────────────────────┐  │
│  │ Top Bar (Clean 3-Zone)│  │ Evaluation Settings Drawer (Sliders)  │  │
│  │ Brand · Nav · Actions │  │ Annual Miles · Lifespan · Presets    │  │
│  └───────────┬───────────┘  └──────────────────┬───────────────────┘  │
│              │                                 │                      │
│              ▼                                 ▼                      │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                   Deal Evaluation State Engine                  │  │
│  │   Listings Store (Local Storage) + Evaluator Calculation Math   │  │
│  └───────────────┬─────────────────────────────────┬───────────────┘  │
│                  │                                 │                  │
│       ┌──────────┴──────────┐           ┌──────────┴──────────┐       │
│       ▼                     ▼           ▼                     ▼       │
│  ┌───────────────┐   ┌───────────────┐ ┌───────────────┐ ┌─────────┐  │
│  │ Best Deal     │   │ Ranked Data   │ │ Head-to-Head  │ │ Add/Edit│  │
│  │ Spotlight Card│   │ Grid / Table  │ │ Comparison    │ │ Listing │  │
│  │ (Top Winner)  │   │ (Sort/Filter) │ │ Duel Modal    │ │ Modal   │  │
│  └───────────────┘   └───────────────┘ └───────────────┘ └─────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Data Entities
```typescript
export interface CarListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  titleStatus: 'clean' | 'rebuilt' | 'salvage';
  estimatedRepairs: number;
  notes?: string;
}

export interface EvaluationResult {
  listing: CarListing;
  effectivePrice: number;
  vehicleAge: number;
  observedAnnualMiles: number;
  adjustedLifespanMiles: number;
  remainingMiles: number;
  remainingYears: number;
  pricePerOdometerMile: number;
  costPerRemainingMile: number;
  annualizedCost: number;
  valueScore: number; // 0 - 100
  tierLabel: 'Exceptional' | 'Great Deal' | 'Fair Market' | 'Below Average' | 'High Risk';
  rank: number;
  isBestOverall: boolean;
}

export interface EvaluationConfig {
  benchmarkAnnualMiles: number; // default 13500
  defaultTotalLifespan: number; // default 200000
  makeLifespanPresets: Record<string, number>;
}
```

#### Interactive Handlers & Transitions
- `handleAddListing(data)`: Validates numerical inputs, computes metrics, inserts into list, auto-recalculates ranks.
- `handleUpdateListing(id, data)`: Inline or modal edit with immediate table update.
- `handleDeleteListing(id)`: Removes car with toast notification.
- `handleDuplicateListing(id)`: Clones listing for quick what-if pricing experiments (e.g. "What if I talk the dealer down to $14,000?").
- `handleSort(criteria)`: Toggle sorting between Value Score, Cost/Remaining Mile, Price, Mileage, and Year.
- `handleOpenCompare(id1, id2)`: Opens side-by-side modal with breakdown of trade-offs.
- `handleConfigChange(newConfig)`: Recalculates all scores in real-time.
- `handleResetDefaults()`: Resets sample data to default curated listings.
