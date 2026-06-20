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
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  green: "bg-green-500/10 text-green-400 border-green-500/30",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
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
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all group">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-gray-900 font-medium text-lg pr-4">{name}</h3>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border whitespace-nowrap ${
              typeStyles[typeColor as keyof typeof typeStyles]
            }`}
          >
            {type}
          </span>
        </div>
        {isLecoTemplate && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 mb-2">
            <span className="text-xs text-cyan-400 font-medium">Leco Recommended</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <div className="text-gray-500 text-xs mb-1">Injury Type</div>
          <div className="text-gray-900">{injuryType}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs mb-1">Jurisdiction</div>
          <div className="text-gray-900">{jurisdiction}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs mb-1">Last Updated</div>
          <div className="text-gray-900">{lastUpdated}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs mb-1">Created By</div>
          <div className="text-gray-900">{createdBy}</div>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center pt-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 border border-cyan-200 transition-all">
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>
    </div>
  );
}
