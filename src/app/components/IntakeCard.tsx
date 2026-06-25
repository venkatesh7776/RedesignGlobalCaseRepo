import { ArrowRight } from "lucide-react";

interface IntakeCardProps {
  caseName: string;
  caseId: string;
  plaintiff: string;
  summary: string;
  stage: string;
  progress: number;
  lastUpdated: string;
  claimValue?: string;
  isReady?: boolean;
  onContinue?: () => void;
}

export function IntakeCard({
  caseName,
  caseId,
  plaintiff,
  summary,
  stage,
  progress,
  lastUpdated,
  claimValue,
  isReady = false,
  onContinue,
}: IntakeCardProps) {
  // Stage badge — green when ready for review, calm cyan otherwise.
  const stageBadge = isReady || stage === "Ready For Review" ? "pill-complete" : "pill-neutral";

  return (
    <div className="lg-card lg-card-i p-5 cursor-pointer group flex flex-col h-full">
      {/* Header — case name + stage badge for instant status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="card-title leading-snug truncate">{caseName}</h3>
          <p className="mono-ref text-deep mt-0.5">{caseId}</p>
        </div>
        <span className={`pill shrink-0 ${stageBadge}`}>{stage}</span>
      </div>

      {/* Plaintiff — inline, low-noise */}
      <div className="flex items-baseline gap-2 mt-3 text-sm min-w-0">
        <span className="text-[#5B6B78] shrink-0">Plaintiff</span>
        <span className="font-semibold text-ink truncate">{plaintiff}</span>
      </div>

      {/* Summary — muted, clamped so cards stay uniform */}
      <p className="secondary-text leading-relaxed line-clamp-2 mt-2">{summary}</p>

      {/* Estimated claim value — highlighted for ready cases */}
      {isReady && claimValue && (
        <div className="mt-4 px-4 py-3 bg-tint border border-[#D6F2F7] rounded-xl">
          <div className="eyebrow text-deep mb-0.5">Estimated Claim Value</div>
          <div className="text-2xl font-bold text-ink tabular-nums">{claimValue}</div>
        </div>
      )}

      {/* Progress — pinned toward the bottom so all cards align */}
      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="eyebrow">Progress</span>
          <span className="text-sm font-semibold text-ink tabular-nums">{progress}%</span>
        </div>
        <div className="lg-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Footer — last updated + CTA */}
      <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-line">
        <span className="text-xs text-[#5B6B78]">Updated {lastUpdated}</span>
        <button
          onClick={onContinue}
          className={`btn flex items-center gap-2 group-hover:gap-3 ${
            isReady ? "btn-primary" : "btn-ghost text-deep"
          }`}
        >
          {isReady ? "Open Workspace" : "Continue"}
          <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
