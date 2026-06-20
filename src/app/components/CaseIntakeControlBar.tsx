import { Search, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface CaseIntakeControlBarProps {
  onNewCase?: () => void;
}

export function CaseIntakeControlBar({ onNewCase }: CaseIntakeControlBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Plaintiff, Defendant, Client, or Case ID..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        <select className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 cursor-pointer hover:bg-gray-50 transition-all min-w-[160px]">
          <option value="all">All Cases</option>
          <option value="progress">In Progress</option>
          <option value="ready">Ready For Review</option>
        </select>

        <select className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-cyan-500 cursor-pointer hover:bg-gray-50 transition-all min-w-[180px]">
          <option value="updated">Recently Updated</option>
          <option value="intake">Intake Date</option>
          <option value="progress">Progress</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>

      <Button
        onClick={onNewCase}
        className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0 gap-2 ml-4"
      >
        <Plus className="w-4 h-4" />
        New Case
      </Button>
    </div>
  );
}
