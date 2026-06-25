import { TemplatesControlBar } from "../components/TemplatesControlBar";
import { TemplateCard } from "../components/TemplateCard";

const firmTemplates = [
  {
    name: "Standard PI Demand - Illinois",
    type: "General PI",
    typeColor: "blue",
    injuryType: "General",
    jurisdiction: "Illinois",
    lastUpdated: "3 days ago",
    createdBy: "Jennifer Davis",
    description: "Firm-standard template for general personal injury demands in Illinois jurisdiction with standard medical documentation sections.",
  },
  {
    name: "Motor Vehicle Spinal Injury",
    type: "Severe Injury",
    typeColor: "purple",
    injuryType: "Spinal Injury",
    jurisdiction: "Multi-State",
    lastUpdated: "1 week ago",
    createdBy: "Michael Chen",
    description: "Comprehensive template for motor vehicle accidents resulting in spinal injuries, including long-term care projections and expert testimony support.",
  },
  {
    name: "Slip & Fall Standard",
    type: "Slip & Fall",
    typeColor: "green",
    injuryType: "Multiple",
    jurisdiction: "Florida",
    lastUpdated: "5 days ago",
    createdBy: "Sarah Johnson",
    description: "Standard template for premises liability slip and fall cases with emphasis on notice and negligence documentation.",
  },
  {
    name: "Back Injury - Workplace",
    type: "General PI",
    typeColor: "blue",
    injuryType: "Back Injury",
    jurisdiction: "Texas",
    lastUpdated: "2 weeks ago",
    createdBy: "Robert Martinez",
    description: "Template specifically structured for workplace-related back injuries with wage loss calculations and career impact analysis.",
  },
  {
    name: "Fracture Standard Template",
    type: "General PI",
    typeColor: "blue",
    injuryType: "Fractures",
    jurisdiction: "Georgia",
    lastUpdated: "1 week ago",
    createdBy: "Jennifer Davis",
    description: "Standard format for bone fracture cases including surgical intervention documentation and permanent hardware considerations.",
  },
  {
    name: "Head Injury Complex",
    type: "Severe Injury",
    typeColor: "purple",
    injuryType: "Head Injury",
    jurisdiction: "Multi-State",
    lastUpdated: "4 days ago",
    createdBy: "David Lee",
    description: "Advanced template for traumatic brain injury and complex head injury cases with neurological expert integration.",
  },
];

export function TemplatesPage() {
  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-8">
      <div>
        <div className="eyebrow mb-2">
          DRAFTING STANDARDS
        </div>
        <h1 className="page-title mb-2">Templates</h1>
        <p className="body-text text-[#5B6B78]">
          Manage firm-standard demand templates used across intake, demand generation, and negotiation workflows.
        </p>
      </div>

      <TemplatesControlBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {firmTemplates.map((template, index) => (
            <TemplateCard key={index} {...template} />
          ))}
      </div>
    </div>
  );
}
