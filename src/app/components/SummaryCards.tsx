import { AlertTriangle, Clock, Send, MessageSquare } from "lucide-react";

const summaryData = [
  {
    title: "Cases Needing Attention",
    count: 8,
    icon: AlertTriangle,
    color: "red",
    gradient: "from-red-500/20 to-red-600/20",
    iconColor: "text-red-400",
    borderColor: "border-red-500/20",
  },
  {
    title: "Ready for Review",
    count: 12,
    icon: Clock,
    color: "yellow",
    gradient: "from-yellow-500/20 to-yellow-600/20",
    iconColor: "text-yellow-400",
    borderColor: "border-yellow-500/20",
  },
  {
    title: "Ready for Demand",
    count: 5,
    icon: Send,
    color: "cyan",
    gradient: "from-cyan-500/20 to-cyan-600/20",
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-500/20",
  },
  {
    title: "Negotiation Active",
    count: 15,
    icon: MessageSquare,
    color: "green",
    gradient: "from-green-500/20 to-green-600/20",
    iconColor: "text-green-400",
    borderColor: "border-green-500/20",
  },
];

export function SummaryCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {summaryData.map((item) => (
        <button
          key={item.title}
          className={`bg-gradient-to-br ${item.gradient} border ${item.borderColor} rounded-xl p-5 hover:scale-[1.02] transition-transform cursor-pointer group`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-lg bg-black/30 ${item.iconColor}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-white">{item.count}</div>
          </div>
          <div className="text-sm text-white/80 text-left">{item.title}</div>
        </button>
      ))}
    </div>
  );
}
