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
  cyan: "pill pill-progress",
  purple: "pill pill-progress",
  orange: "pill pill-progress",
  gray: "pill pill-neutral",
  green: "pill pill-complete",
  yellow: "pill pill-progress",
  blue: "pill pill-neutral",
};

export function CaseTable() {
  return (
    <div className="lg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-wash">
              <th className="eyebrow px-4 py-4 text-left border-r border-line">
                Case ID
              </th>
              <th className="eyebrow px-4 py-4 text-left border-r border-line">
                Client Details
              </th>
              <th className="eyebrow px-4 py-4 text-left border-r border-line">
                Jurisdiction
              </th>
              <th className="eyebrow px-4 py-4 text-left border-r border-line">
                Current Status
              </th>
              <th className="eyebrow px-4 py-4 text-left border-r border-line">
                Missing Items
              </th>
              <th className="eyebrow px-4 py-4 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {cases.map((case_) => (
              <tr
                key={case_.id}
                className="lg-row border-b border-line cursor-pointer group"
              >
                <td className="px-4 py-4 border-r border-line">
                  <div className="mono-ref text-deep">{case_.id}</div>
                </td>
                <td className="px-4 py-4 border-r border-line">
                  <div className="card-title">
                    {case_.client} vs {case_.defendant}
                  </div>
                  <div className="secondary-text mt-1">{case_.injury}</div>
                </td>
                <td className="px-4 py-4 border-r border-line">
                  <div className="body-text">{case_.jurisdiction}</div>
                </td>
                <td className="px-4 py-4 border-r border-line">
                  <div>
                    <span
                      className={statusStyles[case_.statusColor as keyof typeof statusStyles]}
                    >
                      {case_.status}
                    </span>
                    <div className="secondary-text mt-1.5">{case_.lastUpdated}</div>
                  </div>
                </td>
                <td className="px-4 py-4 border-r border-line">
                  <div
                    className={`text-sm ${
                      case_.missingItems === "No Issues" || case_.missingItems === "Complete"
                        ? "text-deep"
                        : "text-ink"
                    }`}
                  >
                    {case_.missingItems}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end">
                    <button className="btn btn-ghost flex items-center gap-1.5 text-deep group-hover:gap-2">
                      {case_.actionLabel}
                      {case_.actionLabel === "View" ? (
                        <Eye className="w-4 h-4" strokeWidth={1.75} />
                      ) : (
                        <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
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
