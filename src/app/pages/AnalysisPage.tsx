import { useState } from "react";
import { StageNavigator } from "../components/StageNavigator";
import {
  ChevronLeft, CheckCircle, FileText, Eye, Download, X, Send,
  AlertCircle, ArrowRight, User, Building2, Calendar, Shield,
  Mail, MessageSquare
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  CaseDocument, classifyDocuments,
  generateAnalysisFindings, detectMissingEvidence
} from "../types/case";

/* MARKER-MAKE-KIT-INVOKED */

interface AnalysisPageProps {
  caseData?: {
    caseName: string;
    caseId: string;
    plaintiff: string;
    summary: string;
    jurisdiction?: string;
  };
  documents?: CaseDocument[];
  onStageClick?: (stageName: string) => void;
  onBackToIntake?: () => void;
  onProceedToValuation?: () => void;
}

const aiQuickPrompts = [
  "Summarize this document",
  "What injuries are mentioned?",
  "Extract treatment dates",
  "Identify medical providers",
  "Highlight key findings",
];

export function AnalysisPage({ caseData, documents = [], onStageClick, onBackToIntake, onProceedToValuation }: AnalysisPageProps) {
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<CaseDocument & { category?: string; source?: string } | null>(null);
  const [aiMessages, setAiMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [aiInput, setAiInput] = useState("");

  // Derive everything from shared documents
  const categories = classifyDocuments(documents);
  const signals = generateAnalysisFindings(categories);
  const missingEvidence = detectMissingEvidence(categories);
  const verifiedDocuments = documents.map((d) => ({
    ...d,
    category: categories.find((c) => c.docs.some((f) => f.id === d.id))?.name ?? "General",
    status: "Verified",
    source: d.source === "Plaintiff" ? "Plaintiff" : "Attorney Office",
  }));
  const hasFindings = signals.length > 0;

  // Missing document request modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(
    Object.fromEntries(missingEvidence.map((m) => [m.title, true]))
  );
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms">("email");
  const clientEmail = "evelyn.miller@email.com";
  const clientPhone = "(555) 123-4567";

  const selectedDocTitles = missingEvidence.filter((m) => checkedDocs[m.title]).map((m) => m.title);

  const generateMessage = (docs: string[]) =>
    `Hello Evelyn,\n\nWe are currently reviewing your case and require additional documents to continue our evaluation.\n\nRequested Documents:\n${docs.map((d) => `• ${d}`).join("\n")}\n\nPlease upload the requested documents using the secure intake link below.\n\nIf you have any questions or are unable to obtain a document, please contact our office.\n\nThank you,\nJennifer Davis\nLexGuard Injury Intel`;

  const [messageText, setMessageText] = useState(() => generateMessage(missingEvidence.map((m) => m.title)));

  const openRequestModal = () => {
    const allTitles = missingEvidence.map((m) => m.title);
    setCheckedDocs(Object.fromEntries(allTitles.map((t) => [t, true])));
    setMessageText(generateMessage(allTitles));
    setShowRequestModal(true);
  };

  const handleDocCheck = (title: string, checked: boolean) => {
    const next = { ...checkedDocs, [title]: checked };
    setCheckedDocs(next);
    const selected = missingEvidence.filter((m) => next[m.title]).map((m) => m.title);
    setMessageText(generateMessage(selected));
  };

  const canSend = selectedDocTitles.length > 0;

  const defaultCaseData = {
    caseName: "Estate of Miller vs Logistics Co.",
    caseId: "PI-2024-001",
    plaintiff: "Evelyn Miller",
    summary: "Motor vehicle accident resulting in cervical disc herniation and ongoing physical therapy.",
    jurisdiction: "Cook County, IL",
  };

  const data = { ...defaultCaseData, ...caseData };

  const handleDocumentView = (doc: typeof verifiedDocuments[number]) => {
    setSelectedDocument(doc);
    setAiMessages([]);
    setShowDocumentPreview(true);
  };

  const handleSendAiMessage = (text?: string) => {
    const message = text ?? aiInput;
    if (!message.trim()) return;
    setAiMessages((prev) => [
      ...prev,
      { role: "user", content: message },
      {
        role: "assistant",
        content:
          "Based on the document, here is a simulated LECO analysis response. In production this would reflect the actual document content and provide attorney-grade insights.",
      },
    ]);
    setAiInput("");
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

      <StageNavigator currentStage="Analysis" onStageClick={onStageClick} />

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

        {documents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Not enough evidence to generate intelligence findings</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">LECO requires supporting documentation before identifying liability signals.</p>
            <div className="flex gap-3">
              <button onClick={() => onStageClick?.("Client Intake")} className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Request Additional Documents</button>
            </div>
          </div>
        )}

        {documents.length > 0 && !hasFindings && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <h2 className="text-base font-semibold text-gray-900 mb-1">Not enough evidence to generate intelligence findings</h2>
            <p className="text-sm text-gray-500">Upload police reports or medical records to unlock liability and injury signals.</p>
          </div>
        )}

        {documents.length > 0 && (
        <>
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-cyan-50 border border-cyan-200 rounded-lg text-xs font-semibold text-cyan-700 mb-3">
              STAGE 03 ACTIVE
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Intelligence & Analysis</h1>
            <p className="text-gray-600">LECO has analyzed all verified evidence and generated attorney-ready case intelligence.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg mt-1">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Analysis Complete</span>
          </div>
        </div>

        {/* ── ROW: Signals + Controls ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT: Discovered Liability & Injury Signals */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Discovered Liability & Injury Signals</h2>
            <p className="text-sm text-gray-500 mb-6">The most important liability and injury findings identified by LECO from verified evidence.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {signals.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5 flex flex-col">
                  <div className="text-xs font-semibold tracking-widest text-cyan-600 uppercase mb-2">{item.tag}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{item.description}</p>
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Source Documents</div>
                    <ul className="space-y-1.5 mb-3">
                      {item.sources.map((src) => (
                        <li key={src} className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-xs text-gray-700 font-mono">{src}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors">
                      View Sources
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Analysis Controls */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Analysis Controls</h2>

            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Analysis Period
                </div>
                <p className="text-sm text-gray-900">May 15, 2026 – Jun 11, 2026</p>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1.5">
                  <User className="w-3.5 h-3.5" />
                  Witnesses Identified
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-900">Officer D. Vance</p>
                  <p className="text-sm text-gray-900">John Peterson</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Medical Providers
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-900">Cook County Medical Center</p>
                  <p className="text-sm text-gray-900">Physical Therapy Associates</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Verified Documents
                </div>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <Button
                  onClick={onProceedToValuation}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white border-0 gap-2"
                >
                  Proceed To Valuation
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Evidence Verification ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Evidence Verification</h2>
            <p className="text-sm text-gray-500 mt-0.5">Inspect the source documents used during analysis.</p>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {verifiedDocuments.map((doc, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doc.category === "Liability"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-purple-50 text-purple-700"
                    }`}>
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-700">{doc.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDocumentView(doc)}
                        className="flex items-center gap-1.5 text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      <span className="text-gray-200">|</span>
                      <button className="flex items-center gap-1.5 text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Missing Evidence Analysis ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Missing Evidence Analysis</h2>
          <p className="text-sm text-gray-500 mb-6">Evidence gaps discovered during analysis that may affect liability or damages.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {missingEvidence.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1.5">{item.title}</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                      Missing
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Expected: </span>
                    <span className="font-mono">{item.expected}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Reason: </span>
                    {item.reason}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Follow-up Request */}
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Missing Evidence Follow-Up</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 mb-1">Recipient</div>
                <div className="text-sm font-medium text-gray-900">Evelyn Miller</div>
                <div className="text-sm text-gray-500">evelyn.miller@email.com</div>
              </div>
              <Button onClick={openRequestModal} className="bg-cyan-500 hover:bg-cyan-600 text-white border-0">
                Send Missing Document Request
              </Button>
            </div>
          </div>
        </div>

        {/* ── Proceed to Valuation ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Ready to proceed?</h3>
            <p className="text-sm text-gray-500">All core analysis is complete. Advance to Valuation to calculate case value.</p>
          </div>
          <Button
            onClick={onProceedToValuation}
            className="bg-cyan-500 hover:bg-cyan-600 text-white border-0 gap-2"
          >
            Proceed To Valuation
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        </>
        )}

      </div>

      {/* ── Missing Document Request Modal ── */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Missing Document Request</h2>
                <p className="text-xs text-gray-500 mt-0.5">Review and approve before sending to client</p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">

              {/* Section 1 — Missing Documents */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Missing Documents</h3>
                <p className="text-xs text-gray-500 mb-3">Uncheck any document you do not want to request.</p>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                  {missingEvidence.map((item) => (
                    <label
                      key={item.title}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!!checkedDocs[item.title]}
                        onChange={(e) => handleDocCheck(item.title, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 accent-cyan-500"
                      />
                      <div>
                        <div className="text-sm text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-400 font-mono">{item.expected}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedDocTitles.length === 0 && (
                  <p className="text-xs text-orange-600 mt-2">Select at least one document to send a request.</p>
                )}
              </div>

              {/* Section 2 — Delivery Method */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Send To</h3>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                  <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="delivery"
                      value="email"
                      checked={deliveryMethod === "email"}
                      onChange={() => setDeliveryMethod("email")}
                      className="w-4 h-4 accent-cyan-500"
                    />
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <div className="text-sm text-gray-900">Email</div>
                      <div className="text-xs text-gray-500">{clientEmail}</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="delivery"
                      value="sms"
                      checked={deliveryMethod === "sms"}
                      onChange={() => setDeliveryMethod("sms")}
                      className="w-4 h-4 accent-cyan-500"
                    />
                    <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <div className="text-sm text-gray-900">SMS</div>
                      <div className="text-xs text-gray-500">{clientPhone}</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 3 — Message Preview */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Message Preview</h3>
                <p className="text-xs text-gray-500 mb-3">This message was generated automatically. You may edit it before sending.</p>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={10}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 leading-relaxed focus:outline-none focus:border-cyan-400 transition-colors resize-none bg-gray-50"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 shrink-0">
              <Button
                onClick={() => setShowRequestModal(false)}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                disabled={!canSend}
                onClick={() => setShowRequestModal(false)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white border-0 gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Send Request
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ── Document Preview Modal ── */}
      {showDocumentPreview && selectedDocument && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{selectedDocument.name}</h2>
                <p className="text-xs text-gray-500">{selectedDocument.category} · {selectedDocument.source}</p>
              </div>
              <button
                onClick={() => setShowDocumentPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Split Panels */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left — Document Preview */}
              <div className="flex-1 border-r border-gray-200 overflow-auto bg-gray-50 p-6 space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Document Metadata</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      { label: "Document Name", value: selectedDocument.name },
                      { label: "Category", value: selectedDocument.category },
                      { label: "Upload Date", value: selectedDocument.date },
                      { label: "Source", value: selectedDocument.source },
                      { label: "Status", value: selectedDocument.status },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                        <div className="text-sm text-gray-900 font-medium">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl flex items-center justify-center min-h-[440px]">
                  <div className="text-center">
                    <FileText className="w-14 h-14 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Document Preview</p>
                    <p className="text-xs text-gray-300 mt-1">{selectedDocument.name}</p>
                  </div>
                </div>
              </div>

              {/* Right — LECO Document Assistant */}
              <div className="w-96 flex flex-col bg-white shrink-0">
                <div className="px-5 py-4 border-b border-gray-200 shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <h3 className="text-sm font-semibold text-gray-900">LECO Document Assistant</h3>
                  </div>
                  <p className="text-xs text-gray-500">Answers based on this document only</p>
                </div>

                <div className="flex-1 overflow-auto p-5 space-y-3">
                  {aiMessages.length === 0 ? (
                    <div>
                      <p className="text-xs text-gray-400 mb-3">Try asking:</p>
                      <div className="space-y-2">
                        {aiQuickPrompts.map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => handleSendAiMessage(prompt)}
                            className="w-full text-left text-xs text-gray-700 bg-gray-50 hover:bg-cyan-50 hover:text-cyan-700 border border-gray-200 hover:border-cyan-200 rounded-lg px-3 py-2.5 transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    aiMessages.map((msg, idx) => (
                      <div key={idx} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                        <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user" ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-gray-200 p-4 shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
                      placeholder="Ask about this document..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <button
                      onClick={() => handleSendAiMessage()}
                      className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
