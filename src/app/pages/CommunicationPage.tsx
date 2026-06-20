import { useState } from "react";
import { CommunicationControlBar } from "../components/CommunicationControlBar";
import { ThreadList } from "../components/ThreadList";
import { ConversationPanel } from "../components/ConversationPanel";

const threads = [
  {
    id: "1",
    sender: "Metro Transit Claims",
    subject: "Re: Demand Letter Counteroffer $42,000",
    caseId: "PI-2024-023",
    clientName: "Sarah Jenkins",
    time: "1h ago",
    status: "Needs Response",
    statusColor: "orange",
    unread: true,
  },
  {
    id: "2",
    sender: "Sarah Jenkins",
    subject: "Need update on treatment bills",
    caseId: "PI-2024-023",
    clientName: "Sarah Jenkins",
    time: "Today",
    status: "Client Message",
    statusColor: "cyan",
    unread: true,
  },
  {
    id: "3",
    sender: "Northside Insurance",
    subject: "Demand accepted pending release",
    caseId: "PI-2023-992",
    clientName: "Robert Vance",
    time: "Yesterday",
    status: "Completed",
    statusColor: "green",
    unread: false,
  },
  {
    id: "4",
    sender: "Retail Giant Legal Dept",
    subject: "Discovery Request Response",
    caseId: "PI-2024-008",
    clientName: "Marcus Thorne",
    time: "2d ago",
    status: "Negotiation",
    statusColor: "purple",
    unread: false,
  },
  {
    id: "5",
    sender: "Elena Rodriguez",
    subject: "Question about settlement timeline",
    caseId: "PI-2024-012",
    clientName: "Elena Rodriguez",
    time: "3d ago",
    status: "Client Message",
    statusColor: "cyan",
    unread: false,
  },
];

const conversationDetails = {
  "1": {
    sender: "Metro Transit Claims",
    caseId: "PI-2024-023",
    clientName: "Sarah Jenkins",
    status: "Negotiation Active",
    messages: [
      {
        sender: "You",
        isYou: true,
        content: "Demand package attached. We are seeking $85,000 based on spinal injury treatment and ongoing care needs.",
        time: "3 days ago",
      },
      {
        sender: "Metro Transit Claims",
        isYou: false,
        content: "We reviewed your demand. Counteroffer $42,000 based on our assessment of medical necessity.",
        time: "2 days ago",
      },
      {
        sender: "You",
        isYou: true,
        content: "Need revised offer considering spinal treatment costs and expert testimony we will present.",
        time: "1 day ago",
      },
    ],
  },
  "2": {
    sender: "Sarah Jenkins",
    caseId: "PI-2024-023",
    clientName: "Sarah Jenkins",
    status: "Client Message",
    messages: [
      {
        sender: "Sarah Jenkins",
        isYou: false,
        content: "Hi, I wanted to check on the status of my treatment bills. The hospital is asking about payment.",
        time: "Today at 9:30 AM",
      },
    ],
  },
  "3": {
    sender: "Northside Insurance",
    caseId: "PI-2023-992",
    clientName: "Robert Vance",
    status: "Completed",
    messages: [
      {
        sender: "You",
        isYou: true,
        content: "Final demand letter with complete medical documentation attached. Seeking $125,000.",
        time: "1 week ago",
      },
      {
        sender: "Northside Insurance",
        isYou: false,
        content: "Demand accepted pending signed release. Will process payment within 14 business days.",
        time: "Yesterday",
      },
    ],
  },
};

export function CommunicationPage() {
  const [selectedThread, setSelectedThread] = useState<string | null>("1");

  return (
    <div className="max-w-[1800px] mx-auto p-8 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-cyan-600 mb-2">
          COMMUNICATION CENTER
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Communication</h1>
        <p className="text-gray-600">
          All case-related messages, negotiations, client requests, and responses across every matter.
        </p>
      </div>

      <CommunicationControlBar />

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2">
          <ThreadList
            threads={threads}
            selectedId={selectedThread}
            onSelect={setSelectedThread}
          />
        </div>
        <div className="col-span-3">
          <ConversationPanel
            thread={
              selectedThread
                ? conversationDetails[selectedThread as keyof typeof conversationDetails]
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}
