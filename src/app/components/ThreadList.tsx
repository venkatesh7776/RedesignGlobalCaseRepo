interface Thread {
  id: string;
  sender: string;
  subject: string;
  caseId: string;
  clientName: string;
  time: string;
  status: string;
  statusColor: string;
  unread: boolean;
}

interface ThreadListProps {
  threads: Thread[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusStyles = {
  orange: "pill pill-progress",
  purple: "pill pill-progress",
  cyan: "pill pill-neutral",
  green: "pill pill-complete",
  gray: "pill pill-neutral",
};

export function ThreadList({ threads, selectedId, onSelect }: ThreadListProps) {
  return (
    <div className="lg-card overflow-hidden h-[calc(100vh-280px)] shadow-sm">
      <div className="divide-y divide-line overflow-y-auto h-full">
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onSelect(thread.id)}
            className={`lg-row w-full py-4 px-4 text-left transition-all ${
              selectedId === thread.id ? "bg-tint border-l-2 border-brand" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {thread.unread && (
                  <div className="w-2 h-2 bg-brand rounded-full flex-shrink-0"></div>
                )}
                <h3 className={`card-title ${thread.unread ? "text-ink" : "text-[#5B6B78]"}`}>
                  {thread.sender}
                </h3>
              </div>
              <span className="mono-ref whitespace-nowrap ml-2">{thread.time}</span>
            </div>

            <p className={`text-sm mb-2 line-clamp-1 ${thread.unread ? "text-ink" : "text-[#5B6B78]"}`}>
              {thread.subject}
            </p>

            <div className="flex items-center justify-between">
              <span className="mono-ref text-deep">
                {thread.caseId} • {thread.clientName}
              </span>
              <span
                className={`${
                  statusStyles[thread.statusColor as keyof typeof statusStyles]
                }`}
              >
                {thread.status}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
