interface CaseSnapshotProps {
  caseName: string;
  caseType?: string;
  caseSubType?: string;
  plaintiff: string;
  plaintiffEmail?: string;
  plaintiffPhone?: string;
  jurisdiction?: string;
  caseId: string;
  dateOfIncident?: string;
  summary: string;
}

export function CaseSnapshot({
  caseName,
  caseType,
  caseSubType,
  plaintiff,
  plaintiffEmail,
  plaintiffPhone,
  jurisdiction,
  caseId,
  dateOfIncident,
  summary,
}: CaseSnapshotProps) {
  const fields = [
    { label: "Plaintiff", value: plaintiff, mono: false },
    plaintiffEmail ? { label: "Email", value: plaintiffEmail, mono: false } : null,
    plaintiffPhone ? { label: "Phone", value: plaintiffPhone, mono: false } : null,
    caseType ? { label: "Case Type", value: caseType, mono: false } : null,
    caseSubType ? { label: "Sub-Type", value: caseSubType, mono: false } : null,
    jurisdiction ? { label: "Jurisdiction", value: jurisdiction, mono: false } : null,
    { label: "Case ID", value: caseId, mono: true },
    dateOfIncident ? { label: "Date of Incident", value: dateOfIncident, mono: false } : null,
  ].filter(Boolean) as { label: string; value: string; mono: boolean }[];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Title row */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">{caseName}</h2>
      </div>

      {/* Metadata strip */}
      <div className="flex flex-wrap divide-x divide-gray-100 border-b border-gray-100">
        {fields.map(({ label, value, mono }) => (
          <div key={label} className="flex flex-col px-5 py-3 min-w-0">
            <span className="text-xs text-gray-400 font-medium mb-0.5 whitespace-nowrap">{label}</span>
            <span className={`text-sm font-semibold text-gray-900 whitespace-nowrap ${mono ? "font-mono text-cyan-600" : ""}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-6 py-4">
        <p className="text-sm text-gray-500 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
