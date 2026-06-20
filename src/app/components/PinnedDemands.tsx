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
        <Pin className="w-4 h-4 text-cyan-400" />
        <h2 className="text-sm font-medium text-white/90">Pinned Demands</h2>
      </div>

      <div className="flex gap-3">
        {pinnedDemands.map((demand) => (
          <button
            key={demand.caseId}
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg p-4 hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all text-left group"
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <FileText className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-cyan-400 mb-1">{demand.caseId}</div>
                <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                  {demand.client}
                </div>
              </div>
            </div>
            <div className="text-xs text-white/60 mb-1">{demand.injury}</div>
            <div className="text-sm font-semibold text-white">{demand.amount}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
