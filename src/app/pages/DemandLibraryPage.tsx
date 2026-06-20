import { DemandLibraryControlBar } from "../components/DemandLibraryControlBar";
import { DemandCard } from "../components/DemandCard";

const demands = [
  {
    caseId: "PI-2024-023",
    client: "Sarah Jenkins",
    injury: "Spinal Injury",
    jurisdiction: "Cook County, IL",
    demandAmount: "$156,756",
    version: "V2",
    status: "Negotiation Active",
    statusColor: "purple",
    preview: "Client suffered severe lumbar trauma requiring ongoing treatment and physical therapy. Medical experts confirm permanent partial disability with need for future care including pain management and potential surgical intervention.",
    dateUpdated: "2 days ago",
  },
  {
    caseId: "PI-2023-992",
    client: "Robert Vance",
    injury: "Leg Fracture",
    jurisdiction: "Harris County, TX",
    demandAmount: "$125,000",
    version: "V1",
    status: "Settled",
    statusColor: "green",
    preview: "Plaintiff sustained compound fracture to left femur in construction site accident. Required multiple surgeries and six months recovery. Lost wages and diminished earning capacity clearly documented.",
    dateUpdated: "1 week ago",
  },
  {
    caseId: "PI-2024-008",
    client: "Marcus Thorne",
    injury: "Back Injury",
    jurisdiction: "Miami-Dade, FL",
    demandAmount: "$98,450",
    version: "V3",
    status: "Sent",
    statusColor: "cyan",
    preview: "Severe lower back injury from slip and fall at retail location. Client underwent epidural injections and physical therapy over eight months. Continuing pain impacts daily activities and work performance.",
    dateUpdated: "3 days ago",
  },
  {
    caseId: "PI-2024-012",
    client: "Elena Rodriguez",
    injury: "Whiplash",
    jurisdiction: "King County, WA",
    demandAmount: "$67,200",
    version: "V1",
    status: "Draft Ready",
    statusColor: "blue",
    preview: "Motor vehicle collision resulted in cervical strain with chronic neck pain and headaches. Treatment included chiropractic care and pain management. Medical imaging confirms soft tissue damage consistent with reported symptoms.",
    dateUpdated: "5 days ago",
  },
  {
    caseId: "PI-2024-015",
    client: "James Summers",
    injury: "Fractured Wrist",
    jurisdiction: "Fulton County, GA",
    demandAmount: "$54,890",
    version: "V1",
    status: "Negotiation Active",
    statusColor: "purple",
    preview: "Client sustained displaced fracture requiring surgical intervention with plate and screws. Extended recovery period affected ability to perform job duties. Permanent hardware and ongoing discomfort documented.",
    dateUpdated: "1 day ago",
  },
  {
    caseId: "PI-2024-001",
    client: "James Miller",
    injury: "Shoulder Injury",
    jurisdiction: "Cook County, IL",
    demandAmount: "$112,340",
    version: "V2",
    status: "Sent",
    statusColor: "cyan",
    preview: "Rotator cuff tear from workplace accident requiring arthroscopic surgery. Post-operative complications extended recovery timeline. Reduced range of motion impacts plaintiff's ability to perform essential job functions.",
    dateUpdated: "4 days ago",
  },
];

export function DemandLibraryPage() {
  return (
    <div className="max-w-[1400px] mx-auto p-8 space-y-8">
      <div>
        <div className="text-xs uppercase tracking-wider text-cyan-600 mb-2">
          DEMAND INTELLIGENCE
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Demand Library</h1>
        <p className="text-gray-600">
          Search, review, and reference demand packages across all cases.
        </p>
      </div>

      <DemandLibraryControlBar />

      <div className="space-y-4">
        {demands.map((demand) => (
          <DemandCard key={demand.caseId} {...demand} />
        ))}
      </div>
    </div>
  );
}
