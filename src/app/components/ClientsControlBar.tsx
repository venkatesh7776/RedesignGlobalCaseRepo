import { Search, Grid3x3, List } from "lucide-react";
import { Button } from "./ui/button";

interface ClientsControlBarProps {
  viewMode: "grid" | "list";
  onViewChange: (mode: "grid" | "list") => void;
}

export function ClientsControlBar({ viewMode, onViewChange }: ClientsControlBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by client name, case ID, phone..."
          className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
        />
      </div>

      <select className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 cursor-pointer hover:bg-gray-50 transition-all min-w-[180px]">
        <option value="all">All Clients</option>
        <option value="attention">Needs Attention</option>
        <option value="active">My Active Clients</option>
        <option value="contacted">Recently Contacted</option>
        <option value="stale">Stale Contact (7+ days)</option>
      </select>

      <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 cursor-pointer hover:bg-white/10 transition-all min-w-[160px]">
        <option value="all">All Statuses</option>
        <option value="awaiting">Awaiting Docs</option>
        <option value="review">Ready for Review</option>
        <option value="demand">Ready for Demand</option>
        <option value="negotiation">Negotiation</option>
        <option value="medical">Medical Review</option>
        <option value="settled">Settled</option>
      </select>

      <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 cursor-pointer hover:bg-white/10 transition-all min-w-[180px]">
        <option value="all">All Blockers</option>
        <option value="medical-bills">Missing Medical Bills</option>
        <option value="signature">Missing Signature</option>
        <option value="police">Missing Police Report</option>
        <option value="no-response">No Client Response</option>
      </select>

      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange("grid")}
          className={`h-8 px-3 ${
            viewMode === "grid"
              ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
              : "text-white/50 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange("list")}
          className={`h-8 px-3 ${
            viewMode === "list"
              ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
              : "text-white/50 hover:bg-white/10 hover:text-white"
          }`}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
