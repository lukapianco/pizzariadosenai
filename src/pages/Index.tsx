import { useState, useEffect, useRef } from "react";
import { MessageCircle, LayoutDashboard, Pizza, ClipboardList } from "lucide-react";
import ChatView, { initialMessages, type Message } from "@/components/ChatView";
import DashboardView from "@/components/DashboardView";
import OrderTracker, { type OrderStatus } from "@/components/OrderTracker";
import OrdersView from "@/components/OrdersView";

const DASHBOARD_WEBHOOK_URL = "https://hook.us2.make.com/ufkmwkvjhln3463h968abmisf4hhhuma";

type View = "atendimento" | "gestao" | "pedidos";

export default function Index() {
  const [view, setView] = useState<View>("atendimento");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showTracker, setShowTracker] = useState(false);
  const [trackerStatus, setTrackerStatus] = useState<OrderStatus>("Confirmado");
  const [trackerKey, setTrackerKey] = useState(0);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Polling for order status updates every 20s
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!trackedOrderId || trackerStatus === "Entregue") return;

    const poll = async () => {
      try {
        const res = await fetch(DASHBOARD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ acao: "listar" }),
        });
        const orders = await res.json();
        if (Array.isArray(orders)) {
          const matched = orders.find((o: any) => o.id === trackedOrderId);
          if (matched?.status) {
            const newStatus = matched.status as OrderStatus;
            if (newStatus !== trackerStatus) {
              setTrackerStatus(newStatus);
              setTrackerKey((k) => k + 1);
              if (newStatus === "Entregue" && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    intervalRef.current = setInterval(poll, 20000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trackedOrderId, trackerStatus]);

  const handleStatusUpdate = (status: string, orderId?: string) => {
    setTrackerStatus(status as OrderStatus);
    setShowTracker(true);
    setTrackerKey((k) => k + 1);
    if (orderId) {
      setTrackedOrderId(orderId);
    }
  };

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
            onStatusUpdate={handleStatusUpdate}
            trackerSlot={showTracker ? <OrderTracker key={trackerKey} status={trackerStatus} onDismiss={() => setShowTracker(false)} /> : undefined}
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
