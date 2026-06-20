import { useState } from "react";
import { ClientsControlBar } from "../components/ClientsControlBar";
import { ClientsGrid, clientsData } from "../components/ClientsGrid";
import { ClientsList } from "../components/ClientsList";

export function ClientsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="max-w-[1800px] mx-auto p-8 space-y-8">
      <div>
        <div className="text-xs uppercase tracking-wider text-cyan-600 mb-2">
          CLIENT DIRECTORY
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients</h1>
        <p className="text-gray-600">
          All active and historical plaintiffs across personal injury matters.
        </p>
      </div>

      <ClientsControlBar viewMode={viewMode} onViewChange={setViewMode} />

      {viewMode === "grid" ? <ClientsGrid /> : <ClientsList clients={clientsData} />}
    </div>
  );
}
