import { useState } from "react";
import { StageNavigator } from "../components/StageNavigator";
import {
  ChevronLeft, CheckCircle, ChevronDown, ChevronRight,
  FileText, ExternalLink, AlertTriangle, Lock, Car,
  ClipboardList, Brain, BarChart2, Map, Globe,
  ArrowRight, Flag, Circle
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  PipelineState, AttorneyNote,
  classifyDocuments, generateAnalysisFindings, computeChecklist
} from "../types/case";

interface CaseReadyPageProps {
  caseData?: {
    caseName: string;
    caseId: string;
    plaintiff: string;
    summary: string;
    jurisdiction?: string;
  };
  pipeline?: PipelineState;
  onPipelineUpdate?: (updates: Partial<PipelineState>) => void;
  onStageClick?: (stageName: string) => void;
  onBackToIntake?: () => void;
}

const CHECKLIST_DETAILS: Record<string, string> = {
  "Medical records collected": "Documents have been collected from the plaintiff and attorney sources.",
  "Documents classified": "All documents have been categorized across Liability, Medical, and Insurance categories.",
  "Missing records audited": "Evidence gaps discovered and follow-up requests have been issued.",
  "Key entities extracted": "Witnesses, medical providers, and treatment dates extracted and verified.",
  "Medical chronology generated": "Complete treatment timeline generated from available evidence.",
  "Valuation completed": "Total recommended case value computed with multiplier scenarios.",
  "Case workspace generated": "All exhibits, chronologies, and demand parameters are staged for attorney review.",
};

const deliverables = [
  {
    title: "Medical Chronology",
    category: "Medical",
    description: "Complete treatment timeline from incident through present.",
    date: "Jun 9, 2026",
    icon: ClipboardList,
    color: "bg-purple-50 text-purple-700",
  },
  {
    title: "Evidence Structure",
    category: "Liability",
    description: "Organized exhibit map across all verified documents.",
    date: "Jun 9, 2026",
    icon: FileText,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Case Summary",
    category: "Overview",
    description: "Attorney-ready narrative summarizing liability and injury findings.",
    date: "Jun 9, 2026",
    icon: Brain,
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Valuation Analysis",
    category: "Damages",
    description: "Full damage computation with multiplier scenarios.",
    date: "Jun 9, 2026",
    icon: BarChart2,
    color: "bg-green-50 text-green-700",
  },
  {
    title: "Knowledge Graph",
    category: "Intelligence",
    description: "Entity relationship map across parties, providers, and documents.",
    date: "Jun 9, 2026",
    icon: Map,
    color: "bg-orange-50 text-orange-700",
  },
  {
    title: "Jurisdiction Profile",
    category: "Legal",
    description: "Cook County venue rules, caps, and precedent summary.",
    date: "Jun 9, 2026",
    icon: Globe,
    color: "bg-gray-100 text-gray-700",
  },
];

const noteCategories = ["Liability", "Medical", "Damages", "Strategy", "General"];
const priorities = ["Low", "Medium", "High"];

export function CaseReadyPage({ caseData, pipeline, onPipelineUpdate, onStageClick, onBackToIntake }: CaseReadyPageProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [noteCategory, setNoteCategory] = useState("General");
  const [notePriority, setNotePriority] = useState("Medium");
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  // Derive checklist from pipeline state
  const categories = pipeline ? classifyDocuments(pipeline.documents) : [];
  const findings = pipeline ? generateAnalysisFindings(categories) : [];
  const checklistMap = pipeline ? computeChecklist(pipeline, categories, findings) : {};
  const checklistItems = Object.entries(checklistMap).map(([label, complete]) => ({
    id: label.replace(/\s+/g, "-").toLowerCase(),
    label,
    detail: CHECKLIST_DETAILS[label] ?? label,
    complete,
  }));
  const completedCount = checklistItems.filter((i) => i.complete).length;
  const allComplete = completedCount === checklistItems.length && checklistItems.length > 0;

  // Notes from pipeline
  const savedNotes: AttorneyNote[] = pipeline?.notes ?? [];

  const defaultCaseData = {
    caseName: "Estate of Miller vs Logistics Co.",
    caseId: "PI-2024-001",
    plaintiff: "Evelyn Miller",
    summary: "Motor vehicle accident resulting in cervical disc herniation and ongoing physical therapy.",
    jurisdiction: "Cook County, IL",
  };

  const data = { ...defaultCaseData, ...caseData };

  const handleSaveNote = () => {
    if (!noteText.trim() || !onPipelineUpdate || !pipeline) return;
    const newNote: AttorneyNote = {
      id: Date.now().toString(),
      text: noteText,
      category: noteCategory,
      priority: notePriority,
      date: "Jun 9, 2026",
    };
    onPipelineUpdate({ notes: [newNote, ...pipeline.notes] });
    setNoteText("");
  };

  const priorityColor: Record<string, string> = {
    Low: "bg-gray-100 text-gray-600",
    Medium: "bg-amber-50 text-amber-700",
    High: "bg-red-50 text-red-700",
  };

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

      <StageNavigator currentStage="Case Ready" onStageClick={onStageClick} />

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

        {/* ── 1. CASE READY HEADER ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-8">
            {/* Left */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-lg text-xs font-semibold text-green-700 mb-4">
                <CheckCircle className="w-3.5 h-3.5" />
                PROCESSING COMPLETE
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Case Ready For Review</h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
                All intake, classification, analysis, and valuation workflows have been completed for this case. Review generated outputs before continuing to the Case Workspace.
              </p>
            </div>

            {/* Right — Claim Intent card */}
            <div className="shrink-0 w-64">
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-3">
                  <Lock className="w-3 h-3" />
                  HIPAA SECURED
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Car className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim Intent</span>
                </div>
                <div className="text-base font-bold text-gray-900 mb-1">Motor Vehicle Accident</div>
                <div className="text-xs text-gray-400">Ref ID: Case-94101</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. CASE INTELLIGENCE SNAPSHOT ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Case Intelligence Snapshot</h2>
          <div className="grid grid-cols-4 gap-4">
            {/* Confidence Score */}
            <div className="border border-gray-100 rounded-xl p-5 flex flex-col">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Confidence Score</div>
              <div className="text-4xl font-bold text-gray-900 mb-3">94%</div>
              <div className="mt-auto">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                  <CheckCircle className="w-3 h-3" /> High Confidence
                </span>
              </div>
            </div>

            {/* Estimated Range */}
            <div className="border border-gray-100 rounded-xl p-5 flex flex-col">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Estimated Range</div>
              <div className="text-2xl font-bold text-gray-900 mb-1 leading-tight">$968K</div>
              <div className="text-sm text-gray-400 mb-3">– $1,372K</div>
              <div className="mt-auto">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-50 text-cyan-700 text-xs font-medium rounded-full">
                  <BarChart2 className="w-3 h-3" /> Settlement Range
                </span>
              </div>
            </div>

            {/* Missing Documents */}
            <div className="border border-gray-100 rounded-xl p-5 flex flex-col">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Missing Documents</div>
              <div className="text-4xl font-bold text-gray-900 mb-3">3</div>
              <div className="mt-auto">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">
                  <AlertTriangle className="w-3 h-3" /> Follow-up Sent
                </span>
              </div>
            </div>

            {/* Critical Risks */}
            <div className="border border-gray-100 rounded-xl p-5 flex flex-col">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Critical Risks</div>
              <div className="text-4xl font-bold text-gray-900 mb-3">2</div>
              <div className="mt-auto">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                  <Flag className="w-3 h-3" /> Review Required
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. CHECKLIST + DELIVERABLES ── */}
        <div className="grid grid-cols-5 gap-6 items-start">

          {/* LEFT — Checklist (40%) */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Case Readiness Checklist</h2>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-50 border border-cyan-100 px-2.5 py-1 rounded-full">
                {completedCount} / {checklistItems.length} COMPLETE
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {checklistItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {item.complete
                        ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        : <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                      }
                      <span className={`text-sm ${item.complete ? "text-gray-900" : "text-gray-400"}`}>{item.label}</span>
                    </div>
                    {expandedItem === item.id
                      ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                    }
                  </button>
                  {expandedItem === item.id && (
                    <div className="px-6 pb-4">
                      <p className="text-xs text-gray-500 leading-relaxed pl-7">{item.detail}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Completion Progress</span>
                <span className="font-semibold text-gray-900">
                  {checklistItems.length > 0 ? Math.round((completedCount / checklistItems.length) * 100) : 0}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: checklistItems.length > 0 ? `${(completedCount / checklistItems.length) * 100}%` : "0%" }}
                />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {allComplete
                  ? <><CheckCircle className="w-3.5 h-3.5 text-green-500" /><span className="text-xs font-medium text-green-700">Ready For Attorney Review</span></>
                  : <span className="text-xs font-medium text-gray-400">Complete earlier stages to proceed</span>
                }
              </div>
            </div>
          </div>

          {/* RIGHT — Generated Deliverables (60%) */}
          <div className="col-span-3 bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Generated Deliverables</h2>
              <span className="text-xs text-gray-500">6 documents ready</span>
            </div>

            <div className="p-5 grid grid-cols-2 gap-4">
              {deliverables.map((item) => (
                <div key={item.title} className="border border-gray-200 rounded-xl p-4 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${item.color}`}>
                      <item.icon className="w-3 h-3" />
                      {item.category}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{item.date}</span>
                    <button className="flex items-center gap-1 text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors">
                      Open <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. ATTORNEY NOTES ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Attorney Notes</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-full">
              <Lock className="w-3 h-3" />
              STRICT WORK PRODUCT PRIVILEGE
            </span>
          </div>

          <div className="grid grid-cols-5 gap-0 divide-x divide-gray-100">
            {/* LEFT — Write note (40%) */}
            <div className="col-span-2 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Write New Private Note</h3>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a private attorney note for this case..."
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 resize-none transition-colors"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Category Tag</label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-cyan-400 bg-white"
                  >
                    {noteCategories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Priority Level</label>
                  <select
                    value={notePriority}
                    onChange={(e) => setNotePriority(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-cyan-400 bg-white"
                  >
                    {priorities.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <Button
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Private Note
              </Button>
            </div>

            {/* RIGHT — Notes feed (60%) */}
            <div className="col-span-3 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Chronological Notes Feed</h3>

              {savedNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-52 text-center">
                  <ClipboardList className="w-8 h-8 text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400">No notes yet.</p>
                  <p className="text-xs text-gray-300 mt-1">Notes saved here are strictly work product privileged.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedNotes.map((note, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColor[note.priority]}`}>
                          {note.priority}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{note.category}</span>
                        <div className="ml-auto flex items-center gap-3">
                          <span className="text-xs text-gray-300">{note.date}</span>
                          {editingNoteIndex === i ? (
                            <>
                              <button
                                onClick={() => {
                                  if (!onPipelineUpdate || !pipeline) return;
                                  const updated = pipeline.notes.map((n, idx) =>
                                    idx === i ? { ...n, text: editingNoteText } : n
                                  );
                                  onPipelineUpdate({ notes: updated });
                                  setEditingNoteIndex(null);
                                }}
                                className="text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingNoteIndex(null)}
                                className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingNoteIndex(i);
                                setEditingNoteText(note.text);
                              }}
                              className="text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                      {editingNoteIndex === i ? (
                        <textarea
                          value={editingNoteText}
                          onChange={(e) => setEditingNoteText(e.target.value)}
                          autoFocus
                          rows={3}
                          className="w-full border border-cyan-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none resize-none"
                        />
                      ) : (
                        <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 5. READY TO PROCEED ── */}
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between gap-8">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Ready to Proceed?</h3>
            <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
              Opening the primary Case Workspace consolidates all evidence exhibits, timeline chronologies, draft demands, and litigation parameters for secure court compilation.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
              View Intake Report
            </Button>
            <Button
              disabled={!allComplete}
              className="bg-cyan-500 hover:bg-cyan-600 text-white border-0 gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Open Case Workspace
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
