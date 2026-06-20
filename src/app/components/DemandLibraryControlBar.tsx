import { Search } from "lucide-react";

export function DemandLibraryControlBar() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by injury, case ID, client, defendant, settlement..."
          className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
        />
      </div>

      <select className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 cursor-pointer hover:bg-gray-50 transition-all min-w-[180px]">
        <option value="all">All Jurisdictions</option>
        <option value="cook">Cook County, IL</option>
        <option value="miami">Miami-Dade, FL</option>
        <option value="fulton">Fulton County, GA</option>
        <option value="king">King County, WA</option>
        <option value="harris">Harris County, TX</option>
      </select>

      <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 cursor-pointer hover:bg-white/10 transition-all min-w-[180px]">
        <option value="all">All Statuses</option>
        <option value="draft">Draft Ready</option>
        <option value="sent">Sent</option>
        <option value="negotiation">Negotiation Active</option>
        <option value="settled">Settled</option>
      </select>
    </div>
  );
}
