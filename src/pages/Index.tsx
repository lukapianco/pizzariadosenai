import { useState } from "react";
import { MessageCircle, LayoutDashboard, Pizza, ClipboardList } from "lucide-react";
import ChatView, { initialMessages, type Message } from "@/components/ChatView";
import DashboardView from "@/components/DashboardView";
import OrderTracker from "@/components/OrderTracker";
import OrdersView from "@/components/OrdersView";

type View = "atendimento" | "gestao" | "pedidos";

export default function Index() {
  const [view, setView] = useState<View>("atendimento");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showTracker, setShowTracker] = useState(false);
  const [trackerKey, setTrackerKey] = useState(0);

  const tabs: { key: View; label: string; icon: React.ElementType }[] = [
    { key: "atendimento", label: "Atendimento", icon: MessageCircle },
    { key: "gestao", label: "Gestão", icon: LayoutDashboard },
    { key: "pedidos", label: "Pedidos", icon: ClipboardList },
  ];

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
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setView(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    view === tab.key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-4">
        <div style={{ display: view === "atendimento" ? "block" : "none" }}>
          <ChatView
            messages={messages}
            setMessages={setMessages}
            input={input}
            setInput={setInput}
            onOrderComplete={() => { setShowTracker(true); setTrackerKey(k => k + 1); }}
            trackerSlot={showTracker ? <OrderTracker key={trackerKey} onDismiss={() => setShowTracker(false)} /> : undefined}
          />
        </div>
        <div style={{ display: view === "gestao" ? "block" : "none" }}>
          <DashboardView />
        </div>
        <div style={{ display: view === "pedidos" ? "block" : "none" }}>
          <OrdersView />
        </div>
      </main>
    </div>
  );
}
