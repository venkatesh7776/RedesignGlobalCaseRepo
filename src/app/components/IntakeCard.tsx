import { ArrowRight } from "lucide-react";

interface IntakeCardProps {
  caseName: string;
  caseId: string;
  plaintiff: string;
  summary: string;
  stage: string;
  progress: number;
  lastUpdated: string;
  claimValue?: string;
  isReady?: boolean;
  onContinue?: () => void;
}

const stageColors = {
  Collection: "text-blue-600",
  Classification: "text-purple-600",
  Analysis: "text-orange-600",
  Valuation: "text-pink-600",
  "Ready For Review": "text-green-600",
};

export function IntakeCard({
  caseName,
  caseId,
  plaintiff,
  summary,
  stage,
  progress,
  lastUpdated,
  claimValue,
  isReady = false,
  onContinue,
}: IntakeCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{caseName}</h3>
        <p className="text-sm text-cyan-600 font-mono mb-3">{caseId}</p>

        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Plaintiff</div>
          <div className="text-sm text-gray-900">{plaintiff}</div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Case Summary</div>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </div>

        {isReady && claimValue && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-xs text-green-600 font-medium mb-1">Estimated Claim Value</div>
            <div className="text-lg font-semibold text-green-700">{claimValue}</div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Current Stage</div>
          <div className={`text-sm font-medium ${stageColors[stage as keyof typeof stageColors]}`}>
            {stage}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500">Progress</div>
            <div className="text-sm font-semibold text-gray-900">{progress}%</div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Last Updated: <span className="text-gray-700">{lastUpdated}</span>
          </div>
          <button
            onClick={onContinue}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all group-hover:gap-3 ${
              isReady
                ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-400 hover:to-cyan-500"
                : "text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
            }`}
          >
            {isReady ? "Open Workspace" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
