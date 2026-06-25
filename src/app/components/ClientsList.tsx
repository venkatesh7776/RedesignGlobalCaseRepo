import { ArrowRight, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Client {
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

interface ClientsListProps {
  clients: Client[];
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

export function ClientsList({ clients }: ClientsListProps) {
  return (
    <div className="lg-card overflow-hidden">
      <div>
        {clients.map((client, index) => {
          const isClean = client.attention === "No Issues" || client.attention === "Complete";

          return (
            <div
              key={index}
              className="lg-row border-b border-line p-5 cursor-pointer group"
            >
              <div className="flex items-center gap-6">
                <Avatar className="w-11 h-11 rounded-lg">
                  <AvatarFallback className="bg-ink text-white font-semibold text-sm rounded-lg">
                    {client.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3 className="card-title mb-1">{client.name}</h3>
                  <p className="body-text">{client.injury}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`${statusStyles[client.statusColor as keyof typeof statusStyles]} whitespace-nowrap`}
                  >
                    {client.status}
                  </span>

                  <div className={`flex items-center gap-1.5 text-sm whitespace-nowrap min-w-[180px] ${isClean ? "text-deep" : "text-ink"}`}>
                    {isClean ? (
                      <CheckCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                    ) : (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                    )}
                    <span>{client.attention}</span>
                  </div>

                  <div className="eyebrow whitespace-nowrap min-w-[200px]">
                    Last Contact: {client.lastContact} • Opened {client.openedDate}
                  </div>

                  <button className="btn btn-ghost flex items-center gap-1.5 text-deep group-hover:gap-2">
                    {client.actionLabel}
                    {client.actionLabel === "View" ? (
                      <Eye className="w-4 h-4" strokeWidth={1.75} />
                    ) : (
                      <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
