import { AlertTriangle, Clock, Send, MessageSquare } from "lucide-react";

const summaryData = [
  {
    label: "Cases Needing Attention",
    count: 8,
    icon: AlertTriangle,
    pill: "Action required",
    pillClass: "pill-risk",
    iconClass: "text-[#B91C1C]",
    iconWrap: "bg-[#FEF2F2]",
  },
  {
    label: "Ready for Review",
    count: 12,
    icon: Clock,
    pill: "In queue",
    pillClass: "pill-progress",
    iconClass: "text-[#B45309]",
    iconWrap: "bg-[#FFF7ED]",
  },
  {
    label: "Ready for Demand",
    count: 5,
    icon: Send,
    pill: "Staged",
    pillClass: "pill-neutral",
    iconClass: "text-deep",
    iconWrap: "bg-tint",
  },
  {
    label: "Negotiation Active",
    count: 15,
    icon: MessageSquare,
    pill: "On track",
    pillClass: "pill-complete",
    iconClass: "text-[#15803D]",
    iconWrap: "bg-[#ECFDF3]",
  },
];

export function SummaryCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {summaryData.map((item) => (
        <button
          key={item.label}
          className="lg-card lg-card-i p-6 text-left cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-lg ${item.iconWrap} ${item.iconClass}`}>
              <item.icon className="w-5 h-5" strokeWidth={1.75} />
            </div>
          </div>
          <div className="eyebrow mb-2">{item.label}</div>
          <div className="flex items-end justify-between gap-2">
            <div className="kpi-value">{item.count}</div>
            <span className={`pill ${item.pillClass} mb-1`}>{item.pill}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
