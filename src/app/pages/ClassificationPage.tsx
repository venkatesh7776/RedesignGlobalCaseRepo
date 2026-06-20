import { useState } from "react";
import { StageNavigator } from "../components/StageNavigator";
import { CheckCircle, ChevronRight, ArrowRight, AlertCircle, ChevronLeft, X, Send, FileText, Eye } from "lucide-react";
import { Button } from "../components/ui/button";

import { CaseDocument, classifyDocuments } from "../types/case";

interface ClassificationPageProps {
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
  onProceedToAnalysis?: () => void;
}

const documentCategories = [
  {
    name: "Medical Records",
    count: 8,
    summary: ["3 MRI Reports", "2 Hospital Admissions", "2 Physical Therapy Records", "1 Medication History"],
    files: [
      { name: "MRI Report.pdf", source: "Plaintiff", date: "Jun 1, 2026", status: "Processed" },
      { name: "ER Admission.pdf", source: "Plaintiff", date: "Jun 1, 2026", status: "Processed" },
      { name: "Surgery Notes.pdf", source: "Plaintiff", date: "Jun 2, 2026", status: "Processed" },
      { name: "Physical Therapy.pdf", source: "Plaintiff", date: "Jun 2, 2026", status: "Processed" },
      { name: "Medication List.pdf", source: "Plaintiff", date: "Jun 3, 2026", status: "Processed" },
      { name: "Treatment Plan.pdf", source: "Attorney", date: "Jun 3, 2026", status: "Processed" },
      { name: "Follow-up Notes.pdf", source: "Plaintiff", date: "Jun 4, 2026", status: "Processed" },
      { name: "Discharge Summary.pdf", source: "Plaintiff", date: "Jun 4, 2026", status: "Processed" },
    ]
  },
  {
    name: "Police Reports",
    count: 1,
    summary: ["1 Accident Report"],
    files: [
      { name: "Accident Report 2024-001.pdf", source: "Plaintiff", date: "Jun 1, 2026", status: "Processed" },
    ]
  },
  {
    name: "Insurance Documents",
    count: 2,
    summary: ["1 Policy Document", "1 Claim Form"],
    files: [
      { name: "Policy Coverage.pdf", source: "Attorney", date: "Jun 2, 2026", status: "Processed" },
      { name: "Claim Form.pdf", source: "Plaintiff", date: "Jun 3, 2026", status: "Processed" },
    ]
  },
  {
    name: "Wage Loss Records",
    count: 1,
    summary: ["1 Employment Verification"],
    files: [
      { name: "Employment Verification.pdf", source: "Plaintiff", date: "Jun 2, 2026", status: "Processed" },
    ]
  },
  {
    name: "Photos & Evidence",
    count: 2,
    summary: ["2 Accident Scene Photos"],
    files: [
      { name: "Accident Scene Photo 1.jpg", source: "Plaintiff", date: "Jun 1, 2026", status: "Processed" },
      { name: "Accident Scene Photo 2.jpg", source: "Plaintiff", date: "Jun 1, 2026", status: "Processed" },
    ]
  },
];

export function ClassificationPage({ caseData, documents = [], onStageClick, onBackToIntake, onProceedToAnalysis }: ClassificationPageProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [aiMessages, setAiMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [aiInput, setAiInput] = useState("");

  const defaultCaseData = {
    caseName: "Estate of Miller vs Logistics Co.",
    caseId: "PI-2024-001",
    plaintiff: "Evelyn Miller",
    summary: "Motor vehicle accident resulting in cervical disc herniation and ongoing physical therapy.",
    jurisdiction: "Cook County, IL",
  };

  const data = { ...defaultCaseData, ...caseData };

  // Derive categories from shared documents
  const derivedCategories = classifyDocuments(documents);
  const hasDocuments = documents.length > 0;
  const needsReview = derivedCategories.some((c) => c.name === "General Documents" && c.docs.length > 0);
  const totalDocuments = documents.length;

  const handleDocumentClick = (document: any, category: string) => {
    setSelectedDocument({ ...document, category });
    setAiMessages([]);
    setShowDocumentPreview(true);
  };

  const handleSendAiMessage = () => {
    if (!aiInput.trim()) return;

    setAiMessages([
      ...aiMessages,
      { role: "user", content: aiInput },
      { role: "assistant", content: "This is a simulated AI response about the document. In production, this would analyze the actual document content and provide relevant insights." }
    ]);
    setAiInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Context Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Back Navigation */}
            <button
              onClick={onBackToIntake}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Case Intake
            </button>

            {/* Breadcrumb */}
            <div className="text-sm text-gray-500">
              Case Intake <span className="mx-2">›</span> <span className="text-gray-900 font-medium">{data.caseName}</span>
            </div>
          </div>
        </div>
      </div>

      <StageNavigator currentStage="Classification" onStageClick={onStageClick} />

      <div className="max-w-[1400px] mx-auto p-8">
        {!hasDocuments ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No documents available for classification</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              LECO will organize evidence automatically once documents are received in the Collection stage.
            </p>
            <button
              onClick={() => onStageClick?.("Client Intake")}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors"
            >
              Back to Collection
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 bg-cyan-50 border border-cyan-200 rounded-lg text-xs font-semibold text-cyan-700 mb-3">
                STAGE 02 ACTIVE
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Organization & Classification</h1>
                  <p className="text-gray-600">
                    LECO has automatically categorized and indexed all received documents for downstream case intelligence.
                  </p>
                </div>
                <div className="ml-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Documents Organized</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Classification Summary */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Case Classification Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Case Type</div>
                  <div className="text-sm font-medium text-gray-900">Medical Malpractice</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Sub-Type</div>
                  <div className="text-sm font-medium text-gray-900">Delayed Treatment</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Incident Date</div>
                  <div className="text-sm font-medium text-gray-900">Feb 14, 2026</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Plaintiff</div>
                  <div className="text-sm font-medium text-gray-900">{data.plaintiff}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Classification Confidence</div>
                  <div className="text-sm font-medium text-green-600">98%</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Document Categories</h2>

                  <div className="space-y-3">
                    {derivedCategories.map((category) => (
                      <div key={category.name} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() =>
                            setExpandedCategory(expandedCategory === category.name ? null : category.name)
                          }
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{category.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {category.docs.length} {category.docs.length === 1 ? "Document" : "Documents"}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-cyan-600">
                            <span className="text-sm font-medium">
                              {expandedCategory === category.name ? "Hide" : "View"}
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 transition-transform ${
                                expandedCategory === category.name ? "rotate-90" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {expandedCategory === category.name && (
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <ul className="space-y-2">
                              {category.docs.map((file) => (
                                <li key={file.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white transition-colors group">
                                  <div className="flex items-center gap-2 flex-1">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-700">{file.name}</span>
                                    <span className="text-xs text-gray-400">({file.date})</span>
                                  </div>
                                  <button
                                    onClick={() => handleDocumentClick(file, category.name)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-cyan-600 hover:bg-cyan-50 hover:border-cyan-300 transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Classification Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                {needsReview ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h3 className="text-lg font-semibold text-orange-900 mb-1">Needs Attention</h3>
                        <p className="text-sm text-orange-700">1 Document Requires Review</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-orange-600 font-medium mb-1">Filename</div>
                      <div className="text-sm text-orange-900 font-mono">IMG_4458.pdf</div>
                    </div>

                    <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-all">
                      Review
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3 mb-6">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h3 className="text-lg font-semibold text-green-900 mb-1">Classification Complete</h3>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <div className="text-xs text-green-600 font-medium mb-1">Documents Processed</div>
                        <div className="text-2xl font-semibold text-green-900">{totalDocuments}</div>
                      </div>

                      <div>
                        <div className="text-xs text-green-600 font-medium mb-1">Successfully Classified</div>
                        <div className="text-2xl font-semibold text-green-900">{totalDocuments}</div>
                      </div>

                      <div>
                        <div className="text-xs text-green-600 font-medium mb-1">Require Review</div>
                        <div className="text-2xl font-semibold text-green-900">0</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-green-200">
                      <div className="text-xs text-green-600 font-medium mb-1">Status</div>
                      <div className="text-sm font-semibold text-green-700">Ready For Analysis</div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Classification Complete</h3>
                <p className="text-sm text-gray-600">
                  All received documents have been organized and verified.
                </p>
              </div>
              <Button
                onClick={onProceedToAnalysis}
                className="bg-cyan-500 hover:bg-cyan-600 text-white border-0 gap-2"
              >
                Continue to Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Document Preview Modal */}
      {showDocumentPreview && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedDocument.name}</h2>
                <p className="text-sm text-gray-500">{selectedDocument.category}</p>
              </div>
              <button
                onClick={() => setShowDocumentPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Split View Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Document Viewer */}
              <div className="flex-1 border-r border-gray-200 overflow-auto bg-gray-50">
                <div className="p-6">
                  {/* Document Metadata */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Document Metadata</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Document Name</div>
                        <div className="text-sm text-gray-900">{selectedDocument.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Source</div>
                        <div className="text-sm text-gray-900">{selectedDocument.source}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Upload Date</div>
                        <div className="text-sm text-gray-900">{selectedDocument.date}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Category</div>
                        <div className="text-sm text-gray-900">{selectedDocument.category}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Processing Status</div>
                        <div className="text-sm text-green-600">{selectedDocument.status}</div>
                      </div>
                    </div>
                  </div>

                  {/* Document Preview Placeholder */}
                  <div className="bg-white border border-gray-200 rounded-xl p-8 flex items-center justify-center min-h-[500px]">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-sm text-gray-500">Document Preview</p>
                      <p className="text-xs text-gray-400 mt-1">{selectedDocument.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - AI Assistant */}
              <div className="w-96 flex flex-col bg-white">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">LECO Document Assistant</h3>
                  <p className="text-xs text-gray-500 mt-1">Ask questions about this document</p>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-auto p-6 space-y-4">
                  {aiMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500 mb-4">Ask anything about this document...</p>
                      <div className="text-xs text-gray-400 space-y-2">
                        <div className="bg-gray-50 rounded-lg p-3 text-left">
                          <p className="font-medium text-gray-700 mb-1">Example Questions:</p>
                          <ul className="space-y-1">
                            <li>• Summarize this report</li>
                            <li>• What injuries are documented?</li>
                            <li>• Extract diagnoses</li>
                            <li>• Highlight key findings</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    aiMessages.map((message, idx) => (
                      <div key={idx} className={`${message.role === "user" ? "text-right" : "text-left"}`}>
                        <div
                          className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === "user"
                              ? "bg-cyan-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendAiMessage()}
                      placeholder="Ask anything about this document..."
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                    <button
                      onClick={handleSendAiMessage}
                      className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
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
