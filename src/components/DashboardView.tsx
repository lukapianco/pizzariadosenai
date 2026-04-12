import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Receipt,
} from "lucide-react";

const kpis = [
  { label: "Lucro Bruto", value: "R$ 18.450", icon: DollarSign, change: "+12%" },
  { label: "Lucro Líquido", value: "R$ 9.230", icon: TrendingUp, change: "+8%" },
  { label: "Total de Pedidos", value: "347", icon: ShoppingCart, change: "+23%" },
  { label: "Ticket Médio", value: "R$ 53,17", icon: Receipt, change: "+3%" },
];

const pizzaData = [
  { name: "Calabresa", vendas: 89 },
  { name: "Margherita", vendas: 72 },
  { name: "Pepperoni", vendas: 65 },
  { name: "4 Queijos", vendas: 54 },
  { name: "Portuguesa", vendas: 47 },
];

const revenueData = [
  { dia: "Seg", receita: 2400, gastos: 1800 },
  { dia: "Ter", receita: 2100, gastos: 1650 },
  { dia: "Qua", receita: 2800, gastos: 1900 },
  { dia: "Qui", receita: 3200, gastos: 2100 },
  { dia: "Sex", receita: 3800, gastos: 2300 },
  { dia: "Sáb", receita: 4500, gastos: 2800 },
  { dia: "Dom", receita: 4100, gastos: 2600 },
];

const orders = [
  { id: 1, customer: "João Silva", value: "R$ 79,80", status: "Entregue" },
  { id: 2, customer: "Maria Santos", value: "R$ 42,90", status: "Preparando" },
  { id: 3, customer: "Carlos Lima", value: "R$ 95,70", status: "Entregue" },
  { id: 4, customer: "Ana Costa", value: "R$ 35,90", status: "Preparando" },
  { id: 5, customer: "Pedro Alves", value: "R$ 62,80", status: "Entregue" },
];

export default function DashboardView() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-start gap-4"
          >
            <div className="rounded-lg bg-primary/10 p-2.5">
              <kpi.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{kpi.value}</p>
              <p className="text-xs text-accent font-semibold mt-1">{kpi.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Pizzas mais vendidas</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pizzaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Receita vs Gastos</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: 12,
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="receita" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="gastos" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Pedidos recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Cliente</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Valor</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-foreground">{order.customer}</td>
                  <td className="px-5 py-3 text-foreground font-medium">{order.value}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Entregue"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
