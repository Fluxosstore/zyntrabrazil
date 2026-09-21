import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Zap, ArrowRight } from "lucide-react";

export default function TrialExpired() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F6] p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-red-50">
          <Clock className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-black mb-2">
          Seu teste gratuito acabou
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Seu período de teste gratuito de 24 horas terminou. Faça a renovação para continuar usando a Zyntra sem interrupções.
        </p>
        <button
          onClick={() => navigate("/plan-selection")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1D1D1F] text-white text-sm font-medium hover:bg-black transition-colors"
        >
          <Zap className="w-4 h-4" />
          Fazer renovação agora
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-gray-400 mt-4">
          Você ainda pode acessar as configurações para gerenciar sua conta.
        </p>
      </div>
    </div>
  );
}