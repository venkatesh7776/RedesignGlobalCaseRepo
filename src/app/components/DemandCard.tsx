import { Eye, ExternalLink } from "lucide-react";

interface DemandCardProps {
  caseId: string;
  client: string;
  injury: string;
  jurisdiction: string;
  demandAmount: string;
  version: string;
  status: string;
  statusColor: string;
  preview: string;
  dateUpdated: string;
}

const statusStyles = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  green: "bg-green-500/10 text-green-400 border-green-500/30",
};

export function DemandCard({
  caseId,
  client,
  injury,
  jurisdiction,
  demandAmount,
  version,
  status,
  statusColor,
  preview,
  dateUpdated,
}: DemandCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-cyan-600 font-mono text-sm font-medium">{caseId}</span>
            <span className="text-gray-900 font-medium">{client}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{injury}</span>
            <span>•</span>
            <span>{jurisdiction}</span>
            <span>•</span>
            <span className="text-gray-700">{version}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <div className="text-xs text-gray-500 mb-1">Demand</div>
            <div className="text-lg font-semibold text-gray-900">{demandAmount}</div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border ${
              statusStyles[statusColor as keyof typeof statusStyles]
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{preview}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">Updated {dateUpdated}</span>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-cyan-600 hover:bg-gray-50 transition-all">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 transition-all">
            <ExternalLink className="w-4 h-4" />
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
