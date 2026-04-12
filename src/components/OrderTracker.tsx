import { CookingPot, Bike, Check, ClipboardCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type OrderStatus = "Confirmado" | "Preparando" | "A caminho" | "Entregue";

interface OrderTrackerProps {
  status: OrderStatus;
  onDismiss?: () => void;
}

const statusConfig: Record<OrderStatus, { icon: typeof CookingPot; label: string; progress: number }> = {
  Confirmado: { icon: ClipboardCheck, label: "Pedido confirmado", progress: 15 },
  Preparando: { icon: CookingPot, label: "Pedido sendo preparado", progress: 40 },
  "A caminho": { icon: Bike, label: "Saiu para entrega", progress: 75 },
  Entregue: { icon: Check, label: "Pedido entregue!", progress: 100 },
};

export default function OrderTracker({ status, onDismiss }: OrderTrackerProps) {
  const { icon: Icon, label, progress } = statusConfig[status] ?? statusConfig["Confirmado"];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-3 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-[hsl(222,47%,11%)] text-white p-5 shadow-lg shadow-primary/20 border border-white/10">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 transition-all duration-700">
            <Icon className="w-6 h-6 text-primary transition-all duration-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/60 font-medium">Acompanhe seu pedido</p>
            <p className="text-base font-bold tracking-tight transition-all duration-500">{label}</p>
          </div>
          {onDismiss && (
            <button onClick={onDismiss} className="text-white/40 hover:text-white/80 text-xs font-medium transition-colors">
              Fechar
            </button>
          )}
        </div>

        <Progress
          value={progress}
          className="h-2.5 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-orange-400 [&>div]:transition-all [&>div]:duration-1000 [&>div]:ease-out [&>div]:shadow-[0_0_12px_hsl(var(--primary)/0.6)]"
        />

        <div className="flex justify-between mt-2 text-[11px] text-white/40 font-medium">
          <span className={status === "Confirmado" ? "text-white/90" : ""}>Confirmado</span>
          <span className={status === "Preparando" ? "text-white/90" : ""}>Preparando</span>
          <span className={status === "A caminho" ? "text-white/90" : ""}>A caminho</span>
          <span className={status === "Entregue" ? "text-white/90" : ""}>Entregue</span>
        </div>
      </div>
    </div>
  );
}
