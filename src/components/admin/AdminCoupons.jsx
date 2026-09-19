import React, { useState, useEffect } from "react";
import { Plus, Search, Ticket, Trash2, Power, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

const formatBRL = (n) => (n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount_type: "percent",
    discount_value: 10,
    max_uses: 100,
    expires_at: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await base44.entities.Coupon.list("-created_date", 500);
      setCoupons(data);
    } catch (e) {}
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.code.trim()) return;
    setSaving(true);
    try {
      await base44.entities.Coupon.create({
        code: form.code.toUpperCase().trim(),
        description: form.description,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        max_uses: Number(form.max_uses),
        uses: 0,
        active: true,
        expires_at: form.expires_at || undefined,
      });
      setShowModal(false);
      setForm({ code: "", description: "", discount_type: "percent", discount_value: 10, max_uses: 100, expires_at: "" });
      fetchCoupons();
    } catch (e) {
      alert("Erro ao criar cupom: " + (e.message || ""));
    }
    setSaving(false);
  };

  const toggleActive = async (coupon) => {
    try {
      await base44.entities.Coupon.update(coupon.id, { active: !coupon.active });
      fetchCoupons();
    } catch (e) {}
  };

  const handleDelete = async (coupon) => {
    if (!confirm(`Excluir o cupom "${coupon.code}"?`)) return;
    try {
      await base44.entities.Coupon.delete(coupon.id);
      fetchCoupons();
    } catch (e) {}
  };

  const filtered = coupons.filter(c => !query || c.code?.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Cupons</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gerencie cupons de desconto</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo cupom
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total de cupons</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{coupons.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Cupons ativos</p>
            <p className="text-xl font-bold text-green-600 mt-1">{coupons.filter(c => c.active).length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total de usos</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{coupons.reduce((s, c) => s + (c.uses || 0), 0)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cupom por código..."
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
                <Ticket className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500">Nenhum cupom encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">CÓDIGO</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">DESCRIÇÃO</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">DESCONTO</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">USOS</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">EXPIRA</th>
                    <th className="text-left text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">STATUS</th>
                    <th className="text-right text-[10px] font-semibold tracking-wider text-gray-500 px-4 py-3">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-semibold text-gray-900">{c.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{c.description || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">
                          {c.discount_type === "percent" ? `${c.discount_value}%` : formatBRL(c.discount_value)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{c.uses || 0} / {c.max_uses || "∞"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">{c.expires_at ? new Date(c.expires_at).toLocaleDateString("pt-BR") : "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {c.active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleActive(c)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                            title={c.active ? "Desativar" : "Ativar"}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Novo cupom</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Código</label>
                <input
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  placeholder="VERAO2026"
                  className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-mono uppercase focus:outline-none focus:border-gray-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Descrição</label>
                <input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Desconto de verão"
                  className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">Tipo</label>
                  <select
                    value={form.discount_type}
                    onChange={e => setForm({ ...form, discount_type: e.target.value })}
                    className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
                  >
                    <option value="percent">Percentual (%)</option>
                    <option value="fixed">Valor fixo (R$)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">Valor</label>
                  <input
                    type="number"
                    value={form.discount_value}
                    onChange={e => setForm({ ...form, discount_value: e.target.value })}
                    className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">Máx. usos</label>
                  <input
                    type="number"
                    value={form.max_uses}
                    onChange={e => setForm({ ...form, max_uses: e.target.value })}
                    className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">Expira em</label>
                  <input
                    type="date"
                    value={form.expires_at}
                    onChange={e => setForm({ ...form, expires_at: e.target.value })}
                    className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !form.code.trim()}
                className="flex-1 h-10 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Criando..." : "Criar cupom"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}