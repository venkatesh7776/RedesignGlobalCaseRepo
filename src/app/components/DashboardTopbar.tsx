import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function DashboardTopbar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-6">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search cases, clients, documents..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-11 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
        />
      </div>

      <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Bell className="w-5 h-5 text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
      </button>

      <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
        <Avatar className="w-9 h-9 border border-gray-200">
          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white text-sm font-semibold">
            JD
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm text-gray-900 font-medium">Jennifer Davis</div>
          <div className="text-xs text-gray-500">j.davis@lexguard.law</div>
        </div>
      </div>
    </div>
  );
}
