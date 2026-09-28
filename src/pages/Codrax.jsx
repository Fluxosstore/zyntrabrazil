import React, { useState } from "react";
import { BookOpen, Code2, Lock, Menu } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import DashboardSidebar from "@/components/ayzen/DashboardSidebar";
import MobileSidebar from "@/components/ayzen/MobileSidebar";
import ConceptLibrary from "@/components/ayzen/codrax/ConceptLibrary";
import ProjectStudio from "@/components/ayzen/codrax/ProjectStudio";

const ALLOWED_PLANS = ["starter", "premium", "team", "startup", "enterprise"];

function CodraxContent({ tab, setTab, canAccess }) {
  return (
    <>
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="p-6 bg-white border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black">Zintre Code</h1>
          </div>
          <p className="text-sm text-gray-500">
            Biblioteca de conceitos e estúdio de criação de projetos com IA.
          </p>
        </div>
      </div>

      {/* Tabs + content */}
      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        <div className="inline-flex bg-gray-100 rounded-full p-1 mb-6">
          <button
            onClick={() => setTab("concepts")}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${
              tab === "concepts" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Conceitos
          </button>
          <button
            onClick={() => setTab("projects")}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${
              tab === "projects" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Projetos
          </button>
        </div>

        {tab === "concepts" ? (
          <ConceptLibrary />
        ) : canAccess ? (
          <ProjectStudio />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
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
        )}
      </div>
    </>
  );
}

export default function Codrax() {
  const { user } = useAuth();
  const [tab, setTab] = useState("concepts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const plan = user?.plan || "free";
  const canAccess = ALLOWED_PLANS.includes(plan);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-screen bg-[#F4F4F6] overflow-hidden py-2 pl-2 pr-2 gap-2">
        <DashboardSidebar activePage="codrax" />
        <main className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
          <CodraxContent tab={tab} setTab={setTab} canAccess={canAccess} />
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden h-screen flex flex-col bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 active:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-black">Zintre Code</span>
          <div className="w-9" />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <CodraxContent tab={tab} setTab={setTab} canAccess={canAccess} />
        </div>
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </>
  );
}