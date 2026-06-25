import { useState } from "react";
import { createRoot } from "react-dom/client";
import { IntakeWorkflowPage } from "./app/pages/IntakeWorkflowPage";
import { PipelineState } from "./app/types/case";
import "./styles/index.css";

const caseData = {
  caseName: "Estate of Miller vs Logistics Co.",
  caseId: "PI-2024-001",
  caseType: "Medical Malpractice",
  plaintiff: "Evelyn Miller",
  summary:
    "Delayed stroke response and negligent medication management at a memory care facility resulting in severe neurological injury.",
  plaintiffEmail: "evelyn.miller@gmail.com",
  plaintiffPhone: "(555) 123-4567",
  jurisdiction: "Cook County, IL",
  dateOfIncident: "Feb 14, 2026",
};

function Harness() {
  const [pipeline, setPipeline] = useState<PipelineState>({
    retainerStatus: "signed",
    intakeCreated: true,
    intakeSent: true,
    intakeLink: "https://leco.ai/intake/ABX29...",
    documents: [
      { id: "1", name: "MRI_Report_2026.pdf", source: "Plaintiff", date: "Jun 1, 2026", status: "Processed" },
      { id: "2", name: "ER_Bills.pdf", source: "Plaintiff", date: "Jun 1, 2026", status: "Processed" },
      { id: "3", name: "police_report_final.pdf", source: "Plaintiff", date: "Jun 2, 2026", status: "Processed" },
    ],
    analysisDone: false,
    valuationDone: false,
    notes: [],
  });
  return (
    <IntakeWorkflowPage
      caseData={caseData}
      pipeline={pipeline}
      onPipelineUpdate={(u) => setPipeline((p) => ({ ...p, ...u }))}
      onContinue={() => {}}
      onStageClick={() => {}}
      onBackToIntake={() => {}}
    />
  );
}

createRoot(document.getElementById("root")!).render(<Harness />);
