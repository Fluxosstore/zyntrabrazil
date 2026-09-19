import React, { useState, useEffect } from "react";
import { Search, Users, Ban, CircleDollarSign, Plus, Minus, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PLAN_LABELS = {
  free: "Zyntra Free",
  starter: "Starter",
  premium: "Pessoal Premium",
  team: "Empresarial Team",
  startup: "Empresarial Startup",
  enterprise: "Empresarial Enterprise",
};

const PLAN_WEEKLY_TOKENS = {
  free: 30000,
  starter: 900000,
  premium: 500000,
  team: 10000000,
  startup: 15000000,
  enterprise: 25000000,
};

const formatTokens = (n) => Math.round(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [balanceDelta, setBalanceDelta] = useState("");
  const [planChange, setPlanChange] = useState(null);
  const [savingPlan, setSavingPlan] = useState(false);

  const [usageByUser, setUsageByUser] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchUsage();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await base44.entities.User.list();
      setUsers(data);
    } catch (e) {}
    setLoading(false);
  };

  const fetchUsage = async () => {
    try {
      const records = await base44.entities.TokenUsage.list("-created_date", 1000);
      const map = {};
      records.forEach(r => {
        const uid = r.created_by_id;
        if (!uid) return;
        map[uid] = (map[uid] || 0) + (r.tokens || 0);
      });
      setUsageByUser(map);
    } catch (e) {}
  };

  const handleBlock = async (user) => {
    try {
      await base44.entities.User.update(user.id, { blocked: !user.blocked });
      fetchUsers();
      if (selectedUser?.id === user.id) setSelectedUser({ ...user, blocked: !user.blocked });
    } catch (e) {
      alert("Erro ao bloquear usuário: " + (e.message || ""));
    }
  };

  const handleBalanceChange = async (action) => {
    if (!selectedUser) return;
    const delta = Number(balanceDelta);
    if (isNaN(delta) || delta <= 0) return;
    const newBalance = action === "add"
      ? (selectedUser.balance || 0) + delta
      : Math.max(0, (selectedUser.balance || 0) - delta);
    try {
      await base44.entities.User.update(selectedUser.id, { balance: newBalance });
      const updated = { ...selectedUser, balance: newBalance };
      setSelectedUser(updated);
      setBalanceDelta("");
      fetchUsers();
    } catch (e) {
      alert("Erro ao atualizar saldo: " + (e.message || ""));
    }
  };

  const openManage = (user) => {
    setSelectedUser(user);
    setPlanChange(null);
  };

  const handlePlanChange = async () => {
    if (!selectedUser || !planChange) return;
    setSavingPlan(true);
    try {
      await base44.entities.User.update(selectedUser.id, { plan: planChange });
      const updated = { ...selectedUser, plan: planChange };
      setSelectedUser(updated);
      setPlanChange(null);
      fetchUsers();
    } catch (e) {
      alert("Erro ao alterar plano: " + (e.message || ""));
    }
    setSavingPlan(false);
  };

  const handleZeroBalance = async (user) => {
    if (!confirm(`Zerar o saldo de ${user.full_name || user.email}?`)) return;
    try {
      await base44.entities.User.update(user.id, { balance: 0 });
      fetchUsers();
      if (selectedUser?.id === user.id) setSelectedUser({ ...user, balance: 0 });
    } catch (e) {}
  };

  const filtered = users.filter(u => {
    if (!query) return true;
    return u.full_name?.toLowerCase().includes(query.toLowerCase()) ||
           u.email?.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Usuários</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie usuários, planos, saldos e bloqueios</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{users.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Ativos</p>
            <p className="text-xl font-bold text-green-600 mt-1">{users.filter(u => !u.blocked).length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Bloqueados</p>
            <p className="text-xl font-bold text-red-500 mt-1">{users.filter(u => u.blocked).length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Admins</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{users.filter(u => u.role === "admin").length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
          />
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
                <Users className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">USUÁRIO</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">PLANO</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">SALDO</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">USADOS</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">STATUS</th>
                    <th className="text-right text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(u.full_name || u.email || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{u.full_name || "—"}</p>
                            <p className="text-xs text-gray-500 truncate">{u.email || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{PLAN_LABELS[u.plan] || u.plan || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900">{formatTokens(PLAN_WEEKLY_TOKENS[u.plan] || 0)}</span>
                        <span className="text-xs text-gray-500 ml-1">tokens/sem</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-violet-600">{formatTokens(usageByUser[u.id] || 0)}</span>
                        <span className="text-xs text-gray-500 ml-1">tokens</span>
                      </td>
                      <td className="px-4 py-3">
                        {u.blocked ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                            Bloqueado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            Ativo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openManage(u)}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Gerenciar
                          </button>
                          <button
                            onClick={() => handleBlock(u)}
                            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${u.blocked ? "text-green-600 hover:bg-green-50" : "text-red-500 hover:bg-red-50"}`}
                            title={u.blocked ? "Desbloquear" : "Bloquear"}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                  {(selectedUser.full_name || selectedUser.email || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">{selectedUser.full_name || "—"}</h2>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Balance & Usage */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500">Saldo do plano (semanal)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatTokens(PLAN_WEEKLY_TOKENS[selectedUser.plan] || 0)}</p>
                <p className="text-xs text-gray-500">tokens</p>
              </div>
              <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                <p className="text-xs text-gray-500">Tokens usados</p>
                <p className="text-2xl font-bold text-violet-600 mt-1">{formatTokens(usageByUser[selectedUser.id] || 0)}</p>
                <p className="text-xs text-gray-500">tokens</p>
              </div>
            </div>

            {/* Plan Selector */}
            <div>
              <label className="text-xs font-medium text-gray-700">Plano da conta</label>
              <div className="flex gap-2 mt-1.5">
                <select
                  value={planChange || selectedUser.plan || "free"}
                  onChange={e => setPlanChange(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
                >
                  {Object.entries(PLAN_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <button
                  onClick={handlePlanChange}
                  disabled={!planChange || planChange === selectedUser.plan || savingPlan}
                  className="px-4 h-10 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {savingPlan ? "Salvando..." : "Aplicar"}
                </button>
              </div>
              {planChange && planChange !== selectedUser.plan && (
                <p className="text-xs text-violet-600 mt-1.5">
                  Upgrade para <strong>{PLAN_LABELS[planChange]}</strong> — {formatTokens(PLAN_WEEKLY_TOKENS[planChange] || 0)} tokens/sem
                </p>
              )}
            </div>

            {/* Balance Controls */}
            <div>
              <label className="text-xs font-medium text-gray-700">Adicionar / remover saldo</label>
              <div className="flex gap-2 mt-1.5">
                <input
                  type="number"
                  value={balanceDelta}
                  onChange={e => setBalanceDelta(e.target.value)}
                  placeholder="Quantidade de tokens"
                  className="flex-1 h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
                />
                <button
                  onClick={() => handleBalanceChange("add")}
                  disabled={!balanceDelta}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                  title="Adicionar"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleBalanceChange("remove")}
                  disabled={!balanceDelta}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
                  title="Remover"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleZeroBalance(selectedUser)}
                className="h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <CircleDollarSign className="w-3.5 h-3.5" />
                Zerar saldo
              </button>
              <button
                onClick={() => handleBlock(selectedUser)}
                className={`h-10 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${selectedUser.blocked ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-500 text-white hover:bg-red-600"}`}
              >
                <Ban className="w-3.5 h-3.5" />
                {selectedUser.blocked ? "Desbloquear" : "Bloquear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}