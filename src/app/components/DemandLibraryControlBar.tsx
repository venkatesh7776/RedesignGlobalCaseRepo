import { Search } from "lucide-react";

export function DemandLibraryControlBar() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <Search strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A98A3]" />
        <input
          type="text"
          placeholder="Search by injury, case ID, client, defendant, settlement..."
          className="w-full bg-white border border-line rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#0F1E2B] placeholder:text-[#8A98A3] focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[180px]">
        <option value="all">All Jurisdictions</option>
        <option value="cook">Cook County, IL</option>
        <option value="miami">Miami-Dade, FL</option>
        <option value="fulton">Fulton County, GA</option>
        <option value="king">King County, WA</option>
        <option value="harris">Harris County, TX</option>
      </select>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[180px]">
        <option value="all">All Statuses</option>
        <option value="draft">Draft Ready</option>
        <option value="sent">Sent</option>
        <option value="negotiation">Negotiation Active</option>
        <option value="settled">Settled</option>
      </select>
    </div>
  );
}
