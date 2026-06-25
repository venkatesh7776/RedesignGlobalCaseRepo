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
  cyan: "pill pill-progress",
  purple: "pill pill-progress",
  orange: "pill pill-progress",
  gray: "pill pill-neutral",
  green: "pill pill-complete",
  yellow: "pill pill-progress",
  blue: "pill pill-neutral",
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
    <div className="lg-card lg-card-i p-6 cursor-pointer group">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-11 h-11 rounded-lg">
          <AvatarFallback className="bg-ink text-white font-semibold text-sm rounded-lg">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="card-title">{name}</h3>
        </div>

        <span
          className={`${statusStyles[statusColor as keyof typeof statusStyles]} whitespace-nowrap`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3 mb-4">
        <p className="body-text">{injury}</p>
        <div className={`flex items-center gap-1.5 text-sm whitespace-nowrap ${isClean ? "text-deep" : "text-ink"}`}>
          {isClean ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
          ) : (
            <AlertTriangle className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
          )}
          <span>{attention}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-line flex items-center justify-between">
        <span className="eyebrow">
          Last Contact: {lastContact} • Opened {openedDate}
        </span>
        <button className="btn btn-ghost flex items-center gap-1.5 text-deep group-hover:gap-2 ml-3">
          {actionLabel}
          {actionLabel === "View" ? (
            <Eye className="w-4 h-4" strokeWidth={1.75} />
          ) : (
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  );
}
