import { Pin, FileText } from "lucide-react";

const pinnedDemands = [
  {
    caseId: "PI-2024-023",
    client: "Sarah Jenkins",
    injury: "Spinal Injury",
    amount: "$156,756",
  },
  {
    caseId: "PI-2023-992",
    client: "Robert Vance",
    injury: "Leg Fracture",
    amount: "$125,000",
  },
  {
    caseId: "PI-2024-008",
    client: "Marcus Thorne",
    injury: "Back Injury",
    amount: "$98,450",
  },
];

export function PinnedDemands() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Pin className="w-4 h-4 text-deep" strokeWidth={1.75} />
        <h2 className="section-header">Pinned Demands</h2>
      </div>

      <div className="flex gap-3">
        {pinnedDemands.map((demand) => (
          <button
            key={demand.caseId}
            className="lg-card lg-card-i flex-1 p-4 text-left group"
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="p-2 bg-tint rounded-lg">
                <FileText className="w-4 h-4 text-deep" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <div className="mono-ref text-deep mb-1">{demand.caseId}</div>
                <div className="card-title group-hover:text-deep transition-colors">
                  {demand.client}
                </div>
              </div>
            </div>
            <div className="secondary-text mb-1">{demand.injury}</div>
            <div className="text-sm font-semibold text-ink">{demand.amount}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
