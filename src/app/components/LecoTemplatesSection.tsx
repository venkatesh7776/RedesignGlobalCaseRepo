import { Sparkles } from "lucide-react";
import { TemplateCard } from "./TemplateCard";

const lecoTemplates = [
  {
    name: "Severe Spinal Injury Standard",
    type: "Severe Injury",
    typeColor: "purple",
    injuryType: "Spinal Injury",
    jurisdiction: "Multi-State",
    lastUpdated: "2 weeks ago",
    createdBy: "Leco Team",
    description: "Comprehensive template for severe spinal injury cases with long-term treatment needs and permanent disability considerations.",
  },
  {
    name: "Truck Accident Demand",
    type: "Truck Accident",
    typeColor: "orange",
    injuryType: "Multiple",
    jurisdiction: "Federal",
    lastUpdated: "1 month ago",
    createdBy: "Leco Team",
    description: "Structured format for commercial truck accident cases including regulatory violations and corporate liability.",
  },
  {
    name: "Soft Tissue Injury Template",
    type: "Soft Tissue",
    typeColor: "blue",
    injuryType: "Whiplash",
    jurisdiction: "Multi-State",
    lastUpdated: "3 weeks ago",
    createdBy: "Leco Team",
    description: "Standard template for whiplash and soft tissue cases with emphasis on treatment continuity and chronic pain documentation.",
  },
];

export function LecoTemplatesSection() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-deep" strokeWidth={1.75} />
        <h2 className="section-header">Leco Recommended Templates</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lecoTemplates.map((template, index) => (
          <TemplateCard key={index} {...template} isLecoTemplate={true} />
        ))}
      </div>
    </div>
  );
}
