import { Search, Upload } from "lucide-react";
import { Button } from "./ui/button";

export function TemplatesControlBar() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search templates..."
          className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
        />
      </div>

      <select className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 cursor-pointer hover:bg-gray-50 transition-all min-w-[180px]">
        <option value="all">All Categories</option>
        <option value="general">General PI</option>
        <option value="severe">Severe Injury</option>
        <option value="truck">Truck Accident</option>
        <option value="slip-fall">Slip & Fall</option>
      </select>

      <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0 gap-2">
        <Upload className="w-4 h-4" />
        Upload Template
      </Button>
    </div>
  );
}
