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
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  green: "bg-green-500/10 text-green-400 border-green-500/30",
  gray: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

export function ThreadList({ threads, selectedId, onSelect }: ThreadListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-[calc(100vh-280px)]">
      <div className="divide-y divide-gray-200 overflow-y-auto h-full">
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onSelect(thread.id)}
            className={`w-full p-4 text-left hover:bg-gray-50 transition-all ${
              selectedId === thread.id ? "bg-cyan-50 border-l-2 border-cyan-500" : ""
            } ${thread.unread ? "bg-blue-50/50" : ""}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {thread.unread && (
                  <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0"></div>
                )}
                <h3 className={`font-medium ${thread.unread ? "text-gray-900" : "text-gray-700"}`}>
                  {thread.sender}
                </h3>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{thread.time}</span>
            </div>

            <p className={`text-sm mb-2 line-clamp-1 ${thread.unread ? "text-gray-700" : "text-gray-600"}`}>
              {thread.subject}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-cyan-600">
                {thread.caseId} • {thread.clientName}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
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
