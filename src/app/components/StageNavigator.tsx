interface StageNavigatorProps {
  currentStage: string;
  onStageClick?: (stageName: string) => void;
}

import { Inbox, ScanSearch, DollarSign, CheckCircle } from "lucide-react";

const stages = [
  { name: "Client Intake", label: "Collection", icon: Inbox },
  { name: "Analysis",      label: "Analysis",   icon: ScanSearch },
  { name: "Valuation",     label: "Valuation",  icon: DollarSign },
  { name: "Case Ready",    label: "Case Ready", icon: CheckCircle },
];

export function StageNavigator({ currentStage, onStageClick }: StageNavigatorProps) {
  const currentIndex = stages.findIndex((s) => s.name === currentStage);

  return (
    <div className="sticky top-[53px] z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center py-3">
          {stages.map((stage, index) => {
            const isActive = stage.name === currentStage;
            const isCompleted = currentIndex > index;
            const Icon = stage.icon;
            const isLast = index === stages.length - 1;

            return (
              <div key={stage.name} className="flex items-center flex-1 min-w-0">
                {/* Card */}
                <button
                  onClick={() => onStageClick?.(stage.name)}
                  className={`flex-1 flex items-center justify-between px-5 py-3.5 rounded-xl border transition-all text-left min-w-0 ${
                    isActive
                      ? "bg-cyan-50 border-cyan-400"
                      : isCompleted
                      ? "bg-white border-cyan-200 hover:bg-cyan-50"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive || isCompleted ? "text-cyan-500" : "text-gray-300"}`} />
                    <div className="min-w-0">
                      <div className={`text-xs font-medium leading-none mb-1 ${isActive ? "text-cyan-500" : isCompleted ? "text-cyan-400" : "text-gray-400"}`}>
                        Stage {index + 1}
                      </div>
                      <div className={`text-sm font-bold leading-none truncate ${isActive ? "text-cyan-700" : isCompleted ? "text-gray-700" : "text-gray-500"}`}>
                        {stage.label}
                      </div>
                    </div>
                  </div>
                  {isCompleted && (
                    <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded shrink-0 ml-2">
                      DONE
                    </span>
                  )}
                </button>

                {/* Connector line */}
                {!isLast && (
                  <div className="relative flex items-center w-8 shrink-0">
                    <div className={`h-px w-full ${isCompleted ? "bg-cyan-300" : "bg-gray-200"}`} />
                    <div className={`absolute right-0 w-1.5 h-1.5 rounded-full border ${isCompleted ? "bg-cyan-300 border-cyan-300" : "bg-white border-gray-300"}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
