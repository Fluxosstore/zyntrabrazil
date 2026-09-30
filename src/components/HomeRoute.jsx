import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import Home from "@/pages/Home";
import PublicChat from "@/pages/PublicChat";

export default function HomeRoute() {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  // Enquanto verifica auth, não decide ainda (evita flash da landing)
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Usuário já logado vai direto ao painel
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Mobile não logado mostra o chat público
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (isMobile) {
    return <PublicChat />;
  }

  return <Home />;
}