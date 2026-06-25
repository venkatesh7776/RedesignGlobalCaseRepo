import { Search } from "lucide-react";

export function FilterBar() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <Search strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A98A3]" />
        <input
          type="text"
          placeholder="Search by Plaintiff, Defendant, Case ID..."
          className="w-full bg-white border border-line rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#0F1E2B] placeholder:text-[#8A98A3] focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[200px]">
        <option value="all">All Statuses</option>
        <option value="demand">Ready for Demand</option>
        <option value="negotiation">Negotiation</option>
        <option value="awaiting">Awaiting Client Docs</option>
        <option value="medical">Medical Review</option>
        <option value="review">Ready for Review</option>
        <option value="settled">Settled</option>
      </select>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[200px]">
        <option value="all">All Cases</option>
        <option value="missing">Missing Items</option>
        <option value="today">Updated Today</option>
        <option value="24h">Updated Last 24h</option>
        <option value="no-issues">No Issues</option>
        <option value="completed">Completed Cases</option>
        <option value="stale">Stale (No update in 3+ days)</option>
      </select>
    </div>
  );
}
