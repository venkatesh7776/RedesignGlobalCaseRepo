import { useState } from "react";
import { StageNavigator } from "../components/StageNavigator";
import { ChevronLeft, CheckCircle, ArrowRight, TrendingUp, DollarSign, Shield, AlertCircle } from "lucide-react";
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
  const settlementLow = totalRecommended * 0.6;
  const settlementHigh = totalRecommended * 0.85;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToIntake}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Case Intake
            </button>
            <div className="text-sm text-gray-500">
              Case Intake <span className="mx-2">›</span>
              <span className="text-gray-900 font-medium">{data.caseName}</span>
            </div>
          </div>
        </div>
      </div>

      <StageNavigator currentStage="Valuation" onStageClick={onStageClick} />

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

        {analysisFindings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Valuation is unavailable until analysis has been completed</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">LECO needs liability and injury signals from the Analysis stage before computing case value.</p>
            <Button onClick={onReturnToAnalysis} className="bg-cyan-500 hover:bg-cyan-600 text-white border-0">
              Return to Analysis
            </Button>
          </div>
        )}

        {analysisFindings.length > 0 && (<>

        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-cyan-50 border border-cyan-200 rounded-lg text-xs font-semibold text-cyan-700 mb-3">
              STAGE 04 ACTIVE
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Valuation</h1>
            <p className="text-gray-600">LECO has computed damages and generated a recommended case value for attorney review.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg mt-1">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Valuation Complete</span>
          </div>
        </div>

        {/* ── VALUATION SUMMARY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT — Damage Computation */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Damage Computation</h2>
            </div>

            {/* Economic breakdown */}
            <div className="border border-gray-100 rounded-xl overflow-hidden mb-5">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Economic Damages</span>
              </div>
              <div className="divide-y divide-gray-100">
                {economicDamages.map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50">
                  <span className="text-sm font-semibold text-gray-900">Economic Damages Subtotal</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(baseEconomic)}</span>
                </div>
              </div>
            </div>

            {/* Multiplier rows */}
            <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-gray-600">Risk & Recovery Multiplier</span>
                  <span className="text-sm font-semibold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">{multiplier}x</span>
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-gray-600">Multiplier Adjustment</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(multiplierAdjustment)}</span>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gray-900 rounded-2xl px-6 py-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Recommended Value</div>
                <div className="text-3xl font-bold text-white">{formatCurrency(totalRecommended)}</div>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-400 opacity-80" />
            </div>
          </div>

          {/* RIGHT — Settlement Estimate (sticky) */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-4 h-4 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Settlement Estimate</h2>
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">Settlement Range</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(settlementLow)} – {formatCurrency(settlementHigh)}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="text-xs text-gray-500 font-medium mb-1">Confidence Verification</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: "94%" }} />
                  </div>
                  <span className="text-sm font-bold text-cyan-700 shrink-0">94%</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="text-xs text-gray-500 font-medium mb-1">Status</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-700">Valuation Complete</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <Button
                  onClick={onProceedToCaseReady}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white border-0 gap-2"
                >
                  Proceed To Case Ready
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE MULTIPLIER STRATEGY ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Interactive Multiplier Strategy</h2>
          <p className="text-sm text-gray-500 mb-8">Adjust the risk and recovery multiplier to explore case value scenarios.</p>

          <div className="max-w-2xl mx-auto">
            {/* Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span>Conservative (1.5x)</span>
                <span className="text-base font-bold text-cyan-600">{multiplier}x multiplier</span>
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
                  background: `linear-gradient(to right, #06AFCB 0%, #06AFCB ${((multiplier - 1.5) / (15 - 1.5)) * 100}%, #e5e7eb ${((multiplier - 1.5) / (15 - 1.5)) * 100}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
                <span>1.5x</span>
                <span>6x</span>
                <span>9x</span>
                <span>12x</span>
                <span>15x</span>
              </div>
            </div>

            {/* Scenario cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className={`border rounded-xl p-4 text-center transition-all ${multiplier < 5 ? "border-cyan-300 bg-cyan-50" : "border-gray-200"}`}>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Conservative</div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(baseEconomic + baseEconomic * 3)}</div>
                <div className="text-xs text-gray-400 mt-1">3x multiplier</div>
              </div>
              <div className={`border rounded-xl p-4 text-center transition-all ${multiplier >= 5 && multiplier < 11 ? "border-cyan-300 bg-cyan-50" : "border-gray-200"}`}>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recommended</div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(baseTotal)}</div>
                <div className="text-xs text-gray-400 mt-1">9x multiplier</div>
              </div>
              <div className={`border rounded-xl p-4 text-center transition-all ${multiplier >= 11 ? "border-cyan-300 bg-cyan-50" : "border-gray-200"}`}>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Aggressive</div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(baseEconomic + baseEconomic * 12)}</div>
                <div className="text-xs text-gray-400 mt-1">12x multiplier</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PROCEED TO CASE READY ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Ready to proceed?</h3>
            <p className="text-sm text-gray-500">Valuation is complete. Advance to Case Ready to prepare the attorney package.</p>
          </div>
          <Button
            onClick={onProceedToCaseReady}
            className="bg-cyan-500 hover:bg-cyan-600 text-white border-0 gap-2"
          >
            Proceed To Case Ready
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        </>)}

      </div>
    </div>
  );
}
