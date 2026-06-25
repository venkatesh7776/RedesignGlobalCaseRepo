import { Search, Upload } from "lucide-react";
import { Button } from "./ui/button";

export function TemplatesControlBar() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <Search strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A98A3]" />
        <input
          type="text"
          placeholder="Search templates..."
          className="w-full bg-white border border-line rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#0F1E2B] placeholder:text-[#8A98A3] focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      <select className="bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-[#33424C] focus:outline-none focus:border-brand cursor-pointer hover:bg-tint transition-colors min-w-[180px]">
        <option value="all">All Categories</option>
        <option value="general">General PI</option>
        <option value="severe">Severe Injury</option>
        <option value="truck">Truck Accident</option>
        <option value="slip-fall">Slip & Fall</option>
      </select>

      <Button className="bg-brand hover:bg-deep text-white border-0 gap-2">
        <Upload strokeWidth={1.75} className="w-4 h-4" />
        Upload Template
      </Button>
    </div>
  );
}
