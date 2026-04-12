import { useState } from "react";
import { MessageCircle, LayoutDashboard, Pizza } from "lucide-react";
import ChatView, { initialMessages, type Message } from "@/components/ChatView";
import DashboardView from "@/components/DashboardView";
import OrderTracker from "@/components/OrderTracker";

type View = "atendimento" | "gestao";

export default function Index() {
  const [view, setView] = useState<View>("atendimento");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showTracker, setShowTracker] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Pizza className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground tracking-tight">
              PizzaHub
            </span>
          </div>

          <div className="flex bg-muted rounded-xl p-1 gap-1">
            <button
              onClick={() => setView("atendimento")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === "atendimento"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Atendimento
            </button>
            <button
              onClick={() => setView("gestao")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === "gestao"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Gestão
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-4">
        <div style={{ display: view === "atendimento" ? "block" : "none" }}>
          {showTracker && <OrderTracker onDismiss={() => setShowTracker(false)} />}
          <ChatView
            messages={messages}
            setMessages={setMessages}
            input={input}
            setInput={setInput}
            onOrderComplete={() => setShowTracker(true)}
          />
        </div>
        <div style={{ display: view === "gestao" ? "block" : "none" }}>
          <DashboardView />
        </div>
      </main>
    </div>
  );
}
