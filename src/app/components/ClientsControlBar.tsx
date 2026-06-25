import { Search, Grid3x3, List } from "lucide-react";
import { Button } from "./ui/button";

interface ClientsControlBarProps {
  viewMode: "grid" | "list";
  onViewChange: (mode: "grid" | "list") => void;
}

export function ClientsControlBar({ viewMode, onViewChange }: ClientsControlBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <Search strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A98A3]" />
        <input
          type="text"
          placeholder="Search by client name, case ID, phone..."
          className="w-full bg-white border border-line rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#0F1E2B] placeholder:text-[#8A98A3] focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[180px]">
        <option value="all">All Clients</option>
        <option value="attention">Needs Attention</option>
        <option value="active">My Active Clients</option>
        <option value="contacted">Recently Contacted</option>
        <option value="stale">Stale Contact (7+ days)</option>
      </select>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[160px]">
        <option value="all">All Statuses</option>
        <option value="awaiting">Awaiting Docs</option>
        <option value="review">Ready for Review</option>
        <option value="demand">Ready for Demand</option>
        <option value="negotiation">Negotiation</option>
        <option value="medical">Medical Review</option>
        <option value="settled">Settled</option>
      </select>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[180px]">
        <option value="all">All Blockers</option>
        <option value="medical-bills">Missing Medical Bills</option>
        <option value="signature">Missing Signature</option>
        <option value="police">Missing Police Report</option>
        <option value="no-response">No Client Response</option>
      </select>

      <div className="flex items-center gap-1 bg-track rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange("grid")}
          className={`h-8 px-3 rounded-md ${
            viewMode === "grid"
              ? "bg-white text-ink shadow-sm hover:bg-white"
              : "text-[#5B6B78] hover:bg-tint"
          }`}
        >
          <Grid3x3 strokeWidth={1.75} className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange("list")}
          className={`h-8 px-3 rounded-md ${
            viewMode === "list"
              ? "bg-white text-ink shadow-sm hover:bg-white"
              : "text-[#5B6B78] hover:bg-tint"
          }`}
        >
          <List strokeWidth={1.75} className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
