import { ArrowRight, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ClientCardProps {
  name: string;
  status: string;
  statusColor: string;
  injury: string;
  attention: string;
  lastContact: string;
  openedDate: string;
  actionLabel: string;
  initials: string;
}

const statusStyles = {
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  gray: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  green: "bg-green-500/10 text-green-400 border-green-500/30",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

export function ClientCard({
  name,
  status,
  statusColor,
  injury,
  attention,
  lastContact,
  openedDate,
  actionLabel,
  initials,
}: ClientCardProps) {
  const isClean = attention === "No Issues" || attention === "Complete";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-11 h-11 border border-gray-200">
          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-medium text-sm mb-1">{name}</h3>
        </div>

        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border whitespace-nowrap ${
            statusStyles[statusColor as keyof typeof statusStyles]
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3 mb-4">
        <p className="text-gray-700 text-sm">{injury}</p>
        <div className={`flex items-center gap-1.5 text-sm whitespace-nowrap ${isClean ? "text-green-600" : "text-orange-600"}`}>
          {isClean ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{attention}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Last Contact: {lastContact} • Opened {openedDate}
        </span>
        <button className="flex items-center gap-1.5 text-sm text-cyan-600 hover:text-cyan-700 transition-colors group-hover:gap-2 ml-3">
          {actionLabel}
          {actionLabel === "View" ? (
            <Eye className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
