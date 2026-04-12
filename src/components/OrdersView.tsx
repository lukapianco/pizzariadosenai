import { useState, useEffect, useCallback } from "react";
import { Package, Bike, CheckCircle2, AlertTriangle, RefreshCw, MapPin, Clock, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const DASHBOARD_WEBHOOK_URL = "https://hook.us2.make.com/COLE_AQUI_A_URL_DO_NOVO_WEBHOOK_DASHBOARD";

type OrderStatus = "Confirmado" | "Preparando" | "A caminho" | "Entregue";

interface Order {
  id: string;
  sabor: string;
  obs: string;
  endereco: string;
  status: OrderStatus;
  data: string;
}

const STATUS_CONFIG: Record<OrderStatus, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  Confirmado: {
    icon: Clock,
    color: "text-muted-foreground",
    bg: "bg-muted/50",
    border: "border-border",
  },
  Preparando: {
    icon: ChefHat,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  "A caminho": {
    icon: Bike,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  Entregue: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

const STATUSES: OrderStatus[] = ["Confirmado", "Preparando", "A caminho", "Entregue"];

export default function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(DASHBOARD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acao: "listar" }),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data.map((o: any) => ({
          id: o.id ?? "",
          sabor: o.sabor ?? "",
          obs: o.obs ?? o.observacoes ?? "",
          endereco: o.endereco ?? "",
          status: STATUSES.includes(o.status) ? o.status : "Confirmado",
          data: o.data ?? "",
        })));
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Falha ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    if (order.status === newStatus) return;
    setUpdatingId(order.id);
    const prev = orders;
    setOrders((o) => o.map((x) => (x.id === order.id ? { ...x, status: newStatus } : x)));

    try {
      await fetch(DASHBOARD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acao: "atualizar", id: order.id, novo_status: newStatus }),
      });
      toast.success(`Pedido #${order.id} → ${newStatus}`);
    } catch {
      setOrders(prev);
      toast.error("Falha ao atualizar status");
    } finally {
      setUpdatingId(null);
    }
  };

  const grouped: Record<OrderStatus, Order[]> = {
    Confirmado: orders.filter((o) => o.status === "Confirmado"),
    Preparando: orders.filter((o) => o.status === "Preparando"),
    "A caminho": orders.filter((o) => o.status === "A caminho"),
    Entregue: orders.filter((o) => o.status === "Entregue"),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">Fila de Produção</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{orders.length} pedidos ativos</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUSES.map((status) => {
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;
          const columnOrders = grouped[status];

          return (
            <div key={status} className="space-y-3">
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${config.bg} border ${config.border}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
                <span className={`font-semibold text-sm ${config.color}`}>{status}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {columnOrders.length}
                </Badge>
              </div>

              {columnOrders.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">Nenhum pedido</p>
              )}
              {columnOrders.map((order) => (
                <Card
                  key={order.id}
                  className={`border ${config.border} shadow-sm hover:shadow-md transition-shadow ${updatingId === order.id ? "opacity-60 pointer-events-none" : ""}`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">#{order.id}</p>
                        <p className="text-base font-bold text-foreground leading-tight">{order.sabor}</p>
                      </div>
                      <Badge className={`${config.bg} ${config.color} border ${config.border} text-[11px]`}>
                        {order.status}
                      </Badge>
                    </div>

                    {order.obs && (
                      <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 rounded-lg px-3 py-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-bold text-amber-800">{order.obs}</p>
                      </div>
                    )}

                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <p className="text-xs">{order.endereco}</p>
                    </div>

                    {order.data && (
                      <p className="text-[10px] text-muted-foreground">{order.data}</p>
                    )}

                    {status !== "Entregue" && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {STATUSES.filter((s) => s !== order.status).map((s) => {
                          const sc = STATUS_CONFIG[s];
                          const SIcon = sc.icon;
                          return (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(order, s)}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors hover:opacity-80 ${sc.bg} ${sc.color} ${sc.border}`}
                            >
                              <SIcon className="w-3 h-3" />
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
