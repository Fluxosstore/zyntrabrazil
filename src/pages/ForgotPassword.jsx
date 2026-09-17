import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import AuthShell from "@/components/ayzen/AuthShell";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ef650f55a_ChatGPTImage16desetde202623_41_31.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      // Always show success regardless
    } finally {
      setLoading(false);
      setSent(true);
      setResendIn(53);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setResendIn(53);
    }
  };

  useEffect(() => {
    if (!sent || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sent, resendIn]);

  return (
    <AuthShell>
      {/* Brand header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-4">
          <img src={LOGO} alt="Zyntra" className="w-7 h-7 rounded-lg object-contain" />
          <span className="text-lg font-bold text-black">Zyntra</span>
        </div>
        <p className="text-xs text-[#757575]">
          Entre na sua conta para conversar com a Zyntra.
        </p>
      </div>

      {!sent ? (
        <>
          <h1 className="text-base font-bold text-black mb-1">Esqueci minha senha</h1>
          <p className="text-xs text-[#757575] mb-5">
            Informe seu e-mail para receber um link de redefinição.
          </p>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-[#DCDCDC] hover:bg-[#7E57C2] hover:text-white text-[#666] text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar link"}
            </button>
          </form>

          <Link
            to="/login"
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#7E57C2] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao login
          </Link>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-5">
              <CheckCircle2 className="w-7 h-7 text-[#16A34A]" />
            </div>
            <h1 className="text-base font-bold text-black mb-2">E-mail enviado</h1>
            <p className="text-xs text-[#757575] leading-relaxed mb-5 max-w-xs">
              Enviamos as instruções para{" "}
              <span className="font-medium text-black">{email}</span>
            </p>

            <div className="w-full rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] p-3.5 space-y-2.5 mb-5">
              <div className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#555] text-left leading-relaxed">
                  Verifique sua caixa de entrada e a pasta de spam.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#555] text-left leading-relaxed">
                  O link expira em 1 hora.
                </p>
              </div>
            </div>

            <button
              disabled={resendIn > 0}
              onClick={handleResend}
              className="w-full h-10 rounded-lg bg-[#DCDCDC] text-[#666] text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center"
            >
              {resendIn > 0 ? `Reenviar em ${resendIn}s` : "Reenviar e-mail"}
            </button>

            <Link
              to="/login"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#7E57C2] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar ao login
            </Link>
          </div>
        </>
      )}
    </AuthShell>
  );
}