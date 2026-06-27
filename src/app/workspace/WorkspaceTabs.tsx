import { useState, useRef, ReactNode } from "react";
import {
  Scale, MapPin, CheckCircle, ShieldCheck, User, Building2, Hash, Calendar, AlertTriangle, X,
  FileText, Activity, Stethoscope, DollarSign, Sparkles,
  ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Search, Eye, Lightbulb, Download,
  Gavel, MessageSquare, SlidersHorizontal,
  HeartPulse, ClipboardList, Image as ImageIcon, Video, FileSignature, Quote,
} from "lucide-react";
import type { AnalysisFinding, CaseDocument } from "../types/case";
import { classifyDocuments } from "../types/case";
import { DocumentWorkspaceModal } from "../components/DocumentWorkspace";
import { EvidenceReviewModal } from "./EvidenceReviewModal";

// ── Shared model & helpers ────────────────────────────────────────────────────

export interface WorkspaceModel {
  caseName: string;
  caseId: string;
  plaintiff: string;
  defendant: string;
  insuranceCarrier: string;
  caseType: string;
  jurisdiction: string;
  incidentDate: string;
  status: string;
  recommendedSettlement: number;
  confidence: number;
  multiplier: number;
  economicTotal: number;
  nonEconomicTotal: number;
  estimatedLow: number;
  estimatedHigh: number;
}

interface TabProps {
  model: WorkspaceModel;
  findings: AnalysisFinding[];
  documents: CaseDocument[];
  goTo: (tab: string) => void;
  goToValuation?: () => void;
}

function formatUSD(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

// Resolve a filename to a workspace-document shape (category/source/date) for the
// shared Document Workspace. Unknown files fall back to a generic attorney doc.
function buildDocResolver(documents: CaseDocument[]) {
  const categories = classifyDocuments(documents);
  return (file: string) => {
    const d = documents.find((x) => x.name === file);
    const category = d ? categories.find((c) => c.docs.some((f) => f.id === d.id))?.name ?? "General Documents" : "General Documents";
    return d
      ? { ...d, category, source: d.source === "Plaintiff" ? "Plaintiff" : "Attorney Office" }
      : { id: file, name: file, source: "Attorney Office", date: "Jun 8, 2026", status: "Processed", category: "General Documents" };
  };
}

// A reading-first section: Onest heading, optional description, generous spacing.
function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="section-header">{title}</h2>
        {description && <p className="secondary-text mt-1 max-w-2xl">{description}</p>}
      </div>
      {children}
    </section>
  );
}

// Compact information tile: outline icon, uppercase muted label, bold value.
// `wide` spans the full grid width; `big` enlarges the value for emphasis.
function InfoTile({ icon: Icon, label, value, wide, big }: { icon: any; label: string; value: string; wide?: boolean; big?: boolean }) {
  return (
    <div className={`rounded-xl border border-line bg-offwhite p-3 ${wide ? "col-span-2" : ""}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-deep shrink-0" strokeWidth={1.75} />
        <span className="eyebrow truncate">{label}</span>
      </div>
      <div className={`font-semibold text-ink leading-snug break-words ${big ? "text-xl tabular-nums" : "text-sm"}`}>{value}</div>
    </div>
  );
}

// ── Tab 1 — Case Overview ─────────────────────────────────────────────────────

// A single AI-summary card: icon + title aligned on one row, summary left-aligned below.
function SummaryCard({ icon: Icon, title, children }: { icon: any; title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white p-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-[18px] h-[18px] text-deep shrink-0" strokeWidth={1.75} />
        <h3 className="card-title">{title}</h3>
      </div>
      {children}
    </div>
  );
}

const LIABILITY_POINTS = [
  "Failure to yield at a controlled intersection confirmed by police report.",
  "Commercial driver cited for a traffic violation.",
  "Witness statements corroborate the plaintiff's account.",
  "Crash reconstruction supports the impact sequence.",
  "Skid marks and scene evidence match the vehicle positions.",
];

// Evidence-backed litigation findings — each links to the verified documents
// behind it and opens the shared Document Workspace (Preview / Insights).
const KEY_FINDINGS: { title: string; kind: "strength" | "risk"; description: string; evidence: string[]; aiSummary: string }[] = [
  {
    title: "Liability Favors Plaintiff",
    kind: "strength",
    description: "Officer fault determination and a confirmed red-light violation establish a strong liability position under state negligence standards.",
    evidence: ["police_report_final.pdf", "witness_statement.pdf"],
    aiSummary: "The police report and a corroborating witness statement both place fault on the defendant, leaving little room to dispute liability.",
  },
  {
    title: "Severe Injuries Verified",
    kind: "strength",
    description: "MRI imaging confirms C5–C6 and C6–C7 disc herniations with nerve-root compression — objectively documented, severe cervical injuries.",
    evidence: ["MRI_Report_2026.pdf", "hospital_medical_records.pdf"],
    aiSummary: "Objective MRI imaging documents two-level cervical herniations with nerve compression — hard medical evidence the defense cannot easily contest.",
  },
  {
    title: "Strong Supporting Evidence",
    kind: "strength",
    description: "A continuous, well-documented treatment record corroborates causation and ties the injuries directly to the collision.",
    evidence: ["physical_therapy_notes.pdf", "ER_Bills.pdf"],
    aiSummary: "An unbroken treatment trail from the ER through physical therapy ties the injuries directly to the collision and reinforces causation.",
  },
  {
    title: "High Settlement Potential",
    kind: "strength",
    description: "Clear liability, severe verified injuries, and confirmed commercial coverage support a strong demand at the recommended multiplier.",
    evidence: ["insurance_policy_v2.pdf", "wage_loss_statement.pdf"],
    aiSummary: "Clear liability plus verified injuries and confirmed commercial coverage support a strong demand with adequate funds to recover against.",
  },
  {
    title: "Pre-Existing Condition Risk",
    kind: "risk",
    description: "The defense may attribute part of the cervical findings to prior degeneration; causation records should be marshaled to rebut this.",
    evidence: ["hospital_medical_records.pdf", "MRI_Report_2026.pdf"],
    aiSummary: "The defense may argue prior degeneration explains part of the cervical findings; line up causation records and a treating-physician opinion to rebut it.",
  },
  {
    title: "Treatment Gap Exposure",
    kind: "risk",
    description: "A brief gap in the physical therapy record could be used to question injury severity and continuity of care.",
    evidence: ["physical_therapy_notes.pdf"],
    aiSummary: "A short gap in the therapy record could be used to question injury severity; document the reason for the gap to neutralize the argument.",
  },
];

export function OverviewTab({ model, documents, goTo }: TabProps) {
  const [bioOpen, setBioOpen] = useState(false);

  // Shared Document Workspace state (reused from the Analysis stage). Each finding
  // contributes a set of supporting documents; Prev/Next pages between findings.
  const [wsOpen, setWsOpen] = useState(false);
  const [wsView, setWsView] = useState<"preview" | "insights">("preview");
  const [wsIndex, setWsIndex] = useState(0);
  const [findingTab, setFindingTab] = useState<"strengths" | "risks">("strengths");

  const docForFile = buildDocResolver(documents);

  // Split findings into Strengths (pros) and Risks (cons).
  const strengthCount = KEY_FINDINGS.filter((f) => f.kind === "strength").length;
  const riskCount = KEY_FINDINGS.filter((f) => f.kind === "risk").length;
  const visibleFindings = KEY_FINDINGS.filter((f) => (findingTab === "strengths" ? f.kind === "strength" : f.kind === "risk"));
  const findingDocSets = visibleFindings.map((f) => f.evidence.map(docForFile));
  const findingContexts = visibleFindings.map((f) => ({ contextType: "Finding", reference: f.title }));
  // AI Insights per finding — its aiSummary is the headline; the same text is
  // surfaced inline when the card's Evidence dropdown is expanded.
  const findingInsights = visibleFindings.map((f) => ({
    summary: f.aiSummary,
    keyPoints: [f.description],
    entities: [{ label: "Finding", value: f.title }, { label: "Type", value: f.kind === "strength" ? "Strength" : "Risk" }],
    supportingDocs: f.evidence,
    confidence: { level: f.kind === "strength" ? "High" : "Medium", score: f.kind === "strength" ? 92 : 74 },
  }));
  const openFinding = (i: number, view: "preview" | "insights") => { setWsIndex(i); setWsView(view); setWsOpen(true); };

  // Which finding cards have their Evidence dropdown expanded (by index within the visible tab).
  const [findingEvidenceOpen, setFindingEvidenceOpen] = useState<Set<number>>(new Set());
  const toggleFindingEvidence = (i: number) =>
    setFindingEvidenceOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const plaintiffBio =
    `${model.plaintiff} is a 47-year-old resident of ${model.jurisdiction} and a full-time logistics coordinator. ` +
    `A parent of two with no prior history of cervical injury, she was in good health and actively employed at the time of the incident. ` +
    `Since the collision she has undergone a continuous course of treatment for cervical disc herniations, with documented impact on her ` +
    `ability to work and to carry out everyday activities.`;

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-20 gap-8 items-start">
      {/* LEFT — 30% */}
      <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-[176px] self-start">
        {/* Case Snapshot */}
        <div className="lg-card p-6">
          <h3 className="card-title mb-4">Case Snapshot</h3>
          {/* Two-column grid of compact info tiles. Rows fill left→right:
              Plaintiff/Defendant · Carrier/Jurisdiction · Case ID/Case Type · Date/Status */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Plaintiff — expandable to reveal biography */}
            <div className="col-span-2 rounded-xl border border-line bg-offwhite p-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <User className="w-3.5 h-3.5 text-deep shrink-0" strokeWidth={1.75} />
                  <span className="eyebrow truncate">Plaintiff</span>
                </div>
                <button
                  onClick={() => setBioOpen((o) => !o)}
                  className="flex items-center gap-1 text-xs font-medium text-deep hover:text-ink transition-colors shrink-0"
                >
                  {bioOpen ? "Hide biography" : "Check biography"}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${bioOpen ? "rotate-180" : ""}`} strokeWidth={1.75} />
                </button>
              </div>
              <div className="text-sm font-semibold text-ink leading-snug break-words">{model.plaintiff}</div>
              {bioOpen && (
                <p className="secondary-text leading-relaxed mt-2.5 pt-2.5 border-t border-line">{plaintiffBio}</p>
              )}
            </div>
            <InfoTile icon={Building2} label="Defendant" value={model.defendant} />
            <InfoTile icon={ShieldCheck} label="Insurance Carrier" value={model.insuranceCarrier} />
            <InfoTile icon={MapPin} label="Jurisdiction" value={model.jurisdiction} />
            <InfoTile icon={Hash} label="Case ID" value={model.caseId} />
            <InfoTile icon={Scale} label="Case Type" value={model.caseType} />
            <InfoTile icon={Calendar} label="Incident Date" value={model.incidentDate} />
            <InfoTile icon={DollarSign} label="Recommended Settlement" value={formatUSD(model.recommendedSettlement)} wide big />
          </div>

          {/* View Chronology — jumps to the Medical Timeline */}
          <button onClick={() => goTo("medical")} className="btn btn-primary w-full gap-2 mt-4">
            <ClipboardList className="w-4 h-4" strokeWidth={1.75} /> View Chronology
          </button>
        </div>
      </div>

      {/* RIGHT — 70% */}
      <div className="lg:col-span-14 space-y-6">
        {/* AI Case Summary — structured, attorney-friendly breakdown */}
        <div className="rounded-2xl border border-line bg-offwhite p-8 shadow-sm">
          {/* Header */}
          <h2 className="section-header mb-4" style={{ fontSize: "22px" }}>AI Case Summary</h2>

          {/* Summary cards */}
          <div className="space-y-5">
            <SummaryCard icon={Calendar} title="Event Summary">
              <p className="body-text leading-relaxed">
                {model.plaintiff} was involved in a {model.caseType.toLowerCase()} on {model.incidentDate} in {model.jurisdiction} after a
                commercial vehicle operated by {model.defendant} failed to yield at a controlled intersection. The collision resulted in
                significant injuries and initiated the current personal injury claim.
              </p>
            </SummaryCard>

            <SummaryCard icon={HeartPulse} title="Injury Summary">
              <p className="body-text leading-relaxed">
                MRI confirms C5–C6 and C6–C7 disc herniations with nerve-root compression — a severe, objectively verified cervical
                injury. The plaintiff sought emergency care within 24 hours and remains in active treatment, with a guarded prognosis
                and permanent residual impairment expected to affect daily function long-term.
              </p>
            </SummaryCard>

            <SummaryCard icon={Scale} title="Facts & Liability">
              <p className="body-text leading-relaxed mb-4">
                Liability strongly favors the plaintiff based on verified evidence and documented negligence.
              </p>
              <div className="space-y-2.5">
                {LIABILITY_POINTS.map((p) => (
                  <div key={p} className="flex items-start gap-2.5 rounded-lg border border-line bg-offwhite px-3.5 py-2.5">
                    <CheckCircle className="w-4 h-4 text-deep mt-0.5 shrink-0" strokeWidth={1.75} />
                    <span className="text-sm text-ink leading-relaxed">{p}</span>
                  </div>
                ))}
              </div>
            </SummaryCard>

            <SummaryCard icon={Stethoscope} title="Treatment Summary">
              <p className="body-text leading-relaxed">
                Emergency department admission and cervical imaging on the date of incident, followed by a neurology consultation and a
                12-week multi-modal physical therapy program. No surgical intervention to date; care remains ongoing with documented
                range-of-motion deficits and continued pain management.
              </p>
            </SummaryCard>

            <SummaryCard icon={DollarSign} title="Estimated Settlement">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="rounded-lg border border-line bg-offwhite p-3">
                  <div className="eyebrow mb-1">Recommended Settlement</div>
                  <div className="text-xl font-bold text-ink tabular-nums">{formatUSD(model.recommendedSettlement)}</div>
                </div>
                <div className="rounded-lg border border-line bg-offwhite p-3">
                  <div className="eyebrow mb-1">Recommended Multiplier</div>
                  <div className="text-xl font-bold text-deep tabular-nums">{model.multiplier}×</div>
                </div>
                <div className="rounded-lg border border-line bg-offwhite p-3">
                  <div className="eyebrow mb-1">Confidence</div>
                  <div className="text-xl font-bold text-deep tabular-nums">{model.confidence}%</div>
                </div>
              </div>
              <p className="body-text leading-relaxed">
                “Recommendation based on verified economic damages, severe injuries, strong liability, and supporting evidence.”
              </p>
            </SummaryCard>
          </div>
        </div>

        {/* Litigation Key Findings — evidence-backed & actionable, split into pros / cons */}
        <div className="lg-card p-6">
          <h3 className="card-title mb-4">Litigation Key Findings</h3>

          {/* Strengths / Risks tabs */}
          <div className="flex items-center gap-2 mb-5">
            {([
              { key: "strengths", label: "Strengths", count: strengthCount },
              { key: "risks", label: "Risks", count: riskCount },
            ] as const).map((tab) => {
              const active = findingTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFindingTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    active ? "bg-tint border-brand text-deep" : "bg-white border-line text-[#5B6B78] hover:border-soft hover:text-ink"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              );
            })}
          </div>

          {visibleFindings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle className="w-8 h-8 text-green-700 mb-3" strokeWidth={1.75} />
              <p className="text-sm font-medium text-ink">No risks identified</p>
              <p className="secondary-text mt-1">No material weaknesses were flagged for this case.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visibleFindings.map((f, i) => (
              <div key={f.title} className="rounded-xl border border-line bg-white p-5 flex flex-col">
                {/* Status icon + title */}
                <div className="flex items-start gap-2.5 mb-2">
                  {f.kind === "strength"
                    ? <CheckCircle className="w-5 h-5 text-green-700 shrink-0 mt-0.5" strokeWidth={1.75} />
                    : <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" strokeWidth={1.75} />}
                  <h4 className="card-title leading-snug">{f.title}</h4>
                </div>

                {/* Description */}
                <p className="body-text leading-relaxed">{f.description}</p>

                {/* Evidence — expandable to reveal an AI summary */}
                <div className="mt-4 pt-4 border-t border-line">
                  <button
                    onClick={() => toggleFindingEvidence(i)}
                    className="w-full flex items-center justify-between gap-2 group"
                  >
                    <span className="eyebrow group-hover:text-ink transition-colors">Evidence</span>
                    <ChevronDown className={`w-4 h-4 text-deep transition-transform ${findingEvidenceOpen.has(i) ? "rotate-180" : ""}`} strokeWidth={1.75} />
                  </button>
                  <div className="flex items-center gap-1.5 secondary-text mt-1.5">
                    <FileText className="w-4 h-4 text-[#5B6B78]" strokeWidth={1.75} />
                    {f.evidence.length} Supporting {f.evidence.length === 1 ? "Document" : "Documents"}
                  </div>
                  {findingEvidenceOpen.has(i) && (
                    <div className="mt-3 rounded-lg bg-tint border border-[#D6F2F7] p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-deep shrink-0" strokeWidth={1.75} />
                        <span className="eyebrow text-deep">AI Summary</span>
                      </div>
                      <p className="secondary-text leading-relaxed">{f.aiSummary}</p>
                    </div>
                  )}
                </div>

                {/* Actions — reuse the Analysis Preview / Insights workspace */}
                <div className="mt-auto pt-4 flex items-center gap-2">
                  <button
                    onClick={() => openFinding(i, "preview")}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-line text-ink rounded-lg text-sm font-medium hover:bg-wash transition-colors"
                  >
                    <Eye className="w-4 h-4" strokeWidth={1.75} /> Preview
                  </button>
                  <button
                    onClick={() => openFinding(i, "insights")}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-line text-deep rounded-lg text-sm font-medium hover:bg-tint transition-colors"
                  >
                    <Sparkles className="w-4 h-4" strokeWidth={1.75} /> Insights
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

      </div>
    </div>

    {/* Shared Document Workspace — Preview / Insights for the selected finding */}
    <DocumentWorkspaceModal
      docs={wsOpen ? (findingDocSets[wsIndex] ?? []) : null}
      noteContext={findingContexts[wsIndex]}
      insights={findingInsights[wsIndex]}
      initialView={wsView}
      position={wsIndex + 1}
      total={findingDocSets.length}
      onPrev={() => setWsIndex((i) => Math.max(0, i - 1))}
      onNext={() => setWsIndex((i) => Math.min(findingDocSets.length - 1, i + 1))}
      onClose={() => setWsOpen(false)}
      onDownload={() => {}}
    />
    </>
  );
}

// ── Tab 2 — Chronology ────────────────────────────────────────────────────────

interface ChronEvent {
  date: string;
  time?: string;
  title: string;
  description: string;
  insight: string;
  evidence: string[];
  actions?: { text: string; time?: string; description?: string; evidence?: string[] }[]; // key actions (Event Chronology milestones)
}

const MEDICAL_CHRONOLOGY: ChronEvent[] = [
  {
    date: "Feb 14, 2026", time: "9:42 AM", title: "Initial Emergency Admission",
    description: "The plaintiff arrived by ambulance at Cook County Medical Center with acute neck pain and neurological symptoms. Trauma assessment and cervical immobilization were performed on arrival.",
    insight: "This event establishes the beginning of documented treatment within hours of the collision and supports causation.",
    evidence: ["ER_Bills.pdf", "hospital_medical_records.pdf"],
  },
  {
    date: "Feb 16, 2026", title: "MRI Completed",
    description: "Diagnostic MRI of the cervical spine was performed, confirming C5–C6 and C6–C7 disc herniations with nerve-root compression.",
    insight: "Objective imaging links the collision to a confirmed, diagnosable injury — a cornerstone of the damages case.",
    evidence: ["MRI_Report_2026.pdf"],
  },
  {
    date: "Feb 23, 2026", title: "Neurology Consultation",
    description: "A neurology specialist evaluated the plaintiff, confirmed traumatic causation, and recommended a course of conservative management with physical therapy.",
    insight: "Specialist confirmation of traumatic causation strengthens the link between the incident and the injury.",
    evidence: ["hospital_medical_records.pdf"],
  },
  {
    date: "Mar 2, 2026", title: "Physical Therapy Started",
    description: "The plaintiff began a structured, multi-modal physical therapy program targeting cervical mobility and pain management.",
    insight: "Prompt, continuous treatment demonstrates the seriousness of the injury and supports ongoing-care damages.",
    evidence: ["physical_therapy_notes.pdf"],
  },
  {
    date: "Apr 20, 2026", title: "Mid-Treatment Re-Evaluation",
    description: "A re-evaluation documented persistent range-of-motion deficits and chronic pain despite ongoing therapy.",
    insight: "Documented lack of full recovery supports the severity and permanence of the injury.",
    evidence: ["physical_therapy_notes.pdf"],
  },
  {
    date: "Jun 5, 2026", title: "Follow-Up Evaluation",
    description: "A follow-up assessment recorded a guarded prognosis with permanent residual impairment anticipated, and recommended continued care.",
    insight: "A guarded prognosis substantiates future-care and non-economic damages.",
    evidence: ["hospital_medical_records.pdf"],
  },
];

// Event Chronology — each entry is a major case milestone grouping several
// underlying actions (the timeline shows only the most important ones).
const EVENT_CHRONOLOGY: ChronEvent[] = [
  {
    date: "Feb 14, 2026", time: "9:05 AM", title: "Collision Occurred",
    description: "A commercial vehicle operated by Midwest Logistics Co. failed to yield at a controlled intersection and struck the plaintiff's vehicle.",
    insight: "This is the originating event of the claim and the basis for the negligence theory against the defendant.",
    actions: [
      { text: "Commercial vehicle entered the intersection", time: "9:04 AM", description: "Officer reconstruction confirms the truck entered the intersection against a red signal.", evidence: ["Police Report", "Traffic Camera"] },
      { text: "Impact with plaintiff's vehicle", time: "9:05 AM", description: "Front-end collision caused significant cervical trauma.", evidence: ["Police Report", "Vehicle Photos"] },
      { text: "Emergency services notified", time: "9:07 AM", description: "Witnesses contacted 911 immediately after the collision.", evidence: ["Dispatch Log"] },
    ],
    evidence: ["police_report_final.pdf"],
  },
  {
    date: "Feb 14, 2026", title: "Initial Emergency Response",
    description: "Emergency services responded to the scene and transported the plaintiff to Cook County Medical Center for assessment.",
    insight: "Establishes an immediate, contemporaneous record of the incident and the plaintiff's injuries.",
    actions: [
      { text: "Ambulance dispatched", time: "9:11 AM", description: "EMS was dispatched to the scene within minutes of the 911 call.", evidence: ["Dispatch Log"] },
      { text: "Scene documented by first responders", time: "9:20 AM", description: "Responders photographed the scene and recorded initial observations.", evidence: ["Scene Photos"] },
      { text: "Plaintiff transported to Cook County Medical Center", time: "9:42 AM", description: "Plaintiff transported by ambulance for emergency assessment.", evidence: ["EMS Report"] },
      { text: "Vitals and injuries recorded on arrival", time: "9:55 AM", description: "Acute neck pain and neurological symptoms documented at intake.", evidence: ["ER Record"] },
    ],
    evidence: ["emergency_dispatch_record.pdf", "hospital_medical_records.pdf"],
  },
  {
    date: "Feb 14 – 15, 2026", title: "Police Investigation",
    description: "Responding officers investigated the scene, determined fault, and collected initial witness accounts.",
    insight: "The officer's fault determination and witness corroboration are strong, objective evidence of liability.",
    actions: [
      { text: "Officers arrived and secured the scene", time: "Feb 14 · 9:28 AM", description: "Responding officers established the scene and managed traffic.", evidence: ["Police Report"] },
      { text: "Skid marks and debris field documented", time: "Feb 14 · 9:45 AM", description: "Physical evidence consistent with the plaintiff's account of the collision.", evidence: ["Scene Photos"] },
      { text: "Initial witness statements collected", time: "Feb 14 · 10:10 AM", description: "An independent witness corroborated the signal violation.", evidence: ["Witness Statement"] },
      { text: "Commercial driver cited for failure to yield", time: "Feb 14 · 11:30 AM", description: "The officer attributed primary fault to the commercial driver.", evidence: ["Citation"] },
      { text: "Police report filed", time: "Feb 15", description: "The final report was completed and filed with the fault determination.", evidence: ["Police Report"] },
    ],
    evidence: ["police_report_final.pdf", "witness_statement.pdf"],
  },
  {
    date: "Feb 20, 2026", title: "Insurance Claim Filed",
    description: "A claim was filed against the defendant's commercial liability policy and acknowledged by the carrier.",
    insight: "Confirmed coverage ensures an adequate source of recovery for the projected demand.",
    actions: [
      { text: "Claim filed against the carrier", time: "Feb 20", description: "A liability claim was submitted to the defendant's commercial carrier.", evidence: ["Claim Form"] },
      { text: "Commercial coverage confirmed active", time: "Feb 24", description: "The policy was verified active on the date of loss.", evidence: ["Insurance Policy"] },
      { text: "Carrier acknowledged the claim", time: "Mar 6", description: "The carrier opened its investigation and requested documentation.", evidence: ["Correspondence"] },
    ],
    evidence: ["insurance_policy_v2.pdf"],
  },
  {
    date: "Mar – May, 2026", title: "Case Preparation",
    description: "Medical records and supporting documentation were assembled to substantiate liability and damages.",
    insight: "A complete, verified record base underpins both causation and the damages calculation.",
    actions: [
      { text: "Medical records requested and assembled", time: "Mar 24", description: "Complete treatment records were gathered to substantiate the injuries.", evidence: ["Medical Records"] },
      { text: "Wage-loss documentation obtained", time: "Apr 10", description: "Employer verification of lost income was collected.", evidence: ["Wage Loss Statement"] },
      { text: "Evidence index compiled", time: "May 2", description: "All exhibits were organized and indexed for the demand.", evidence: ["Evidence Index"] },
      { text: "Damages computed", time: "May 28", description: "Economic and non-economic damages were calculated.", evidence: ["Damages Summary"] },
    ],
    evidence: ["hospital_medical_records.pdf", "wage_loss_statement.pdf"],
  },
  {
    date: "Jun 9 – 11, 2026", title: "Settlement Negotiation",
    description: "An attorney-ready demand package was delivered to the carrier and the matter advanced to negotiation.",
    insight: "Anchors the negotiation above the projected settlement range with documented support.",
    actions: [
      { text: "Demand letter delivered", time: "Jun 9", description: "An attorney-ready demand package was delivered to the carrier.", evidence: ["Demand Letter"] },
      { text: "Recommended settlement value asserted", time: "Jun 9", description: "The recommended value was asserted with supporting documentation.", evidence: ["Damages Summary"] },
      { text: "Negotiation opened with the carrier", time: "Jun 11", description: "Negotiations commenced toward a resolution.", evidence: ["Correspondence"] },
    ],
    evidence: ["demand_letter_draft.pdf"],
  },
];

// ── Chronology toolbar helpers ────────────────────────────────────────────────

// Event categories, keyed by title, drive the tab-aware filter dropdown.
const MEDICAL_CATEGORIES: Record<string, string> = {
  "Initial Emergency Admission": "Emergency",
  "MRI Completed": "Diagnostic",
  "Neurology Consultation": "Consultation",
  "Physical Therapy Started": "Therapy",
  "Mid-Treatment Re-Evaluation": "Evaluation",
  "Follow-Up Evaluation": "Evaluation",
};
const EVENT_CATEGORIES: Record<string, string> = {
  "Collision Occurred": "Incident",
  "Initial Emergency Response": "Medical Response",
  "Police Investigation": "Investigation",
  "Insurance Claim Filed": "Insurance",
  "Case Preparation": "Preparation",
  "Settlement Negotiation": "Negotiation",
};
const MEDICAL_FILTERS = ["Emergency", "Diagnostic", "Consultation", "Therapy", "Evaluation"];
const EVENT_FILTERS = ["Incident", "Medical Response", "Investigation", "Insurance", "Preparation", "Negotiation"];

const MONTHS_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Parse the starting month/day/year from a chronology date label. Handles single
// dates ("Feb 14, 2026") and ranges ("Feb 14 – 15, 2026", "Mar – May, 2026").
function parseChronStart(date: string): { month: number; day: number; year: number } | null {
  const mon = date.match(/([A-Z][a-z]{2,})/);
  const yr = date.match(/(\d{4})/);
  const dayMatch = date.match(/[A-Z][a-z]{2,}\s+(\d{1,2})/);
  if (!mon || !yr) return null;
  const month = MONTHS_ABBR.indexOf(mon[1].slice(0, 3));
  if (month < 0) return null;
  return { month, day: dayMatch ? parseInt(dayMatch[1], 10) : 1, year: parseInt(yr[1], 10) };
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmtShort = (d: Date) => `${MONTHS_ABBR[d.getMonth()]} ${d.getDate()}`;

// Date-picker popup for the Chronology toolbar — pick a single date or a custom
// range. Selection filters the chronology; nothing selected = show everything.
function ChronologyDatePicker({
  mode, setMode, selDate, rangeFrom, rangeTo, onPick, onClear, onDone, setRangeFrom, setRangeTo,
}: {
  mode: "single" | "range";
  setMode: (m: "single" | "range") => void;
  selDate: Date | null;
  rangeFrom: Date | null;
  rangeTo: Date | null;
  onPick: (d: Date) => void;
  onClear: () => void;
  onDone: () => void;
  setRangeFrom: (d: Date | null) => void;
  setRangeTo: (d: Date | null) => void;
}) {
  // <input type="date"> uses yyyy-mm-dd; convert to/from local Date.
  const toInput = (d: Date | null) =>
    d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "";
  const fromInput = (v: string) => {
    if (!v) return null;
    const [y, m, dd] = v.split("-").map(Number);
    return new Date(y, m - 1, dd);
  };
  // The visible month defaults to the first selection, else the chronology start (Feb 2026).
  const initial = selDate ?? rangeFrom ?? new Date(2026, 1, 1);
  const [cal, setCal] = useState<{ year: number; month: number }>({ year: initial.getFullYear(), month: initial.getMonth() });
  const shift = (delta: number) =>
    setCal((c) => {
      const m = c.month + delta;
      return { year: c.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });

  const firstWeekday = new Date(cal.year, cal.month, 1).getDay();
  const daysInMonth = new Date(cal.year, cal.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, k) => k + 1),
  ];

  const rangeEnd = rangeTo ?? rangeFrom;
  const isSelected = (d: Date) =>
    mode === "single" ? !!selDate && sameDay(d, selDate) : (!!rangeFrom && sameDay(d, rangeFrom)) || (!!rangeEnd && sameDay(d, rangeEnd));
  const inRangeMiddle = (d: Date) =>
    mode === "range" && !!rangeFrom && !!rangeTo && d.getTime() > rangeFrom.getTime() && d.getTime() < rangeTo.getTime();

  const summary =
    mode === "single"
      ? (selDate ? fmtShort(selDate) : "No date selected")
      : rangeFrom
      ? `${fmtShort(rangeFrom)}${rangeTo ? ` – ${fmtShort(rangeTo)}` : " – …"}`
      : "No range selected";

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onDone} />
      <div className="absolute left-0 mt-1.5 z-20 w-[300px] rounded-xl border border-line bg-white shadow-lg p-3">
        {/* Mode toggle — Date | Range */}
        <div className="flex items-center rounded-lg border border-line bg-white p-0.5 mb-3">
          {([{ key: "single", label: "Date" }, { key: "range", label: "Custom Range" }] as const).map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === m.key ? "bg-tint text-deep" : "text-[#5B6B78] hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Custom range — type or pick the From / To dates directly */}
        {mode === "range" && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="eyebrow mb-1 block">From</label>
              <input
                type="date"
                value={toInput(rangeFrom)}
                onChange={(e) => setRangeFrom(fromInput(e.target.value))}
                className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <div>
              <label className="eyebrow mb-1 block">To</label>
              <input
                type="date"
                value={toInput(rangeTo)}
                min={toInput(rangeFrom)}
                onChange={(e) => setRangeTo(fromInput(e.target.value))}
                className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>
        )}

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => shift(-1)} aria-label="Previous month" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#5B6B78] hover:bg-wash hover:text-ink transition-colors">
            <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <span className="card-title">{MONTHS_FULL[cal.month]} {cal.year}</span>
          <button onClick={() => shift(1)} aria-label="Next month" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#5B6B78] hover:bg-wash hover:text-ink transition-colors">
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, k) => (
            <div key={k} className="text-center eyebrow py-1">{d}</div>
          ))}
          {cells.map((day, k) => {
            if (day === null) return <div key={k} />;
            const date = new Date(cal.year, cal.month, day);
            const selected = isSelected(date);
            const middle = inRangeMiddle(date);
            return (
              <button
                key={k}
                onClick={() => onPick(date)}
                className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  selected
                    ? "bg-brand text-white"
                    : middle
                    ? "bg-tint text-deep"
                    : "text-ink hover:bg-wash"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Selection summary + actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
          <span className="secondary-text">{summary}</span>
          <div className="flex items-center gap-2">
            <button onClick={onClear} className="text-sm font-medium text-[#5B6B78] hover:text-ink transition-colors">Clear</button>
            <button onClick={onDone} className="btn btn-primary px-3 py-1.5 text-sm">Done</button>
          </div>
        </div>
      </div>
    </>
  );
}

type PanelMode = "severity" | "forensic" | "expert";

// Close (X) button shown on the revealed panel.
function PanelClose({ onClose }: { onClose?: () => void }) {
  if (!onClose) return null;
  return (
    <button onClick={onClose} title="Close" className="p-1 -mr-1 rounded-md hover:bg-white/70 transition-colors shrink-0">
      <X className="w-4 h-4 text-[#5B6B78]" strokeWidth={1.75} />
    </button>
  );
}

// 1 — Assess Severity (brand light theme)
function SeverityPanel({ onClose }: { onClose?: () => void }) {
  return (
    <div className="rounded-xl border border-[#D6F2F7] bg-[#F6FDFF] p-5">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <h4 className="card-title">Priority Assessment</h4>
          <span className="pill pill-neutral shrink-0"><AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.75} /> Moderate Priority</span>
        </div>
        <PanelClose onClose={onClose} />
      </div>
      <div className="eyebrow text-deep mb-2">Liability Priority Assessment</div>
      <p className="body-text leading-relaxed">
        Requires regulatory review. This event has moderate litigation importance and contributes supporting evidence toward liability.
      </p>
    </div>
  );
}

// 2 — Forensic Analysis (brand light theme)
function ForensicPanel({ ev, onClose }: { ev: ChronEvent; onClose?: () => void }) {
  const sections: [string, string][] = [
    ["Evidence Summary", ev.description],
    ["Medical Interpretation", "Findings are consistent with a traumatic cervical injury showing disc herniation and nerve-root involvement — a significant, objectively documented impairment."],
    ["Legal Significance", "Reinforces the negligence theory and ties the documented harm directly to the defendant's breach of duty."],
    ["Settlement Impact", "Reinforces causation and injury severity, supporting the recommended multiplier and overall settlement value."],
  ];
  return (
    <div className="rounded-xl border border-[#D6F2F7] bg-[#F6FDFF] p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-deep" strokeWidth={1.75} />
          <h4 className="card-title">Forensic Analysis</h4>
          <span className="pill pill-neutral shrink-0">AI Generated</span>
        </div>
        <PanelClose onClose={onClose} />
      </div>
      {/* AI Summary — moved off the timeline card */}
      <div className="rounded-lg border border-[#D6F2F7] bg-white p-3 mb-3">
        <div className="eyebrow text-deep mb-1">AI Summary</div>
        <p className="body-text leading-relaxed">{ev.insight}</p>
      </div>
      <div className="space-y-3">
        {sections.map(([t, b]) => (
          <div key={t}>
            <div className="eyebrow text-deep mb-1">{t}</div>
            <p className="body-text leading-relaxed">{b}</p>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1">
          <span className="eyebrow">Confidence</span>
          <span className="pill pill-complete">High (92%)</span>
        </div>
      </div>
    </div>
  );
}

// 3 — Ask Medical Expert (brand light theme)
function ExpertPanel({ onClose }: { ev?: ChronEvent; onClose?: () => void }) {
  const questions = ["Explain standard of care", "What is the medical causation?", "What future medical costs can we claim?"];
  return (
    <div className="rounded-xl border border-[#D6F2F7] bg-[#F6FDFF] p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-tint flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5 text-deep" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h4 className="card-title leading-tight">Dr. Sarah Lin, MD</h4>
            <div className="secondary-text">Forensic Medical Consultant</div>
          </div>
        </div>
        <PanelClose onClose={onClose} />
      </div>
      <p className="body-text leading-relaxed mb-3">Ask Dr. Lin about the clinical significance of this evidence.</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {questions.map((q) => (
          <button key={q} className="inline-flex items-center gap-1.5 rounded-full border border-[#D6F2F7] bg-white px-3 py-1.5 text-xs text-ink hover:bg-tint transition-colors">
            <MessageSquare className="w-3.5 h-3.5 text-deep" strokeWidth={1.75} /> {q}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          placeholder="Ask Dr. Lin about this evidence..."
          className="flex-1 bg-white border border-[#D6F2F7] rounded-lg px-3 py-2 text-sm text-ink placeholder:text-[#5B6B78] focus:outline-none focus:border-brand transition-colors"
        />
        <button className="btn btn-primary shrink-0">Consult Expert</button>
      </div>
    </div>
  );
}

// Supporting-evidence chips: one document + an aggregated "+N More".
function EvidenceChips({ evidence, onOpen, align }: { evidence: string[]; onOpen: () => void; align?: "right" }) {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${align === "right" ? "justify-end" : ""}`}>
      <button
        onClick={onOpen}
        title="Open evidence review"
        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-offwhite px-3 py-2 text-sm text-ink cursor-pointer hover:border-brand hover:bg-tint hover:shadow-sm transition-all"
      >
        <FileText className="w-4 h-4 text-deep shrink-0" strokeWidth={1.75} />
        <span className="truncate max-w-[220px]">{evidence[0]}</span>
      </button>
      {evidence.length > 1 && (
        <button
          onClick={onOpen}
          title="Open evidence review"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-offwhite px-3 py-2 text-sm font-medium text-deep cursor-pointer hover:border-brand hover:bg-tint hover:shadow-sm transition-all"
        >
          <FileText className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          +{evidence.length - 1} More
        </button>
      )}
    </div>
  );
}

export function MedicalTimelineTab({ documents, goTo }: TabProps) {
  const [subTab, setSubTab] = useState<"medical" | "event">("medical");
  // Inline accordion: only one panel open across all medical cards at a time.
  const [openPanel, setOpenPanel] = useState<{ index: number; mode: PanelMode } | null>(null);
  const togglePanel = (index: number, mode: PanelMode) =>
    setOpenPanel((p) => (p && p.index === index && p.mode === mode ? null : { index, mode }));
  // Evidence Review Workspace — opened from a card's Supporting Evidence chips.
  const [evidenceEvent, setEvidenceEvent] = useState<ChronEvent | null>(null);
  const [evidenceAI, setEvidenceAI] = useState<"actions" | "insights" | "chat" | "severity" | "forensic" | "expert" | null>(null);
  const openEvidence = (
    ev: ChronEvent,
    opts: { ai?: "actions" | "insights" | "chat" | "severity" | "forensic" | "expert" } = {},
  ) => { setEvidenceEvent(ev); setEvidenceAI(opts.ai ?? null); };

  // ── Chronology toolbar state ──
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" or a category name
  const [filterOpen, setFilterOpen] = useState(false);
  // Date filter (calendar popup): single date or a custom from–to range.
  const [calOpen, setCalOpen] = useState(false);
  const [dateMode, setDateMode] = useState<"single" | "range">("single");
  const [selDate, setSelDate] = useState<Date | null>(null);
  const [rangeFrom, setRangeFrom] = useState<Date | null>(null);
  const [rangeTo, setRangeTo] = useState<Date | null>(null);

  const clearDates = () => { setSelDate(null); setRangeFrom(null); setRangeTo(null); };
  // Click handling inside the calendar grid: single sets the date; range fills
  // from → to, then starts over on the next click.
  const pickDay = (d: Date) => {
    if (dateMode === "single") { setSelDate(d); return; }
    if (!rangeFrom || (rangeFrom && rangeTo)) { setRangeFrom(d); setRangeTo(null); return; }
    if (d.getTime() < rangeFrom.getTime()) { setRangeTo(rangeFrom); setRangeFrom(d); }
    else setRangeTo(d);
  };
  const hasDateFilter = dateMode === "single" ? !!selDate : !!rangeFrom;

  // Switching tabs resets the category + date filters (and any open dropdown).
  const selectSubTab = (key: "medical" | "event") => {
    setSubTab(key);
    setFilter("all");
    setFilterOpen(false);
    clearDates();
  };

  const categoryOf = (ev: ChronEvent) =>
    (subTab === "medical" ? MEDICAL_CATEGORIES : EVENT_CATEGORIES)[ev.title] ?? "Other";
  const filterOptions = subTab === "medical" ? MEDICAL_FILTERS : EVENT_FILTERS;
  const allLabel = subTab === "medical" ? "All Medical Events" : "All Case Events";
  const filterLabel = filter === "all" ? allLabel : filter;

  const eventDate = (ev: ChronEvent) => {
    const p = parseChronStart(ev.date);
    return p ? new Date(p.year, p.month, p.day) : null;
  };
  const matchesDate = (ev: ChronEvent) => {
    if (!hasDateFilter) return true;
    const d = eventDate(ev);
    if (!d) return false;
    if (dateMode === "single") return !!selDate && sameDay(d, selDate);
    const end = rangeTo ?? rangeFrom!;
    return d.getTime() >= rangeFrom!.getTime() && d.getTime() <= end.getTime();
  };
  const calLabel = !hasDateFilter
    ? "Calendar"
    : dateMode === "single"
    ? fmtShort(selDate!)
    : `${fmtShort(rangeFrom!)}${rangeTo ? ` – ${fmtShort(rangeTo)}` : ""}`;

  const docForFile = buildDocResolver(documents);
  const q = search.trim().toLowerCase();
  const events = (subTab === "medical" ? MEDICAL_CHRONOLOGY : EVENT_CHRONOLOGY).filter(
    (ev) =>
      (filter === "all" || categoryOf(ev) === filter) &&
      (q === "" || (ev.title + " " + ev.description).toLowerCase().includes(q)) &&
      matchesDate(ev),
  );
  const evidenceDocs = evidenceEvent ? evidenceEvent.evidence.map(docForFile) : [];

  return (
    <>
    <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
      {/* Timeline content — placed on the right, widened to fill */}
      <div className="flex-1 min-w-0 lg:order-2 rounded-2xl border border-line bg-offwhite p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="section-header" style={{ fontSize: "22px" }}>Chronology</h2>
          <p className="secondary-text mt-1 max-w-2xl">
            Review the complete sequence of medical treatment and case events generated from verified evidence.
          </p>
        </div>
        <span className="pill pill-complete shrink-0"><CheckCircle className="w-3.5 h-3.5" strokeWidth={1.75} /> Timeline Generated</span>
      </div>

      {/* Toolbar (tabs + controls) with the active date-filter chip beneath it */}
      <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left — chronology tabs */}
        <div className="flex items-center gap-2">
          {([
            { key: "medical", label: "Medical Chronology", count: MEDICAL_CHRONOLOGY.length },
            { key: "event", label: "Event Chronology", count: EVENT_CHRONOLOGY.length },
          ] as const).map((t) => {
            const active = subTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => selectSubTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  active ? "bg-tint border-brand text-deep" : "bg-white border-line text-[#5B6B78] hover:border-soft hover:text-ink"
                }`}
              >
                {t.label}
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold ${
                  active ? "bg-brand text-white" : "bg-track text-[#5B6B78]"
                }`}>{t.count}</span>
              </button>
            );
          })}
        </div>

        {/* Right — expandable search (date & event filters live in the left Filters card) */}
        <div className="flex items-center gap-2">
          {/* Expandable search — icon-only until clicked */}
          <div className={`flex items-center rounded-lg border transition-all duration-300 ease-out overflow-hidden ${
            searchOpen ? "w-[240px] border-line bg-white" : "w-9 border-transparent bg-transparent"
          }`}>
            <button
              onClick={() => (searchOpen && !search ? setSearchOpen(false) : setSearchOpen(true))}
              aria-label="Search chronology"
              className="w-9 h-9 shrink-0 flex items-center justify-center text-[#5B6B78] hover:text-ink transition-colors"
            >
              <Search className="w-4 h-4" strokeWidth={1.75} />
            </button>
            {searchOpen && (
              <>
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => { if (!search) setSearchOpen(false); }}
                  placeholder="Search chronology..."
                  className="flex-1 min-w-0 bg-transparent text-sm py-2 pr-1 placeholder:text-[#9BA8B4] focus:outline-none"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(""); setSearchOpen(false); }}
                    aria-label="Clear search"
                    className="w-8 h-9 shrink-0 flex items-center justify-center text-[#9BA8B4] hover:text-ink transition-colors"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      </div>

      {/* Active date filter — small chip below the tabs; ✕ clears it */}
      {hasDateFilter && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tint border border-[#D6F2F7] pl-3 pr-1.5 py-1 text-deep text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
            {dateMode === "single"
              ? `Showing ${fmtShort(selDate!)}`
              : `Showing ${fmtShort(rangeFrom!)}${rangeTo ? ` – ${fmtShort(rangeTo)}` : ""}`}
            <button
              onClick={clearDates}
              aria-label="Clear date filter"
              className="ml-0.5 w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#D7EEF5] transition-colors"
            >
              <X className="w-3 h-3" strokeWidth={2} />
            </button>
          </span>
          <span className="secondary-text">{events.length} {events.length === 1 ? "event" : "events"}</span>
        </div>
      )}
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <div className="text-center py-16 secondary-text">No events match the current filters.</div>
      ) : (
      <div className="relative">
        {events.map((ev, i) => {
          const isLast = i === events.length - 1;
          return (
            <div key={ev.title} className="relative flex gap-5 pb-6 last:pb-0">
              {/* Marker + connector */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-brand mt-6" />
                {!isLast && <div className="w-px flex-1 bg-line mt-1.5" />}
              </div>

              {/* Event card */}
              <div className="flex-1 min-w-0 lg-card p-6">
                {/* Top row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-1.5 mono-ref">
                    <Calendar className="w-3.5 h-3.5 text-[#5B6B78]" strokeWidth={1.75} />
                    {ev.date}{ev.time && <span className="text-[#9BA8B4]"> · {ev.time}</span>}
                  </div>
                  <span className="pill pill-complete shrink-0"><ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} /> Verified</span>
                </div>

                {/* Title */}
                <h3 className="card-title mb-2 leading-snug" style={{ fontSize: "18px" }}>{ev.title}</h3>

                {/* Description */}
                <p className="body-text leading-relaxed">{ev.description}</p>

                {/* Event Chronology — Key Actions beside Supporting Evidence (+ actions under it) */}
                {subTab === "event" && (
                  <div className="mt-4 pt-4 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                    {/* Key Actions — the 2–3 most important; full list lives in the preview */}
                    {ev.actions && ev.actions.length > 0 && (
                      <div className="rounded-xl border border-line bg-offwhite p-4">
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="eyebrow">Key Actions</div>
                          <button onClick={() => openEvidence(ev, { ai: "actions" })} className="inline-flex items-center gap-1 text-xs font-semibold text-deep hover:text-ink transition-colors shrink-0">
                            View Details <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </button>
                        </div>
                        <ul className="space-y-1.5">
                          {ev.actions.slice(0, 3).map((a) => (
                            <li key={a.text} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-deep mt-[7px] shrink-0" />
                              <span className="body-text leading-relaxed">{a.text}</span>
                            </li>
                          ))}
                        </ul>
                        {ev.actions.length > 3 && (
                          <button onClick={() => openEvidence(ev, { ai: "actions" })} className="mt-2.5 text-xs font-semibold text-deep hover:text-ink transition-colors">
                            +{ev.actions.length - 3} more actions
                          </button>
                        )}
                      </div>
                    )}

                    {/* Supporting Evidence card + actions directly under it */}
                    {ev.evidence.length > 0 && (
                      <div className="space-y-3">
                        <div className="rounded-xl border border-line bg-offwhite p-4">
                          <div className="eyebrow mb-2.5">Supporting Evidence</div>
                          <EvidenceChips evidence={ev.evidence} onOpen={() => openEvidence(ev)} />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEvidence(ev)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-tint border border-[#D6F2F7] text-deep rounded-lg text-sm font-medium hover:bg-[#D7EEF5] transition-colors"
                          >
                            <Eye className="w-4 h-4" strokeWidth={1.75} /> Preview Evidences
                          </button>
                          <button
                            onClick={() => openEvidence(ev, { ai: "insights" })}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-tint border border-[#D6F2F7] text-deep rounded-lg text-sm font-medium hover:bg-[#D7EEF5] transition-colors"
                          >
                            <Sparkles className="w-4 h-4" strokeWidth={1.75} /> Insights
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Medical Chronology — divider, then AI tool buttons (left) aligned with Supporting Evidence pills (right) */}
                {subTab === "medical" && (
                  <div className="mt-4 pt-4 border-t border-line">
                    <div className="flex items-end justify-between gap-4 flex-wrap">
                      {/* Left — AI tool buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {([
                          { mode: "severity", label: "Assess Severity", icon: AlertTriangle, accent: "#0E3A47", tint: "#E6F6FB", line: "#D6F2F7" },
                          { mode: "forensic", label: "Forensic Analysis", icon: Sparkles, accent: "#0E3A47", tint: "#E6F6FB", line: "#D6F2F7" },
                          { mode: "expert", label: "Ask Medical Expert", icon: Stethoscope, accent: "#0E3A47", tint: "#E6F6FB", line: "#D6F2F7" },
                        ] as const).map((b) => {
                          const active = openPanel?.index === i && openPanel.mode === b.mode;
                          return (
                            <button
                              key={b.mode}
                              onClick={() => togglePanel(i, b.mode)}
                              aria-expanded={active}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all whitespace-nowrap"
                              style={{ background: active ? "#D7EEF5" : "#E6F6FB", borderColor: active ? "#1E7C99" : "#D6F2F7", color: "#0E3A47" }}
                            >
                              <b.icon className="w-4 h-4" style={{ color: "#0E3A47" }} strokeWidth={1.75} /> {b.label}
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${active ? "rotate-180" : ""}`} style={{ color: "#0E3A47" }} strokeWidth={1.75} />
                            </button>
                          );
                        })}
                      </div>

                      {/* Right — Supporting Evidence label above the pills; row bottom-aligns so buttons line up with the pills */}
                      {ev.evidence.length > 0 && (
                        <div className="shrink-0">
                          <div className="eyebrow mb-2 text-right">Supporting Evidence</div>
                          <EvidenceChips evidence={ev.evidence} onOpen={() => openEvidence(ev)} align="right" />
                        </div>
                      )}
                    </div>

                    {/* Expandable panel — animates open/closed via grid-rows */}
                    <div className={`grid transition-all duration-300 ease-out ${openPanel?.index === i ? "grid-rows-[1fr] mt-4 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        {openPanel?.index === i && openPanel.mode === "severity" && <SeverityPanel onClose={() => setOpenPanel(null)} />}
                        {openPanel?.index === i && openPanel.mode === "forensic" && <ForensicPanel ev={ev} onClose={() => setOpenPanel(null)} />}
                        {openPanel?.index === i && openPanel.mode === "expert" && <ExpertPanel ev={ev} onClose={() => setOpenPanel(null)} />}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      </div>

      {/* LEFT column — Filters card (top) + Timeline Navigator (below) */}
      <div className="w-full lg:w-[300px] shrink-0 lg:order-1 lg:sticky lg:top-[176px] self-start space-y-6">

        {/* Filters — date filter + event-type filter */}
        <div className="rounded-2xl border border-line bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-deep" strokeWidth={1.75} />
            <h3 className="card-title">Filters</h3>
          </div>

          {/* Date filter — opens the date-picker popup (single date or custom range) */}
          <div>
            <div className="eyebrow mb-2">Date</div>
            <div className="relative">
              <button
                onClick={() => setCalOpen((o) => !o)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  hasDateFilter ? "border-brand bg-tint text-deep" : "border-line bg-white text-ink hover:border-soft"
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Calendar className="w-4 h-4 text-[#5B6B78] shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{calLabel}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-[#5B6B78] shrink-0 transition-transform ${calOpen ? "rotate-180" : ""}`} strokeWidth={1.75} />
              </button>
              {calOpen && (
                <ChronologyDatePicker
                  mode={dateMode}
                  setMode={(m) => { setDateMode(m); clearDates(); }}
                  selDate={selDate}
                  rangeFrom={rangeFrom}
                  rangeTo={rangeTo}
                  onPick={pickDay}
                  onClear={clearDates}
                  onDone={() => setCalOpen(false)}
                  setRangeFrom={setRangeFrom}
                  setRangeTo={setRangeTo}
                />
              )}
            </div>
            {hasDateFilter && (
              <button onClick={clearDates} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#5B6B78] hover:text-ink transition-colors">
                <X className="w-3 h-3" strokeWidth={2} /> Clear date
              </button>
            )}
          </div>

          {/* Event-type filter — dropdown; options follow the active chronology tab */}
          <div>
            <div className="eyebrow mb-2">{subTab === "medical" ? "Medical Events" : "Case Events"}</div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  filter !== "all" ? "border-brand bg-tint text-deep" : "border-line bg-white text-ink hover:border-soft"
                }`}
              >
                <span className="truncate">{filterLabel}</span>
                <ChevronDown className={`w-4 h-4 text-[#5B6B78] shrink-0 transition-transform ${filterOpen ? "rotate-180" : ""}`} strokeWidth={1.75} />
              </button>
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1.5 z-20 rounded-lg border border-line bg-white shadow-lg p-1">
                    {[{ value: "all", label: allLabel }, ...filterOptions.map((c) => ({ value: c, label: c }))].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setFilter(opt.value); setFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          filter === opt.value ? "bg-tint text-deep font-medium" : "text-ink hover:bg-wash"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Navigator */}
        <div className="rounded-2xl border border-line bg-white p-5 flex flex-col gap-2.5">
          <h3 className="card-title">Timeline Navigator</h3>
          {([
            { key: "medical", num: MEDICAL_CHRONOLOGY.length, label: "Medical Events", helper: "Verified treatment timeline" },
            { key: "event", num: EVENT_CHRONOLOGY.length, label: "Case Events", helper: "Incident & legal timeline" },
          ] as const).map((c) => {
            const active = subTab === c.key;
            return (
              <button
                key={c.key}
                onClick={() => selectSubTab(c.key)}
                className={`w-full rounded-xl border px-4 py-3 text-left cursor-pointer transition-all ${
                  active ? "border-brand bg-tint shadow-sm" : "border-line bg-offwhite hover:border-soft hover:bg-wash hover:shadow-sm"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <span className={`font-bold tabular-nums leading-none ${active ? "text-deep" : "text-ink"}`} style={{ fontSize: "22px", letterSpacing: "-0.01em", fontFamily: "var(--font-display)" }}>{c.num}</span>
                  <span className="card-title">{c.label}</span>
                </div>
                <div className="secondary-text mt-0.5">{c.helper}</div>
              </button>
            );
          })}

          <button onClick={() => goTo("economic")} className="btn btn-primary w-full gap-2 mt-1">
            Explore Damages Analysis <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>

    {/* Evidence Review Workspace — PDF viewer + AI analysis tools */}
    <EvidenceReviewModal
      open={!!evidenceEvent}
      title={evidenceEvent?.title ?? ""}
      date={evidenceEvent?.date}
      time={evidenceEvent?.time}
      insight={evidenceEvent?.insight ?? ""}
      description={evidenceEvent?.description ?? ""}
      actions={evidenceEvent?.actions}
      docs={evidenceDocs}
      initialAI={evidenceAI}
      onClose={() => setEvidenceEvent(null)}
    />
    </>
  );
}

// ── Tab 3 — Damages Analysis ──────────────────────────────────────────────────
// Explains the financial impact of the case and the evidence supporting each
// damage figure. This is NOT the Valuation page: there are no interactive
// multiplier controls and no settlement-strategy scenarios here — those live on
// the Valuation stage, which this page links out to at the bottom.

const ECONOMIC = [
  { label: "Medical Expenses", desc: "Emergency, hospital, imaging & physician bills", value: 87500, icon: Stethoscope },
  { label: "Lost Wages", desc: "Documented income loss during treatment", value: 43200, icon: DollarSign },
  { label: "Future Medical Care", desc: "Projected ongoing medical management", value: 18750, icon: HeartPulse },
  { label: "Physical Therapy", desc: "Physical therapy & rehabilitation program", value: 6000, icon: Activity },
  { label: "Transportation", desc: "Mileage & medical travel costs", value: 3850, icon: MapPin },
  { label: "Other Expenses", desc: "Assistive devices & out-of-pocket costs", value: 2150, icon: ClipboardList },
];

// Non-economic damage categories the recommended multiplier is applied to.
const DA_APPLIED_CATEGORIES = [
  "Pain & Suffering", "Emotional Distress", "Physical Impairment",
  "Loss of Quality of Life", "Cognitive Impairment", "Family Relationship Impact",
];
// Why LECO recommends the 9× multiplier.
const DA_STRATEGY_FACTORS = ["Clear Liability", "Severe Injuries", "Strong Supporting Evidence", "Favorable Jurisdiction"];

// Each verified damage category, the amount it contributes (matches the Economic
// Damages table above), and the supporting documents behind it. `docs` resolves
// to real evidence files for the shared Document Workspace; `docCount` is the
// full count of supporting documents on file.
const DAMAGE_EVIDENCE = [
  {
    category: "Medical Bills", amount: 87500, docCount: 18, primary: "Hospital_Bill.pdf",
    docs: ["hospital_medical_records.pdf", "ER_Bills.pdf", "MRI_Report_2026.pdf"],
    insight: {
      summary: "The $87,500 in medical expenses is fully substantiated. Every charge traces to an itemized billing document — emergency, hospital, imaging, and physician services — and reconciles to the verified total with no duplicate or unsupported line items.",
      keyPoints: [
        "18 itemized bills reconcile to the $87,500 total.",
        "All charges fall within the post-incident treatment window.",
        "No duplicate or out-of-scope line items detected.",
      ],
    },
  },
  {
    category: "Lost Wages", amount: 43200, docCount: 6, primary: "Wage_Loss_Statement.pdf",
    docs: ["wage_loss_statement.pdf", "physical_therapy_notes.pdf"],
    insight: {
      summary: "The $43,200 lost-wages figure reflects documented income loss during treatment, corroborated by employer payroll records and the plaintiff's pre-incident earnings history.",
      keyPoints: [
        "Wage loss verified against employer payroll records.",
        "Time out of work aligns with the treatment timeline.",
        "Calculated from pre-incident average earnings.",
      ],
    },
  },
  {
    category: "Future Medical Care", amount: 18750, docCount: 9, primary: "Life_Care_Plan.pdf",
    docs: ["hospital_medical_records.pdf", "MRI_Report_2026.pdf"],
    insight: {
      summary: "The $18,750 projection for future medical care is grounded in a physician-prepared treatment plan covering ongoing management of the cervical injuries, discounted to present value.",
      keyPoints: [
        "Based on a physician-prepared life-care projection.",
        "Covers anticipated follow-up and management costs.",
        "Discounted to present value.",
      ],
    },
  },
  {
    category: "Rehabilitation", amount: 6000, docCount: 12, primary: "PT_Treatment_Notes.pdf",
    docs: ["physical_therapy_notes.pdf"],
    insight: {
      summary: "The $6,000 rehabilitation total captures the completed physical-therapy program, supported session-by-session by the treating provider's notes.",
      keyPoints: [
        "12 documented therapy sessions support the total.",
        "Charges match the prescribed rehabilitation plan.",
        "Continuous course of care with no unexplained gaps.",
      ],
    },
  },
  {
    category: "Transportation", amount: 3850, docCount: 5, primary: "Mileage_Log.pdf",
    docs: ["ER_Bills.pdf"],
    insight: {
      summary: "The $3,850 in transportation costs reflects mileage and medical-travel expenses, each tied to a documented appointment and applied at the standard reimbursement rate.",
      keyPoints: [
        "Mileage logged against verified appointment dates.",
        "Standard medical-travel reimbursement rate applied.",
        "Every trip corresponds to a treatment record.",
      ],
    },
  },
  {
    category: "Other Damages", amount: 2150, docCount: 4, primary: "Out_of_Pocket_Receipts.pdf",
    docs: ["physical_therapy_notes.pdf"],
    insight: {
      summary: "The $2,150 in other damages covers assistive devices and out-of-pocket costs, each backed by an itemized receipt and limited to incident-related purchases.",
      keyPoints: [
        "Itemized receipts support each out-of-pocket cost.",
        "Limited to incident-related purchases.",
        "No speculative or unsupported amounts.",
      ],
    },
  },
];

export function EconomicDamagesTab({ model, documents, goTo, goToValuation }: TabProps) {
  const subtotal = ECONOMIC.reduce((s, e) => s + e.value, 0);

  // Shared Document Workspace (reused from Analysis/Overview). Each damage
  // category contributes a set of supporting documents; "View Evidence" opens
  // the existing Document Preview experience.
  const [wsOpen, setWsOpen] = useState(false);
  const [wsIndex, setWsIndex] = useState(0);
  const [wsView, setWsView] = useState<"preview" | "insights">("preview");
  const docForFile = buildDocResolver(documents);
  const evidenceDocSets = DAMAGE_EVIDENCE.map((d) => [d.primary, ...d.docs].map(docForFile));
  const evidenceContexts = DAMAGE_EVIDENCE.map((d) => ({ contextType: "Damage Category", reference: d.category }));
  // Amount-focused AI Insights — explains *why* each damage figure is what it is.
  const evidenceInsights = DAMAGE_EVIDENCE.map((d) => ({
    summary: d.insight.summary,
    keyPoints: d.insight.keyPoints,
    entities: [
      { label: "Category", value: d.category },
      { label: "Verified Amount", value: formatUSD(d.amount) },
    ],
    supportingDocs: [d.primary, ...d.docs],
    confidence: { level: "High", score: 96 },
  }));
  const openEvidence = (i: number, view: "preview" | "insights" = "preview") => { setWsIndex(i); setWsView(view); setWsOpen(true); };

  // Which evidence cards have their Evidence dropdown expanded (by index).
  const [evidenceExpand, setEvidenceExpand] = useState<Set<number>>(new Set());
  const toggleEvidenceExpand = (i: number) =>
    setEvidenceExpand((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  // Sidebar: count of verified damage-evidence documents on file.
  const evidenceDocTotal = 42;

  // Quick-action targets — each sidebar card scrolls to its section on the right.
  const damagesSummaryRef = useRef<HTMLDivElement>(null);
  const economicRef = useRef<HTMLDivElement>(null);
  const nonEconomicRef = useRef<HTMLDivElement>(null);
  const evidenceRef = useRef<HTMLDivElement>(null);
  const scrollTo = (ref: React.RefObject<HTMLDivElement>) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-20 gap-8 items-start">

      {/* LEFT — narrow, tall Quick Actions sidebar (sticky) */}
      <div className="lg:col-span-5 lg:sticky lg:top-[176px] self-start">
        <div className="lg-card p-5 flex flex-col gap-3 lg:min-h-[600px]">
          <h3 className="card-title">Quick Actions</h3>

          {/* card 1 — Damages Summary (scrolls to the summary) */}
          <button
            onClick={() => scrollTo(damagesSummaryRef)}
            className="rounded-xl border border-line bg-offwhite p-4 text-left transition-all hover:border-brand hover:bg-tint hover:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-deep shrink-0" strokeWidth={1.75} />
              <span className="card-title">Damages Summary</span>
            </div>
          </button>

          {/* card 2 — Economic Damages */}
          <button
            onClick={() => scrollTo(economicRef)}
            className="rounded-xl border border-line bg-offwhite p-4 text-left transition-all hover:border-brand hover:bg-tint hover:shadow-sm"
          >
            <div className="text-xl font-bold text-ink tabular-nums">{formatUSD(model.economicTotal)}</div>
            <div className="eyebrow mt-1">Economic Damages</div>
          </button>

          {/* card 3 — Non-Economic Damages */}
          <button
            onClick={() => scrollTo(nonEconomicRef)}
            className="rounded-xl border border-line bg-offwhite p-4 text-left transition-all hover:border-brand hover:bg-tint hover:shadow-sm"
          >
            <div className="text-xl font-bold text-ink tabular-nums">{formatUSD(model.nonEconomicTotal)}</div>
            <div className="eyebrow mt-1">Non-Economic Damages</div>
          </button>

          {/* card 4 — Damage Evidence count */}
          <button
            onClick={() => scrollTo(evidenceRef)}
            className="rounded-xl border border-line bg-offwhite p-4 text-left transition-all hover:border-brand hover:bg-tint hover:shadow-sm"
          >
            <div className="text-xl font-bold text-ink tabular-nums">{evidenceDocTotal}</div>
            <div className="eyebrow mt-1">Damage Evidence</div>
          </button>

          {/* Estimated value — emphasized, below the four cards */}
          <div className="mt-auto pt-4 border-t border-line">
            <div className="eyebrow mb-1">Estimated Value</div>
            <div className="text-2xl font-bold text-deep tabular-nums">{formatUSD(model.recommendedSettlement)}</div>
          </div>

          {/* CTA — jump to the Negligence (Non-Economic) tab */}
          <button onClick={() => goTo("noneconomic")} className="btn btn-primary w-full gap-2">
            Negligence <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* RIGHT — all sections */}
      <div className="lg:col-span-15 space-y-12">

      {/* Damages Summary — attorney-ready overview, one big card, top of page */}
      <div ref={damagesSummaryRef} className="lg-card bg-offwhite p-6 space-y-5 scroll-mt-[176px]">
        <h2 className="section-header">Damages Summary</h2>
        <div className="bg-tint border border-[#D6F2F7] rounded-xl p-5 space-y-4">
          <p className="body-text leading-relaxed">
            Verified economic damages total <strong className="font-semibold text-ink">{formatUSD(model.economicTotal)}</strong>, supported by
            medical records, billing statements, employment records, and rehabilitation documentation.
          </p>
          <p className="body-text leading-relaxed">
            Based on the severity of injuries, permanent impairment, and strong liability evidence, LECO estimates{" "}
            <strong className="font-semibold text-ink">{formatUSD(model.nonEconomicTotal)}</strong> in Non-Economic Damages using a{" "}
            <strong className="font-semibold text-ink">{model.multiplier}× multiplier</strong>.
          </p>
        </div>
        <div className="bg-ink rounded-xl px-6 py-5 flex items-center justify-between gap-4">
          <div className="eyebrow text-soft">Current Projected Settlement Impact</div>
          <div className="text-white font-bold tabular-nums shrink-0" style={{ fontSize: "30px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {formatUSD(model.recommendedSettlement)}
          </div>
        </div>
      </div>

      {/* 1 + 2 — Damage Computation (single card: Economic · Non-Economic · Total).
          Adopts the Valuation page's "Damage Computation" design, minus the
          interactive multiplier controls — those stay on the Valuation page. */}
      <div ref={economicRef} className="lg-card bg-offwhite p-6 scroll-mt-[176px]">
        <div className="flex items-center gap-2 mb-5">
          <DollarSign className="w-5 h-5 text-[#5B6B78]" strokeWidth={1.75} />
          <h2 className="section-header">Damage Computation</h2>
        </div>

        <div className="space-y-5">
          {/* Economic Damages — clean table, with a leading icon per line item */}
          <div className="border border-line rounded-xl overflow-hidden">
            <div className="bg-tint px-5 py-3 border-b border-line flex items-center justify-between gap-3">
              <h3 className="card-title">Economic Damages</h3>
              <span className="pill pill-progress shrink-0">Verified</span>
            </div>
            <div className="p-5">
              <div className="divide-y divide-line">
                {ECONOMIC.map((e) => (
                  <div key={e.label} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-tint flex items-center justify-center shrink-0">
                        <e.icon className="w-4 h-4 text-deep" strokeWidth={1.75} />
                      </div>
                      <span className="body-text truncate">{e.label}</span>
                    </div>
                    <span className="text-sm font-medium text-ink tabular-nums shrink-0">{formatUSD(e.value)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t-2 border-line flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">Economic Damages Subtotal</span>
                <span className="text-lg font-bold text-ink tabular-nums">{formatUSD(subtotal)}</span>
              </div>
            </div>
          </div>

          {/* Non-Economic Damages — read-only; multiplier controls live on Valuation */}
          <div ref={nonEconomicRef} className="border border-line rounded-xl overflow-hidden scroll-mt-[176px]">
            <div className="bg-tint px-5 py-3 border-b border-line">
              <h3 className="card-title">Non-Economic Damages</h3>
            </div>
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-tint border border-[#D6F2F7] rounded-xl p-4">
                  <div className="eyebrow mb-1">Recommended Multiplier</div>
                  <div className="text-2xl font-bold text-deep tabular-nums">{model.multiplier}×</div>
                </div>
                <div className="bg-tint border border-[#D6F2F7] rounded-xl p-4">
                  <div className="eyebrow mb-1">Estimated Non-Economic Damages</div>
                  <div className="text-2xl font-bold text-ink tabular-nums">{formatUSD(model.nonEconomicTotal)}</div>
                </div>
              </div>

              <div className="bg-[#F6FDFF] border border-[#D6F2F7] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2.5">
                  <Sparkles className="w-4 h-4 text-deep" strokeWidth={1.75} />
                  <span className="eyebrow text-deep">Recommended Valuation Strategy</span>
                </div>
                <p className="body-text">
                  LECO recommends applying a <strong className="font-semibold text-ink">{model.multiplier}× multiplier</strong> to estimate{" "}
                  <strong className="font-semibold text-ink">Non-Economic Damages</strong> based on the verified case evidence and overall case strength.
                </p>
              </div>

              <div>
                <div className="eyebrow mb-3">Applied Categories</div>
                <div className="flex flex-wrap gap-2">
                  {DA_APPLIED_CATEGORIES.map((c) => (
                    <span key={c} className="inline-flex items-center px-3 py-1.5 rounded-full bg-tint border border-[#D6F2F7] text-deep text-xs font-medium">{c}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="eyebrow mb-3">Recommendation Factors</div>
                <div className="flex flex-wrap gap-2">
                  {DA_STRATEGY_FACTORS.map((f) => (
                    <span key={f} className="pill pill-neutral"><CheckCircle className="w-4 h-4" strokeWidth={1.75} />{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Total Recommended Value — economic + non-economic */}
          <div className="bg-ink rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="eyebrow text-soft mb-1">Total Recommended Value</div>
              <div className="font-mono text-xs text-soft tabular-nums truncate">
                {formatUSD(model.economicTotal)} <span className="text-brand">+</span> {formatUSD(model.nonEconomicTotal)}
              </div>
            </div>
            <div className="text-white font-bold tabular-nums shrink-0" style={{ fontSize: "28px", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
              {formatUSD(model.recommendedSettlement)}
            </div>
          </div>
        </div>
      </div>

      {/* 3 — Verified Damage Evidence (new) — one big card; each category is a bordered tile */}
      <div ref={evidenceRef} className="lg-card bg-offwhite p-6 scroll-mt-[176px]">
        <div className="mb-5">
          <h2 className="section-header">Verified Damage Evidence</h2>
          <p className="secondary-text mt-1 max-w-2xl">How each damage amount is supported by evidence on file. Open any category to review its documents.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DAMAGE_EVIDENCE.map((d, i) => (
            <div key={d.category} className="border border-line rounded-xl bg-white p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="eyebrow mb-1.5">Category</div>
                  <div className="card-title truncate">{d.category}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="eyebrow mb-1.5">Amount</div>
                  <div className="text-lg font-bold text-ink tabular-nums">{formatUSD(d.amount)}</div>
                </div>
              </div>

              <div className="border-t border-line pt-4">
                <button
                  onClick={() => toggleEvidenceExpand(i)}
                  className="w-full flex items-center justify-between gap-2 mb-2.5 group"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-deep shrink-0" strokeWidth={1.75} />
                    <span className="text-sm font-semibold text-ink">{d.docCount} Supporting Documents</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-deep transition-transform ${evidenceExpand.has(i) ? "rotate-180" : ""}`} strokeWidth={1.75} />
                </button>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => openEvidence(i)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-offwhite px-3 py-2 text-sm text-ink cursor-pointer hover:border-brand hover:bg-tint hover:shadow-sm transition-all"
                  >
                    <FileText className="w-4 h-4 text-deep shrink-0" strokeWidth={1.75} />
                    <span className="truncate max-w-[180px]">{d.primary}</span>
                  </button>
                  {d.docCount > 1 && (
                    <button
                      onClick={() => openEvidence(i)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-offwhite px-3 py-2 text-sm font-medium text-deep cursor-pointer hover:border-brand hover:bg-tint hover:shadow-sm transition-all"
                    >
                      <FileText className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                      +{d.docCount - 1} More
                    </button>
                  )}
                </div>
                {evidenceExpand.has(i) && (
                  <div className="mt-3 rounded-lg bg-tint border border-[#D6F2F7] p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-deep shrink-0" strokeWidth={1.75} />
                      <span className="eyebrow text-deep">AI Summary</span>
                    </div>
                    <p className="secondary-text leading-relaxed">{d.insight.summary}</p>
                  </div>
                )}
              </div>

              {/* Divider above the action buttons */}
              <div className="mt-auto border-t border-line" />

              {/* Actions — Preview & Insights open the same Document Workspace
                  used by the Analysis tab's signal cards. */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEvidence(i, "preview")}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-line text-ink rounded-lg text-sm font-medium hover:bg-wash transition-colors"
                >
                  <Eye className="w-4 h-4" strokeWidth={1.75} /> Preview
                </button>
                <button
                  onClick={() => openEvidence(i, "insights")}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-line text-deep rounded-lg text-sm font-medium hover:bg-tint transition-colors"
                >
                  <Sparkles className="w-4 h-4" strokeWidth={1.75} /> Insights
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>

    {/* Shared Document Workspace — Preview / Insights for the selected category */}
    <DocumentWorkspaceModal
      docs={wsOpen ? (evidenceDocSets[wsIndex] ?? []) : null}
      noteContext={evidenceContexts[wsIndex]}
      insights={evidenceInsights[wsIndex]}
      initialView={wsView}
      position={wsIndex + 1}
      total={evidenceDocSets.length}
      onPrev={() => setWsIndex((i) => Math.max(0, i - 1))}
      onNext={() => setWsIndex((i) => Math.min(evidenceDocSets.length - 1, i + 1))}
      onClose={() => setWsOpen(false)}
      onDownload={() => {}}
    />
    </>
  );
}

// ── Tab 4 — Negligence ────────────────────────────────────────────────────────
// An attorney's negligence investigation workspace: the four legal elements,
// the negligent events (expected vs actual), the evidence proving each, the AI
// assessment, the supporting documents, and the overall liability strength.

// Section 1 — the four legal elements of negligence.
const NEGLIGENCE_PILLARS = [
  {
    no: "01", title: "Duty of Care", subtitle: "What was expected?", icon: ShieldCheck, confidence: 97,
    body: "Under Texas Nursing Standards and the facility's custodial care agreement, staff were required to administer physician-prescribed Plavix continuously, monitor neurological symptoms, and initiate emergency stroke protocols without delay.",
    insight: "Physician orders, the custodial care agreement, and Texas nursing standards together establish a clear, non-discretionary duty to medicate and monitor the resident.",
    docCount: 5,
    docs: ["Physician_Prescription_Orders.pdf", "Custodial_Care_Agreement.pdf", "Texas_Nursing_Standards.pdf"],
  },
  {
    no: "02", title: "Breach of Duty", subtitle: "What failed?", icon: AlertTriangle, confidence: 98,
    body: "The facility failed to administer prescribed medication for five consecutive days and delayed emergency stroke response, violating accepted nursing standards and physician instructions.",
    insight: "The medication record and pharmacy log show five consecutive missed Plavix doses, and the stroke-protocol checklist was never initiated — a documented departure from the required standard of care.",
    docCount: 18,
    docs: ["Medication_Administration_Record.pdf", "Pharmacy_Dispensing_Log.pdf", "Nursing_Shift_Notes.pdf", "Stroke_Protocol_Checklist.pdf"],
  },
  {
    no: "03", title: "Causation", subtitle: "How did the breach lead to the injury?", icon: Activity, confidence: 96,
    body: "The prolonged medication omission and delayed emergency response directly contributed to arterial thrombosis, irreversible neurological damage, and the plaintiff's catastrophic injuries.",
    insight: "Neurology and admission records tie the medication omission and the 2.5-hour dispatch delay directly to the ischemic stroke and its irreversible progression.",
    docCount: 9,
    docs: ["Neurology_Consultation_Report.pdf", "Hospital_Admission_Records.pdf", "EMS_Dispatch_Report.pdf"],
  },
  {
    no: "04", title: "Damages", subtitle: "What harm resulted?", icon: HeartPulse, confidence: 99,
    body: "The negligence resulted in permanent neurological impairment, loss of independence, extensive medical treatment, significant emotional suffering, and ultimately wrongful death.",
    insight: "Admission records, the neurology report, and the death certificate document permanent neurological impairment and the ultimate wrongful death resulting from the negligence.",
    docCount: 7,
    docs: ["Hospital_Admission_Records.pdf", "Neurology_Consultation_Report.pdf", "Death_Certificate.pdf"],
  },
];

// AI reasoning for why this constitutes negligence (concise).
const AI_REASONING = [
  "Duty of care clearly established.",
  "Multiple documented breaches of standard care.",
  "Direct causation linked to the stroke and death.",
  "Evidence shows deviation from medical standards.",
  "Liability strongly supported by the pattern of harm.",
];


// Circular AI-confidence indicator drawn as an SVG ring (green success stroke).
function ConfidenceRing({ value }: { value: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div className="relative w-[150px] h-[150px] shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#EAEEF2" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#3FB5D7" strokeWidth="10" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-bold text-ink tabular-nums" style={{ fontSize: "26px", letterSpacing: "-0.02em" }}>{value}%</div>
        <div className="eyebrow mt-0.5">AI Confidence</div>
      </div>
    </div>
  );
}

export function NonEconomicDamagesTab({ goTo, documents }: TabProps) {
  // Shared Document Workspace — Preview / Insights for each pillar's evidence.
  const [wsOpen, setWsOpen] = useState(false);
  const [wsIndex, setWsIndex] = useState(0);
  const [wsView, setWsView] = useState<"preview" | "insights">("preview");
  const docForFile = buildDocResolver(documents);
  const negDocSets = NEGLIGENCE_PILLARS.map((p) => p.docs.map(docForFile));
  const negContexts = NEGLIGENCE_PILLARS.map((p) => ({ contextType: "Negligence Element", reference: p.title }));
  const negInsights = NEGLIGENCE_PILLARS.map((p) => ({
    summary: p.insight,
    keyPoints: p.docs.map((d) => `${d.replace(/_/g, " ").replace(/\.pdf$/, "")} reviewed and verified.`),
    entities: [
      { label: "Element", value: p.title },
      { label: "Confidence", value: `${p.confidence}%` },
    ],
    supportingDocs: p.docs,
    confidence: { level: "High", score: p.confidence },
  }));
  const openNeg = (i: number, view: "preview" | "insights" = "preview") => { setWsIndex(i); setWsView(view); setWsOpen(true); };

  // Which pillar cards have their Supporting Documents AI summary expanded.
  const [pillarExpand, setPillarExpand] = useState<Set<number>>(new Set());
  const togglePillar = (i: number) =>
    setPillarExpand((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <>
    <div className="w-full space-y-5">

      {/* Page intro */}
      <div>
        <h1 className="page-title" style={{ fontSize: "24px" }}>Negligence Analysis</h1>
      </div>

      {/* ── Core Negligence Framework (70%) + AI Assessment (30%) side by side ── */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
      <div className="lg:col-span-7 lg:order-2 lg-card bg-offwhite p-6">
        <h2 className="section-header mb-5">Core Negligence Framework</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NEGLIGENCE_PILLARS.map((p, i) => {
            const shown = p.docs.slice(0, 1);
            const more = p.docCount - shown.length;
            return (
              <div key={p.no} className="border border-line rounded-xl bg-white p-6 flex flex-col gap-4">
                {/* Legal reasoning */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="eyebrow text-deep">Pillar {p.no}</span>
                    <div className="w-9 h-9 rounded-lg bg-tint flex items-center justify-center shrink-0">
                      <p.icon className="w-4 h-4 text-deep" strokeWidth={1.75} />
                    </div>
                  </div>
                  <h3 className="card-title" style={{ fontSize: "18px" }}>{p.title}</h3>
                  <p className="text-sm font-medium text-deep mt-0.5 mb-3">{p.subtitle}</p>
                  <p className="body-text leading-relaxed">{p.body}</p>
                </div>

                {/* Supporting documents — header dropdown reveals the AI summary */}
                <div className="border-t border-line pt-4">
                  <button onClick={() => togglePillar(i)} className="w-full flex items-center justify-between gap-2 mb-2.5 group">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-deep shrink-0" strokeWidth={1.75} />
                      <span className="text-sm font-semibold text-ink">{p.docCount} Supporting Documents</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-deep transition-transform ${pillarExpand.has(i) ? "rotate-180" : ""}`} strokeWidth={1.75} />
                  </button>
                  <div className="flex items-center gap-2 flex-wrap">
                    {shown.map((d) => (
                      <button
                        key={d}
                        onClick={() => openNeg(i, "preview")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-offwhite px-2.5 py-1.5 text-xs text-ink cursor-pointer hover:border-brand hover:bg-tint hover:shadow-sm transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-deep shrink-0" strokeWidth={1.75} />
                        <span className="truncate max-w-[150px]">{d}</span>
                      </button>
                    ))}
                    {more > 0 && (
                      <button
                        onClick={() => openNeg(i, "preview")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-offwhite px-2.5 py-1.5 text-xs font-medium text-deep cursor-pointer hover:border-brand hover:bg-tint hover:shadow-sm transition-all"
                      >
                        +{more} more
                      </button>
                    )}
                  </div>
                  {pillarExpand.has(i) && (
                    <div className="mt-3 rounded-lg bg-tint border border-[#D6F2F7] p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-deep shrink-0" strokeWidth={1.75} />
                        <span className="eyebrow text-deep">AI Summary</span>
                      </div>
                      <p className="secondary-text leading-relaxed">{p.insight}</p>
                    </div>
                  )}
                </div>

                {/* Actions — Preview / Insights open the shared Document Workspace */}
                <div className="mt-auto border-t border-line" />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openNeg(i, "preview")}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-line text-ink rounded-lg text-sm font-medium hover:bg-wash transition-colors"
                  >
                    <Eye className="w-4 h-4" strokeWidth={1.75} /> Preview Evidence
                  </button>
                  <button
                    onClick={() => openNeg(i, "insights")}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-line text-deep rounded-lg text-sm font-medium hover:bg-tint transition-colors"
                  >
                    <Sparkles className="w-4 h-4" strokeWidth={1.75} /> View Insights
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI assessment card (30%) — placed directly on the left, sticky, no section title */}
      <div className="lg:col-span-3 lg:order-1 lg:sticky lg:top-[176px] self-start lg-card p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-deep" strokeWidth={1.75} />
          <h3 className="card-title" style={{ fontSize: "18px" }}>Why This Constitutes Negligence</h3>
        </div>
        <div className="flex flex-col items-center gap-5">
          <ConfidenceRing value={98.4} />
          <ul className="space-y-2.5 w-full">
            {AI_REASONING.map((r) => (
              <li key={r} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-deep mt-0.5 shrink-0" strokeWidth={1.75} />
                <span className="body-text leading-snug">{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => goTo("liability")} className="btn btn-primary w-full gap-2 mt-6">
          Proceed to Violations <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>
      </div>
    </div>

    {/* Shared Document Workspace — Preview / Insights for the selected pillar's evidence */}
    <DocumentWorkspaceModal
      docs={wsOpen ? (negDocSets[wsIndex] ?? []) : null}
      noteContext={negContexts[wsIndex]}
      insights={negInsights[wsIndex]}
      initialView={wsView}
      position={wsIndex + 1}
      total={negDocSets.length}
      onPrev={() => setWsIndex((i) => Math.max(0, i - 1))}
      onNext={() => setWsIndex((i) => Math.min(negDocSets.length - 1, i + 1))}
      onClose={() => setWsOpen(false)}
      onDownload={() => {}}
    />
    </>
  );
}

// ── Tab 5 — Liability Analysis ────────────────────────────────────────────────

const VIOLATIONS = ["Failure to Yield Right-of-Way", "Red-Light Signal Violation", "Excessive Speed", "Commercial Carrier Negligence"];

export function LiabilityAnalysisTab({ findings }: TabProps) {
  const liability = findings.filter((f) => f.kind === "liability");
  const avgConfidence = liability.length ? Math.round(liability.reduce((s, f) => s + f.confidence, 0) / liability.length) : 0;
  return (
    <div className="max-w-4xl space-y-8">
      <Section title="Liability Analysis" description="Why the defendant is liable, with each conclusion tied to verified evidence.">
        <div className="lg-card p-6">
          <h3 className="card-title mb-2">Liability Summary</h3>
          <p className="body-text leading-relaxed">
            Liability rests firmly with the defendant. The responding officer attributed primary fault for failure to yield, the
            commercial vehicle entered the intersection against a red signal, and reconstruction places its speed above the posted
            limit at impact. Independent scene evidence corroborates the plaintiff's account, and confirmed commercial coverage ensures
            an adequate source of recovery.
          </p>
        </div>

        {/* Liability Strength */}
        <div className="lg-card p-6">
          <div className="flex items-end justify-between mb-3">
            <h3 className="card-title">Liability Strength</h3>
            <span className="pill pill-complete"><ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} /> Strong</span>
          </div>
          <div className="lg-progress mb-2"><span style={{ width: `${avgConfidence}%` }} /></div>
          <div className="secondary-text">{avgConfidence}% average confidence across {liability.length} verified liability signals</div>
        </div>
      </Section>

      <Section title="Verified Liability Signals">
        <div className="space-y-4">
          {liability.map((f) => (
            <div key={f.tag} className="lg-card p-6">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="eyebrow text-deep">{f.tag}</span>
                <span className="pill pill-neutral shrink-0">{f.confidence}% confidence</span>
              </div>
              <h4 className="card-title mb-1">{f.title}</h4>
              <p className="body-text leading-relaxed mb-3">{f.description}</p>
              <p className="text-sm text-deep font-medium mb-4">{f.conclusion}</p>
              {f.evidence.length > 0 && (
                <div className="space-y-2 border-t border-line pt-4">
                  <div className="eyebrow mb-1">Supporting Evidence</div>
                  {f.evidence.map((ev, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-lg bg-offwhite border border-line px-3.5 py-2.5">
                      <Quote className="w-3.5 h-3.5 text-deep mt-0.5 shrink-0" strokeWidth={1.75} />
                      <div className="min-w-0">
                        <p className="text-sm text-ink leading-relaxed">“{ev.quote}”</p>
                        <p className="mono-ref mt-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" strokeWidth={1.75} />{ev.file}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Applicable Violations">
        <div className="flex flex-wrap gap-2">
          {VIOLATIONS.map((v) => (
            <span key={v} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink">
              <Gavel className="w-4 h-4 text-deep" strokeWidth={1.75} />{v}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ── Tab 6 — Evidence Repository ───────────────────────────────────────────────

const EVIDENCE_GROUPS: { name: string; icon: any; match: RegExp }[] = [
  { name: "Medical Records", icon: Stethoscope, match: /(mri|er_|hospital|medical|therapy|treatment|discharge|physical|radiology|bills)/ },
  { name: "Police Reports", icon: FileText, match: /(police|accident|incident|citation|crash|report)/ },
  { name: "Witness Statements", icon: MessageSquare, match: /(witness|statement)/ },
  { name: "Insurance & Financial", icon: DollarSign, match: /(insurance|policy|wage|loss|claim)/ },
  { name: "Photos", icon: ImageIcon, match: /\.(jpg|jpeg|png|gif|webp)$|photo|image|scene/ },
  { name: "Videos", icon: Video, match: /\.(mp4|mov|avi|webm)$|video|dashcam/ },
];

export function EvidenceRepositoryTab({ documents }: TabProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const q = search.trim().toLowerCase();
  const classify = (name: string) => EVIDENCE_GROUPS.find((g) => g.match.test(name.toLowerCase()))?.name ?? "Other Documents";

  const visible = documents.filter((d) => (!q || d.name.toLowerCase().includes(q)) && (filter === "All" || classify(d.name) === filter));
  const groupNames = [...EVIDENCE_GROUPS.map((g) => g.name), "Other Documents"];
  const grouped = groupNames
    .map((name) => ({ name, icon: EVIDENCE_GROUPS.find((g) => g.name === name)?.icon ?? FileText, docs: visible.filter((d) => classify(d.name) === name) }))
    .filter((g) => g.docs.length > 0);

  return (
    <div className="max-w-4xl space-y-6">
      <Section title="Evidence Repository" description="Every verified document supporting the case, organized by type. Preview, inspect insights, or download.">
        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6B78]" strokeWidth={1.75} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
              className="w-full bg-white border border-line rounded-lg pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-[#5B6B78] focus:outline-none focus:border-brand transition-colors"
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand transition-colors">
            <option value="All">All Types</option>
            {groupNames.map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>

        {grouped.length === 0 ? (
          <div className="lg-card flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-8 h-8 text-soft mb-3" strokeWidth={1.75} />
            <p className="text-sm font-medium text-ink">No documents match</p>
            <p className="secondary-text mt-1">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map((g) => (
              <div key={g.name}>
                <div className="flex items-center gap-2 mb-3">
                  <g.icon className="w-4 h-4 text-deep" strokeWidth={1.75} />
                  <h3 className="card-title">{g.name}</h3>
                  <span className="pill pill-neutral">{g.docs.length}</span>
                </div>
                <div className="lg-card divide-y divide-line">
                  {g.docs.map((d) => (
                    <div key={d.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="w-9 h-9 rounded-lg bg-tint flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-deep" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-ink truncate">{d.name}</div>
                        <div className="mono-ref">{d.source} · {d.date}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button title="Preview" className="p-2 rounded-lg text-[#5B6B78] hover:text-deep hover:bg-tint transition-colors"><Eye className="w-4 h-4" strokeWidth={1.75} /></button>
                        <button title="Insights" className="p-2 rounded-lg text-[#5B6B78] hover:text-deep hover:bg-tint transition-colors"><Lightbulb className="w-4 h-4" strokeWidth={1.75} /></button>
                        <button title="Download" className="p-2 rounded-lg text-[#5B6B78] hover:text-deep hover:bg-tint transition-colors"><Download className="w-4 h-4" strokeWidth={1.75} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

// ── Tab 7 — Demand Package ────────────────────────────────────────────────────

const DEMAND_SECTIONS = [
  { title: "Demand Letter", desc: "Attorney-ready narrative letter asserting liability and demand.", icon: FileSignature },
  { title: "Medical Chronology", desc: "Complete treatment timeline from incident through present.", icon: HeartPulse },
  { title: "Damages Summary", desc: "Economic and non-economic damages with supporting figures.", icon: DollarSign },
  { title: "Liability Summary", desc: "Negligence findings and the basis for defendant fault.", icon: Scale },
  { title: "Evidence Index", desc: "Indexed map of every exhibit referenced in the demand.", icon: FileText },
  { title: "Supporting Exhibits", desc: "Compiled records, reports, and imaging as labeled exhibits.", icon: ClipboardList },
];

export function DemandPackageTab({ model }: TabProps) {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="lg-card p-6 flex items-center justify-between gap-6">
        <div>
          <h2 className="section-header mb-1">Demand Package</h2>
          <p className="secondary-text max-w-xl">An assembled, attorney-ready package for {model.caseName}. Review each component, then export the complete demand.</p>
        </div>
        <button className="btn btn-primary gap-2 shrink-0"><Download className="w-4 h-4" strokeWidth={1.75} /> Export PDF</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DEMAND_SECTIONS.map((s) => (
          <div key={s.title} className="lg-card lg-card-i p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-tint flex items-center justify-center"><s.icon className="w-4 h-4 text-deep" strokeWidth={1.75} /></div>
              <span className="pill pill-complete"><CheckCircle className="w-3.5 h-3.5" strokeWidth={1.75} /> Ready</span>
            </div>
            <h3 className="card-title mb-1">{s.title}</h3>
            <p className="secondary-text leading-relaxed flex-1">{s.desc}</p>
            <button className="mt-4 pt-3 border-t border-line flex items-center gap-1 text-xs font-medium text-deep hover:text-ink transition-colors self-start">
              Preview <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab 8 — Negotiation ───────────────────────────────────────────────────────

const STRATEGY_POINTS = [
  "Open with the full demand to anchor the negotiation above the projected settlement range.",
  "Lead with objective liability evidence — officer fault determination and red-light violation — to limit comparative-fault arguments.",
  "Hold firm on documented economic damages; treat the non-economic multiplier as the primary negotiable lever.",
  "Reference confirmed policy limits to keep the conversation anchored to an adequate source of recovery.",
];

const COUNTER_OFFERS = [
  { round: "Initial Demand", party: "Plaintiff", amount: 1850000, date: "Jun 12, 2026", status: "Sent" },
  { round: "Carrier Response", party: "Defendant", amount: 720000, date: "Jun 18, 2026", status: "Received" },
  { round: "Counter", party: "Plaintiff", amount: 1650000, date: "Jun 22, 2026", status: "Sent" },
];

const SETTLEMENT_HISTORY = [
  { date: "Jun 12, 2026", event: "Demand package delivered to carrier." },
  { date: "Jun 18, 2026", event: "Carrier responded below the projected range." },
  { date: "Jun 22, 2026", event: "Plaintiff counter issued near recommended value." },
];

export function NegotiationTab({ model }: TabProps) {
  const [notes, setNotes] = useState("");
  return (
    <div className="max-w-4xl space-y-8">
      <Section title="Negotiation" description="Settlement preparation — strategy, offers, and history in one place.">
        {/* Settlement Recommendation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="lg-card p-5">
            <div className="eyebrow mb-1">Recommended Settlement</div>
            <div className="text-2xl font-bold text-ink tabular-nums">{formatUSD(model.recommendedSettlement)}</div>
          </div>
          <div className="lg-card p-5">
            <div className="eyebrow mb-1">Settlement Range</div>
            <div className="text-2xl font-bold text-deep tabular-nums">{formatCompact(model.estimatedLow)} – {formatCompact(model.estimatedHigh)}</div>
          </div>
          <div className="lg-card p-5">
            <div className="eyebrow mb-1">Confidence</div>
            <div className="text-2xl font-bold text-deep tabular-nums">{model.confidence}%</div>
          </div>
        </div>
      </Section>

      <Section title="Negotiation Strategy">
        <div className="lg-card p-6">
          <ul className="space-y-3">
            {STRATEGY_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-deep mt-0.5 shrink-0" strokeWidth={1.75} />
                <span className="body-text leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Counter Offers">
        <div className="lg-card divide-y divide-line">
          {COUNTER_OFFERS.map((o, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink">{o.round}</div>
                <div className="mono-ref">{o.party} · {o.date}</div>
              </div>
              <span className={`pill ${o.party === "Plaintiff" ? "pill-neutral" : "pill-progress"} shrink-0`}>{o.status}</span>
              <div className="text-sm font-semibold text-ink tabular-nums w-28 text-right shrink-0">{formatUSD(o.amount)}</div>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Section title="Negotiation Notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Capture negotiation notes, carrier positions, and next steps…"
            rows={6}
            className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder:text-[#5B6B78] focus:outline-none focus:border-brand resize-none transition-colors"
          />
        </Section>

        <Section title="Settlement History">
          <div className="relative pl-6 space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-line">
            {SETTLEMENT_HISTORY.map((h, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-brand" />
                <div className="mono-ref mb-0.5">{h.date}</div>
                <div className="body-text">{h.event}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Final Recommended Offer */}
      <div className="bg-ink rounded-xl px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <div className="eyebrow text-soft mb-1">Final Recommended Offer</div>
          <div className="secondary-text text-soft">Target settlement aligned to the recommended case value</div>
        </div>
        <div className="text-white font-bold tabular-nums shrink-0" style={{ fontSize: "30px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          {formatUSD(model.recommendedSettlement)}
        </div>
      </div>
    </div>
  );
}
