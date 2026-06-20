export interface CaseDocument {
  id: string;
  name: string;
  source: "Plaintiff" | "Attorney";
  date: string;
  status: "Processing" | "Processed";
}

export interface AttorneyNote {
  id: string;
  text: string;
  category: string;
  priority: string;
  date: string;
}

export interface PipelineState {
  // Retainer
  retainerStatus: "not-sent" | "sent" | "signed";
  // Intake
  intakeCreated: boolean;
  intakeSent: boolean;
  intakeLink: string;
  // Documents uploaded in Collection
  documents: CaseDocument[];
  // Stage completion flags
  analysisDone: boolean;
  valuationDone: boolean;
  // Notes (shared to Case Ready)
  notes: AttorneyNote[];
}

export interface ClassificationCategory {
  name: string;
  docs: CaseDocument[];
}

// ── Classification rules ──────────────────────────────────────────────────────
export function classifyDocuments(docs: CaseDocument[]): ClassificationCategory[] {
  const buckets: Record<string, CaseDocument[]> = {
    "Medical Records": [],
    "Police Reports": [],
    "Insurance Documents": [],
    "Wage Loss Records": [],
    "Photos & Evidence": [],
    "General Documents": [],
  };

  for (const doc of docs) {
    const n = doc.name.toLowerCase();
    if (/(mri|ct_|xray|x-ray|er_|emergency|hospital|medical|therapy|treatment|surgery|medication|discharge|physical|clinical|admission|radiology|imaging|records|bills|invoice|prescription)/.test(n)) {
      buckets["Medical Records"].push(doc);
    } else if (/(police|accident|incident|witness|citation|patrol|officer|crash|report)/.test(n)) {
      buckets["Police Reports"].push(doc);
    } else if (/(insurance|policy|claim|coverage|liability)/.test(n)) {
      buckets["Insurance Documents"].push(doc);
    } else if (/(wage|employment|salary|income|w2|pay|employer|job|verification|loss)/.test(n)) {
      buckets["Wage Loss Records"].push(doc);
    } else if (/\.(jpg|jpeg|png|gif|webp)$|photo|image|picture|scene/.test(n)) {
      buckets["Photos & Evidence"].push(doc);
    } else {
      buckets["General Documents"].push(doc);
    }
  }

  return Object.entries(buckets)
    .filter(([, d]) => d.length > 0)
    .map(([name, docs]) => ({ name, docs }));
}

// ── Analysis finding rules ────────────────────────────────────────────────────
export interface AnalysisFinding {
  tag: string;
  title: string;
  description: string;
  sources: string[];
}

export function generateAnalysisFindings(categories: ClassificationCategory[]): AnalysisFinding[] {
  const findings: AnalysisFinding[] = [];

  const liabilityCat = categories.find((c) => c.name === "Police Reports");
  const medicalCat = categories.find((c) => c.name === "Medical Records");

  if (liabilityCat && liabilityCat.docs.length > 0) {
    findings.push({
      tag: "TRAFFIC CODE VIOLATION",
      title: "Red-Light Intersection Encroachment",
      description:
        "Responding patrol officer report confirms the commercial vehicle entered the intersection against a red light.",
      sources: liabilityCat.docs.map((d) => d.name).slice(0, 2),
    });
  }

  if (medicalCat && medicalCat.docs.length > 0) {
    findings.push({
      tag: "CLINICAL DISABILITY ONSET",
      title: "Cervical Cord Compression",
      description:
        "MRI findings confirm C5-C6 and C6-C7 disc herniations causing neurological compression.",
      sources: medicalCat.docs.map((d) => d.name).slice(0, 2),
    });
  }

  return findings;
}

// ── Missing evidence rules ────────────────────────────────────────────────────
export interface MissingEvidenceItem {
  title: string;
  expected: string;
  reason: string;
}

export function detectMissingEvidence(categories: ClassificationCategory[]): MissingEvidenceItem[] {
  const missing: MissingEvidenceItem[] = [];
  const names = categories.flatMap((c) => c.docs.map((d) => d.name.toLowerCase()));

  const hasPoliceAddendum = names.some((n) => n.includes("addendum"));
  if (!hasPoliceAddendum) {
    missing.push({ title: "Police Report Addendum", expected: "Police_Report_Addendum.pdf", reason: "May strengthen liability findings." });
  }

  const hasWageLoss = categories.some((c) => c.name === "Wage Loss Records" && c.docs.length > 0);
  if (!hasWageLoss) {
    missing.push({ title: "Wage Loss Records", expected: "Wage_Loss_Statement.pdf", reason: "Required for damages calculation." });
  }

  const hasInsurance = categories.some((c) => c.name === "Insurance Documents" && c.docs.length > 0);
  if (!hasInsurance) {
    missing.push({ title: "Insurance Policy", expected: "Commercial_Insurance_Policy.pdf", reason: "Needed to determine policy limits." });
  }

  return missing;
}

// ── Valuation computation ─────────────────────────────────────────────────────
export function computeValuation(findings: AnalysisFinding[], multiplier: number) {
  const baseEconomic = 161450;
  const multiplierAdjustment = baseEconomic * multiplier;
  const totalRecommended = baseEconomic + multiplierAdjustment;
  const settlementLow = totalRecommended * 0.6;
  const settlementHigh = totalRecommended * 0.85;
  return { baseEconomic, multiplierAdjustment, totalRecommended, settlementLow, settlementHigh };
}

// ── Checklist completion ──────────────────────────────────────────────────────
export function computeChecklist(pipeline: PipelineState, categories: ClassificationCategory[], findings: AnalysisFinding[]) {
  const hasDocs = pipeline.documents.length > 0;
  const hasCategories = categories.length > 0;
  const hasFindings = findings.length > 0;
  return {
    "Medical records collected": hasDocs,
    "Documents classified": hasCategories,
    "Missing records audited": hasFindings,
    "Key entities extracted": hasFindings,
    "Medical chronology generated": hasFindings,
    "Valuation completed": pipeline.valuationDone,
    "Case workspace generated": pipeline.valuationDone,
  };
}
