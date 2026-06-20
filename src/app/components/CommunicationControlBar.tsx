import { Search } from "lucide-react";

export function CommunicationControlBar() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by sender, client name, case ID, email..."
          className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
        />
      </div>

      <select className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 cursor-pointer hover:bg-gray-50 transition-all min-w-[180px]">
        <option value="all">All Messages</option>
        <option value="unread">Unread</option>
        <option value="negotiation">Negotiation</option>
        <option value="client">Client Messages</option>
        <option value="sent">Sent Items</option>
        <option value="completed">Completed Threads</option>
      </select>

      <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 cursor-pointer hover:bg-white/10 transition-all min-w-[160px]">
        <option value="all">All Cases</option>
        <option value="pi-2024-023">PI-2024-023</option>
        <option value="pi-2024-008">PI-2024-008</option>
        <option value="pi-2024-015">PI-2024-015</option>
      </select>

      <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 cursor-pointer hover:bg-white/10 transition-all min-w-[200px]">
        <option value="all">All</option>
        <option value="needs-response">Needs Response</option>
        <option value="waiting-opposing">Waiting on Opposing Party</option>
        <option value="waiting-client">Waiting on Client</option>
        <option value="closed">Closed Threads</option>
      </select>

      <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 cursor-pointer hover:bg-white/10 transition-all min-w-[160px]">
        <option value="recent">Recently Updated</option>
        <option value="oldest">Oldest First</option>
        <option value="unread">Unread First</option>
        <option value="priority">High Priority First</option>
      </select>
    </div>
  );
}
