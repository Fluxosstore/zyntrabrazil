import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  Tag,
  MailCheck,
} from "lucide-react";
import AuthShell from "@/components/ayzen/AuthShell";
import { toast } from "@/components/ui/use-toast";

const LOGO =
  "https://media.base44.com/images/public/6aab2e6298f803d865228a5d/ef650f55a_ChatGPTImage16desetde202623_41_31.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP step
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendIn, setResendIn] = useState(47);
  const otpRefs = useRef([]);

  const canSubmit = name && email && password && accepted;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
      setResendIn(47);
    } catch (err) {
      setError(err.message || "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const code = otp.join("");
      const result = await base44.auth.verifyOtp({ email, otpCode: code });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Código inválido");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      setResendIn(47);
      toast({ title: "Código reenviado", description: "Confira seu e-mail." });
    } catch (err) {
      setError(err.message || "Falha ao reenviar");
    }
  };

  // resend countdown
  useEffect(() => {
    if (!showOtp || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [showOtp, resendIn]);

  const onOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const onOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const onOtpPaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    const next = ["", "", "", "", "", ""];
    digits.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  /* ---------- OTP confirmation (image 3) ---------- */
  if (showOtp) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-[#f3f0f7] flex items-center justify-center mb-4">
            <MailCheck className="w-5 h-5 text-[#7E57C2]" />
          </div>
          <h1 className="text-base font-bold text-[#1e1e1e] mb-2">
            Confirme seu e-mail para continuar
          </h1>
          <p className="text-xs text-[#707070] leading-relaxed mb-5 max-w-xs">
            Enviamos um código de 6 dígitos para{" "}
            <span className="font-medium text-[#1e1e1e]">{email}</span>. Digite-o
            abaixo para confirmar seu e-mail.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm w-full">
              {error}
            </div>
          )}

          <div className="flex gap-1.5 mb-5" onPaste={onOtpPaste}>
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => onOtpChange(i, e.target.value)}
                onKeyDown={(e) => onOtpKey(i, e)}
                autoFocus={i === 0}
                className="w-9 h-11 rounded-lg bg-white border border-[#E5E5E5] text-center text-base font-bold text-[#1e1e1e] focus:outline-none focus:border-[#7E57C2] transition-colors"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.join("").length < 6}
            className="w-full h-9 rounded-lg bg-[#DCDCDC] hover:bg-[#7E57C2] hover:text-white text-[#666] text-xs font-semibold transition-colors disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar"}
          </button>

          <div className="mt-4 flex flex-col gap-1.5">
            <p className="text-xs text-[#707070]">
              {resendIn > 0
                ? `Reenviar código em ${resendIn}s`
                : (
                  <button
                    onClick={handleResend}
                    className="text-[#7E57C2] font-medium hover:underline"
                  >
                    Reenviar código
                  </button>
                )}
            </p>
            <Link
              to="/login"
              className="text-xs text-[#707070] hover:text-[#7E57C2] transition-colors"
            >
              &lt; Voltar ao login
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  /* ---------- Registration form (image 2) ---------- */
  return (
    <AuthShell>
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <img src={LOGO} alt="Zyntra" className="w-7 h-7 rounded-lg object-contain" />
          <span className="text-lg font-bold text-black">Zyntra</span>
        </div>
        <h1 className="text-base font-bold text-black mb-0.5">Crie sua conta</h1>
        <p className="text-xs text-[#757575]">
          Entre na sua conta para conversar com a Zyntra.
        </p>
      </div>

      {error && (
        <div className="mb-3 p-2.5 rounded-lg bg-red-50 text-red-600 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#333]">Nome</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como podemos te chamar?"
              required
              autoFocus
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7E57C2] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-[#333]">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7E57C2] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[#333]">Senha</label>
            <button type="button" className="text-[11px] text-[#7E57C2] font-medium hover:underline">
              Gerar senha forte
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha"
              required
              className="w-full h-9 pl-9 pr-9 rounded-lg bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7E57C2] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <ul className="text-[10px] text-gray-400 space-y-0.5 pt-0.5">
            <li>• Pelo menos 8 caracteres</li>
            <li>• 1 letra maiúscula</li>
            <li>• 1 número</li>
          </ul>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[#333]">Cupom</label>
            <span className="text-[11px] text-gray-400">Opcional</span>
          </div>
          <div className="relative flex items-center">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Tem um cupom? Digite aqui"
              className="w-full h-9 pl-9 pr-14 rounded-lg bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7E57C2] transition-colors"
            />
            <button type="button" className="absolute right-3 text-xs font-medium text-[#7E57C2] hover:underline">
              Aplicar
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 w-3.5 h-3.5 rounded border-[#E5E5E5] accent-[#7E57C2]"
          />
          <span className="text-[11px] text-[#666] leading-relaxed">
            Li e aceito os{" "}
            <a href="#" className="text-[#7E57C2] font-medium">Termos de Uso</a> e a{" "}
            <a href="#" className="text-[#7E57C2] font-medium">Política de Privacidade</a>.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="w-full h-9 rounded-lg bg-[#D1D1D6] hover:bg-[#7E57C2] hover:text-white text-[#666] text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-80 flex items-center justify-center"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Começar grátis"}
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-[#757575]">
        Já tem conta?{" "}
        <Link to="/login" className="text-[#7E57C2] font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}