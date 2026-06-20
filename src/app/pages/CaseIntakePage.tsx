import { useState } from "react";
import { CaseIntakeControlBar } from "../components/CaseIntakeControlBar";
import { IntakeCard } from "../components/IntakeCard";
import { Plus, X, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

interface CaseIntakePageProps {
  onOpenWorkflow?: (caseData: any) => void;
}

const initialIntakeCases = [
  {
    caseName: "Estate of Miller vs Logistics Co.",
    caseId: "PI-2024-001",
    plaintiff: "Evelyn Miller",
    summary: "Delayed stroke response and negligent medication management at memory care facility.",
    jurisdiction: "Cook County, IL",
    plaintiffEmail: "evelyn.miller@gmail.com",
    stage: "Analysis",
    progress: 78,
    lastUpdated: "2 mins ago",
    isReady: false,
  },
  {
    caseName: "Sarah Jenkins vs Metro Transit",
    caseId: "PI-2024-023",
    plaintiff: "Sarah Jenkins",
    summary: "Severe spinal injury from bus accident requiring ongoing treatment and permanent disability considerations.",
    jurisdiction: "Harris County, TX",
    plaintiffEmail: "sarah.jenkins@email.com",
    stage: "Ready For Review",
    progress: 100,
    lastUpdated: "Just now",
    claimValue: "$650K – $820K",
    isReady: true,
  },
  {
    caseName: "Marcus Thorne vs Retail Giant",
    caseId: "PI-2024-008",
    plaintiff: "Marcus Thorne",
    summary: "Slip and fall at retail location resulting in chronic back injury and ongoing pain management needs.",
    jurisdiction: "Los Angeles County, CA",
    plaintiffEmail: "m.thorne@email.com",
    stage: "Valuation",
    progress: 94,
    lastUpdated: "15 mins ago",
    isReady: false,
  },
  {
    caseName: "Elena Rodriguez vs City Transit",
    caseId: "PI-2024-012",
    plaintiff: "Elena Rodriguez",
    summary: "Motor vehicle collision causing whiplash with chronic neck pain and documented soft tissue damage.",
    jurisdiction: "Miami-Dade County, FL",
    plaintiffEmail: "elena.rodriguez@email.com",
    stage: "Classification",
    progress: 46,
    lastUpdated: "1 hour ago",
    isReady: false,
  },
  {
    caseName: "James Summers vs Apex Delivery",
    caseId: "PI-2024-015",
    plaintiff: "James Summers",
    summary: "Workplace delivery accident resulting in fractured wrist requiring surgical intervention with permanent hardware.",
    jurisdiction: "Cook County, IL",
    stage: "Collection",
    progress: 22,
    lastUpdated: "3 hours ago",
    isReady: false,
  },
  {
    caseName: "Robert Vance vs Construction LLC",
    caseId: "PI-2024-017",
    plaintiff: "Robert Vance",
    summary: "Construction site leg fracture with multiple surgeries and extended recovery affecting work capacity.",
    jurisdiction: "Maricopa County, AZ",
    stage: "Analysis",
    progress: 68,
    lastUpdated: "5 hours ago",
    isReady: false,
  },
];

const jurisdictions = [
  "Cook County, IL",
  "Harris County, TX",
  "Miami-Dade County, FL",
  "Los Angeles County, CA",
  "Maricopa County, AZ",
  "San Diego County, CA",
  "Orange County, CA",
];

const caseTypes = [
  "Motor Vehicle Accident",
  "Truck Accident",
  "Slip & Fall",
  "Medical Malpractice",
  "Workplace Injury",
  "Wrongful Death",
  "Product Liability",
  "Other",
];

export function CaseIntakePage({ onOpenWorkflow }: CaseIntakePageProps) {
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [intakeCases, setIntakeCases] = useState(initialIntakeCases);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [caseName, setCaseName] = useState("");
  const [plaintiffName, setPlaintiffName] = useState("");
  const [plaintiffEmail, setPlaintiffEmail] = useState("");
  const [plaintiffPhone, setPlaintiffPhone] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [caseSummary, setCaseSummary] = useState("");
  const [dateOfIncident, setDateOfIncident] = useState("");
  const [caseType, setCaseType] = useState("");

  const handleCreateCase = () => {
    const newCaseId = `PI-2024-${String(intakeCases.length + 1).padStart(3, "0")}`;
    const newCase: any = {
      caseName,
      caseId: newCaseId,
      plaintiff: plaintiffName,
      summary: caseSummary,
      jurisdiction,
      stage: "Client Intake",
      progress: 0,
      lastUpdated: "Just now",
      isReady: false,
    };

    if (plaintiffEmail) {
      newCase.plaintiffEmail = plaintiffEmail;
    }

    setIntakeCases([newCase, ...intakeCases]);
    setShowNewCaseModal(false);

    // Reset form
    setCaseName("");
    setPlaintiffName("");
    setPlaintiffEmail("");
    setPlaintiffPhone("");
    setJurisdiction("");
    setCaseSummary("");
    setDateOfIncident("");
    setCaseType("");
    setShowAdvanced(false);
  };

  const showEmptyState = false;

  return (
    <>
      <div className="max-w-[1400px] mx-auto p-8 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CASE INTAKE</h1>
          <p className="text-gray-600">
            Monitor incoming personal injury cases as LECO collects records, analyzes evidence, and prepares cases for attorney review.
          </p>
        </div>

        {!showEmptyState && <CaseIntakeControlBar onNewCase={() => setShowNewCaseModal(true)} />}

        {showEmptyState ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Intake Cases</h3>
              <p className="text-gray-600 mb-6">
                Create a new personal injury case to begin document collection and analysis.
              </p>
              <Button
                onClick={() => setShowNewCaseModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0 gap-2"
              >
                <Plus className="w-4 h-4" />
                New Case
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {intakeCases.map((intakeCase: any) => (
              <IntakeCard
                key={intakeCase.caseId}
                {...intakeCase}
                onContinue={() =>
                  onOpenWorkflow?.({
                    caseName: intakeCase.caseName,
                    caseId: intakeCase.caseId,
                    plaintiff: intakeCase.plaintiff,
                    summary: intakeCase.summary,
                    plaintiffEmail: intakeCase.plaintiffEmail,
                    jurisdiction: intakeCase.jurisdiction,
                    stage: intakeCase.stage,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* New Case Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create New Case</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Create a new personal injury case record before configuring the client intake request.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewCaseModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Case Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Case Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  placeholder="e.g. Miller vs. SafeRoads"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              {/* Plaintiff Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Plaintiff Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={plaintiffName}
                  onChange={(e) => setPlaintiffName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              {/* Grid for Email and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Plaintiff Email <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={plaintiffEmail}
                    onChange={(e) => setPlaintiffEmail(e.target.value)}
                    placeholder="e.g. jane@clientmail.com"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Plaintiff Phone <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={plaintiffPhone}
                    onChange={(e) => setPlaintiffPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 000-0000"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              {/* Jurisdiction */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Jurisdiction <span className="text-red-500">*</span>
                </label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 transition-all"
                >
                  <option value="">Select jurisdiction...</option>
                  {jurisdictions.map((jur) => (
                    <option key={jur} value={jur}>
                      {jur}
                    </option>
                  ))}
                </select>
              </div>

              {/* Case Summary */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Case Summary / Narrative <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={caseSummary}
                  onChange={(e) => setCaseSummary(e.target.value)}
                  placeholder="Brief description of the accident, injuries, liability factors, and any important context for the case."
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 resize-none transition-all"
                />
              </div>

              {/* Advanced Section Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
              >
                {showAdvanced ? "− Hide" : "+ Show"} Advanced Options
              </button>

              {showAdvanced && (
                <div className="space-y-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Date of Incident <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="date"
                        value={dateOfIncident}
                        onChange={(e) => setDateOfIncident(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Case Type <span className="text-gray-400">(Optional)</span>
                      </label>
                      <select
                        value={caseType}
                        onChange={(e) => setCaseType(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 transition-all"
                      >
                        <option value="">Select type...</option>
                        {caseTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl flex items-center justify-between">
              <button
                onClick={() => setShowNewCaseModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <Button
                onClick={handleCreateCase}
                disabled={!caseName || !plaintiffName || !jurisdiction || !caseSummary}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Case
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
