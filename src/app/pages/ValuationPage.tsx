import { useState } from "react";
import { StageNavigator } from "../components/StageNavigator";
import { ChevronLeft, CheckCircle, ArrowRight, DollarSign, Shield, AlertCircle, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { AnalysisFinding } from "../types/case";

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
  { label: "Medical Expenses", value: "$87,500" },
  { label: "Lost Wages", value: "$43,200" },
  { label: "Future Medical Care", value: "$24,750" },
  { label: "Physical Therapy", value: "$6,000" },
];

// Factors that justify the recommended valuation strategy (shown as compact chips).
const keyFactors = ["Clear Liability", "Severe Injuries", "Strong Evidence", "Favorable Jurisdiction"];

const baseEconomic = 161450;
const baseMultiplier = 9;
const baseMult = baseEconomic * baseMultiplier;
const baseTotal = baseEconomic + baseMult;

function formatCurrency(n: number) {
  return "$" + n.toLocaleString("en-US");
}

export function ValuationPage({ caseData, analysisFindings = [], onStageClick, onBackToIntake, onReturnToAnalysis, onProceedToCaseReady }: ValuationPageProps) {
  const [multiplier, setMultiplier] = useState(baseMultiplier);

  const defaultCaseData = {
    caseName: "Estate of Miller vs Logistics Co.",
    caseId: "PI-2024-001",
    plaintiff: "Evelyn Miller",
    summary: "Motor vehicle accident resulting in cervical disc herniation and ongoing physical therapy.",
    jurisdiction: "Cook County, IL",
  };

  const data = { ...defaultCaseData, ...caseData };

  const multiplierAdjustment = baseEconomic * multiplier;
  const totalRecommended = baseEconomic + multiplierAdjustment;

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
                    {economicDamages.map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2.5">
                        <span className="body-text">{item.label}</span>
                        <span className="text-sm font-medium text-ink tabular-nums">{item.value}</span>
                      </div>
                    ))}
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
                <div className="p-5">
                {/* Recommended multiplier + estimated non-economic damages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-tint border border-[#D6F2F7] rounded-xl p-4">
                    <div className="eyebrow mb-1">Recommended Multiplier</div>
                    <div className="text-2xl font-bold text-deep tabular-nums">{multiplier}×</div>
                  </div>
                  <div className="bg-tint border border-[#D6F2F7] rounded-xl p-4">
                    <div className="eyebrow mb-1">Est. Non-Economic Damages</div>
                    <div className="text-2xl font-bold text-ink tabular-nums">{formatCurrency(multiplierAdjustment)}</div>
                  </div>
                </div>

                {/* Recommended strategy — concise */}
                <div className="bg-[#F6FDFF] border border-[#D6F2F7] rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-deep" strokeWidth={1.75} />
                    <span className="eyebrow text-deep">Recommended Valuation Strategy</span>
                  </div>
                  <p className="body-text mb-3">
                    LECO recommends a {multiplier}× multiplier given clear liability, severe injuries, and strong supporting evidence.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {keyFactors.map((f) => (
                      <span key={f} className="pill pill-neutral">
                        <CheckCircle className="w-4 h-4" strokeWidth={1.75} />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Adjust multiplier — scrolls to the interactive strategy section */}
                <button
                  type="button"
                  onClick={() => document.getElementById("multiplier-strategy")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] bg-white border-[1.5px] border-brand text-deep text-sm font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.06)] hover:bg-tint transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} /> Adjust Multiplier
                </button>
                </div>
              </div>

              {/* 3 — Total Recommended Value (slim) */}
              <div className="bg-ink rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="eyebrow text-soft mb-1">Total Recommended Value</div>
                  <div className="font-mono text-xs text-soft tabular-nums truncate">
                    {formatCurrency(baseEconomic)} <span className="text-brand">+</span> {formatCurrency(multiplierAdjustment)}
                  </div>
                </div>
                <div className="text-white font-bold tabular-nums shrink-0" style={{ fontSize: "28px", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                  {formatCurrency(totalRecommended)}
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
                <div className="text-ink font-bold tabular-nums" style={{ fontSize: "32px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  {formatCurrency(totalRecommended)}
                </div>
              </div>

              <div className="border-t border-line pt-5">
                <div className="eyebrow mb-1">Recommended Multiplier</div>
                <div className="text-2xl font-bold text-deep tabular-nums">{multiplier}×</div>
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
                <div className="text-lg font-bold text-ink">{formatCurrency(baseEconomic + baseEconomic * 3)}</div>
                <div className="mono-ref mt-1">3x multiplier</div>
              </button>
              <button
                type="button"
                onClick={() => setMultiplier(9)}
                className={`border rounded-xl p-4 text-center transition-all cursor-pointer hover:border-soft ${multiplier >= 5 && multiplier < 11 ? "border-brand bg-tint" : "border-line"}`}
              >
                <div className="eyebrow mb-2">Recommended</div>
                <div className="text-lg font-bold text-ink">{formatCurrency(baseTotal)}</div>
                <div className="mono-ref mt-1">9x multiplier</div>
              </button>
              <button
                type="button"
                onClick={() => setMultiplier(12)}
                className={`border rounded-xl p-4 text-center transition-all cursor-pointer hover:border-soft ${multiplier >= 11 ? "border-brand bg-tint" : "border-line"}`}
              >
                <div className="eyebrow mb-2">Aggressive</div>
                <div className="text-lg font-bold text-ink">{formatCurrency(baseEconomic + baseEconomic * 12)}</div>
                <div className="mono-ref mt-1">12x multiplier</div>
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
  );
}
