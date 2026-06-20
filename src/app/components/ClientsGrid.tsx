import { ClientCard } from "./ClientCard";

export const clientsData = [
  {
    name: "Sarah Jenkins",
    status: "Ready for Demand",
    statusColor: "cyan",
    injury: "Spinal injury",
    attention: "Missing Final Bill",
    lastContact: "2d ago",
    openedDate: "Jan 12",
    actionLabel: "Open",
    initials: "SJ",
  },
  {
    name: "Marcus Thorne",
    status: "Negotiation",
    statusColor: "purple",
    injury: "Back injury",
    attention: "No Issues",
    lastContact: "Yesterday",
    openedDate: "Feb 8",
    actionLabel: "Open",
    initials: "MT",
  },
  {
    name: "Elena Rodriguez",
    status: "Awaiting Docs",
    statusColor: "orange",
    injury: "Whiplash",
    attention: "Treatment Notes Pending",
    lastContact: "Today",
    openedDate: "Mar 15",
    actionLabel: "Open",
    initials: "ER",
  },
  {
    name: "Robert Vance",
    status: "Settled",
    statusColor: "green",
    injury: "Leg fracture",
    attention: "Complete",
    lastContact: "3d ago",
    openedDate: "Nov 22, 2023",
    actionLabel: "View",
    initials: "RV",
  },
  {
    name: "James Miller",
    status: "Medical Review",
    statusColor: "gray",
    injury: "Shoulder injury",
    attention: "Police Report Missing",
    lastContact: "6d ago",
    openedDate: "Jan 5",
    actionLabel: "Open",
    initials: "JM",
  },
  {
    name: "Lisa Chen",
    status: "Ready for Review",
    statusColor: "yellow",
    injury: "Soft tissue injury",
    attention: "Signature Pending",
    lastContact: "1d ago",
    openedDate: "Feb 20",
    actionLabel: "Open",
    initials: "LC",
  },
  {
    name: "David Martinez",
    status: "Awaiting Docs",
    statusColor: "orange",
    injury: "Fractured wrist",
    attention: "Medical Records Missing",
    lastContact: "4h ago",
    openedDate: "Mar 1",
    actionLabel: "Open",
    initials: "DM",
  },
  {
    name: "Amanda Thompson",
    status: "Ready for Demand",
    statusColor: "cyan",
    injury: "Head injury",
    attention: "No Issues",
    lastContact: "3d ago",
    openedDate: "Jan 28",
    actionLabel: "Open",
    initials: "AT",
  },
  {
    name: "Kevin Park",
    status: "Negotiation",
    statusColor: "purple",
    injury: "Knee injury",
    attention: "No Issues",
    lastContact: "5h ago",
    openedDate: "Feb 14",
    actionLabel: "Open",
    initials: "KP",
  },
];

export function ClientsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {clientsData.map((client, index) => (
        <ClientCard key={index} {...client} />
      ))}
    </div>
  );
}
