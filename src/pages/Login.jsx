import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Mail, Lock, Eye, EyeOff, Loader2, Fingerprint } from "lucide-react";
import AuthShell from "@/components/ayzen/AuthShell";
import { safeReturnTo } from "@/lib/authReturnTo";
import { useLanguage } from "@/lib/LanguageContext";
import { isWebAuthnSupported, authenticatePasskey } from "@/lib/webauthnUtils";

const LOGO =
"https://media.base44.com/images/public/6aab2e6298f803d865228a5d/4242d5902_quality_restoration_20260928203908003.png";

export default function Login() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const returnTo = safeReturnTo();
  const dest = returnTo === "/" ? "/dashboard" : returnTo;
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [passkeyVerified, setPasskeyVerified] = useState(false);

  const handlePasskeyLogin = async () => {
    if (!isWebAuthnSupported()) {
      setError("Seu dispositivo não suporta passkeys.");
      return;
    }
    setPasskeyLoading(true);
    setError("");
    try {
      const startRes = await base44.functions.invoke("passkeyAuth", { action: "startAuth" });
      const startData = startRes.data || startRes;
      const rpId = window.location.hostname;
      const assertion = await authenticatePasskey({
        challenge: startData.challenge,
        rpId,
        allowCredentials: startData.allowCredentials || []
      });
      const finishRes = await base44.functions.invoke("passkeyAuth", {
        action: "finishAuth",
        credentialId: assertion.credentialId,
        authenticatorData: assertion.authenticatorData,
        clientDataJSON: assertion.clientDataJSON,
        signature: assertion.signature,
        challenge: startData.challenge,
        challengeSignature: startData.challengeSignature
      });
      const finishData = finishRes.data || finishRes;
      if (finishData.success && finishData.email) {
        if (finishData.password) {
          // Auto-login: preenche email + senha e entra automaticamente
          setEmail(finishData.email);
          setPassword(finishData.password);
          try {
            await base44.auth.loginViaEmailPassword(finishData.email, finishData.password);
            window.location.href = dest;
          } catch (err) {
            setError("Falha no login automático. Digite sua senha manualmente.");
            setPasskeyVerified(true);
          }
        } else {
          setEmail(finishData.email);
          setPasskeyVerified(true);
        }
      } else {
        const dbg = finishData.debug ? ` [${finishData.debug.step || ""} alg=${finishData.debug.algorithm} sigLen=${finishData.debug.sigLen} first=${finishData.debug.sigFirstBytes} raw=${finishData.debug.rawVerifyResult} der=${finishData.debug.derVerifyResult} derErr=${finishData.debug.derError || "none"}]` : "";
        setError(`${finishData.error || "Falha na verificação da passkey."}${dbg}`);
      }
    } catch (e) {
      if (e.name !== "NotAllowedError") {
        const msg = e?.message || e?.name || "erro desconhecido";
        setError(`Não foi possível autenticar com passkey: ${msg}`);
      }
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = dest;
    } catch (err) {
      setError(t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="mb-3 lg:mb-5">
        <Link to="/" className="flex items-center justify-center gap-2 mb-2 lg:mb-4">
          <img src={LOGO} alt="Zyntra" className="w-7 h-7 rounded-lg object-contain" />
          <span className="text-lg font-bold text-black">Zyntra</span>
        </Link>
        
        <p className="text-xs text-[#757575] text-center">
          {t("login.subtitle")}
        </p>
      </div>

      {error &&
      <div className="mb-2 p-2.5 rounded-lg bg-red-50 text-red-600 text-xs">
          {error}
        </div>
      }

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#333]">{t("login.email")}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login.emailPlaceholder")}
              required
              autoFocus
              className="w-full h-9 lg:h-10 pl-9 pr-4 rounded-lg bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7E57C2] transition-colors" />
            
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#333]">{t("login.password")}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.pwdPlaceholder")}
              required
              className="w-full h-9 lg:h-10 pl-9 pr-9 rounded-lg bg-[#F9F9F9] border border-[#E5E5E5] text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7E57C2] transition-colors" />
            
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              
              {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-9 lg:h-10 rounded-lg bg-[#DCDCDC] hover:bg-[#7E57C2] hover:text-white text-[#666] text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center">
          
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("login.submit")}
        </button>
      </form>

      <div className="relative my-3 lg:my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E5E5]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400">{t("login.or")}</span>
        </div>
      </div>

      <button
        onClick={handlePasskeyLogin}
        disabled={passkeyLoading}
        className="w-full h-9 lg:h-10 rounded-lg bg-white border border-[#E5E5E5] text-sm font-medium text-[#333] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-60">
        
        {passkeyLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7E57C2]" /> : <Fingerprint className="w-3.5 h-3.5 text-[#7E57C2]" />}
        {passkeyLoading ? "Verificando..." : t("login.passkey")}
      </button>

      {passkeyVerified &&
      <div className="mt-2 p-2.5 rounded-lg bg-green-50 text-green-700 text-xs flex items-center gap-1.5">
          <Fingerprint className="w-3.5 h-3.5 shrink-0" />
          Identidade verificada por biometria. Digite sua senha para entrar.
        </div>
      }

      <div className="mt-3 lg:mt-4 flex flex-col gap-1 text-center">
        <Link
          to="/forgot-password"
          className="text-xs font-medium text-[#7E57C2] hover:underline">
          
          {t("login.forgot")}
        </Link>
        <p className="text-xs text-[#757575]">
          {t("login.noAccount")}{" "}
          <Link
            to="/register"
            className="text-[#7E57C2] font-medium hover:underline">
            
            {t("login.createAccount")}
          </Link>
        </p>
      </div>
    </AuthShell>);

}