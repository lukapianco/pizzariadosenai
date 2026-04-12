import { useEffect, useState } from "react";
import { CookingPot, Bike } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OrderTrackerProps {
  onDismiss?: () => void;
}

type Stage = "preparing" | "delivering";

const stages: Record<Stage, { icon: typeof CookingPot; label: string; progress: number }> = {
  preparing: { icon: CookingPot, label: "Pedido sendo preparado", progress: 30 },
  delivering: { icon: Bike, label: "Saiu para entrega", progress: 80 },
};

export default function OrderTracker({ onDismiss }: OrderTrackerProps) {
  const [stage, setStage] = useState<Stage>("preparing");

  useEffect(() => {
    const timer = setTimeout(() => setStage("delivering"), 10000);
    return () => clearTimeout(timer);
  }, []);

  const { icon: Icon, label, progress } = stages[stage];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-3 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-[hsl(222,47%,11%)] text-white p-5 shadow-lg shadow-primary/20 border border-white/10">
        {/* Glow effect */}
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
            <button
              onClick={onDismiss}
              className="text-white/40 hover:text-white/80 text-xs font-medium transition-colors"
            >
              Fechar
            </button>
          )}
        </div>

        <Progress
          value={progress}
          className="h-2.5 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-orange-400 [&>div]:transition-all [&>div]:duration-1000 [&>div]:ease-out [&>div]:shadow-[0_0_12px_hsl(var(--primary)/0.6)]"
        />

        <div className="flex justify-between mt-2 text-[11px] text-white/40 font-medium">
          <span>Confirmado</span>
          <span>Preparando</span>
          <span>A caminho</span>
          <span>Entregue</span>
        </div>
      </div>
    </div>
  );
}
