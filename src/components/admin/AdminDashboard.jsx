import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Ticket } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { base44 } from "@/api/base44Client";

const MONTHLY_REVENUE = [
  { month: "Jan", receita: 4200, pedidos: 32 },
  { month: "Fev", receita: 5100, pedidos: 41 },
  { month: "Mar", receita: 4800, pedidos: 38 },
  { month: "Abr", receita: 6200, pedidos: 52 },
  { month: "Mai", receita: 7800, pedidos: 61 },
  { month: "Jun", receita: 8400, pedidos: 68 },
  { month: "Jul", receita: 9100, pedidos: 74 },
  { month: "Ago", receita: 11200, pedidos: 89 },
  { month: "Set", receita: 12400, pedidos: 96 },
];

const PLAN_DISTRIBUTION = [
  { name: "Free", value: 420, color: "#9CA3AF" },
  { name: "Starter", value: 180, color: "#8B5CF6" },
  { name: "Premium", value: 95, color: "#EC4899" },
  { name: "Team", value: 42, color: "#3B82F6" },
  { name: "Startup", value: 18, color: "#10B981" },
  { name: "Enterprise", value: 8, color: "#F59E0B" },
];

function StatCard({ icon: Icon, label, value, trend, trendUp }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? "text-green-600" : "text-red-500"}`}>
            {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, coupons: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [orders, users, coupons] = await Promise.all([
          base44.entities.Order.list("-created_date", 500).catch(() => []),
          base44.entities.User.list().catch(() => []),
          base44.entities.Coupon.list().catch(() => []),
        ]);
        const revenue = orders.reduce((s, o) => s + (o.status === "paid" ? o.amount || 0 : 0), 0);
        setStats({ revenue, orders: orders.length, users: users.length, coupons: coupons.length });
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const formatBRL = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Visão geral do desempenho da plataforma</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="Receita total" value={formatBRL(stats.revenue)} trend="+18%" trendUp />
          <StatCard icon={ShoppingCart} label="Pedidos" value={stats.orders} trend="+12%" trendUp />
          <StatCard icon={Users} label="Usuários" value={stats.users} trend="+8%" trendUp />
          <StatCard icon={Ticket} label="Cupons ativos" value={stats.coupons} trend="-3%" trendUp={false} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Faturamento mensal</h2>
                <p className="text-xs text-gray-500">Receita e pedidos por mês</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={MONTHLY_REVENUE}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", fontSize: 12 }}
                  formatter={(value, name) => name === "receita" ? [formatBRL(value), "Receita"] : [value, "Pedidos"]}
                />
                <Area type="monotone" dataKey="receita" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorReceita)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Plan Distribution */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-1">Distribuição de planos</h2>
            <p className="text-xs text-gray-500 mb-4">Usuários por plano</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={PLAN_DISTRIBUTION} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {PLAN_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Pedidos por mês</h2>
          <p className="text-xs text-gray-500 mb-4">Volume de pedidos mensais</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", fontSize: 12 }} />
              <Bar dataKey="pedidos" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}