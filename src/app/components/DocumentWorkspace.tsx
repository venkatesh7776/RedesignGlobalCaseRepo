import React, { useState, useEffect } from "react";
import {
  Eye, Sparkles, Download, FileText, ListChecks, Info, CheckCircle,
  Bot, Send, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X,
} from "lucide-react";
import { useNotes } from "../notes/NotesContext";
import { getDocumentContent, type DocBlock } from "./documentText";

/* ────────────────────────────────────────────────────────────────────────────
   Standardized document actions.
   Pattern: Preview | Insights | Download. Preview & Insights both open the same
   unified Document Workspace; Download is a direct action.
   ──────────────────────────────────────────────────────────────────────────── */

export function DocActions({
  onPreview,
  onInsights,
  onDownload,
  size = "md",
}: {
  onPreview?: () => void;
  onInsights?: () => void;
  onDownload?: () => void;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "p-1.5" : "p-2";
  const icon = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const base = `${pad} rounded-lg transition-colors`;
  const labelPad = size === "sm" ? "px-2.5 py-1.5" : "px-3.5 py-2";
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        title="Preview"
        onClick={(e) => { e.stopPropagation(); onPreview?.(); }}
        className={`${labelPad} bg-white border border-line text-ink rounded-lg text-sm font-medium hover:bg-wash transition-colors flex items-center gap-1.5`}
      >
        <Eye className={icon} strokeWidth={1.75} /> Preview
      </button>
      <button
        type="button"
        title="Insights"
        onClick={(e) => { e.stopPropagation(); onInsights?.(); }}
        className={`${labelPad} bg-white border border-line text-deep rounded-lg text-sm font-medium hover:bg-tint transition-colors flex items-center gap-1.5`}
      >
        <Sparkles className={icon} strokeWidth={1.75} /> Insights
      </button>
      <button
        type="button"
        title="Download"
        aria-label="Download"
        onClick={(e) => { e.stopPropagation(); onDownload?.(); }}
        className={`${base} text-ink hover:bg-tint`}
      >
        <Download className={icon} strokeWidth={1.75} />
      </button>
    </div>
  );
}

// Simulated document intelligence — in production this reflects real extraction.
// Insights are computed across ALL supporting documents in the set, not just one.
function buildDocInsights(docs: any[]) {
  const primary = docs[0] ?? {};
  return {
    summary: "Spinal MRI confirms a herniated L4-L5 disc consistent with the claimed injury.",
    keyPoints: [
      "Objective injury finding supports causation.",
      "Treatment dates fall within the injury window.",
      "$18,450 in billing usable for damages.",
    ],
    entities: [
      { label: "Provider", value: "St. Mary's Medical" },
      { label: "Date", value: primary?.date ?? "Jun 1, 2026" },
    ],
    supportingDocs: docs.map((d) => d.name),
    confidence: { level: "High", score: 92 },
  };
}

function InsightBlock({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-deep" strokeWidth={1.75} />
        <span className="text-xs font-semibold uppercase tracking-wide text-[#5B6B78]">{title}</span>
      </div>
      {children}
    </div>
  );
}

/* The AI Intelligence panel that fills the right 40% of the Document Workspace.
   Default = AI Insights. "Chat With AI" transforms this same panel into a chat
   interface in place — the PDF viewer on the left stays visible throughout.
   When `onBackToPreview` is provided, a back control returns to the document-only
   Preview layout (80% viewer / 20% action rail). */
function AiIntelligencePanel({ docs, onDownload, startInChat = false, onBackToPreview }: { docs: any[]; onDownload?: () => void; startInChat?: boolean; onBackToPreview?: () => void }) {
  const [chatOpen, setChatOpen] = useState(startInChat);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const insights = buildDocInsights(docs);
  const subjectLabel = docs.length > 1 ? `${docs.length} supporting documents` : (docs[0]?.name ?? "document");

  const send = (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: msg },
      { role: "assistant", content: "Based on this document, here is a simulated LECO analysis response. In production this would reflect the actual document content." },
    ]);
    setInput("");
  };

  if (chatOpen) {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-tint flex items-center justify-center">
              <Bot className="w-4 h-4 text-deep" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-sm font-semibold text-ink leading-tight">AI Assistant</div>
              <div className="text-xs text-[#5B6B78] font-mono truncate max-w-[180px]">{subjectLabel}</div>
            </div>
          </div>
          <button onClick={() => setChatOpen(false)} className="flex items-center gap-1 text-xs font-medium text-deep hover:text-ink transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.75} /> Insights
          </button>
        </div>

        {/* Conversation history */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-[#5B6B78] mb-3">Try asking:</p>
              {["Summarize this document", "What injuries are mentioned?", "Create a treatment timeline", "Does this support liability?", "Identify key findings"].map((p) => (
                <button key={p} onClick={() => send(p)} className="w-full text-left text-xs text-ink bg-wash hover:bg-tint hover:text-deep border border-line hover:border-soft rounded-lg px-3 py-2.5 transition-colors">
                  {p}
                </button>
              ))}
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "bg-brand text-white" : "bg-track text-ink"}`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message input + send */}
        <div className="border-t border-line p-4 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything about this document..."
              autoFocus
              className="flex-1 bg-wash border border-line rounded-lg px-3 py-2 text-sm placeholder:text-[#5B6B78] focus:outline-none focus:border-brand transition-colors"
            />
            <button onClick={() => send()} className="px-3 py-2 bg-brand hover:bg-deep text-white rounded-lg transition-colors">
              <Send className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default state — AI Insights
  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
        <div className="flex items-center gap-2">
          {onBackToPreview && (
            <button onClick={onBackToPreview} title="Back to preview" className="p-1 -ml-1 hover:bg-tint rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4 text-[#5B6B78]" strokeWidth={1.75} />
            </button>
          )}
          <Sparkles className="w-4 h-4 text-deep" strokeWidth={1.75} />
          <span className="text-sm font-semibold text-ink">AI Insights</span>
        </div>
        <span className={`pill ${insights.confidence.score >= 80 ? "pill-complete" : "pill-progress"}`}>
          {insights.confidence.level} · {insights.confidence.score}%
        </span>
      </div>

      {/* Scrollable insights — only the points that matter at a glance */}
      <div className="flex-1 overflow-auto p-5 space-y-5">
        <InsightBlock icon={FileText} title="Summary">
          <p className="text-sm text-ink leading-relaxed">{insights.summary}</p>
        </InsightBlock>

        <InsightBlock icon={ListChecks} title="Key Points">
          <ul className="space-y-1.5">
            {insights.keyPoints.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink leading-relaxed">
                <CheckCircle className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" strokeWidth={1.75} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </InsightBlock>

        <InsightBlock icon={Info} title="Key Details">
          <div className="flex flex-wrap gap-2">
            {insights.entities.map(({ label, value }) => (
              <span key={label} className="inline-flex items-center gap-1.5 bg-wash border border-line rounded-lg px-2.5 py-1 text-xs">
                <span className="text-[#5B6B78]">{label}</span>
                <span className="font-semibold text-ink">{value}</span>
              </span>
            ))}
          </div>
        </InsightBlock>

        <InsightBlock icon={FileText} title="Supporting Documents">
          <ul className="space-y-1.5">
            {insights.supportingDocs.map((d) => (
              <li key={d} className="flex items-center gap-2 text-sm text-ink">
                <FileText className="w-3.5 h-3.5 text-[#5B6B78] shrink-0" strokeWidth={1.75} />
                <span className="font-mono text-xs truncate">{d}</span>
              </li>
            ))}
          </ul>
        </InsightBlock>
      </div>

      {/* Actions — live inside the AI panel */}
      <div className="border-t border-line p-4 shrink-0 space-y-2">
        <button
          onClick={() => setChatOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand hover:bg-deep text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Bot className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          Ask Questions
        </button>
        <button
          onClick={() => onDownload?.()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-wash border border-line text-ink rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          Download
        </button>
      </div>
    </div>
  );
}

/* The Preview action rail that fills the right 20% of the Document Workspace
   in Preview mode. The viewer takes 80% and AI insights are NOT shown by default —
   the rail just offers three actions: Insights, Chat with AI, Download. */
function PreviewActionRail({ onInsights, onChat, onDownload }: { onInsights: () => void; onChat: () => void; onDownload?: () => void }) {
  const btn = "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium border transition-colors";
  return (
    <div className="w-full h-full flex flex-col bg-white p-4 gap-2">
      <button onClick={onInsights} className={`${btn} bg-tint border-brand text-deep hover:bg-white`}>
        <Sparkles className="w-4 h-4 shrink-0" strokeWidth={1.75} /> Insights
      </button>
      <button onClick={onChat} className={`${btn} bg-white border-line text-ink hover:bg-wash`}>
        <Bot className="w-4 h-4 shrink-0" strokeWidth={1.75} /> Chat with AI
      </button>
      <button onClick={() => onDownload?.()} className={`${btn} bg-white border-line text-ink hover:bg-wash`}>
        <Download className="w-4 h-4 shrink-0" strokeWidth={1.75} /> Download
      </button>
    </div>
  );
}

/* Renders one synthesized document-text block (heading / paragraph / fields / list). */
function DocBlockView({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "heading":
      return <h3 className="text-[13px] font-semibold uppercase tracking-wide text-deep border-b border-line pb-1.5 mt-1">{block.text}</h3>;
    case "paragraph":
      return <p className="text-[13px] leading-relaxed text-ink">{block.text}</p>;
    case "list":
      return (
        <ul className="space-y-1.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-ink">
              <span className="mt-2 w-1 h-1 rounded-full bg-soft shrink-0" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "fields":
      return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {block.pairs.map(([label, value]) => (
            <div key={label} className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wide text-[#5B6B78]">{label}</span>
              <span className="text-[13px] text-ink font-medium">{value}</span>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

/* The document "page" — renders the actual (simulated) full text of the active
   document so reviewers can read it inline. Images show a scene placeholder with
   a caption since they have no body text. */
function DocumentPage({ doc }: { doc: any }) {
  const content = getDocumentContent(doc);
  return (
    <div className="flex-1 overflow-auto bg-track flex justify-center items-start p-8">
      <div className="bg-white rounded-xl shadow-sm w-full max-w-2xl min-h-[500px] border border-line p-8">
        {content.kind === "image" && (
          <div className="mb-6 rounded-lg bg-track border border-line h-56 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-12 h-12 text-[#9BDAEC] mx-auto mb-2" strokeWidth={1.75} />
              <p className="text-xs text-[#5B6B78] font-mono">{String(doc?.name ?? "")}</p>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {content.blocks.map((block, i) => (
            <DocBlockView key={i} block={block} />
          ))}
        </div>
        <div className="mt-8 pt-3 border-t border-line flex items-center justify-between text-[10px] text-[#5B6B78] font-mono">
          <span>{String(doc?.name ?? "")}</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}

/* The unified Document Workspace modal — split layout that depends on the view:
   • Preview  → Left (80%) document viewer · Right (20%) action rail (Insights / Chat / Download)
   • Insights → Left (60%) document viewer · Right (40%) AI Intelligence panel
   `docs` is the set of supporting documents for the current item (signal/row).
   `initialView` controls how the workspace opens. Renders nothing when `docs` is empty. */
export function DocumentWorkspaceModal(props: {
  docs: any[] | null;
  onClose: () => void;
  onDownload?: () => void;
  initialView?: "preview" | "insights" | "chat";
  onPrev?: () => void;
  onNext?: () => void;
  position?: number; // 1-based index of the current item
  total?: number;    // total navigable items (signals/rows)
  noteContext?: { contextType: string; reference: string }; // auto-attached to notes
}) {
  if (!props.docs || props.docs.length === 0) return null;
  // Remount (reset active tab + view) whenever the document set changes.
  const setKey = props.docs.map((d) => d.id ?? d.name).join("|");
  return <WorkspaceInner key={setKey} {...props} docs={props.docs} />;
}

function WorkspaceInner({
  docs,
  onClose,
  onDownload,
  initialView = "preview",
  onPrev,
  onNext,
  position,
  total,
  noteContext,
}: {
  docs: any[];
  onClose: () => void;
  onDownload?: () => void;
  initialView?: "preview" | "insights" | "chat";
  onPrev?: () => void;
  onNext?: () => void;
  position?: number;
  total?: number;
  noteContext?: { contextType: string; reference: string };
}) {
  const [activeTab, setActiveTab] = useState(0);
  // Which workspace view is active. Preview = 80/20 (document only + action rail);
  // insights/chat = 60/40 (document + AI Intelligence panel).
  const [view, setView] = useState<"preview" | "insights" | "chat">(initialView);
  const isPreview = view === "preview";
  const activeDoc = docs[activeTab] ?? docs[0];

  // Register evidence/document context so a note taken from here auto-attaches it.
  const { setDocContext } = useNotes();
  const ctxType = noteContext?.contextType ?? "Document";
  const ctxRef = noteContext?.reference ?? activeDoc?.name;
  useEffect(() => {
    setDocContext({ contextType: ctxType, reference: ctxRef });
    return () => setDocContext(null);
  }, [ctxType, ctxRef, setDocContext]);
  const subtitle = [activeDoc.category, activeDoc.source, activeDoc.date].filter(Boolean).join(" · ");
  const canNavigate = (onPrev || onNext) && (total ?? 0) > 1;
  const hasPrev = !!onPrev && (position ?? 1) > 1;
  const hasNext = !!onNext && (position ?? 1) < (total ?? 1);
  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-7xl flex flex-col overflow-hidden shadow-sm" style={{ height: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-line shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-ink font-mono truncate">{activeDoc.name}</h2>
            {subtitle && <p className="text-xs text-[#5B6B78]">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {canNavigate && (
              <div className="flex items-center gap-1">
                <button
                  onClick={onPrev}
                  disabled={!hasPrev}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-line text-ink rounded-lg text-sm font-medium hover:bg-wash transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.75} /> Prev
                </button>
                {position && total && <span className="text-xs text-[#5B6B78] tabular-nums px-1">{position} of {total}</span>}
                <button
                  onClick={onNext}
                  disabled={!hasNext}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-line text-ink rounded-lg text-sm font-medium hover:bg-wash transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            )}
            <button onClick={onClose} className="p-2 hover:bg-tint rounded-lg transition-colors">
              <X className="w-5 h-5 text-[#5B6B78]" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Body — split layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left — Document Viewer with a tab per supporting document.
              Preview gives the viewer 80%; Insights/Chat share the space 60/40. */}
          <div className="flex flex-col border-r border-line overflow-hidden" style={{ width: isPreview ? "80%" : "60%" }}>
            {/* Document tabs/chips — only when the signal has multiple documents */}
            {docs.length > 1 && (
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line bg-white overflow-x-auto shrink-0">
                {docs.map((d, idx) => {
                  const active = idx === activeTab;
                  return (
                    <button
                      key={(d.id ?? d.name) + idx}
                      onClick={() => setActiveTab(idx)}
                      title={d.name}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-colors ${
                        active
                          ? "bg-tint border-brand text-deep"
                          : "bg-white border-line text-[#5B6B78] hover:border-soft hover:text-ink"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                      <span className="max-w-[180px] truncate">{d.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Viewer toolbar */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-line bg-wash shrink-0">
              <button className="p-1.5 hover:bg-tint rounded-lg transition-colors"><ZoomOut className="w-4 h-4 text-[#5B6B78]" strokeWidth={1.75} /></button>
              <span className="text-xs text-[#5B6B78]">100%</span>
              <button className="p-1.5 hover:bg-tint rounded-lg transition-colors"><ZoomIn className="w-4 h-4 text-[#5B6B78]" strokeWidth={1.75} /></button>
              <div className="flex-1" />
              <div className="flex items-center gap-2 text-xs text-[#5B6B78]">
                <button className="p-1.5 hover:bg-tint rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" strokeWidth={1.75} /></button>
                <span>Page 1 of 1</span>
                <button className="p-1.5 hover:bg-tint rounded-lg transition-colors"><ChevronRight className="w-4 h-4" strokeWidth={1.75} /></button>
              </div>
            </div>

            {/* Viewer area — renders the actual document text for the active tab */}
            <DocumentPage doc={activeDoc} />
          </div>

          {/* Right — Preview shows a 20% action rail; Insights/Chat show the 40%
              AI Intelligence Panel (insights across ALL documents in the set). */}
          <div className="flex flex-col overflow-hidden shrink-0" style={{ width: isPreview ? "20%" : "40%" }}>
            {isPreview ? (
              <PreviewActionRail
                onInsights={() => setView("insights")}
                onChat={() => setView("chat")}
                onDownload={onDownload}
              />
            ) : (
              <AiIntelligencePanel
                key={view}
                docs={docs}
                onDownload={onDownload}
                startInChat={view === "chat"}
                onBackToPreview={() => setView("preview")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
