import { Reply, Forward, ExternalLink, Sparkles, Paperclip, Send } from "lucide-react";
import { Button } from "./ui/button";

interface Message {
  sender: string;
  isYou: boolean;
  content: string;
  time: string;
}

interface ConversationPanelProps {
  thread: {
    sender: string;
    caseId: string;
    clientName: string;
    status: string;
    messages: Message[];
  } | null;
}

export function ConversationPanel({ thread }: ConversationPanelProps) {
  if (!thread) {
    return (
      <div className="lg-card h-[calc(100vh-280px)] flex items-center justify-center shadow-sm">
        <p className="secondary-text">Select a conversation to view details</p>
      </div>
    );
  }

  return (
    <div className="lg-card h-[calc(100vh-280px)] flex flex-col p-0 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-line">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="card-title text-lg mb-1">{thread.sender}</h2>
            <p className="mono-ref text-deep">
              {thread.caseId} • {thread.clientName}
            </p>
          </div>
          <span className="pill pill-progress">
            {thread.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="btn btn-secondary gap-2">
            <Reply className="w-4 h-4" strokeWidth={1.75} />
            Reply
          </Button>
          <Button variant="outline" size="sm" className="btn btn-ghost gap-2">
            <Forward className="w-4 h-4" strokeWidth={1.75} />
            Forward
          </Button>
          <Button variant="outline" size="sm" className="btn btn-ghost gap-2">
            <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
            Open Case
          </Button>
          <Button variant="outline" size="sm" className="btn btn-secondary gap-2 ml-auto">
            <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            AI Summary
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="bg-tint border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-deep" strokeWidth={1.75} />
            <span className="text-sm font-semibold text-deep">AI Detected</span>
          </div>
          <div className="space-y-2 text-sm text-[#0F1E2B]">
            <div className="flex justify-between">
              <span>Counteroffer:</span>
              <span className="text-ink font-semibold">$42,000</span>
            </div>
            <div className="flex justify-between">
              <span>Previous Offer:</span>
              <span>$30,000</span>
            </div>
            <div className="flex justify-between">
              <span>Increase:</span>
              <span className="text-deep font-semibold">+$12,000</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-line">
            <p className="text-xs text-deep">
              <strong>Suggested Action:</strong> Respond with updated medical justification.
            </p>
          </div>
        </div>

        {thread.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isYou ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[70%] ${message.isYou ? "bg-ink border-ink" : "bg-white border-line"} border rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-semibold ${message.isYou ? "text-white" : "text-ink"}`}>
                  {message.sender}
                </span>
                <span className={`text-xs ${message.isYou ? "text-white/70" : "text-[#5B6B78]"}`}>{message.time}</span>
              </div>
              <p className={`text-sm ${message.isYou ? "text-white/90" : "text-[#0F1E2B]"}`}>{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-line bg-wash">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              placeholder="Type your reply..."
              rows={3}
              className="w-full bg-white border border-line rounded-lg px-4 py-3 text-sm text-ink placeholder:text-[#5B6B78] focus:outline-none focus:border-brand resize-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="btn btn-secondary gap-2 whitespace-nowrap">
              <Paperclip className="w-4 h-4" strokeWidth={1.75} />
              Attach File
            </Button>
            <Button variant="outline" size="sm" className="btn btn-secondary whitespace-nowrap">
              Use Template
            </Button>
            <Button className="btn btn-primary gap-2">
              <Send className="w-4 h-4" strokeWidth={1.75} />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
