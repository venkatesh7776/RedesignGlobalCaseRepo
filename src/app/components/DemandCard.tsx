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
  blue: "pill pill-neutral",
  cyan: "pill pill-progress",
  purple: "pill pill-progress",
  green: "pill pill-complete",
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
    <div className="lg-card lg-card-i p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="mono-ref text-deep">{caseId}</span>
            <span className="card-title">{client}</span>
          </div>
          <div className="flex items-center gap-4 secondary-text">
            <span>{injury}</span>
            <span>•</span>
            <span>{jurisdiction}</span>
            <span>•</span>
            <span className="body-text">{version}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <div className="eyebrow mb-1">Demand</div>
            <div className="kpi-value text-ink">{demandAmount}</div>
          </div>
          <span
            className={statusStyles[statusColor as keyof typeof statusStyles]}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="secondary-text leading-relaxed line-clamp-2">{preview}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-line">
        <span className="eyebrow">Updated {dateUpdated}</span>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary flex items-center gap-2">
            <Eye className="w-4 h-4" strokeWidth={1.75} />
            Preview
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
