import React, { useState, useEffect } from "react";
import { Headphones, Search, Send, X, MessageCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_STYLES = {
  open: { bg: "bg-blue-50", text: "text-blue-700", label: "Aberto" },
  in_progress: { bg: "bg-amber-50", text: "text-amber-700", label: "Em atendimento" },
  resolved: { bg: "bg-green-50", text: "text-green-700", label: "Resolvido" },
  closed: { bg: "bg-gray-100", text: "text-gray-500", label: "Fechado" },
};

const PRIORITY_STYLES = {
  low: { bg: "bg-gray-100", text: "text-gray-600", label: "Baixa" },
  medium: { bg: "bg-blue-50", text: "text-blue-600", label: "Média" },
  high: { bg: "bg-amber-50", text: "text-amber-600", label: "Alta" },
  urgent: { bg: "bg-red-50", text: "text-red-600", label: "Urgente" },
};

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await base44.entities.SupportTicket.list("-created_date", 500);
      setTickets(data);
    } catch (e) {}
    setLoading(false);
  };

  const handleReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    setSending(true);
    try {
      await base44.entities.SupportTicket.update(selectedTicket.id, {
        reply,
        status: "in_progress",
      });
      setReply("");
      setSelectedTicket(null);
      fetchTickets();
    } catch (e) {}
    setSending(false);
  };

  const handleStatusChange = async (ticket, status) => {
    try {
      await base44.entities.SupportTicket.update(ticket.id, { status });
      fetchTickets();
      if (selectedTicket?.id === ticket.id) setSelectedTicket({ ...ticket, status });
    } catch (e) {}
  };

  const filtered = tickets.filter(t => {
    const matchesQuery = !query ||
      t.user_name?.toLowerCase().includes(query.toLowerCase()) ||
      t.user_email?.toLowerCase().includes(query.toLowerCase()) ||
      t.subject?.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Suporte</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie chamados de suporte dos clientes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Abertos</p>
            <p className="text-xl font-bold text-blue-600 mt-1">{tickets.filter(t => t.status === "open").length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Em atendimento</p>
            <p className="text-xl font-bold text-amber-600 mt-1">{tickets.filter(t => t.status === "in_progress").length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Resolvidos</p>
            <p className="text-xl font-bold text-green-600 mt-1">{tickets.filter(t => t.status === "resolved").length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{tickets.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por cliente, e-mail ou assunto..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
          >
            <option value="all">Todos os status</option>
            <option value="open">Aberto</option>
            <option value="in_progress">Em atendimento</option>
            <option value="resolved">Resolvido</option>
            <option value="closed">Fechado</option>
          </select>
        </div>

        {/* Tickets List */}
        <div className="space-y-2">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500">Nenhum chamado encontrado</p>
            </div>
          ) : (
            filtered.map(ticket => {
              const status = STATUS_STYLES[ticket.status] || STATUS_STYLES.open;
              const priority = PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.medium;
              return (
                <div key={ticket.id} className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.text}`}>
                          {priority.label}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{ticket.subject}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {ticket.user_name || "—"} · {ticket.user_email || "—"}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{ticket.message}</p>
                      {ticket.reply && (
                        <div className="mt-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                          <p className="text-[10px] font-semibold text-gray-400 mb-0.5">RESPOSTA</p>
                          <p className="text-xs text-gray-700">{ticket.reply}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-[10px] text-gray-400">
                        {ticket.created_date ? new Date(ticket.created_date).toLocaleDateString("pt-BR") : ""}
                      </span>
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Responder
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedTicket.subject}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{selectedTicket.user_name} · {selectedTicket.user_email}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-sm text-gray-700">{selectedTicket.message}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Resposta</label>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                rows={4}
                placeholder="Digite sua resposta..."
                className="w-full mt-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleStatusChange(selectedTicket, "resolved")}
                className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Marcar resolvido
              </button>
              <button
                onClick={handleReply}
                disabled={sending || !reply.trim()}
                className="flex-1 h-10 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {sending ? "Enviando..." : "Enviar resposta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}