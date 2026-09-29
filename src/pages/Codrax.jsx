import React, { useState } from "react";
import { Menu, Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import CodraxHome from "@/components/ayzen/codrax/CodraxHome";
import ProjectStudio from "@/components/ayzen/codrax/ProjectStudio";

const ALLOWED_PLANS = ["starter", "premium", "team", "startup", "enterprise"];

export default function Codrax() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const plan = user?.plan || "free";
  const canAccess = ALLOWED_PLANS.includes(plan);

  const handleStart = () => setStarted(true);

  const renderContent = () => {
    if (!started) return <CodraxHome onStart={handleStart} />;
    if (canAccess) return <ProjectStudio />;
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto px-6">
        <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-5">
          <Lock className="w-7 h-7 text-violet-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Plano Starter necessário</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          O Zintre Code Projetos está disponível a partir do plano Starter. Faça upgrade para criar e editar projetos direto no seu GitHub com IA.
        </p>
        <a
          href="/plan-selection"
          className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          Ver planos
        </a>
      </div>
    );
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pl-2 pr-2 gap-2">
        <DashboardSidebar activePage="codrax" />
        <main className="flex-1 flex flex-col bg-[#f9fafb] rounded-2xl overflow-hidden">
          {renderContent()}
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden h-screen flex flex-col bg-[#f9fafb] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 active:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-black">Zintre Code</span>
          <div className="w-9" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </>
  );
}