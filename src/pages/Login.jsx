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
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-6">
          <img src={LOGO} alt="Ayzen" className="w-9 h-9 rounded-lg object-contain" />
          <span className="text-2xl font-bold text-black">Ayzen</span>
        </div>
        <h1 className="text-xl font-bold text-black mb-1">Entre na sua conta</h1>
        <p className="text-sm text-[#757575]">
          Entre na sua conta para conversar com a Ayzen.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#333]">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
              autoFocus
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7E57C2] transition-colors"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#333]">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="w-full h-12 pl-10 pr-10 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7E57C2] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-full bg-[#DCDCDC] hover:bg-[#7E57C2] hover:text-white text-[#666] text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E5E5]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400">OU</span>
        </div>
      </div>

      <button className="w-full h-12 rounded-full bg-white border border-[#E5E5E5] text-sm font-medium text-[#333] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
        <KeyRound className="w-4 h-4 text-[#7E57C2]" />
        Entrar com passkey
      </button>

      <div className="mt-6 flex flex-col gap-2 text-center">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-[#7E57C2] hover:underline"
        >
          Esqueci minha senha
        </Link>
        <p className="text-sm text-[#757575]">
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