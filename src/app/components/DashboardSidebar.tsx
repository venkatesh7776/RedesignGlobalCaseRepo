import { LayoutDashboard, FolderOpen, FileText, Mail, Users, Files, Settings, LogOut, Inbox } from "lucide-react";
import { Button } from "./ui/button";

interface DashboardSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function DashboardSidebar({ activePage, onNavigate }: DashboardSidebarProps) {
  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LG</span>
          </div>
          <div>
            <div className="text-gray-900 font-semibold text-sm">LexGuard</div>
            <div className="text-cyan-600 text-xs">Injury Intel</div>
          </div>
        </div>
      </div>

      <div className="px-3 mb-4 flex-shrink-0">
        <Button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0">
          + New PI Dossier
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => onNavigate("dashboard")} active={activePage === "dashboard"} />
        <NavItem icon={Inbox} label="Case Intake" onClick={() => onNavigate("intake")} active={activePage === "intake"} />
        <NavItem icon={FolderOpen} label="Case Workspace" onClick={() => onNavigate("cases")} active={activePage === "cases"} />
        <NavItem icon={Users} label="Clients" onClick={() => onNavigate("clients")} active={activePage === "clients"} />
        <NavItem icon={Mail} label="Communication" onClick={() => onNavigate("communication")} active={activePage === "communication"} />
        <NavItem icon={FileText} label="Demand Letters" onClick={() => onNavigate("demands")} active={activePage === "demands"} />
        <NavItem icon={Files} label="Templates" onClick={() => onNavigate("templates")} active={activePage === "templates"} />
      </nav>

      <div className="p-3 space-y-3 border-t border-gray-200 flex-shrink-0">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        active
          ? "bg-cyan-50 text-cyan-600 border border-cyan-200"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
}
