import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from "recharts";
import { base44 } from "@/api/base44Client";

const REVENUE_DATA = [
  { month: "Jan", mrr: 4200, arr: 50400 },
  { month: "Fev", mrr: 5100, arr: 61200 },
  { month: "Mar", mrr: 4800, arr: 57600 },
  { month: "Abr", mrr: 6200, arr: 74400 },
  { month: "Mai", mrr: 7800, arr: 93600 },
  { month: "Jun", mrr: 8400, arr: 100800 },
  { month: "Jul", mrr: 9100, arr: 109200 },
  { month: "Ago", mrr: 11200, arr: 134400 },
  { month: "Set", mrr: 12400, arr: 148800 },
];

const REVENUE_BY_PLAN = [
  { plan: "Starter", receita: 16200 },
  { plan: "Premium", receita: 14200 },
  { plan: "Team", receita: 16800 },
  { plan: "Startup", receita: 10800 },
  { plan: "Enterprise", receita: 8000 },
];

const formatBRL = (n) => (n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminRevenue() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Order.list("-created_date", 500);
        setOrders(data);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const paidOrders = orders.filter(o => o.status === "paid");
  const totalRevenue = paidOrders.reduce((s, o) => s + (o.amount || 0), 0);
  const monthlyAvg = totalRevenue / 9;
  const mrr = REVENUE_DATA[REVENUE_DATA.length - 1].mrr;
  const arr = REVENUE_DATA[REVENUE_DATA.length - 1].arr;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Receita</h1>
          <p className="text-sm text-gray-500 mt-0.5">Análise de faturamento e métricas financeiras</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatBRL(mrr)}</p>
            <p className="text-xs text-gray-500 mt-0.5">MRR (Receita mensal)</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatBRL(arr)}</p>
            <p className="text-xs text-gray-500 mt-0.5">ARR (Receita anual)</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatBRL(totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Receita total (pedidos pagos)</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatBRL(monthlyAvg)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Ticket médio mensal</p>
          </div>
        </div>

        {/* MRR / ARR Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Evolução MRR x ARR</h2>
          <p className="text-xs text-gray-500 mb-4">Receita mensal recorrente vs receita anual recorrente</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorARR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", fontSize: 12 }} formatter={(v) => formatBRL(v)} />
              <Area type="monotone" dataKey="mrr" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorMRR)" name="MRR" />
              <Area type="monotone" dataKey="arr" stroke="#10B981" strokeWidth={2} fill="url(#colorARR)" name="ARR" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Plan */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-1">Receita por plano</h2>
            <p className="text-xs text-gray-500 mb-4">Faturamento total por tipo de plano</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={REVENUE_BY_PLAN} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                <YAxis type="category" dataKey="plan" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", fontSize: 12 }} formatter={(v) => formatBRL(v)} />
                <Bar dataKey="receita" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-1">Crescimento mensal</h2>
            <p className="text-xs text-gray-500 mb-4">Taxa de crescimento da receita</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", fontSize: 12 }} />
                <Line type="monotone" dataKey="mrr" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: "#8B5CF6", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}