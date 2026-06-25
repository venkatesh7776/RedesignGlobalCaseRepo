import { Eye } from "lucide-react";

interface TemplateCardProps {
  name: string;
  type: string;
  typeColor: string;
  injuryType: string;
  jurisdiction: string;
  lastUpdated: string;
  createdBy: string;
  description: string;
  isLecoTemplate?: boolean;
}

const typeStyles = {
  blue: "pill pill-neutral",
  cyan: "pill pill-neutral",
  purple: "pill pill-neutral",
  green: "pill pill-complete",
  orange: "pill pill-neutral",
};

export function TemplateCard({
  name,
  type,
  typeColor,
  injuryType,
  jurisdiction,
  lastUpdated,
  createdBy,
  description,
  isLecoTemplate = false,
}: TemplateCardProps) {
  return (
    <div className="lg-card lg-card-i p-6 group">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="card-title pr-4">{name}</h3>
          <span
            className={`${typeStyles[typeColor as keyof typeof typeStyles]} whitespace-nowrap`}
          >
            {type}
          </span>
        </div>
        {isLecoTemplate && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-tint border border-line mb-2">
            <span className="eyebrow text-deep">Leco Recommended</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <div className="eyebrow mb-1">Injury Type</div>
          <div className="body-text">{injuryType}</div>
        </div>
        <div>
          <div className="eyebrow mb-1">Jurisdiction</div>
          <div className="body-text">{jurisdiction}</div>
        </div>
        <div>
          <div className="eyebrow mb-1">Last Updated</div>
          <div className="body-text">{lastUpdated}</div>
        </div>
        <div>
          <div className="eyebrow mb-1">Created By</div>
          <div className="body-text">{createdBy}</div>
        </div>
      </div>

      <p className="secondary-text leading-relaxed mb-4 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center pt-4 border-t border-line">
        <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" strokeWidth={1.75} />
          Preview
        </button>
      </div>
    </div>
  );
}
