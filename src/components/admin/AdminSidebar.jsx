import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  Ticket,
  Headphones,
  Settings,
  Package,
  Users,
  LogOut,
  ChevronLeft,
} from "lucide-react";

const LOGO = "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ddb60374d_ChatGPTImage16desetde202623_41_31.png";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Pedidos", icon: ShoppingCart },
  { id: "revenue", label: "Receita", icon: DollarSign },
  { id: "coupons", label: "Cupons", icon: Ticket },
  { id: "support", label: "Suporte", icon: Headphones },
  { id: "users", label: "Usuários", icon: Users },
  { id: "product", label: "Produto", icon: Package },
  { id: "settings", label: "Configurações", icon: Settings },
];

export default function AdminSidebar({ active, onSelect }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? "w-16" : "w-60"} bg-[#3a3a3a] flex flex-col transition-all duration-200 shrink-0`}>
      {/* Header */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-3 py-3 border-b border-white/5`}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={LOGO} alt="Zyntra" className="w-6 h-6 rounded-lg object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-white">Zyntra</span>
              <span className="text-[9px] text-gray-500">Admin Panel</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link to="/dashboard" onClick={() => setCollapsed(false)} className="w-full flex items-center justify-center py-1">
            <img src={LOGO} alt="Zyntra" className="w-6 h-6 rounded-lg object-contain" />
          </Link>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-3 mt-2 w-10 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-violet-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-white/5">
        <Link
          to="/dashboard"
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Voltar ao app" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Voltar ao app</span>}
        </Link>
        {!collapsed && user && (
          <div className="mt-2 px-2.5 py-2 rounded-lg bg-white/5">
            <p className="text-xs font-semibold text-white truncate">{user.full_name || user.email}</p>
            <p className="text-[10px] text-gray-500 truncate">Administrador</p>
          </div>
        )}
      </div>
    </aside>
  );
}