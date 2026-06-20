import { ArrowRight, Eye } from "lucide-react";

const cases = [
  {
    id: "PI-2024-001",
    client: "Miller Estate",
    defendant: "Logistics Co",
    injury: "Spinal injury",
    jurisdiction: "Cook County, IL",
    status: "Ready for Demand",
    statusColor: "cyan",
    lastUpdated: "Updated 2h ago",
    missingItems: "Missing Final Bill",
    actionLabel: "Open",
  },
  {
    id: "PI-2024-008",
    client: "Marcus Thorne",
    defendant: "Retail Giant",
    injury: "Back injury",
    jurisdiction: "Miami-Dade, FL",
    status: "Negotiation",
    statusColor: "purple",
    lastUpdated: "Updated Yesterday",
    missingItems: "No Issues",
    actionLabel: "Open",
  },
  {
    id: "PI-2024-015",
    client: "James Summers",
    defendant: "Apex Delivery",
    injury: "Fractured wrist",
    jurisdiction: "Fulton County, GA",
    status: "Awaiting Client Docs",
    statusColor: "orange",
    lastUpdated: "Updated 4h ago",
    missingItems: "Police Report Missing",
    actionLabel: "Open",
  },
  {
    id: "PI-2024-012",
    client: "Elena Rodriguez",
    defendant: "City of Greenwood",
    injury: "Whiplash",
    jurisdiction: "King County, WA",
    status: "Medical Review",
    statusColor: "gray",
    lastUpdated: "Updated Today",
    missingItems: "Treatment Notes Pending",
    actionLabel: "Open",
  },
  {
    id: "PI-2023-992",
    client: "Robert Vance",
    defendant: "Northside Builders",
    injury: "Leg fracture",
    jurisdiction: "Harris County, TX",
    status: "Settled",
    statusColor: "green",
    lastUpdated: "Updated 3d ago",
    missingItems: "Complete",
    actionLabel: "View",
  },
  {
    id: "PI-2024-023",
    client: "Sarah Chen",
    defendant: "Metro Transit",
    injury: "Soft tissue injury",
    jurisdiction: "Los Angeles, CA",
    status: "Ready for Review",
    statusColor: "yellow",
    lastUpdated: "Updated 1h ago",
    missingItems: "No Issues",
    actionLabel: "Open",
  },
  {
    id: "PI-2024-017",
    client: "David Martinez",
    defendant: "Construction LLC",
    injury: "Shoulder injury",
    jurisdiction: "Maricopa County, AZ",
    status: "Intake Pending",
    statusColor: "blue",
    lastUpdated: "Updated 6h ago",
    missingItems: "Client Signature Needed",
    actionLabel: "Open",
  },
];

const statusStyles = {
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  gray: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  green: "bg-green-500/10 text-green-400 border-green-500/30",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

export function CaseTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Case ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider border-r border-white/5">
                Client Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider border-r border-white/5">
                Jurisdiction
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider border-r border-white/5">
                Current Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider border-r border-white/5">
                Missing Items
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cases.map((case_) => (
              <tr
                key={case_.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 border-r border-gray-200">
                  <div className="text-sm font-mono text-cyan-600">{case_.id}</div>
                </td>
                <td className="px-6 py-4 border-r border-gray-200">
                  <div className="text-sm text-gray-900 font-medium">
                    {case_.client} vs {case_.defendant}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{case_.injury}</div>
                </td>
                <td className="px-6 py-4 border-r border-gray-200">
                  <div className="text-sm text-gray-700">{case_.jurisdiction}</div>
                </td>
                <td className="px-6 py-4 border-r border-gray-200">
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                        statusStyles[case_.statusColor as keyof typeof statusStyles]
                      }`}
                    >
                      {case_.status}
                    </span>
                    <div className="text-xs text-gray-400 mt-1.5">{case_.lastUpdated}</div>
                  </div>
                </td>
                <td className="px-6 py-4 border-r border-gray-200">
                  <div
                    className={`text-sm ${
                      case_.missingItems === "No Issues" || case_.missingItems === "Complete"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {case_.missingItems}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end">
                    <button className="flex items-center gap-1.5 text-sm text-cyan-600 hover:text-cyan-700 transition-colors group-hover:gap-2">
                      {case_.actionLabel}
                      {case_.actionLabel === "View" ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
