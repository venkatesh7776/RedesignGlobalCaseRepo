import { LayoutDashboard, FolderOpen, FileText, Mail, Users, Files, Settings, LogOut, Inbox, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface DashboardSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DashboardSidebar({ activePage, onNavigate, collapsed = false, onToggleCollapse }: DashboardSidebarProps) {
  return (
    <div className={`${collapsed ? "w-[72px]" : "w-64"} h-full bg-white border-r border-line flex flex-col transition-[width] duration-200 ease-in-out`}>
      <div className={`${collapsed ? "px-3" : "px-6"} py-6 flex-shrink-0`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-ink rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm tracking-tight">LG</span>
            </div>
            {!collapsed && (
              <div>
                <div className="text-ink font-semibold text-sm leading-tight">LexGuard</div>
                <div className="eyebrow mt-0.5">Injury Intel</div>
              </div>
            )}
          </div>
          {!collapsed && onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              className="text-[#5B6B78] hover:bg-tint hover:text-ink rounded-lg p-1.5 transition-colors duration-150"
            >
              <PanelLeftClose className="w-5 h-5" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {collapsed && onToggleCollapse && (
        <div className="px-3 mb-2 flex-shrink-0 flex justify-center">
          <button
            onClick={onToggleCollapse}
            title="Expand sidebar"
            className="text-[#5B6B78] hover:bg-tint hover:text-ink rounded-lg p-2 transition-colors duration-150"
          >
            <PanelLeftOpen className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
      )}

      <div className={`${collapsed ? "px-3" : "px-4"} mb-6 flex-shrink-0`}>
        <Button className="w-full" title="New PI Dossier">
          {collapsed ? <Plus className="w-5 h-5" /> : "+ New PI Dossier"}
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => onNavigate("dashboard")} active={activePage === "dashboard"} collapsed={collapsed} />
        <NavItem icon={Inbox} label="Case Intake" onClick={() => onNavigate("intake")} active={activePage === "intake"} collapsed={collapsed} />
        <NavItem icon={FolderOpen} label="Case Workspace" onClick={() => onNavigate("cases")} active={activePage === "cases"} collapsed={collapsed} />
        <NavItem icon={Users} label="Clients" onClick={() => onNavigate("clients")} active={activePage === "clients"} collapsed={collapsed} />
        <NavItem icon={Mail} label="Communication" onClick={() => onNavigate("communication")} active={activePage === "communication"} collapsed={collapsed} />
        <NavItem icon={FileText} label="Demand Letters" onClick={() => onNavigate("demands")} active={activePage === "demands"} collapsed={collapsed} />
        <NavItem icon={Files} label="Templates" onClick={() => onNavigate("templates")} active={activePage === "templates"} collapsed={collapsed} />
      </nav>

      <div className="p-3 space-y-1 border-t border-line flex-shrink-0">
        <button
          title="Settings"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#5B6B78] hover:bg-tint hover:text-ink transition-colors duration-150 ${collapsed ? "justify-center" : ""}`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" strokeWidth={1.75} />
          {!collapsed && <span className="text-sm">Settings</span>}
        </button>

        <button
          title="Logout"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#5B6B78] hover:bg-[#FEF2F2] hover:text-[#B91C1C] transition-colors duration-150 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={1.75} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, onClick, collapsed = false }: { icon: any; label: string; active?: boolean; onClick?: () => void; collapsed?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${collapsed ? "justify-center" : ""} ${
        active
          ? "bg-tint text-ink font-medium"
          : "text-[#5B6B78] hover:bg-tint hover:text-ink"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-brand" />
      )}
      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.75} />
      {!collapsed && <span className="text-sm">{label}</span>}
    </button>
  );
}
