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
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  gray: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  green: "bg-green-500/10 text-green-400 border-green-500/30",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

export function ClientsList({ clients }: ClientsListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="divide-y divide-gray-200">
        {clients.map((client, index) => {
          const isClean = client.attention === "No Issues" || client.attention === "Complete";

          return (
            <div
              key={index}
              className="p-5 hover:bg-gray-50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-6">
                <Avatar className="w-11 h-11 border border-gray-200">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-semibold text-sm">
                    {client.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-medium text-sm mb-1">{client.name}</h3>
                  <p className="text-gray-600 text-sm">{client.injury}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border whitespace-nowrap ${
                      statusStyles[client.statusColor as keyof typeof statusStyles]
                    }`}
                  >
                    {client.status}
                  </span>

                  <div className={`flex items-center gap-1.5 text-sm whitespace-nowrap min-w-[180px] ${isClean ? "text-green-600" : "text-orange-600"}`}>
                    {isClean ? (
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{client.attention}</span>
                  </div>

                  <div className="text-xs text-gray-500 whitespace-nowrap min-w-[200px]">
                    Last Contact: {client.lastContact} • Opened {client.openedDate}
                  </div>

                  <button className="flex items-center gap-1.5 text-sm text-cyan-600 hover:text-cyan-700 transition-colors group-hover:gap-2">
                    {client.actionLabel}
                    {client.actionLabel === "View" ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
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
