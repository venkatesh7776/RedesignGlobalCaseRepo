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
      <div className="bg-white border border-gray-200 rounded-xl h-[calc(100vh-280px)] flex items-center justify-center">
        <p className="text-gray-400">Select a conversation to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl h-[calc(100vh-280px)] flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-gray-900 font-medium text-lg mb-1">{thread.sender}</h2>
            <p className="text-sm text-cyan-600">
              {thread.caseId} • {thread.clientName}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
            {thread.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-gray-200 bg-white text-gray-900 hover:bg-gray-50 gap-2">
            <Reply className="w-4 h-4" />
            Reply
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2">
            <Forward className="w-4 h-4" />
            Forward
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2">
            <ExternalLink className="w-4 h-4" />
            Open Case
          </Button>
          <Button variant="outline" size="sm" className="border-cyan-200 bg-cyan-50 text-cyan-600 hover:bg-cyan-100 gap-2 ml-auto">
            <Sparkles className="w-4 h-4" />
            AI Summary
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-600">AI Detected</span>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Counteroffer:</span>
              <span className="text-gray-900 font-medium">$42,000</span>
            </div>
            <div className="flex justify-between">
              <span>Previous Offer:</span>
              <span>$30,000</span>
            </div>
            <div className="flex justify-between">
              <span>Increase:</span>
              <span className="text-green-600">+$12,000</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-cyan-200">
            <p className="text-xs text-cyan-600">
              <strong>Suggested Action:</strong> Respond with updated medical justification.
            </p>
          </div>
        </div>

        {thread.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isYou ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[70%] ${message.isYou ? "bg-cyan-50 border-cyan-200" : "bg-gray-50 border-gray-200"} border rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-medium ${message.isYou ? "text-cyan-600" : "text-gray-900"}`}>
                  {message.sender}
                </span>
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
              <p className="text-sm text-gray-700">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 border-t border-gray-200 bg-gray-50">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              placeholder="Type your reply..."
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 resize-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="border-gray-200 bg-white text-gray-900 hover:bg-gray-50 gap-2 whitespace-nowrap">
              <Paperclip className="w-4 h-4" />
              Attach File
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200 bg-white text-gray-900 hover:bg-gray-50 whitespace-nowrap">
              Use Template
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0 gap-2">
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
