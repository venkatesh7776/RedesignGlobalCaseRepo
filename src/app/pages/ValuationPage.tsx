import { useState } from "react";
import { StageNavigator } from "../components/StageNavigator";
import { ChevronLeft, ChevronRight, CheckCircle, ArrowRight, DollarSign, Shield, AlertCircle, Sparkles, ChevronDown, FileText, Eye, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { AnalysisFinding } from "../types/case";
import { DocumentWorkspaceModal } from "../components/DocumentWorkspace";

interface ValuationPageProps {
  caseData?: {
    caseName: string;
    caseId: string;
    plaintiff: string;
    summary: string;
    jurisdiction?: string;
  };
  analysisFindings?: AnalysisFinding[];
  onStageClick?: (stageName: string) => void;
  onBackToIntake?: () => void;
  onReturnToAnalysis?: () => void;
  onProceedToCaseReady?: () => void;
}

const economicDamages = [
  { label: "Medical Expenses", value: 87500, category: "Medical Bills", docCount: 18,
    reasoning: "Every charge traces to an itemized billing document and reconciles to the verified total with no duplicates.",
    docs: ["Hospital_Bill.pdf", "hospital_medical_records.pdf", "ER_Bills.pdf", "MRI_Report_2026.pdf"] },
  { label: "Lost Wages", value: 43200, category: "Lost Wages", docCount: 6,
    reasoning: "Verified against employer payroll records and the plaintiff's pre-incident earnings history.",
    docs: ["Wage_Loss_Statement.pdf", "Employer_Payroll_Records.pdf"] },
  { label: "Future Medical Care", value: 24750, category: "Future Medical Care", docCount: 9,
    reasoning: "Projected from the life-care plan and corroborating treating-physician cost estimates.",
    docs: ["Life_Care_Plan.pdf", "Treating_Physician_Estimate.pdf"] },
  { label: "Physical Therapy", value: 6000, category: "Rehabilitation", docCount: 12,
    reasoning: "Substantiated by the documented physical-therapy treatment record and invoices.",
    docs: ["PT_Treatment_Notes.pdf", "Therapy_Invoices.pdf"] },
];

// Factors that justify the recommended valuation strategy (shown as compact chips).
const keyFactors = ["Clear Liability", "Severe Injuries", "Strong Evidence", "Favorable Jurisdiction"];

// Severity tag → pill class. Mirrors the LECO status-pill palette
// (risk = red, progress = amber, neutral = teal, complete = green).
const SEVERITY_PILL: Record<string, string> = {
  Critical: "pill pill-risk",
  High: "pill pill-progress",
  Moderate: "pill pill-neutral",
  Low: "pill pill-complete",
};

// How much each factor contributes to the recommended multiplier, by severity.
// These are multiplier ranges (not dollar amounts) — the factors justify the
// multiplier, which is then applied to the verified economic damages.
const SEVERITY_MULTIPLIER: Record<string, string> = {
  Critical: "2×–3×",
  High: "1×–1.5×",
  Moderate: "0.5×–1×",
  Low: "0.25×–0.5×",
};

// Non-economic damage factors the recommended multiplier is applied to. Each
// carries an AI-assigned severity and a one-line rationale for that severity.
const damageFactors: { category: string; severity: "Critical" | "High" | "Moderate" | "Low"; rationale: string }[] = [
  { category: "Pain & Suffering", severity: "Critical", rationale: "Treating-physician records document persistent, chronic pain requiring ongoing pain-management intervention." },
  { category: "Emotional Distress", severity: "High", rationale: "Mental-health evaluations corroborate diagnosed anxiety and post-traumatic symptoms tied to the incident." },
  { category: "Quality of Life", severity: "High", rationale: "Functional-capacity assessments show a sustained loss of independence in daily activities and prior hobbies." },
  { category: "Cognitive Impairment", severity: "Critical", rationale: "Neuropsychological testing confirms measurable deficits in memory, attention, and processing speed." },
  { category: "Physical Impairment", severity: "High", rationale: "Imaging and orthopedic findings verify permanent mobility restrictions and reduced range of motion." },
  { category: "Dignity & Independence", severity: "Moderate", rationale: "Reliance on assistive care for routine self-care tasks meaningfully reduces personal autonomy." },
  { category: "Family Relationship Impact", severity: "Moderate", rationale: "Family statements document caregiving burden and loss of consortium within the household." },
];

const baseEconomic = 161450;
const baseMultiplier = 9;
const baseMult = baseEconomic * baseMultiplier;
const baseTotal = baseEconomic + baseMult;

function formatCurrency(n: number) {
  return "$" + n.toLocaleString("en-US");
}

// Compact dollars (e.g. $1.45M, $137K) — keeps ranges from overflowing.
function formatCompactUSD(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return "$" + Math.round(n).toLocaleString("en-US");
}

// Show a value as a ±15% range instead of an exact figure.
const RANGE_LOW = 0.85;
const RANGE_HIGH = 1.15;
function formatRange(n: number) {
  return `${formatCompactUSD(n * RANGE_LOW)} – ${formatCompactUSD(n * RANGE_HIGH)}`;
}

// Show a multiplier as a ±1 range (e.g. 9 → "8× – 10×").
function multiplierRange(m: number) {
  return `${m - 1}× – ${m + 1}×`;
}

// Pad named docs up to `count` with realistic placeholder names.
function padDocs(names: string[], category: string, count: number): string[] {
  const slug = category.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
  const out = [...names];
  let n = out.length + 1;
  while (out.length < count) { out.push(`${slug}_${String(n).padStart(2, "0")}.pdf`); n++; }
  return out;
}

// Stable string hash → non-negative int, so per-document amounts/dates are
// deterministic across renders (no jitter when the drawer re-renders).
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

type DocLine = { name: string; amount: number; aiSummary: string; billingPeriod: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Build an itemized, evidence-backed breakdown for an economic damage category.
// Amounts are deterministic and reconcile EXACTLY to the verified category total.
function buildDocBreakdown(item: { value: number; category: string; docCount: number; docs: string[] }): DocLine[] {
  const files = padDocs(item.docs, item.category, item.docCount);
  const weights = files.map((f) => 0.6 + (hashStr(f + item.category) % 1000) / 1000); // 0.6 – 1.6
  const wsum = weights.reduce((a, b) => a + b, 0);
  // Round each share to the nearest $50, then absorb the rounding drift into the
  // last line so the itemized amounts sum exactly to the category total.
  const amounts = weights.map((w) => Math.max(50, Math.round((item.value * w / wsum) / 50) * 50));
  amounts[amounts.length - 1] += item.value - amounts.reduce((a, b) => a + b, 0);

  return files.map((name, i) => {
    const h = hashStr(name + i);
    const m = h % 6;                     // billing window within Jan–Jun 2026
    const startDay = 1 + (h % 18);
    const endDay = Math.min(28, startDay + 4 + ((h >> 4) % 16));
    const summaries = [
      `Itemized ${item.category.toLowerCase()} charges verified against the provider ledger; line items reconcile with no duplicates.`,
      `${item.category} entry cross-checked to the source billing statement and confirmed attributable to this claim.`,
      `Verified ${item.category.toLowerCase()} amount — matches the provider invoice and is supported by treatment records.`,
    ];
    return {
      name,
      amount: amounts[i],
      aiSummary: summaries[h % summaries.length],
      billingPeriod: `${MONTHS[m]} ${startDay} – ${MONTHS[m]} ${endDay}, 2026`,
    };
  });
}

export function ValuationPage({ caseData, analysisFindings = [], onStageClick, onBackToIntake, onReturnToAnalysis, onProceedToCaseReady }: ValuationPageProps) {
  const [multiplier, setMultiplier] = useState(baseMultiplier);
  // Damage Factors accordion — collapsed by default.
  const [damageFactorsOpen, setDamageFactorsOpen] = useState(false);
  // Economic line items: which rows have their reasoning card expanded, the row
  // whose details drawer is open, and the preview/insights modal view.
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const toggleRow = (label: string) =>
    setExpandedRows((prev) => { const n = new Set(prev); if (n.has(label)) n.delete(label); else n.add(label); return n; });
  const [drawerItem, setDrawerItem] = useState<(typeof economicDamages)[number] | null>(null);
  const [drawerDocsOpen, setDrawerDocsOpen] = useState(false);
  // Which itemized document rows are expanded (keyed by file name).
  const [expandedDocRows, setExpandedDocRows] = useState<Set<string>>(new Set());
  const toggleDocRow = (name: string) =>
    setExpandedDocRows((prev) => { const n = new Set(prev); if (n.has(name)) n.delete(name); else n.add(name); return n; });
  const openDrawer = (item: (typeof economicDamages)[number]) => { setDrawerItem(item); setDrawerDocsOpen(false); setExpandedDocRows(new Set()); };
  const [wsView, setWsView] = useState<"preview" | "insights" | null>(null);
  // When a single row's "Preview Document" is used, focus that file in the workspace.
  const [wsFocus, setWsFocus] = useState<string | null>(null);
  // Itemized, amount-attributed breakdown for the open category (sums to its total).
  const breakdown = drawerItem ? buildDocBreakdown(drawerItem) : [];
  const verifiedTotal = breakdown.reduce((a, d) => a + d.amount, 0);
  const drawerDocs = drawerItem
    ? padDocs(drawerItem.docs, drawerItem.category, drawerItem.docCount).map((name) => ({
        id: name, name, source: "Attorney Office", date: "Jun 8, 2026", status: "Processed", category: drawerItem.category,
      }))
    : [];
  // Reorder so a row-focused document opens first in the workspace tabs.
  const orderedDrawerDocs = wsFocus
    ? [...drawerDocs.filter((d) => d.name === wsFocus), ...drawerDocs.filter((d) => d.name !== wsFocus)]
    : drawerDocs;

  const defaultCaseData = {
    caseName: "Estate of Miller vs Logistics Co.",
    caseId: "PI-2024-001",
    plaintiff: "Evelyn Miller",
    summary: "Motor vehicle accident resulting in cervical disc herniation and ongoing physical therapy.",
    jurisdiction: "Cook County, IL",
  };

  const data = { ...defaultCaseData, ...caseData };

  // The "Recommended" valuation summary is pinned to LECO's recommended multiplier
  // (baseMultiplier). The interactive slider below is an exploration tool only and
  // does not alter the recommended figures.

  // Key valuation factors that justify the currently selected multiplier zone
  const valuationFactors =
    multiplier < 5
      ? {
          posture: "Conservative",
          factors: ["Early Settlement Goal", "Reduced Trial Risk", "Faster Resolution", "Liability Largely Undisputed"],
        }
      : multiplier < 11
      ? {
          posture: "Recommended",
          factors: ["Clear Liability", "Severe Injuries", "Strong Evidence", "Favorable Jurisdiction"],
        }
      : {
          posture: "Aggressive",
          factors: ["Egregious Negligence", "Permanent Impairment", "Punitive Exposure", "Trial-Ready Evidence"],
        };

  return (
    <>
    <div className="min-h-screen bg-wash">
      {/* Breadcrumb */}
      <div className="bg-white sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToIntake}
              className="flex items-center gap-2 secondary-text hover:text-ink transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              Back to Case Intake
            </button>
            <div className="secondary-text ml-auto">
              Case Intake <span className="mx-2">›</span>
              <span className="text-ink font-medium">{data.caseName}</span>
            </div>
          </div>
        </div>
      </div>

      <StageNavigator currentStage="Valuation" onStageClick={onStageClick} />

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-8">

        {analysisFindings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-tint rounded-xl flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-deep" strokeWidth={1.75} />
            </div>
            <h2 className="section-header mb-2">Valuation is unavailable until analysis has been completed</h2>
            <p className="body-text mb-6 max-w-sm">LECO needs liability and injury signals from the Analysis stage before computing case value.</p>
            <Button onClick={onReturnToAnalysis} className="btn btn-primary">
              Return to Analysis
            </Button>
          </div>
        )}

        {analysisFindings.length > 0 && (<>

        {/* Page Header */}
        <div>
          <h1 className="page-title" style={{ fontSize: "24px" }}>Stage 3 - Case Valuation</h1>
        </div>

        {/* ── VALUATION SUMMARY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT — Damage Computation (single card; Economic / Non-Economic tabs + total) */}
          <div className="lg:col-span-2 lg-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <DollarSign className="w-5 h-5 text-[#5B6B78]" strokeWidth={1.75} />
              <h2 className="section-header">Damage Computation</h2>
            </div>

            {/* Three stacked sections: Economic · Non-Economic · Total */}
            <div className="space-y-5">

              {/* 1 — Economic Damages */}
              <div className="border border-line rounded-xl overflow-hidden">
                <div className="bg-tint px-5 py-3 border-b border-line flex items-center justify-between gap-3">
                  <h3 className="card-title">Economic Damages</h3>
                  <span className="pill pill-progress shrink-0">Verified</span>
                </div>
                <div className="p-5">
                  <div className="divide-y divide-line">
                    {economicDamages.map((item) => {
                      const open = expandedRows.has(item.label);
                      return (
                        <div key={item.label} className="py-2.5">
                          <div className="flex items-center justify-between gap-3">
                            <button onClick={() => toggleRow(item.label)} aria-expanded={open} className="flex items-center gap-1.5 text-left min-w-0">
                              <span className="body-text w-[170px] shrink-0">{item.label}</span>
                              <ChevronDown className={`w-4 h-4 text-[#5B6B78] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={1.75} />
                            </button>
                            <span className="text-sm font-medium text-ink tabular-nums shrink-0">{formatCurrency(item.value)}</span>
                          </div>
                          {open && (
                            <div className="mt-2.5 ml-[22px] rounded-xl border border-line bg-offwhite p-3.5 flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="secondary-text">{item.reasoning}</p>
                                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#5B6B78]">
                                  <FileText className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                                  We considered {item.docs[0]} and {item.docCount - 1}+ more documents.
                                </div>
                              </div>
                              <button onClick={() => openDrawer(item)} className="shrink-0 text-sm font-semibold text-deep hover:text-ink transition-colors whitespace-nowrap">
                                View details →
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t-2 border-line flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink">Economic Damages Subtotal</span>
                    <span className="text-lg font-bold text-ink tabular-nums">{formatCurrency(baseEconomic)}</span>
                  </div>
                </div>
              </div>

              {/* 2 — Non-Economic Damages */}
              <div className="border border-line rounded-xl overflow-hidden">
                <div className="bg-tint px-5 py-3 border-b border-line">
                  <h3 className="card-title">Non-Economic Damages</h3>
                </div>
                <div className="p-5 space-y-6">
                  {/* Top metrics — sky-blue brand cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-tint border border-[#D6F2F7] rounded-xl p-4">
                      <div className="eyebrow mb-1">Recommended Multiplier</div>
                      <div className="text-2xl font-bold text-deep tabular-nums">{multiplierRange(baseMultiplier)}</div>
                    </div>
                    <div className="bg-tint border border-[#D6F2F7] rounded-xl p-4">
                      <div className="eyebrow mb-1">Estimated Non-Economic Damages</div>
                      <div className="text-2xl font-bold text-ink tabular-nums">{formatRange(baseMult)}</div>
                    </div>
                  </div>

                  {/* Recommended Valuation Strategy — full-width explanation */}
                  <div className="bg-[#F6FDFF] border border-[#D6F2F7] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Sparkles className="w-4 h-4 text-deep" strokeWidth={1.75} />
                      <span className="eyebrow text-deep">Recommended Valuation Strategy</span>
                    </div>
                    <p className="body-text">
                      LECO recommends applying a <strong className="font-semibold text-ink">{multiplierRange(baseMultiplier)} multiplier</strong> to estimate{" "}
                      <strong className="font-semibold text-ink">Non-Economic Damages</strong> based on the verified case evidence and overall case strength.
                    </p>
                  </div>

                  {/* Damage Factors — collapsible breakdown of what the multiplier covers */}
                  <div className="border border-line rounded-xl overflow-hidden">
                    <button
                      onClick={() => setDamageFactorsOpen((v) => !v)}
                      aria-expanded={damageFactorsOpen}
                      className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-wash transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="card-title">Damage Factors</span>
                          <span className="text-xs font-semibold text-deep bg-tint border border-[#D6F2F7] rounded-full px-2 py-0.5 tabular-nums">
                            {damageFactors.length}
                          </span>
                        </div>
                        <p className="secondary-text mt-0.5">
                          Factors contributing to the recommended {multiplierRange(baseMultiplier)} multiplier.
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-[#5B6B78] shrink-0 transition-transform duration-200 ${damageFactorsOpen ? "" : "-rotate-90"}`}
                        strokeWidth={1.75}
                      />
                    </button>

                    {damageFactorsOpen && (
                      <div className="border-t border-line divide-y divide-[#EAF1F4]">
                        {damageFactors.map((f) => (
                          <div key={f.category} className="px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                                <span className="text-sm font-semibold text-ink">{f.category}</span>
                                <span className={SEVERITY_PILL[f.severity]}>{f.severity}</span>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-sm font-semibold text-ink tabular-nums">{SEVERITY_MULTIPLIER[f.severity]}</div>
                                <div className="text-[10px] uppercase tracking-wide text-[#8A98A3]">Multiplier</div>
                              </div>
                            </div>
                            <p className="secondary-text mt-1">{f.rationale}</p>
                          </div>
                        ))}

                        {/* Summary — combined factors → recommended multiplier → non-economic estimate */}
                        <div className="bg-tint px-4 py-3.5 space-y-2.5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-[#5B6B78]">Recommended Multiplier</span>
                            <span className="text-sm font-bold text-ink tabular-nums">{multiplierRange(baseMultiplier)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-[#5B6B78]">Estimated Non-Economic Damages</span>
                            <span className="text-sm font-bold text-ink tabular-nums">{formatRange(baseMult)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recommendation Factors — why 9× was recommended */}
                  <div>
                    <div className="eyebrow mb-3">Recommendation Factors</div>
                    <div className="flex flex-wrap gap-2">
                      {keyFactors.map((f) => (
                        <span key={f} className="pill pill-neutral">
                          <CheckCircle className="w-4 h-4" strokeWidth={1.75} />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 — Total Recommended Value (slim) */}
              <div className="bg-ink rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="eyebrow text-soft mb-1">Total Recommended Value</div>
                  <div className="font-mono text-xs text-soft tabular-nums truncate">
                    {formatCurrency(baseEconomic)} <span className="text-brand">+</span> {formatRange(baseMult)}
                  </div>
                </div>
                <div className="text-white font-bold tabular-nums shrink-0" style={{ fontSize: "24px", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                  {formatRange(baseTotal)}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT — Settlement Estimate (sticky, offset below the sticky breadcrumb + stage nav) */}
          <div className="lg:col-span-1 lg-card p-6 sticky top-[160px]">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-[#5B6B78]" strokeWidth={1.75} />
              <h2 className="section-header">Settlement Estimate</h2>
            </div>

            <div className="space-y-5">
              <div>
                <div className="eyebrow mb-1">Recommended Settlement Value</div>
                <div className="text-ink font-bold tabular-nums" style={{ fontSize: "26px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  {formatRange(baseTotal)}
                </div>
              </div>

              <div className="border-t border-line pt-5">
                <div className="eyebrow mb-1">Recommended Multiplier</div>
                <div className="text-2xl font-bold text-deep tabular-nums">{multiplierRange(baseMultiplier)}</div>
              </div>

              <div className="border-t border-line pt-5">
                <div className="eyebrow mb-1">Status</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-deep" strokeWidth={1.75} />
                  <span className="text-sm font-semibold text-deep">Valuation Completed</span>
                </div>
              </div>

              <div className="border-t border-line pt-5">
                <Button
                  onClick={onProceedToCaseReady}
                  className="w-full btn btn-primary gap-2"
                >
                  Proceed To Case Ready
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE MULTIPLIER STRATEGY ── */}
        <div id="multiplier-strategy" className="lg-card p-6 scroll-mt-32">
          <h2 className="section-header mb-1">Interactive Multiplier Strategy</h2>
          <p className="body-text mb-8">Adjust the risk and recovery multiplier to explore case value scenarios.</p>

          {/* Key Valuation Factors */}
          <div className="relative bg-[#F6FDFF] border border-[#D6F2F7] rounded-[10px] p-4 mb-8">
            <div className="flex items-center justify-between mb-2.5">
              <div className="eyebrow">Key Valuation Factors</div>
              <div className="eyebrow text-deep">{valuationFactors.posture} · {multiplier}x</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {valuationFactors.factors.map((factor) => (
                <span key={factor} className="pill pill-neutral">
                  <CheckCircle className="w-4 h-4" strokeWidth={1.75} />
                  {factor}
                </span>
              ))}
            </div>
            {/* Downward tail pointing to the multiplier label below */}
            <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-6 h-6 rotate-45 bg-[#F6FDFF] border-r-2 border-b-2 border-[#D6F2F7]" />
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-[#5B6B78] mb-3">
                <span>Conservative (1.5x)</span>
                <span className="text-base font-bold text-deep bg-[#F6FDFF] border border-[#D6F2F7] rounded-lg px-3 py-1">{multiplier}x multiplier</span>
                <span>Aggressive (15x)</span>
              </div>
              <input
                type="range"
                min={1.5}
                max={15}
                step={0.5}
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3FB5D7 0%, #3FB5D7 ${((multiplier - 1.5) / (15 - 1.5)) * 100}%, #EEF3F6 ${((multiplier - 1.5) / (15 - 1.5)) * 100}%, #EEF3F6 100%)`,
                }}
              />
              <div className="flex items-center justify-between text-xs text-[#5B6B78] mt-1">
                <span>1.5x</span>
                <span>6x</span>
                <span>9x</span>
                <span>12x</span>
                <span>15x</span>
              </div>
            </div>

            {/* Scenario cards */}
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setMultiplier(3)}
                className={`border rounded-xl p-4 text-center transition-all cursor-pointer hover:border-soft ${multiplier < 5 ? "border-brand bg-tint" : "border-line"}`}
              >
                <div className="eyebrow mb-2">Conservative</div>
                <div className="text-lg font-bold text-ink">{formatRange(baseEconomic + baseEconomic * 3)}</div>
                <div className="mono-ref mt-1">{multiplierRange(3)} multiplier</div>
              </button>
              <button
                type="button"
                onClick={() => setMultiplier(9)}
                className={`border rounded-xl p-4 text-center transition-all cursor-pointer hover:border-soft ${multiplier >= 5 && multiplier < 11 ? "border-brand bg-tint" : "border-line"}`}
              >
                <div className="eyebrow mb-2">Recommended</div>
                <div className="text-lg font-bold text-ink">{formatRange(baseTotal)}</div>
                <div className="mono-ref mt-1">{multiplierRange(9)} multiplier</div>
              </button>
              <button
                type="button"
                onClick={() => setMultiplier(12)}
                className={`border rounded-xl p-4 text-center transition-all cursor-pointer hover:border-soft ${multiplier >= 11 ? "border-brand bg-tint" : "border-line"}`}
              >
                <div className="eyebrow mb-2">Aggressive</div>
                <div className="text-lg font-bold text-ink">{formatRange(baseEconomic + baseEconomic * 12)}</div>
                <div className="mono-ref mt-1">{multiplierRange(12)} multiplier</div>
              </button>
            </div>
          </div>
        </div>

        {/* ── PROCEED TO CASE READY ── */}
        <div className="lg-zone p-6 flex items-center justify-between">
          <div>
            <h3 className="card-title mb-1">Ready to proceed?</h3>
            <p className="body-text">Valuation is complete. Advance to Case Ready to prepare the attorney package.</p>
          </div>
          <Button
            onClick={onProceedToCaseReady}
            className="btn btn-primary gap-2"
          >
            Proceed To Case Ready
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </Button>
        </div>

        </>)}

      </div>
    </div>

    {/* Economic line-item detail drawer */}
    {drawerItem && (
      <>
        <div className="fixed inset-0 bg-ink/40 z-50" onClick={() => setDrawerItem(null)} />
        <div className="fixed top-0 right-0 h-full w-[380px] max-w-[90vw] bg-white shadow-xl z-50 flex flex-col">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
            <h2 className="card-title">Document Details</h2>
            <button onClick={() => setDrawerItem(null)} className="p-1.5 hover:bg-tint rounded-lg transition-colors">
              <X className="w-5 h-5 text-[#5B6B78]" strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div>
              <div className="eyebrow mb-1">Category</div>
              <div className="text-sm font-semibold text-ink">{drawerItem.category}</div>
            </div>
            <div>
              <div className="eyebrow mb-1">Amount</div>
              <div className="text-sm font-semibold text-ink tabular-nums">{formatCurrency(drawerItem.value)}</div>
            </div>

            <div className="border-t border-line" />

            <div>
              <div className="eyebrow mb-2">{drawerItem.docCount} Supporting Documents</div>
              <div className="space-y-2">
                {(drawerDocsOpen ? breakdown : breakdown.slice(0, 3)).map((doc, i) => {
                  const open = expandedDocRows.has(doc.name);
                  return (
                    <div key={doc.name} className="rounded-lg border border-line bg-offwhite overflow-hidden">
                      <button onClick={() => toggleDocRow(doc.name)} className="w-full text-left px-3 py-2.5 hover:bg-wash transition-colors">
                        <div className="eyebrow text-[#8A98A3] mb-1.5">Document {String(i + 1).padStart(2, "0")}</div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-deep shrink-0" strokeWidth={1.75} />
                          <span className="text-xs font-medium text-ink truncate flex-1">{doc.name}</span>
                          <span className="text-xs font-semibold text-ink tabular-nums shrink-0">{formatCurrency(doc.amount)}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-deep shrink-0 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={1.75} />
                        </div>
                      </button>
                      {open && (
                        <div className="px-3 pb-3 pt-2.5 border-t border-line bg-white space-y-3">
                          <div>
                            <div className="eyebrow flex items-center gap-1.5 mb-1">
                              <Sparkles className="w-3 h-3 text-deep" strokeWidth={1.75} /> AI Summary
                            </div>
                            <p className="text-xs text-[#5B6B78] leading-relaxed">{doc.aiSummary}</p>
                          </div>
                          <div>
                            <div className="eyebrow mb-1">Billing Period</div>
                            <p className="text-xs font-medium text-ink">{doc.billingPeriod}</p>
                          </div>
                          <button
                            onClick={() => { setWsFocus(doc.name); setWsView("preview"); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-line text-deep text-xs font-medium hover:bg-tint transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" strokeWidth={1.75} /> Preview Document
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {drawerItem.docCount > 3 && (
                <button onClick={() => setDrawerDocsOpen((o) => !o)} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-deep hover:text-ink transition-colors">
                  {drawerDocsOpen ? "Show less" : `+${drawerItem.docCount - 3} More`}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${drawerDocsOpen ? "rotate-180" : ""}`} strokeWidth={1.75} />
                </button>
              )}
            </div>

            {/* Verified Total — itemized amounts reconcile to the category total */}
            <div className="border-t border-line pt-4">
              <div className="flex items-center justify-between gap-3 rounded-lg bg-tint border border-[#D6F2F7] px-3.5 py-3">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-deep shrink-0" strokeWidth={1.75} />
                  <span className="text-xs font-semibold text-deep">Verified Total</span>
                </div>
                <span className="text-sm font-bold text-ink tabular-nums">{formatCurrency(verifiedTotal)}</span>
              </div>
              <p className="text-[11px] text-[#8A98A3] mt-1.5">Sum of all {drawerItem.docCount} itemized documents · matches the verified {drawerItem.category} total.</p>
            </div>
          </div>

          <div className="border-t border-line p-4 flex items-center gap-2">
            <button onClick={() => { setWsFocus(null); setWsView("preview"); }} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-line text-ink text-sm font-medium hover:bg-wash transition-colors">
              <Eye className="w-4 h-4" strokeWidth={1.75} /> Preview
            </button>
            <button onClick={() => { setWsFocus(null); setWsView("insights"); }} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand hover:bg-deep text-white text-sm font-semibold transition-colors">
              <Sparkles className="w-4 h-4" strokeWidth={1.75} /> Insights
            </button>
          </div>
        </div>
      </>
    )}

    {/* Preview / Insights document workspace */}
    <DocumentWorkspaceModal
      docs={wsView && drawerItem ? orderedDrawerDocs : null}
      contextPanel={drawerItem ? { summary: [
        { label: "Category", value: drawerItem.category },
        { label: "Amount", value: formatCurrency(drawerItem.value) },
        { label: "Supporting Documents", value: String(drawerItem.docCount) },
      ] } : undefined}
      initialView={wsView ?? "preview"}
      onClose={() => { setWsView(null); setWsFocus(null); }}
      onDownload={() => {}}
    />
    </>
  );
}
