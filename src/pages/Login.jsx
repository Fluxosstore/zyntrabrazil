import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Mail, Lock, Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import AuthShell from "@/components/ayzen/AuthShell";
import { safeReturnTo } from "@/lib/authReturnTo";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ef650f55a_ChatGPTImage16desetde202623_41_31.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const returnTo = safeReturnTo();
  const dest = returnTo === "/" ? "/dashboard" : returnTo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = dest;
    } catch (err) {
      setError(err.message || "E-mail ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-4">
          <img src={LOGO} alt="Zyntra" className="w-7 h-7 rounded-lg object-contain" />
          <span className="text-lg font-bold text-black">Zyntra</span>
        </div>
        <h1 className="text-base font-bold text-black mb-0.5">Entre na sua conta</h1>
        <p className="text-xs text-[#757575]">
          Entre na sua conta para conversar com a Zyntra.
        </p>
      </div>

      {error && (
        <div className="mb-3 p-2.5 rounded-lg bg-red-50 text-red-600 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#333]">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
              autoFocus
              className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7E57C2] transition-colors"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#333]">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="w-full h-10 pl-9 pr-9 rounded-lg bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7E57C2] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg bg-[#DCDCDC] hover:bg-[#7E57C2] hover:text-white text-[#666] text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E5E5]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400">OU</span>
        </div>
      </div>

      <button className="w-full h-10 rounded-lg bg-white border border-[#E5E5E5] text-sm font-medium text-[#333] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
        <KeyRound className="w-3.5 h-3.5 text-[#7E57C2]" />
        Entrar com passkey
      </button>

      <div className="mt-4 flex flex-col gap-1.5 text-center">
        <Link
          to="/forgot-password"
          className="text-xs font-medium text-[#7E57C2] hover:underline"
        >
          Esqueci minha senha
        </Link>
        <p className="text-xs text-[#757575]">
          Não tem conta?{" "}
          <Link
            to="/register"
            className="text-[#7E57C2] font-medium hover:underline"
          >
            Criar conta grátis
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}