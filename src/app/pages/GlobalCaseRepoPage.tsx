import { useState } from "react";
import { Search, ArrowRight, MapPin, Calendar, Archive } from "lucide-react";

const WORKSPACE_CASES = [
  {
    id: "CASE-94101",
    caseName: "Estate of Miller vs Logistics Co.",
    caseType: "Motor Vehicle Accident",
    plaintiff: "Evelyn Miller",
    defendant: "Midwest Logistics Co.",
    summary:
      "Our client was struck by a commercial logistics vehicle that failed to yield at a controlled intersection, resulting in cervical disc herniations and ongoing neurological treatment.",
    jurisdiction: "Cook County, IL",
    dateOfIncident: "Feb 14, 2026",
    estimatedLow: 968700,
    estimatedHigh: 1372325,
    status: "Attorney Active",
    lastUpdated: "2 mins ago",
  },
  {
    id: "CASE-94102",
    caseName: "Sarah Jenkins vs Metro Transit",
    caseType: "Premises Liability",
    plaintiff: "Sarah Jenkins",
    defendant: "Metro Transit Authority",
    summary:
      "Client sustained severe spinal injuries following a bus collision caused by driver negligence, resulting in permanent disability and extensive ongoing rehabilitation requirements.",
    jurisdiction: "Harris County, TX",
    dateOfIncident: "Jan 8, 2026",
    estimatedLow: 650000,
    estimatedHigh: 820000,
    status: "Ready For Review",
    lastUpdated: "Just now",
  },
  {
    id: "CASE-94103",
    caseName: "Salinas v. Amaro",
    caseType: "Motor Vehicle Accident",
    plaintiff: "Cesar Jose Barrera Salinas",
    defendant: "Carlos Guadalupe Amaro",
    summary:
      "Client was rear-ended by a commercial vehicle at high speed, causing significant lumbar spine damage, soft tissue injuries, and documented loss of earning capacity.",
    jurisdiction: "Los Angeles County, CA",
    dateOfIncident: "Mar 3, 2026",
    estimatedLow: 242175,
    estimatedHigh: 968700,
    status: "Drafting Demand",
    lastUpdated: "15 mins ago",
  },
  {
    id: "CASE-94104",
    caseName: "Arthur Pendleton v. Vertex Cargo",
    caseType: "Product Liability",
    plaintiff: "Arthur Pendleton",
    defendant: "Vertex Cargo Systems LLC",
    summary:
      "Defective cargo restraint system failed during transit, causing the client to sustain traumatic brain injury and bilateral shoulder damage requiring surgical intervention.",
    jurisdiction: "Maricopa County, AZ",
    dateOfIncident: "Dec 19, 2025",
    estimatedLow: 1100000,
    estimatedHigh: 1850000,
    status: "In Negotiation",
    lastUpdated: "1 hour ago",
  },
  {
    id: "CASE-94105",
    caseName: "Rodriguez v. City Transit",
    caseType: "Motor Vehicle Accident",
    plaintiff: "Elena Rodriguez",
    defendant: "City of Miami Transit",
    summary:
      "Client suffered whiplash and chronic cervical pain following a collision with a municipal transit vehicle, with documented soft tissue damage and ongoing pain management.",
    jurisdiction: "Miami-Dade County, FL",
    dateOfIncident: "Nov 2, 2025",
    estimatedLow: 185000,
    estimatedHigh: 310000,
    status: "Awaiting Filing",
    lastUpdated: "3 hours ago",
  },
];

const CASE_TYPES = ["Motor Vehicle Accident", "Medical Malpractice", "Premises Liability", "Product Liability", "Workplace Injury"];
const JURISDICTIONS = ["Cook County, IL", "Harris County, TX", "Los Angeles County, CA", "Maricopa County, AZ", "Miami-Dade County, FL"];

const STATUS_STYLES: Record<string, string> = {
  "Ready For Review": "bg-green-50 text-green-700 border-green-200",
  "Attorney Active": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Drafting Demand": "bg-blue-50 text-blue-700 border-blue-200",
  "In Negotiation": "bg-purple-50 text-purple-700 border-purple-200",
  "Awaiting Filing": "bg-orange-50 text-orange-700 border-orange-200",
};

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

export function GlobalCaseRepoPage() {
  const [search, setSearch] = useState("");
  const [caseTypeFilter, setCaseTypeFilter] = useState("All");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [openedCases, setOpenedCases] = useState<Set<string>>(new Set());

  const handleOpenWorkspace = (id: string) => {
    setOpenedCases((prev) => new Set([...prev, id]));
  };

  const filtered = WORKSPACE_CASES.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      c.caseName.toLowerCase().includes(q) ||
      c.plaintiff.toLowerCase().includes(q) ||
      c.defendant.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.jurisdiction.toLowerCase().includes(q);
    const matchesType = caseTypeFilter === "All" || c.caseType === caseTypeFilter;
    const matchesJurisdiction = jurisdictionFilter === "All" || c.jurisdiction === jurisdictionFilter;
    return matchesSearch && matchesType && matchesJurisdiction;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Litigation Case Workspaces</h1>
            <p className="text-gray-600">Select a completed litigation matter to review evidence, prepare strategy, draft demands, and manage case execution.</p>
          </div>
          <div className="shrink-0 flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-2xl">
            <Archive className="w-5 h-5 text-gray-400" />
            <div className="text-right">
              <div className="text-xs text-gray-500 font-medium">Managed Archives</div>
              <div className="text-lg font-bold text-gray-900">6 Cases</div>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cases, plaintiffs, defendants, case IDs..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={caseTypeFilter}
              onChange={(e) => setCaseTypeFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-cyan-400 transition-colors"
            >
              <option value="All">Case Type</option>
              {CASE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select
              value={jurisdictionFilter}
              onChange={(e) => setJurisdictionFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-cyan-400 transition-colors"
            >
              <option value="All">Jurisdiction</option>
              {JURISDICTIONS.map((j) => <option key={j}>{j}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-cyan-400 transition-colors"
            >
              <option value="recent">Recently Updated</option>
              <option value="value">Highest Value</option>
              <option value="name">Case Name</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500">
          {filtered.length} matter{filtered.length !== 1 ? "s" : ""} ready for review
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
              <Archive className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Cases Ready For Workspace</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">Cases that complete the Intake Pipeline will automatically appear here.</p>
            <button className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition-colors">
              Go To Intake Pipeline
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((c) => {
              const status = openedCases.has(c.id) && c.status === "Ready For Review" ? "Attorney Active" : c.status;
              return (
                <div
                  key={c.id}
                  className="bg-white border border-gray-200 rounded-2xl flex flex-col hover:shadow-lg hover:border-gray-300 transition-all group overflow-hidden"
                >
                  {/* Card header band */}
                  <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="inline-flex items-center px-2.5 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-lg border border-cyan-100">
                        {c.caseType}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {status}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-cyan-700 transition-colors leading-snug mb-0.5">
                      {c.caseName}
                    </h2>
                    <span className="text-xs font-mono text-gray-400">{c.id}</span>
                  </div>

                  {/* Value */}
                  <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
                    <span className="text-xs text-gray-400">Est. Value</span>
                    <span className="text-xs font-medium text-gray-600">{formatCurrency(c.estimatedLow)} – {formatCurrency(c.estimatedHigh)}</span>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-5 flex flex-col flex-1 gap-4">
                    {/* Parties */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Plaintiff</div>
                        <div className="text-sm text-gray-900 font-medium leading-tight">{c.plaintiff}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Defendant</div>
                        <div className="text-sm text-gray-900 font-medium leading-tight">{c.defendant}</div>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
                      {c.summary}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {c.jurisdiction && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {c.jurisdiction}
                        </div>
                      )}
                      {c.dateOfIncident && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar className="w-3 h-3 shrink-0" />
                          {c.dateOfIncident}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA footer */}
                  <div className="px-6 py-4 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenWorkspace(c.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-cyan-600 text-white rounded-xl text-sm font-semibold transition-colors"
                    >
                      Open Workspace
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
