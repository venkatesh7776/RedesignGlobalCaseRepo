import { Search } from "lucide-react";

export function FilterBar() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Plaintiff, Defendant, Case ID..."
          className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
        />
      </div>

      <select className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 cursor-pointer hover:bg-gray-50 transition-all min-w-[200px]">
        <option value="all">All Statuses</option>
        <option value="demand">Ready for Demand</option>
        <option value="negotiation">Negotiation</option>
        <option value="awaiting">Awaiting Client Docs</option>
        <option value="medical">Medical Review</option>
        <option value="review">Ready for Review</option>
        <option value="settled">Settled</option>
      </select>

      <select className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 cursor-pointer hover:bg-gray-50 transition-all min-w-[200px]">
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
