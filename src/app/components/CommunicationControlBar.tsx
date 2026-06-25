import { Search } from "lucide-react";

export function CommunicationControlBar() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <Search strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A98A3]" />
        <input
          type="text"
          placeholder="Search by sender, client name, case ID, email..."
          className="w-full bg-white border border-line rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#0F1E2B] placeholder:text-[#8A98A3] focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[180px]">
        <option value="all">All Messages</option>
        <option value="unread">Unread</option>
        <option value="negotiation">Negotiation</option>
        <option value="client">Client Messages</option>
        <option value="sent">Sent Items</option>
        <option value="completed">Completed Threads</option>
      </select>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[160px]">
        <option value="all">All Cases</option>
        <option value="pi-2024-023">PI-2024-023</option>
        <option value="pi-2024-008">PI-2024-008</option>
        <option value="pi-2024-015">PI-2024-015</option>
      </select>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[200px]">
        <option value="all">All</option>
        <option value="needs-response">Needs Response</option>
        <option value="waiting-opposing">Waiting on Opposing Party</option>
        <option value="waiting-client">Waiting on Client</option>
        <option value="closed">Closed Threads</option>
      </select>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[160px]">
        <option value="recent">Recently Updated</option>
        <option value="oldest">Oldest First</option>
        <option value="unread">Unread First</option>
        <option value="priority">High Priority First</option>
      </select>
    </div>
  );
}
