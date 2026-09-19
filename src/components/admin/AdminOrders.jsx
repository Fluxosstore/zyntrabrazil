import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Filter } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_STYLES = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", label: "Pendente" },
  paid: { bg: "bg-green-50", text: "text-green-700", label: "Pago" },
  cancelled: { bg: "bg-red-50", text: "text-red-600", label: "Cancelado" },
  refunded: { bg: "bg-blue-50", text: "text-blue-600", label: "Reembolsado" },
};

const PLAN_LABELS = {
  starter: "Starter",
  premium: "Pessoal Premium",
  team: "Empresarial Team",
  startup: "Empresarial Startup",
  enterprise: "Empresarial Enterprise",
};

const formatBRL = (n) => (n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await base44.entities.Order.list("-created_date", 500);
      setOrders(data);
    } catch (e) {}
    setLoading(false);
  };

  const filtered = orders.filter((o) => {
    const matchesQuery = !query ||
      o.user_name?.toLowerCase().includes(query.toLowerCase()) ||
      o.user_email?.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const totalRevenue = filtered.filter(o => o.status === "paid").reduce((s, o) => s + (o.amount || 0), 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie todos os pedidos da plataforma</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total de pedidos</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{filtered.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Receita filtrada</p>
            <p className="text-xl font-bold text-green-600 mt-1">{formatBRL(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Pagos</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{filtered.filter(o => o.status === "paid").length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por cliente ou e-mail..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="cancelled">Cancelado</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">CLIENTE</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">PLANO</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">CICLO</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">VALOR</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">STATUS</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">DATA</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => {
                    const status = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                    return (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{order.user_name || "—"}</p>
                          <p className="text-xs text-gray-500">{order.user_email || "—"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{PLAN_LABELS[order.plan] || order.plan}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700 capitalize">{order.cycle || "—"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-900">{formatBRL(order.amount)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-500">
                            {order.created_date ? new Date(order.created_date).toLocaleDateString("pt-BR") : "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}