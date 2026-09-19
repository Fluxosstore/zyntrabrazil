import React, { useState } from "react";
import { Settings as SettingsIcon, Save, Check, Globe, Bell, Shield, CreditCard } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    site_name: "Zyntra",
    site_url: "https://zyntra.com",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    maintenance_mode: false,
    signup_enabled: true,
    email_notifications: true,
    push_notifications: false,
    two_factor_required: false,
    payment_provider: "stripe",
    currency: "BRL",
    min_withdrawal: 50,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-green-500" : "bg-gray-300"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 lg:px-8 py-6 space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Configurações</h1>
            <p className="text-sm text-gray-500 mt-0.5">Configurações gerais da plataforma</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
          </button>
        </div>

        {/* General */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-bold text-gray-900">Geral</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Nome do site</label>
              <input
                value={settings.site_name}
                onChange={e => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">URL do site</label>
              <input
                value={settings.site_url}
                onChange={e => setSettings({ ...settings, site_url: e.target.value })}
                className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Idioma padrão</label>
              <select
                value={settings.language}
                onChange={e => setSettings({ ...settings, language: e.target.value })}
                className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Fuso horário</label>
              <select
                value={settings.timezone}
                onChange={e => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
              >
                <option value="America/Sao_Paulo">America/Sao_Paulo</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm font-medium text-gray-900">Modo de manutenção</p>
              <p className="text-xs text-gray-500">Bloqueia o acesso ao app para usuários comuns</p>
            </div>
            <Toggle checked={settings.maintenance_mode} onChange={v => setSettings({ ...settings, maintenance_mode: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Cadastro aberto</p>
              <p className="text-xs text-gray-500">Permite que novos usuários se registrem</p>
            </div>
            <Toggle checked={settings.signup_enabled} onChange={v => setSettings({ ...settings, signup_enabled: v })} />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-bold text-gray-900">Notificações</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Notificações por e-mail</p>
              <p className="text-xs text-gray-500">Receber alertas de novos pedidos e chamados</p>
            </div>
            <Toggle checked={settings.email_notifications} onChange={v => setSettings({ ...settings, email_notifications: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Notificações push</p>
              <p className="text-xs text-gray-500">Enviar notificações push para o celular</p>
            </div>
            <Toggle checked={settings.push_notifications} onChange={v => setSettings({ ...settings, push_notifications: v })} />
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-bold text-gray-900">Segurança</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Exigir 2FA para admins</p>
              <p className="text-xs text-gray-500">Obriga autenticação em duas etapas para administradores</p>
            </div>
            <Toggle checked={settings.two_factor_required} onChange={v => setSettings({ ...settings, two_factor_required: v })} />
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-bold text-gray-900">Pagamento</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Provedor</label>
              <select
                value={settings.payment_provider}
                onChange={e => setSettings({ ...settings, payment_provider: e.target.value })}
                className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
              >
                <option value="stripe">Stripe</option>
                <option value="pagseguro">PagSeguro</option>
                <option value="mercadopago">Mercado Pago</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Moeda</label>
              <select
                value={settings.currency}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
              >
                <option value="BRL">Real (R$)</option>
                <option value="USD">Dólar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Saque mínimo (R$)</label>
            <input
              type="number"
              value={settings.min_withdrawal}
              onChange={e => setSettings({ ...settings, min_withdrawal: Number(e.target.value) })}
              className="w-full h-10 mt-1 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}