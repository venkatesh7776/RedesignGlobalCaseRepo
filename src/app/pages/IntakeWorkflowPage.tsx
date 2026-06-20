import React, { useState, useRef } from "react";
import { StageNavigator } from "../components/StageNavigator";
import { CaseSnapshot } from "../components/CaseSnapshot";
import { Send, Upload, CheckCircle, Circle, ArrowRight, Check, X, FileText, Copy, MoreVertical, Download, Eye, Search, ChevronLeft, ChevronDown, Mail, MessageSquare, AlertCircle, Bot, ZoomIn, ZoomOut, ChevronRight, Pencil, RefreshCw, Plus, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { PipelineState, CaseDocument, classifyDocuments, detectMissingEvidence } from "../types/case";

interface IntakeWorkflowPageProps {
  caseData?: {
    caseName: string;
    caseId: string;
    caseType?: string;
    plaintiff: string;
    summary: string;
    plaintiffEmail?: string;
    plaintiffPhone?: string;
    jurisdiction?: string;
    dateOfIncident?: string;
  };
  pipeline: PipelineState;
  onPipelineUpdate: (updates: Partial<PipelineState>) => void;
  onContinue?: () => void;
  onStageClick?: (stageName: string) => void;
  onBackToIntake?: () => void;
}

const documentCategories = [
  { name: "Medical Records", required: true, enabled: true },
  { name: "Police Report", required: true, enabled: true },
  { name: "Insurance Documents", required: true, enabled: true },
  { name: "Wage Loss Records", required: true, enabled: true },
  { name: "Property Damage Photos", required: false, enabled: false },
  { name: "Employment Records", required: false, enabled: false },
];

const allRetainerDocuments = [
  { name: "PI_Retainer_Agreement.pdf", date: "Jun 8, 2026", status: "Sent", source: "Attorney" },
  { name: "Signed_PI_Retainer_Agreement.pdf", date: "Jun 10, 2026", status: "Signed", source: "Plaintiff" },
];

const intakeDocuments = [
  { name: "prakash_medical_records.pdf", source: "Plaintiff", status: "Processed" },
  { name: "MRI_Report_2026.pdf", source: "Plaintiff", status: "Processed" },
  { name: "hospital_invoice.pdf", source: "Plaintiff", status: "Processed" },
  { name: "ER_Bills.pdf", source: "Plaintiff", status: "Processed" },
  { name: "physical_therapy_notes.pdf", source: "Plaintiff", status: "Processed" },
  { name: "medication_list.pdf", source: "Plaintiff", status: "Processing" },
  { name: "police_report_final.pdf", source: "Plaintiff", status: "Processed" },
  { name: "accident_scene_photo_1.jpg", source: "Plaintiff", status: "Processed" },
  { name: "accident_scene_photo_2.jpg", source: "Plaintiff", status: "Processed" },
  { name: "insurance_policy_v2.pdf", source: "Attorney", status: "Processing" },
  { name: "Insurance_Claim_Form.pdf", source: "Attorney", status: "Processed" },
  { name: "employment_verification.pdf", source: "Plaintiff", status: "Processed" },
  { name: "wage_loss_statement.pdf", source: "Plaintiff", status: "Processed" },
  { name: "witness_statement.pdf", source: "Attorney", status: "Processed" },
];

const documentProgress = [
  { name: "Medical Records", complete: true },
  { name: "Insurance Documents", complete: true },
  { name: "Police Report", complete: false },
  { name: "Wage Loss Records", complete: false },
];

const activityLog = [
  { date: "Jun 8", event: "Intake Request Sent" },
  { date: "Jun 20", event: "Follow-up Request Sent" },
];

const retainerTemplates = [
  {
    id: "standard-pi",
    name: "Standard Personal Injury Retainer",
    lastUpdated: "May 15, 2026",
    createdBy: "Legal Team",
  },
  {
    id: "medical-malpractice",
    name: "Medical Malpractice Retainer",
    lastUpdated: "Apr 22, 2026",
    createdBy: "Jennifer Davis",
  },
  {
    id: "wrongful-death",
    name: "Wrongful Death Retainer",
    lastUpdated: "Mar 10, 2026",
    createdBy: "Legal Team",
  },
  {
    id: "truck-accident",
    name: "Truck Accident Retainer",
    lastUpdated: "Feb 5, 2026",
    createdBy: "Michael Chen",
  },
  {
    id: "custom",
    name: "Custom Retainer Agreement",
    lastUpdated: "Jan 12, 2026",
    createdBy: "Legal Team",
  },
];

export function IntakeWorkflowPage({ caseData, pipeline, onPipelineUpdate, onContinue, onStageClick, onBackToIntake }: IntakeWorkflowPageProps) {
  // Default case data if none provided
  const defaultCaseData = {
    caseName: "Estate of Miller vs Logistics Co.",
    caseId: "PI-2024-001",
    caseType: "Medical Malpractice",
    caseSubType: "Delayed Treatment",
    plaintiff: "Evelyn Miller",
    summary: "Delayed stroke response and negligent medication management at a memory care facility resulting in severe neurological injury.",
    plaintiffEmail: "evelyn.miller@gmail.com",
    plaintiffPhone: "(555) 123-4567",
    jurisdiction: "Cook County, IL",
    dateOfIncident: "Feb 14, 2026",
  };

  const data = { ...defaultCaseData, ...caseData };

  const [accordionOpen, setAccordionOpen] = useState({ retainer: true, request: false, documents: false });
  const toggleAccordion = (key: "retainer" | "request" | "documents") =>
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  const [documents, setDocuments] = useState(documentCategories);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [recipientEmail, setRecipientEmail] = useState(data.plaintiffEmail || "");
  const [secureLink] = useState(pipeline.intakeLink);
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms">(
    data.plaintiffEmail ? "email" : "sms"
  );
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editableEmail, setEditableEmail] = useState(data.plaintiffEmail || "");
  const [editablePhone, setEditablePhone] = useState(data.plaintiffPhone || "(555) 123-4567");

  const clientPhone = editablePhone;
  const hasEmail = !!data.plaintiffEmail;
  const hasPhone = !!clientPhone;
  const hasContact = hasEmail || hasPhone;

  // Pipeline-derived state (shared)
  const intakeCreated = pipeline.intakeCreated;
  const intakeSent = pipeline.intakeSent;
  const retainerStatus = pipeline.retainerStatus;

  const setIntakeCreated = (v: boolean) => onPipelineUpdate({ intakeCreated: v });
  const setIntakeSent = (v: boolean) => onPipelineUpdate({ intakeSent: v });
  const setRetainerStatus = (v: "not-sent" | "sent" | "signed") => onPipelineUpdate({ retainerStatus: v });

  // Local retainer UI state
  const [retainerEmail, setRetainerEmail] = useState(data.plaintiffEmail || "");
  const [retainerPhone, setRetainerPhone] = useState("");
  const [retainerSentDate, setRetainerSentDate] = useState("Jun 8, 2026");
  const [retainerSignedDate, setRetainerSignedDate] = useState("");
  const [retainerLink] = useState("https://leco.ai/retainer/RET29...");
  const [showMarkSignedModal, setShowMarkSignedModal] = useState(false);
  const [showSendRetainerModal, setShowSendRetainerModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [agreementUploaded, setAgreementUploaded] = useState(false);
  const [showUploadAgreementModal, setShowUploadAgreementModal] = useState(false);
  const [showGenerateNewRetainerModal, setShowGenerateNewRetainerModal] = useState(false);
  const [demoRetainerState, setDemoRetainerState] = useState<"sent" | "signed">("sent");
  const [demoIntakeState, setDemoIntakeState] = useState<"awaiting" | "received">("awaiting");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [retainerMessage, setRetainerMessage] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [previewAiOpen, setPreviewAiOpen] = useState(false);
  const [previewAiMessages, setPreviewAiMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [previewAiInput, setPreviewAiInput] = useState("");
  const [aiPopupDoc, setAiPopupDoc] = useState<any>(null);
  const [aiPopupMessages, setAiPopupMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [aiPopupInput, setAiPopupInput] = useState("");
  const [editingDocName, setEditingDocName] = useState(false);
  const [editDocNameValue, setEditDocNameValue] = useState("");

  // Intake request multi-request state
  type IntakeStatus = "Draft" | "Sent" | "Opened" | "In Progress" | "Partially Completed" | "Completed" | "Expired" | "Cancelled";
  interface IntakeRequestRecord {
    id: string;
    status: IntakeStatus;
    version: number;
    recipient: string;
    deliveryMethod: "email" | "sms";
    requestedDocs: string[];
    created: string;
    lastSent: string;
    lastModified?: string;
    docsReceived?: number;
    missingDocs?: number;
  }
  const [intakeRequests, setIntakeRequests] = useState<IntakeRequestRecord[]>([]);
  const [intakeOverflowOpen, setIntakeOverflowOpen] = useState<string | null>(null);
  const [intakeModalMode, setIntakeModalMode] = useState<"create" | "modify" | "additional">("create");
  const [activeModifyId, setActiveModifyId] = useState<string | null>(null);
  const [showResendModal, setShowResendModal] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [showViewSubmissionModal, setShowViewSubmissionModal] = useState(false);
  const [viewingSubmissionId, setViewingSubmissionId] = useState<string | null>(null);

  // plaintiffActivityDetected is derived after sharedDocs — see below
  const [documentsSubTab, setDocumentsSubTab] = useState<"retainer" | "intake">("retainer");
  const [documentSearch, setDocumentSearch] = useState("");
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const toggleDocument = (index: number) => {
    const newDocs = [...documents];
    if (!newDocs[index].required) {
      newDocs[index].enabled = !newDocs[index].enabled;
      setDocuments(newDocs);
    }
  };

  const buildNewRequest = (overrides: Partial<IntakeRequestRecord> = {}): IntakeRequestRecord => ({
    id: `REQ-${String((intakeRequests.length + 1)).padStart(3, "0")}`,
    status: "Sent",
    version: 1,
    recipient: recipientEmail || data.plaintiffEmail || data.plaintiff,
    deliveryMethod: deliveryMethod,
    requestedDocs: documents.filter((d) => d.enabled).map((d) => d.name),
    created: "Jun 8, 2026",
    lastSent: "Jun 8, 2026",
    ...overrides,
  });

  const handleSendRequestFromCard = () => {
    if (!hasContact) { setShowIntakeModal(true); return; }
    setIntakeSent(true);
    setEmailError(false);
    if (intakeRequests.length === 0) {
      setIntakeRequests([buildNewRequest()]);
    }
  };

  const handleSendRequest = () => {
    if (!hasContact) return;
    setIntakeCreated(true);
    setIntakeSent(true);
    setShowIntakeModal(false);
    setEmailError(false);
    if (intakeModalMode === "create") {
      setIntakeRequests([buildNewRequest()]);
    } else if (intakeModalMode === "modify" && activeModifyId) {
      setIntakeRequests((prev) => prev.map((r) =>
        r.id === activeModifyId
          ? { ...r, requestedDocs: documents.filter((d) => d.enabled).map((d) => d.name), recipient: recipientEmail || r.recipient, deliveryMethod, version: r.version + 1, lastModified: "Jun 10, 2026", lastSent: "Jun 10, 2026" }
          : r
      ));
    } else if (intakeModalMode === "additional") {
      const additionalDocs = ["Wage Loss Records", "Employment Records", "Pharmacy Records"];
      const nextId = `REQ-${String(intakeRequests.length + 1).padStart(3, "0")}`;
      setIntakeRequests((prev) => [...prev, {
        id: nextId, status: "Sent", version: 1,
        recipient: recipientEmail || data.plaintiffEmail || data.plaintiff,
        deliveryMethod, requestedDocs: additionalDocs,
        created: "Jun 9, 2026", lastSent: "Jun 9, 2026",
      }]);
    }
    setIntakeModalMode("create");
    setActiveModifyId(null);
  };

  const handleCreateForm = () => {
    setIntakeCreated(true);
    setIntakeSent(false);
    setShowIntakeModal(false);
    setEmailError(false);
  };

  const handleModifyRequest = (id: string) => {
    setIntakeModalMode("modify");
    setActiveModifyId(id);
    setEmailError(false);
    setShowIntakeModal(true);
  };

  const handleOpenAdditionalRequest = () => {
    setIntakeModalMode("additional");
    setActiveModifyId(null);
    setShowIntakeModal(true);
  };

  const handleMarkCompleted = (id: string) => {
    setIntakeRequests((prev) => prev.map((r) =>
      r.id === id ? { ...r, status: "Completed", docsReceived: 8, missingDocs: 1 } : r
    ));
  };

  const handleOpenResend = (id: string) => {
    setResendingId(id);
    setShowResendModal(true);
  };

  const handleConfirmResend = () => {
    if (resendingId) {
      setIntakeRequests((prev) => prev.map((r) =>
        r.id === resendingId ? { ...r, lastSent: "Jun 10, 2026" } : r
      ));
    }
    setShowResendModal(false);
    setResendingId(null);
  };

  const handleCreateAdditionalRequest = () => {
    handleOpenAdditionalRequest();
  };

  const handleCopyLink = () => {
    // Fallback method for when Clipboard API is blocked
    const textArea = document.createElement("textarea");
    textArea.value = secureLink;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
    textArea.remove();
  };

  const handleOpenFollowUp = () => {
    const missing = missingDocuments.join("\n• ");
    setFollowUpMessage(
      `Hello ${data.plaintiff},\n\nWe're still waiting for the following documents to continue processing your case:\n\n• ${missing}\n\nPlease upload them using your secure intake link.\n\nThank you.`
    );
    setShowFollowUpModal(true);
  };

  const handleSendFollowUp = () => {
    setShowFollowUpModal(false);
  };

  const handleOpenSendRetainerModal = () => {
    setRetainerMessage(
      `Hello ${data.plaintiff},\n\nPlease review and sign the attached retainer agreement to begin representation.\n\nThank you.`
    );
    setShowSendRetainerModal(true);
  };

  const handleSendRetainer = () => {
    const template = retainerTemplates.find((t) => t.id === selectedTemplate);
    if (template) {
      setSelectedTemplateName(template.name);
    }
    setRetainerStatus("sent");
    setRetainerSentDate("Jun 9, 2026");
    setShowSendRetainerModal(false);
  };

  const handlePreviewTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowPreviewModal(true);
  };

  const handleMarkAsSigned = () => {
    setShowMarkSignedModal(true);
  };

  const handleConfirmSigned = () => {
    setRetainerStatus("signed");
    setRetainerSignedDate("Jun 9, 2026");
    setAgreementUploaded(true);
    setShowMarkSignedModal(false);
  };

  const handleAddLater = () => {
    setRetainerStatus("signed");
    setRetainerSignedDate("Jun 9, 2026");
    setAgreementUploaded(false);
    setShowMarkSignedModal(false);
  };

  const handleUploadAgreement = () => {
    setAgreementUploaded(true);
  };

  const handleResendRetainer = () => {
    setRetainerSentDate("Jun 9, 2026");
  };

  const handlePreviewDocument = (document: any) => {
    setSelectedDocument(document);
    setPreviewAiOpen(false);
    setPreviewAiMessages([]);
    setPreviewAiInput("");
    setShowDocumentPreview(true);
    setOpenActionMenu(null);
  };

  const handleOpenAiPopup = (document: any) => {
    if (aiPopupDoc?.id === document.id) {
      setAiPopupDoc(null);
    } else {
      setAiPopupDoc(document);
      setAiPopupMessages([]);
      setAiPopupInput("");
    }
    setOpenActionMenu(null);
  };

  const handleSendAiPopup = (text?: string) => {
    const msg = text ?? aiPopupInput;
    if (!msg.trim()) return;
    setAiPopupMessages((prev) => [
      ...prev,
      { role: "user", content: msg },
      { role: "assistant", content: "Based on this document, here is a simulated LECO analysis response. In production this would reflect the actual document content." },
    ]);
    setAiPopupInput("");
  };

  const handleSendPreviewAi = (text?: string) => {
    const msg = text ?? previewAiInput;
    if (!msg.trim()) return;
    setPreviewAiMessages((prev) => [
      ...prev,
      { role: "user", content: msg },
      { role: "assistant", content: "Based on this document, here is a simulated LECO analysis response. In production this would reflect the actual document content." },
    ]);
    setPreviewAiInput("");
  };

  // Shared uploaded documents (pipeline state)
  const sharedDocs = pipeline.documents;
  const plaintiffActivityDetected = sharedDocs.length > 0;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const existing = new Set(sharedDocs.map((d) => d.name));
    const newDocs: typeof sharedDocs = files
      .filter((f) => !existing.has(f.name))
      .map((f) => ({
        id: `${Date.now()}-${f.name}`,
        name: f.name,
        source: "Attorney" as const,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "Processed" as const,
      }));
    if (newDocs.length > 0) {
      onPipelineUpdate({ documents: [...sharedDocs, ...newDocs] });
      setUploadedFileNames(newDocs.map((d) => d.name));
      setShowUploadSuccess(true);
    }
    e.target.value = "";
  };

  const handleSimulateUpload = (source: "Plaintiff" | "Attorney") => {
    const simulatedBatch: CaseDocument[] = [
      { id: `${Date.now()}-1`, name: "MRI_Report_2026.pdf", source, date: "Jun 9, 2026", status: "Processed" },
      { id: `${Date.now()}-2`, name: "ER_Bills.pdf", source, date: "Jun 9, 2026", status: "Processed" },
      { id: `${Date.now()}-3`, name: "police_report_final.pdf", source, date: "Jun 9, 2026", status: "Processed" },
      { id: `${Date.now()}-4`, name: "physical_therapy_notes.pdf", source, date: "Jun 9, 2026", status: "Processed" },
      { id: `${Date.now()}-5`, name: "insurance_policy_v2.pdf", source: "Attorney", date: "Jun 9, 2026", status: "Processed" },
      { id: `${Date.now()}-6`, name: "witness_statement.pdf", source: "Attorney", date: "Jun 9, 2026", status: "Processed" },
    ];
    const existing = new Set(sharedDocs.map((d) => d.name));
    const newDocs = simulatedBatch.filter((d) => !existing.has(d.name));
    if (newDocs.length > 0) onPipelineUpdate({ documents: [...sharedDocs, ...newDocs] });
  };

  const filteredIntakeDocuments = sharedDocs.filter((doc) =>
    doc.name.toLowerCase().includes(documentSearch.toLowerCase())
  );

  // Classification derived from shared docs
  const classifiedCategories = classifyDocuments(sharedDocs);
  const classifiedCount = classifiedCategories.reduce((n, c) => n + c.docs.length, 0);
  const missingEvidence = detectMissingEvidence(classifiedCategories);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const toggleCategory = (name: string) =>
    setExpandedCategories((prev) => ({ ...prev, [name]: prev[name] === false ? true : false }));
  const isCategoryExpanded = (name: string) => expandedCategories[name] !== false;

  // Missing evidence request modal
  const [showMissingRequestModal, setShowMissingRequestModal] = useState(false);
  const [missingCheckedDocs, setMissingCheckedDocs] = useState<Record<string, boolean>>({});
  const [missingDeliveryMethod, setMissingDeliveryMethod] = useState<"email" | "sms">("email");
  const [missingMessageText, setMissingMessageText] = useState("");

  const generateMissingMessage = (docs: string[]) =>
    `Hello ${data.plaintiff},\n\nWe are currently reviewing your case and require additional documents to continue our evaluation.\n\nRequested Documents:\n${docs.map((d) => `• ${d}`).join("\n")}\n\nPlease upload the requested documents using your secure intake link.\n\nIf you have any questions or are unable to obtain a document, please contact our office.\n\nThank you,\nJennifer Davis\nLexGuard Injury Intel`;

  const openMissingRequestModal = () => {
    const allTitles = missingEvidence.map((m) => m.title);
    setMissingCheckedDocs(Object.fromEntries(allTitles.map((t) => [t, true])));
    setMissingMessageText(generateMissingMessage(allTitles));
    setShowMissingRequestModal(true);
  };

  const handleMissingDocCheck = (title: string, checked: boolean) => {
    const next = { ...missingCheckedDocs, [title]: checked };
    setMissingCheckedDocs(next);
    const selected = missingEvidence.filter((m) => next[m.title]).map((m) => m.title);
    setMissingMessageText(generateMissingMessage(selected));
  };

  const selectedMissingTitles = missingEvidence.filter((m) => missingCheckedDocs[m.title]).map((m) => m.title);

  const handleCopyRetainerLink = () => {
    const textArea = document.createElement("textarea");
    textArea.value = retainerLink;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
    textArea.remove();
  };

  const missingDocuments = documentProgress
    .filter((doc) => !doc.complete)
    .map((doc) => doc.name);

  const allRequiredReceived = documentProgress.every((doc) => doc.complete);

  const requestedDocumentsCount = documents.filter((doc) => doc.enabled).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Context Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
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

      <StageNavigator currentStage="Client Intake" onStageClick={onStageClick} />

      <div className="max-w-[1400px] mx-auto p-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Intake & Document Collection</h1>
          <p className="text-gray-600">Manage the retainer agreement, send the intake request, and collect all case documents from the client and attorney.</p>
        </div>

        <CaseSnapshot
          caseName={data.caseName}
          caseType={data.caseType}
          caseSubType={(data as any).caseSubType}
          plaintiff={data.plaintiff}
          plaintiffEmail={data.plaintiffEmail}
          plaintiffPhone={data.plaintiffPhone}
          jurisdiction={data.jurisdiction}
          caseId={data.caseId}
          dateOfIncident={data.dateOfIncident}
          summary={data.summary}
        />

        {/* Accordion Sections */}
        <div className="space-y-3">

          {/* ── Retainer ── */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {/* Accordion header */}
            <div className="flex items-center justify-between px-6 py-5">
              <button onClick={() => toggleAccordion("retainer")} className="flex-1 text-left">
                <span className="text-base font-semibold text-gray-900">Retainer</span>
              </button>
              <div className="flex items-center gap-3 shrink-0">
                {/* Demo state toggle — prototype only */}
                {retainerStatus !== "not-sent" && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">Demo</span>
                    <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs font-medium">
                      <button onClick={() => setDemoRetainerState("sent")} className={`px-3 py-1.5 rounded-md transition-all ${demoRetainerState === "sent" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                        Awaiting Signature
                      </button>
                      <button onClick={() => setDemoRetainerState("signed")} className={`px-3 py-1.5 rounded-md transition-all ${demoRetainerState === "signed" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                        Signed
                      </button>
                    </div>
                  </div>
                )}
                <button onClick={() => toggleAccordion("retainer")}>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${accordionOpen.retainer ? "" : "-rotate-90"}`} />
                </button>
              </div>
            </div>

            {accordionOpen.retainer && (
              <div className="border-t border-gray-100 p-6">
              <div className="space-y-6">
                {retainerStatus === "not-sent" ? (
                  <div className="text-center py-10">
                    <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">No Retainer Agreement Sent</h3>
                    <p className="text-sm text-gray-500 mb-6">Send a retainer agreement to the plaintiff to begin the representation.</p>
                    <div className="flex items-center justify-center gap-3">
                      <Button onClick={handleOpenSendRetainerModal} className="bg-cyan-500 hover:bg-cyan-600 text-white border-0 gap-2">
                        Send Retainer
                      </Button>
                      <Button onClick={handleMarkAsSigned} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
                        Mark as Signed
                      </Button>
                    </div>
                  </div>

                ) : demoRetainerState === "sent" ? (
                  /* ── STATE 1: Awaiting Signature ── */
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 bg-cyan-50 border-b border-cyan-100">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-sm font-semibold text-cyan-800">Retainer Sent — Awaiting Signature</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                      {[
                        { label: "Status", value: "Sent" },
                        { label: "Date Sent", value: retainerSentDate || "Jun 9, 2026" },
                        { label: "Recipient", value: retainerEmail || data.plaintiffEmail || data.plaintiff },
                        { label: "Template", value: selectedTemplateName || "Personal Injury Retainer Agreement v1" },
                      ].map(({ label, value }) => (
                        <div key={label} className="px-5 py-4">
                          <div className="text-xs text-gray-400 font-medium mb-1">{label}</div>
                          <div className="text-sm font-semibold text-gray-900">{value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="px-6 py-4 border-b border-gray-100">
                      <p className="text-sm text-gray-500">The retainer agreement has been sent to the client and is awaiting signature.</p>
                    </div>

                    <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50">
                      <button onClick={handleOpenSendRetainerModal} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5" /> Resend
                      </button>
                      <button onClick={() => setShowUploadAgreementModal(true)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" /> Upload Agreement
                      </button>
                    </div>
                  </div>

                ) : (
                  /* ── STATE 2: Signed ── */
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 bg-green-50 border-b border-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <span className="text-sm font-semibold text-green-800">Retainer Signed</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                      {[
                        { label: "Status", value: "Signed" },
                        { label: "Signed Date", value: retainerSignedDate || "Jun 11, 2026" },
                        { label: "Recipient", value: retainerEmail || data.plaintiffEmail || data.plaintiff },
                        { label: "Template", value: selectedTemplateName || "Personal Injury Retainer Agreement v1" },
                      ].map(({ label, value }) => (
                        <div key={label} className="px-5 py-4">
                          <div className="text-xs text-gray-400 font-medium mb-1">{label}</div>
                          <div className="text-sm font-semibold text-gray-900">{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Signed document row */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-medium mb-0.5">Signed Document</div>
                          <div className="text-sm font-semibold text-gray-900">Signed_PI_Retainer.pdf</div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-100">
                      <p className="text-sm text-gray-500">A signed retainer agreement has been received and attached to this case.</p>
                    </div>

                    <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50">
                      <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                      <button onClick={() => setShowGenerateNewRetainerModal(true)} className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Generate New Retainer
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </div>
            )}
          </div>

          {/* ── Intake Request ── */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5">
              <button onClick={() => toggleAccordion("request")} className="flex-1 text-left">
                <span className="text-base font-semibold text-gray-900">Intake Request</span>
              </button>
              <div className="flex items-center gap-3 shrink-0">
                {/* intentionally empty — demo state is now per-card */}
                <button onClick={() => toggleAccordion("request")}>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${accordionOpen.request ? "" : "-rotate-90"}`} />
                </button>
              </div>
            </div>
            {accordionOpen.request && (
              <div className="border-t border-gray-100 p-6">
              <div className="space-y-6">
                {!intakeCreated ? (
                  <>
                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        onClick={() => setShowIntakeModal(true)}
                        className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-cyan-300 transition-all group text-left"
                      >
                        <div className="space-y-4">
                          <div className="p-4 bg-cyan-50 rounded-xl inline-flex">
                            <Send className="w-8 h-8 text-cyan-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Intake Form</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Create a secure intake form that the plaintiff can use to upload documents.
                            </p>
                            <div className="flex items-center gap-2 text-cyan-600 font-medium text-sm group-hover:gap-3 transition-all">
                              Create Intake Form
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSimulateUpload("Attorney")}
                        className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-cyan-300 transition-all group text-left"
                      >
                        <div className="space-y-4">
                          <div className="p-4 bg-cyan-50 rounded-xl inline-flex">
                            <Upload className="w-8 h-8 text-cyan-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Existing Files</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Upload documents already received outside LECO.
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              Examples: Email attachments • Physical paperwork • Police reports • Hospital records
                            </p>
                            <div className="flex items-center gap-2 text-cyan-600 font-medium text-sm group-hover:gap-3 transition-all">
                              Upload Files
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </>
                ) : (
<>
                    <div className="space-y-4">
                      {(intakeRequests.length > 0 ? intakeRequests : [buildNewRequest({ id: "REQ-001", status: intakeSent ? "Sent" : "Draft" as any })]).map((req) => {
                        const isCompleted = req.status === "Completed";
                        const isSent = req.status === "Sent" || req.status === "Draft";
                        const statusColors: Record<string, string> = {
                          Draft: "bg-gray-100 text-gray-600",
                          Sent: "bg-cyan-50 text-cyan-700",
                          Completed: "bg-green-50 text-green-700",
                          Expired: "bg-red-50 text-red-700",
                          Cancelled: "bg-gray-100 text-gray-500",
                        };

                        return (
                          <div key={req.id} className="border border-gray-200 rounded-xl overflow-hidden" onClick={() => intakeOverflowOpen && setIntakeOverflowOpen(null)}>

                            {/* Card header */}
                            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xs font-bold text-gray-500 font-mono">{req.id}</span>
                                {req.version > 1 && <span className="text-xs text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded font-mono">v{req.version}</span>}
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${statusColors[req.status] ?? "bg-gray-100 text-gray-600"}`}>
                                  {isCompleted ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                  {req.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Per-card demo toggle for Sent cards */}
                                {isSent && (
                                  <button
                                    onClick={() => handleMarkCompleted(req.id)}
                                    className="text-xs text-gray-400 hover:text-gray-600 border border-dashed border-gray-300 px-2.5 py-1 rounded-lg transition-colors"
                                  >
                                    Demo: Mark Completed
                                  </button>
                                )}
                                <span className="text-xs text-gray-400">{req.lastSent}</span>
                              </div>
                            </div>

                            {isSent ? (
                              /* ── SENT STATE ── */
                              <>
                                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                                  <div className="px-5 py-4">
                                    <div className="text-xs text-gray-400 font-medium mb-1">Recipient</div>
                                    <div className="text-sm font-semibold text-gray-900 truncate">{req.recipient}</div>
                                  </div>
                                  <div className="px-5 py-4">
                                    <div className="text-xs text-gray-400 font-medium mb-1">Delivery</div>
                                    <div className="text-sm font-semibold text-gray-900 capitalize">{req.deliveryMethod}</div>
                                  </div>
                                  <div className="px-5 py-4">
                                    <div className="text-xs text-gray-400 font-medium mb-1">Documents Requested</div>
                                    <div className="text-sm font-semibold text-gray-900">{req.requestedDocs.length}</div>
                                  </div>
                                  <div className="px-5 py-4">
                                    <div className="text-xs text-gray-400 font-medium mb-1">Documents</div>
                                    <div className="space-y-0.5">
                                      {req.requestedDocs.slice(0, 3).map((d) => <div key={d} className="text-xs text-gray-600 truncate">• {d}</div>)}
                                      {req.requestedDocs.length > 3 && <div className="text-xs text-gray-400">+{req.requestedDocs.length - 3} more</div>}
                                    </div>
                                  </div>
                                </div>
                                {req.lastModified && (
                                  <div className="px-5 py-2 bg-amber-50 border-b border-amber-100 text-xs text-amber-700">
                                    Last modified {req.lastModified}
                                  </div>
                                )}
                                <div className="flex items-center justify-between px-5 py-3.5 bg-white">
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => handleModifyRequest(req.id)} className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                                      <Pencil className="w-3.5 h-3.5" /> Modify Request
                                    </button>
                                    <button onClick={() => handleOpenResend(req.id)} className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                                      <RefreshCw className="w-3.5 h-3.5" /> Resend
                                    </button>
                                  </div>
                                  <div className="relative">
                                    <button onClick={(e) => { e.stopPropagation(); setIntakeOverflowOpen(intakeOverflowOpen === req.id ? null : req.id); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                      <MoreVertical className="w-4 h-4 text-gray-500" />
                                    </button>
                                    {intakeOverflowOpen === req.id && (
                                      <div className="absolute right-0 bottom-10 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                                        <button onClick={() => { handleModifyRequest(req.id); setIntakeOverflowOpen(null); }} className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <Pencil className="w-3.5 h-3.5 text-gray-400" /> Update Recipient
                                        </button>
                                        <button onClick={() => setIntakeOverflowOpen(null)} className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <FileText className="w-3.5 h-3.5 text-gray-400" /> View Requested Documents
                                        </button>
                                        <button onClick={() => setIntakeOverflowOpen(null)} className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <Clock className="w-3.5 h-3.5 text-gray-400" /> View Activity Log
                                        </button>
                                        <button onClick={() => { setIntakeRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: "Cancelled" as any } : r)); setIntakeOverflowOpen(null); }} className="w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100">
                                          <X className="w-3.5 h-3.5" /> Cancel Request
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : (
                              /* ── COMPLETED STATE ── */
                              <>
                                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                                  <div className="px-5 py-4">
                                    <div className="text-xs text-gray-400 font-medium mb-1">Status</div>
                                    <div className="text-sm font-semibold text-gray-900">Completed</div>
                                  </div>
                                  <div className="px-5 py-4">
                                    <div className="text-xs text-gray-400 font-medium mb-1">Recipient</div>
                                    <div className="text-sm font-semibold text-gray-900 truncate">{req.recipient}</div>
                                  </div>
                                  <div className="px-5 py-4">
                                    <div className="text-xs text-gray-400 font-medium mb-1">Documents Received</div>
                                    <div className="text-2xl font-bold text-gray-900">{req.docsReceived ?? 8}</div>
                                  </div>
                                  <div className="px-5 py-4">
                                    <div className="text-xs text-gray-400 font-medium mb-1">Missing Documents</div>
                                    <div className="text-2xl font-bold text-orange-500">{req.missingDocs ?? 1}</div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between px-5 py-3.5 bg-white">
                                  <button onClick={handleOpenAdditionalRequest} className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> Create Additional Request
                                  </button>
                                  <button onClick={() => { setViewingSubmissionId(req.id); setShowViewSubmissionModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold transition-all">
                                    <Eye className="w-3.5 h-3.5" /> View Submission
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Attorney Upload Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Existing Files</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Add documents already received outside the LECO intake process.
                      </p>

                      {showUploadSuccess && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-green-800 mb-1">
                                {uploadedFileNames.length} file{uploadedFileNames.length > 1 ? "s" : ""} uploaded successfully
                              </p>
                              <ul className="space-y-0.5">
                                {uploadedFileNames.map((name) => (
                                  <li key={name} className="text-xs text-green-700 font-mono">{name}</li>
                                ))}
                              </ul>
                              <button
                                onClick={() => setAccordionOpen((prev) => ({ ...prev, documents: true }))}
                                className="mt-2 text-xs font-medium text-green-700 underline hover:text-green-900 transition-colors"
                              >
                                View in Documents tab →
                              </button>
                            </div>
                            <button
                              onClick={() => setShowUploadSuccess(false)}
                              className="text-green-400 hover:text-green-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileInputChange}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 text-cyan-700 rounded-lg text-sm font-medium hover:bg-cyan-100 transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Files
                      </button>
                    </div>
                  </>
                )}
              </div>
              </div>
            )}
          </div>

          {/* ── Documents ── */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleAccordion("documents")}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-base font-semibold text-gray-900">Documents</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${accordionOpen.documents ? "" : "-rotate-90"}`} />
            </button>
            {accordionOpen.documents && (
              <div className="border-t border-gray-100 p-6">
              <div className="space-y-6">
                {/* Documents Sub-Tabs */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setDocumentsSubTab("retainer")}
                      className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                        documentsSubTab === "retainer"
                          ? "bg-cyan-50 text-cyan-600 border-b-2 border-cyan-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Retainer Documents
                    </button>
                    <button
                      onClick={() => setDocumentsSubTab("intake")}
                      className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                        documentsSubTab === "intake"
                          ? "bg-cyan-50 text-cyan-600 border-b-2 border-cyan-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Case Evidence
                    </button>
                  </div>

                  <div className="p-6">
                    {documentsSubTab === "retainer" ? (
                      retainerStatus !== "signed" ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <FileText className="w-8 h-8 text-gray-200 mb-3" />
                          <p className="text-sm text-gray-400">No retainer documents yet.</p>
                          <p className="text-xs text-gray-300 mt-1">Send and sign a retainer agreement to see documents here.</p>
                        </div>
                      ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                                Document Name
                              </th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                                Status
                              </th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                                Date
                              </th>
                              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {allRetainerDocuments.map((doc, index) => (
                              <tr
                                key={index}
                                onClick={() => handlePreviewDocument(doc)}
                                className="hover:bg-gray-50 cursor-pointer"
                              >
                                <td className="py-3 px-4 text-sm text-gray-900 font-mono">{doc.name}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      doc.status === "Signed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-cyan-100 text-cyan-700"
                                    }`}
                                  >
                                    {doc.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">{doc.date}</td>
                                <td className="py-3 px-4 text-right">
                                  <div className="relative inline-block">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenActionMenu(openActionMenu === doc.name ? null : doc.name);
                                      }}
                                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    >
                                      <MoreVertical className="w-4 h-4 text-gray-600" />
                                    </button>
                                    {openActionMenu === doc.name && (
                                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handlePreviewDocument(doc);
                                          }}
                                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                          <Eye className="w-4 h-4" />
                                          Preview
                                        </button>
                                        <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <Download className="w-4 h-4" />
                                          Download
                                        </button>
                                        <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                          <Info className="w-4 h-4" />
                                          View Details
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      )
                    ) : (
                      <div className="space-y-4">
                        {sharedDocs.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-14 text-center">
                            <Upload className="w-8 h-8 text-gray-200 mb-3" />
                            <p className="text-sm font-medium text-gray-500 mb-1">No evidence has been received yet.</p>
                            <p className="text-xs text-gray-400 mb-4">Upload documents manually or wait for the plaintiff to complete the intake request.</p>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              Upload Documents
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Classification Summary Bar */}
                            <div className="flex items-center justify-between gap-4 bg-green-50 border border-green-200 rounded-xl px-5 py-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                <span className="text-sm font-semibold text-green-800">Document Processing Complete</span>
                              </div>
                              <div className="flex items-center gap-6 text-xs">
                                <div className="text-center">
                                  <div className="font-bold text-gray-900">{sharedDocs.length}</div>
                                  <div className="text-gray-500">Processed</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-gray-900">{classifiedCount}</div>
                                  <div className="text-gray-500">Organized</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-gray-900">{sharedDocs.length - classifiedCount}</div>
                                  <div className="text-gray-500">Review</div>
                                </div>
                                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg font-semibold">Ready For Analysis</span>
                              </div>
                            </div>

                            {/* Categorized document sections */}
                            {classifiedCategories.map((category) => (
                              <div key={category.name} className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => toggleCategory(category.name)}
                                  className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-800">{category.name}</span>
                                    <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">{category.docs.length}</span>
                                  </div>
                                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryExpanded(category.name) ? "" : "-rotate-90"}`} />
                                </button>
                                {isCategoryExpanded(category.name) && (
                                  <table className="w-full">
                                    <thead className="bg-white border-b border-gray-100">
                                      <tr>
                                        <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 uppercase">File Name</th>
                                        <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 uppercase">Source</th>
                                        <th className="text-left px-5 py-2.5 text-xs font-medium text-gray-400 uppercase">Date</th>
                                        <th className="text-right px-5 py-2.5 text-xs font-medium text-gray-400 uppercase">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                      {category.docs.map((doc) => {
                                        const isAiActive = aiPopupDoc?.id === doc.id;
                                        const isOtherActive = aiPopupDoc && !isAiActive;
                                        return (
                                          <React.Fragment key={doc.id}>
                                          <tr
                                            className={`transition-all ${isAiActive ? "bg-purple-50 ring-1 ring-inset ring-purple-200" : isOtherActive ? "opacity-40 pointer-events-none" : "hover:bg-gray-50"}`}
                                          >
                                            <td className="px-5 py-3 text-sm text-gray-900 font-mono">{doc.name}</td>
                                            <td className="px-5 py-3 text-sm text-gray-500">{doc.source}</td>
                                            <td className="px-5 py-3 text-sm text-gray-500">{doc.date}</td>
                                            <td className="px-5 py-3 text-right">
                                              <div className="flex items-center justify-end gap-2">
                                                <button
                                                  onClick={() => handlePreviewDocument(doc)}
                                                  className="flex items-center gap-1 text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-cyan-50"
                                                >
                                                  <Eye className="w-3.5 h-3.5" /> Preview
                                                </button>
                                                <button
                                                  onClick={() => handleOpenAiPopup(doc)}
                                                  className={`flex items-center gap-1 text-xs font-medium transition-colors px-2.5 py-1.5 rounded-lg ${isAiActive ? "bg-purple-100 text-purple-700" : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"}`}
                                                >
                                                  <Bot className="w-3.5 h-3.5" /> Chat With AI
                                                </button>
                                                <div className="relative">
                                                  <button
                                                    onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu === doc.id ? null : doc.id); }}
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                                  >
                                                    <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                                                  </button>
                                                  {openActionMenu === doc.id && (
                                                    <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                                                      <button className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                        <Pencil className="w-3.5 h-3.5 text-gray-400" /> Edit Document
                                                      </button>
                                                      <button className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                        <Download className="w-3.5 h-3.5 text-gray-400" /> Download
                                                      </button>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                          {isAiActive && (
                                            <tr key={`${doc.id}-ai`}>
                                              <td colSpan={4} className="px-5 pb-4">
                                                <div className="bg-white border border-purple-200 rounded-xl overflow-hidden shadow-sm">
                                                  {/* AI Panel Header */}
                                                  <div className="flex items-center justify-between px-4 py-3 bg-purple-50 border-b border-purple-100">
                                                    <div className="flex items-center gap-2">
                                                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                                                      <span className="text-sm font-semibold text-purple-900">Chat With AI</span>
                                                      <span className="text-xs text-purple-500 font-mono">· {doc.name}</span>
                                                    </div>
                                                    <button onClick={() => setAiPopupDoc(null)} className="p-1 hover:bg-purple-100 rounded-lg transition-colors">
                                                      <X className="w-3.5 h-3.5 text-purple-400" />
                                                    </button>
                                                  </div>

                                                  {/* Messages */}
                                                  <div className="p-4 space-y-2 max-h-64 overflow-auto">
                                                    {aiPopupMessages.length === 0 ? (
                                                      <div>
                                                        <p className="text-xs text-gray-400 mb-2">Try asking:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                          {["Summarize this document", "What injuries are mentioned?", "Create a treatment timeline", "Does this support liability?", "Identify key findings", "What should I review first?"].map((p) => (
                                                            <button key={p} onClick={() => handleSendAiPopup(p)} className="text-xs text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200 rounded-lg px-3 py-1.5 transition-colors">
                                                              {p}
                                                            </button>
                                                          ))}
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      aiPopupMessages.map((msg, i) => (
                                                        <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                                                          <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${msg.role === "user" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-900"}`}>
                                                            {msg.content}
                                                          </div>
                                                        </div>
                                                      ))
                                                    )}
                                                  </div>

                                                  {/* Input */}
                                                  <div className="border-t border-gray-100 px-4 py-3">
                                                    <div className="flex gap-2">
                                                      <input
                                                        type="text"
                                                        value={aiPopupInput}
                                                        onChange={(e) => setAiPopupInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" && handleSendAiPopup()}
                                                        placeholder="Ask anything about this document..."
                                                        autoFocus
                                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                                                      />
                                                      <button onClick={() => handleSendAiPopup()} className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                                                        <Send className="w-4 h-4" />
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                          </React.Fragment>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Missing Evidence Analysis — only in Case Evidence sub-tab */}
                {documentsSubTab === "intake" && sharedDocs.length > 0 && (
                  <>
                    {/* Section 1 — Missing Evidence Cards */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">Missing Evidence Analysis</h2>
                      <p className="text-sm text-gray-500 mb-5">Evidence gaps identified during document processing that may impact case analysis.</p>

                      {missingEvidence.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                          <p className="text-sm font-semibold text-gray-700 mb-1">No Missing Evidence Identified</p>
                          <p className="text-xs text-gray-400">All expected evidence has been received and processed.</p>
                          <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-200">
                            <CheckCircle className="w-3.5 h-3.5" /> Evidence Collection Complete
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
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
                          <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button onClick={openMissingRequestModal} className="bg-cyan-500 hover:bg-cyan-600 text-white border-0">
                              Send Missing Document Request
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Bottom CTA */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={onContinue}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0 gap-2"
                  >
                    Proceed to Analysis
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              </div>
            )}
          </div>

        </div>{/* end accordion space-y-3 */}
      </div>

      {/* Intake Form Modal */}
      {showIntakeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {intakeModalMode === "modify" ? "Modify Intake Request" : intakeModalMode === "additional" ? "Create Additional Document Request" : "Create Intake Request"}
                </h2>
                <button
                  onClick={() => setShowIntakeModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Delivery Method */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Send To</h3>
                {!hasContact ? (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-orange-700">
                      No contact information is available for this client. Please update client contact information before sending an intake request.
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                    {hasEmail && (
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="intakeDelivery"
                          value="email"
                          checked={deliveryMethod === "email"}
                          onChange={() => setDeliveryMethod("email")}
                          className="w-4 h-4 accent-cyan-500 cursor-pointer"
                        />
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900 mb-0.5">Email</div>
                          {editingEmail ? (
                            <input
                              type="email"
                              value={editableEmail}
                              onChange={(e) => setEditableEmail(e.target.value)}
                              autoFocus
                              className="w-full text-xs border border-cyan-400 rounded-md px-2 py-1 text-gray-900 focus:outline-none"
                            />
                          ) : (
                            <div className="text-xs text-gray-500">{editableEmail}</div>
                          )}
                        </div>
                        {editingEmail ? (
                          <button
                            onClick={() => setEditingEmail(false)}
                            className="text-xs font-medium text-cyan-600 hover:text-cyan-700 shrink-0 transition-colors"
                          >
                            Done
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingEmail(true)}
                            className="text-xs font-medium text-cyan-600 hover:text-cyan-700 shrink-0 transition-colors"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                    {hasPhone && (
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="intakeDelivery"
                          value="sms"
                          checked={deliveryMethod === "sms"}
                          onChange={() => setDeliveryMethod("sms")}
                          className="w-4 h-4 accent-cyan-500 cursor-pointer"
                        />
                        <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900 mb-0.5">SMS</div>
                          {editingPhone ? (
                            <input
                              type="tel"
                              value={editablePhone}
                              onChange={(e) => setEditablePhone(e.target.value)}
                              autoFocus
                              className="w-full text-xs border border-cyan-400 rounded-md px-2 py-1 text-gray-900 focus:outline-none"
                            />
                          ) : (
                            <div className="text-xs text-gray-500">{editablePhone}</div>
                          )}
                        </div>
                        {editingPhone ? (
                          <button
                            onClick={() => setEditingPhone(false)}
                            className="text-xs font-medium text-cyan-600 hover:text-cyan-700 shrink-0 transition-colors"
                          >
                            Done
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingPhone(true)}
                            className="text-xs font-medium text-cyan-600 hover:text-cyan-700 shrink-0 transition-colors"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Previously Requested — only for additional mode */}
              {intakeModalMode === "additional" && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Previously Requested</h3>
                  <div className="space-y-1.5">
                    {(intakeRequests[0]?.requestedDocs ?? documents.filter((d) => d.enabled).map((d) => d.name)).map((doc) => (
                      <div key={doc} className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" /> {doc}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Documents */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  {intakeModalMode === "additional" ? "Additional Documents to Request" : "Required Documents"}
                </h3>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div key={doc.name} className="flex items-center gap-3">
                      <button
                        onClick={() => toggleDocument(index)}
                        disabled={doc.required}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          doc.enabled
                            ? "bg-cyan-500 border-cyan-500"
                            : "bg-white border-gray-300 hover:border-gray-400"
                        } ${doc.required ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {doc.enabled && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <span className={`text-sm ${doc.enabled ? "text-gray-900" : "text-gray-500"}`}>
                        {doc.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Instructions */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Additional Instructions</h3>
                <textarea
                  rows={4}
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Provide any additional information or supporting documents that may help evaluate your claim."
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 resize-none transition-all"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
              <button
                onClick={() => { setShowIntakeModal(false); setEmailError(false); setIntakeModalMode("create"); setActiveModifyId(null); }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              {intakeModalMode === "create" && (
                <button onClick={handleCreateForm} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                  Create Form
                </button>
              )}
              <Button
                onClick={handleSendRequest}
                disabled={!hasContact}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0 gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {intakeModalMode === "modify" ? "Save Changes" : intakeModalMode === "additional" ? "Send Request" : "Send Request"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resend Confirmation Modal */}
      {showResendModal && (() => {
        const req = intakeRequests.find((r) => r.id === resendingId) ?? intakeRequests[0];
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Resend Intake Request</h2>
                <button onClick={() => setShowResendModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              {req && (
                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-500">This will resend the existing intake request to the recipient below.</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl divide-y divide-gray-100">
                    <div className="px-4 py-3"><div className="text-xs text-gray-400 mb-0.5">Recipient</div><div className="text-sm font-semibold text-gray-900">{req.recipient}</div></div>
                    <div className="px-4 py-3"><div className="text-xs text-gray-400 mb-0.5">Delivery Method</div><div className="text-sm font-semibold text-gray-900 capitalize">{req.deliveryMethod}</div></div>
                    <div className="px-4 py-3"><div className="text-xs text-gray-400 mb-0.5">Requested Documents</div><div className="text-sm font-semibold text-gray-900">{req.requestedDocs.join(", ")}</div></div>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button onClick={() => setShowResendModal(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={handleConfirmResend} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> Resend Request
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* View Submission Modal */}
      {showViewSubmissionModal && (() => {
        const req = intakeRequests.find((r) => r.id === viewingSubmissionId);
        const submittedDocs = ["MRI_Report_2026.pdf", "ER_Bills.pdf", "hospital_medical_records.pdf", "police_report_final.pdf", "physical_therapy_notes.pdf", "insurance_policy_v2.pdf", "witness_statement.pdf", "wage_loss_statement.pdf"];
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Submission Details</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{req?.id} · Submitted Jun 12, 2026</p>
                </div>
                <button onClick={() => setShowViewSubmissionModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6 space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  {[{ label: "Documents Received", value: "8", color: "text-gray-900" }, { label: "Missing Documents", value: "1", color: "text-orange-500" }, { label: "Completion", value: "100%", color: "text-green-600" }].map(({ label, value, color }) => (
                    <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                      <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
                      <div className="text-xs text-gray-400">{label}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Received Documents</h3>
                  <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                    {submittedDocs.map((doc) => (
                      <div key={doc} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-900 font-mono">{doc}</span>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100 shrink-0">
                <button onClick={() => setShowViewSubmissionModal(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">Close</button>
                <button onClick={handleOpenAdditionalRequest} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Create Additional Request
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Follow-up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Send Follow-up Request</h2>
                <button
                  onClick={() => setShowFollowUpModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Recipient */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Recipient</h3>
                <div className="text-sm text-gray-900">{recipientEmail}</div>
              </div>

              {/* Missing Documents */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Missing Documents</h3>
                <div className="space-y-2">
                  {missingDocuments.map((doc) => (
                    <div key={doc} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded border bg-cyan-500 border-cyan-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-900">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Message</h3>
                <textarea
                  rows={8}
                  value={followUpMessage}
                  onChange={(e) => setFollowUpMessage(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 resize-none transition-all"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <Button
                onClick={handleSendFollowUp}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0"
              >
                Send Follow-up
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Send Retainer Modal */}
      {showSendRetainerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Send Retainer Agreement</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Select a retainer template and send it to the plaintiff for signature.
                  </p>
                </div>
                <button
                  onClick={() => setShowSendRetainerModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Recipient Information */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Recipient Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plaintiff Name</label>
                    <input
                      type="text"
                      value={data.plaintiff}
                      disabled
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
                      <input
                        type="email"
                        value={retainerEmail}
                        onChange={(e) => setRetainerEmail(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Phone</label>
                      <input
                        type="tel"
                        value={retainerPhone}
                        onChange={(e) => setRetainerPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Retainer Template */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Retainer Template</h3>
                <div className="space-y-3">
                  {retainerTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-xl p-4 transition-all cursor-pointer ${
                        selectedTemplate === template.id
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedTemplate === template.id
                                  ? "border-cyan-500 bg-cyan-500"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {selectedTemplate === template.id && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">{template.name}</div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Last Updated: {template.lastUpdated}</span>
                              <span>•</span>
                              <span>Created By: {template.createdBy}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewTemplate(template.id);
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Message */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Message to Plaintiff <span className="text-gray-400 font-normal">(Optional)</span>
                </h3>
                <textarea
                  rows={5}
                  value={retainerMessage}
                  onChange={(e) => setRetainerMessage(e.target.value)}
                  placeholder={`Hello ${data.plaintiff},\n\nPlease review and sign the attached retainer agreement to begin representation.\n\nThank you.`}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 resize-none transition-all"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSendRetainerModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <Button
                onClick={handleSendRetainer}
                disabled={!selectedTemplate || !retainerEmail}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Retainer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Preview Retainer Agreement</h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-3xl mx-auto">
                {/* Firm Branding */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">LG</span>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-gray-900">LexGuard</div>
                      <div className="text-xs text-cyan-600">Injury Intel</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">123 Legal Ave, Suite 100</div>
                  <div className="text-sm text-gray-600">Chicago, IL 60601</div>
                  <div className="text-sm text-gray-600">contact@lexguard.law</div>
                </div>

                {/* Agreement Content */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    RETAINER AGREEMENT FOR LEGAL SERVICES
                  </h3>
                  <div className="space-y-4 text-sm text-gray-700">
                    <p>
                      This Retainer Agreement ("Agreement") is entered into on{" "}
                      <span className="font-semibold">[Date]</span> by and between{" "}
                      <span className="font-semibold">LexGuard Legal Group</span> ("Attorney") and{" "}
                      <span className="font-semibold">{data.plaintiff}</span> ("Client").
                    </p>
                    <p className="font-semibold">1. SCOPE OF REPRESENTATION</p>
                    <p>
                      Attorney agrees to represent Client in connection with a personal injury claim arising from
                      incidents described in the case summary. Attorney will provide legal advice, investigate the
                      claim, negotiate with insurance companies, and if necessary, file a lawsuit.
                    </p>
                    <p className="font-semibold">2. ATTORNEY'S FEES</p>
                    <p>
                      Client agrees to pay Attorney a contingency fee equal to 33.33% (one-third) of any recovery
                      obtained through settlement or judgment. If no recovery is obtained, Client owes no attorney
                      fees.
                    </p>
                    <p className="font-semibold">3. COSTS AND EXPENSES</p>
                    <p>
                      Client is responsible for all case-related costs and expenses, including filing fees, expert
                      witness fees, deposition costs, and investigation expenses. These costs will be deducted from
                      any recovery before calculating attorney's fees.
                    </p>
                    <p className="text-gray-500 italic">[Additional terms and conditions...]</p>
                  </div>
                </div>

                {/* Signature Section */}
                <div className="border-t border-gray-200 pt-6 mt-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-4">CLIENT SIGNATURE</div>
                      <div className="border-b-2 border-gray-300 mb-2 h-12"></div>
                      <div className="text-xs text-gray-600">Signature</div>
                      <div className="mt-4">
                        <div className="border-b border-gray-300 mb-1 h-8"></div>
                        <div className="text-xs text-gray-600">Date</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-4">ATTORNEY SIGNATURE</div>
                      <div className="border-b-2 border-gray-300 mb-2 h-12"></div>
                      <div className="text-xs text-gray-600">Signature</div>
                      <div className="mt-4">
                        <div className="border-b border-gray-300 mb-1 h-8"></div>
                        <div className="text-xs text-gray-600">Date</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Missing Document Request Modal */}
      {showMissingRequestModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Missing Document Request</h2>
                <p className="text-xs text-gray-500 mt-0.5">Review and approve before sending to client</p>
              </div>
              <button onClick={() => setShowMissingRequestModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Missing Documents */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Missing Documents</h3>
                <p className="text-xs text-gray-500 mb-3">Uncheck any document you do not want to request.</p>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                  {missingEvidence.map((item) => (
                    <label key={item.title} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={!!missingCheckedDocs[item.title]}
                        onChange={(e) => handleMissingDocCheck(item.title, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 accent-cyan-500"
                      />
                      <div>
                        <div className="text-sm text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-400 font-mono">{item.expected}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedMissingTitles.length === 0 && (
                  <p className="text-xs text-orange-600 mt-2">Select at least one document to send a request.</p>
                )}
              </div>

              {/* Contact Method */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Send To</h3>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                  {data.plaintiffEmail && (
                    <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="radio" name="missingDelivery" value="email" checked={missingDeliveryMethod === "email"} onChange={() => setMissingDeliveryMethod("email")} className="w-4 h-4 accent-cyan-500" />
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <div className="text-sm text-gray-900">Email</div>
                        <div className="text-xs text-gray-500">{data.plaintiffEmail}</div>
                      </div>
                    </label>
                  )}
                  <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="missingDelivery" value="sms" checked={missingDeliveryMethod === "sms"} onChange={() => setMissingDeliveryMethod("sms")} className="w-4 h-4 accent-cyan-500" />
                    <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <div className="text-sm text-gray-900">SMS</div>
                      <div className="text-xs text-gray-500">{data.plaintiffPhone || editablePhone}</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Message Preview */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Message Preview</h3>
                <p className="text-xs text-gray-500 mb-3">This message was generated automatically. You may edit it before sending.</p>
                <textarea
                  value={missingMessageText}
                  onChange={(e) => setMissingMessageText(e.target.value)}
                  rows={10}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 leading-relaxed focus:outline-none focus:border-cyan-400 transition-colors resize-none bg-gray-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 shrink-0">
              <Button onClick={() => setShowMissingRequestModal(false)} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
                Cancel
              </Button>
              <Button
                disabled={selectedMissingTitles.length === 0}
                onClick={() => setShowMissingRequestModal(false)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white border-0 gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {showDocumentPreview && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl flex flex-col overflow-hidden shadow-2xl" style={{ height: "90vh" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <div>
                <h2 className="text-base font-semibold text-gray-900 font-mono">{selectedDocument.name}</h2>
                <p className="text-xs text-gray-500">{selectedDocument.source} · {selectedDocument.date || "Jun 8, 2026"}</p>
              </div>
              <button onClick={() => { setShowDocumentPreview(false); setSelectedDocument(null); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left — Document Viewer */}
              <div className="flex-1 flex flex-col border-r border-gray-200 overflow-hidden">
                {/* Viewer toolbar */}
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 bg-gray-50 shrink-0">
                  <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"><ZoomOut className="w-4 h-4 text-gray-500" /></button>
                  <span className="text-xs text-gray-500">100%</span>
                  <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"><ZoomIn className="w-4 h-4 text-gray-500" /></button>
                  <div className="flex-1" />
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                    <span>Page 1 of 1</span>
                    <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Viewer area */}
                <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-8">
                  <div className="bg-white rounded-xl shadow-md w-full max-w-2xl min-h-[500px] flex items-center justify-center border border-gray-200">
                    <div className="text-center">
                      <FileText className="w-14 h-14 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 font-mono">{selectedDocument.name}</p>
                      <p className="text-xs text-gray-300 mt-1">
                        {selectedDocument.name.endsWith(".pdf") ? "PDF Document" : selectedDocument.name.match(/\.(jpg|jpeg|png|gif)$/i) ? "Image File" : "Document File"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Quick Actions or AI Panel */}
              {previewAiOpen ? (
                <div className="w-96 flex flex-col shrink-0">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-sm font-semibold text-gray-900">AI Assistant</span>
                    </div>
                    <button onClick={() => setPreviewAiOpen(false)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Close</button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 space-y-3">
                    {previewAiMessages.length === 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400 mb-3">Try asking:</p>
                        {["Summarize this document", "What injuries are mentioned?", "Create a treatment timeline", "Does this support liability?", "Identify key findings"].map((p) => (
                          <button key={p} onClick={() => handleSendPreviewAi(p)} className="w-full text-left text-xs text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200 rounded-lg px-3 py-2.5 transition-colors">
                            {p}
                          </button>
                        ))}
                      </div>
                    ) : (
                      previewAiMessages.map((msg, i) => (
                        <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                          <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-900"}`}>
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t border-gray-100 p-4 shrink-0">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={previewAiInput}
                        onChange={(e) => setPreviewAiInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendPreviewAi()}
                        placeholder="Ask anything about this document..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                      />
                      <button onClick={() => handleSendPreviewAi()} className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-64 shrink-0 p-5 flex flex-col gap-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Quick Actions</h3>
                  <button
                    onClick={() => setPreviewAiOpen(true)}
                    className="w-full flex items-center gap-2.5 px-4 py-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl text-sm font-medium transition-colors text-left"
                  >
                    <Bot className="w-4 h-4 shrink-0" />
                    Chat With AI
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors text-left">
                    <Download className="w-4 h-4 shrink-0" />
                    Download Document
                  </button>
                  <div className="mt-2 pt-3 border-t border-gray-100 space-y-2">
                    <div className="text-xs text-gray-400 font-medium">File Info</div>
                    <div className="text-xs text-gray-500"><span className="text-gray-400">Source</span> · {selectedDocument.source}</div>
                    <div className="text-xs text-gray-500"><span className="text-gray-400">Date</span> · {selectedDocument.date || "Jun 8, 2026"}</div>
                    <div className="text-xs text-gray-500"><span className="text-gray-400">Status</span> · {selectedDocument.status}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Agreement Modal */}
      {showUploadAgreementModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Upload Signed Agreement</h2>
              <button onClick={() => setShowUploadAgreementModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">Upload a signed copy of the retainer agreement to attach it to this case.</p>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-cyan-300 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">Drop file here or click to upload</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG up to 20MB</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => { setShowUploadAgreementModal(false); }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Add Later
              </button>
              <div className="flex gap-2">
                <button onClick={() => setShowUploadAgreementModal(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button
                  onClick={() => { setAgreementUploaded(true); setRetainerStatus("signed"); setDemoRetainerState("signed"); setShowUploadAgreementModal(false); }}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-all"
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate New Retainer Confirmation Modal */}
      {showGenerateNewRetainerModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Generate New Retainer</h2>
              <button onClick={() => setShowGenerateNewRetainerModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-sm text-orange-800">A signed retainer agreement already exists for this case.</p>
              </div>
              <p className="text-sm text-gray-600">Generating a new retainer will <strong>not</strong> replace or modify the signed agreement. A new retainer request will be created and tracked separately.</p>
              <p className="text-sm text-gray-600">The original signed agreement will remain preserved.</p>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button onClick={() => setShowGenerateNewRetainerModal(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button
                onClick={() => { setShowGenerateNewRetainerModal(false); handleOpenSendRetainerModal(); }}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all"
              >
                Generate New Retainer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark as Signed Modal */}
      {showMarkSignedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Mark Retainer as Signed</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Use this option if the retainer agreement was completed outside LECO.
                  </p>
                </div>
                <button
                  onClick={() => setShowMarkSignedModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  Upload Agreement <span className="text-gray-400 font-normal">(Optional)</span>
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-cyan-400 hover:bg-cyan-50/50 transition-all cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-900">Drag & Drop</span>
                    <span className="text-sm text-gray-600"> or </span>
                    <button className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
                      Browse Files
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Supported: PDF, DOCX, JPG, PNG
                  </p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
              <button
                onClick={handleAddLater}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                Add Later
              </button>
              <Button
                onClick={handleConfirmSigned}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0"
              >
                Confirm Signed
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
