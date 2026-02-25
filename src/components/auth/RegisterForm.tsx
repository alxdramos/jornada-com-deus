"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      if (password !== confirmPassword) {
        throw new Error("Senhas não correspondem");
      }

      if (password.length < 6) {
        throw new Error("Senha deve ter mínimo 6 caracteres");
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      setSuccess(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      if (data.session) {
        // Confirmação de e-mail desativada (ex: ambiente local) — auto-login
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        // Produção: Supabase exige confirmação de e-mail antes de logar
        setNeedsConfirmation(true);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Erro geral */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sucesso */}
      {success && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {needsConfirmation
              ? "Conta criada! Enviamos um e-mail de confirmação. Verifique sua caixa de entrada (e spam) e clique no link para ativar."
              : "Conta criada! Entrando…"}
          </span>
        </div>
      )}

      {/* E-mail */}
      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="block text-sm font-medium text-[#1F2937]">
          E-mail
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending || success}
          className="
            w-full h-11 px-4 rounded-xl border border-gray-200
            bg-white/80 text-[#1F2937] text-sm placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:border-[#FB923C]
            transition-colors duration-150 disabled:opacity-50
          "
        />
      </div>

      {/* Senha */}
      <div className="space-y-1.5">
        <label htmlFor="reg-password" className="block text-sm font-medium text-[#1F2937]">
          Senha
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending || success}
            className="
              w-full h-11 px-4 pr-11 rounded-xl border border-gray-200
              bg-white/80 text-[#1F2937] text-sm placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:border-[#FB923C]
              transition-colors duration-150 disabled:opacity-50
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={isPending || success}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FB923C] transition-colors disabled:opacity-50"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirmar senha */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1F2937]">
          Confirmar senha
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending || success}
            className="
              w-full h-11 px-4 pr-11 rounded-xl border border-gray-200
              bg-white/80 text-[#1F2937] text-sm placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:border-[#FB923C]
              transition-colors duration-150 disabled:opacity-50
            "
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            disabled={isPending || success}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FB923C] transition-colors disabled:opacity-50"
            aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Botão criar conta */}
      <button
        type="submit"
        disabled={isPending || success}
        className="
          w-full h-11 flex items-center justify-center gap-2
          bg-[#FB923C] hover:bg-[#F97316] disabled:bg-[#FB923C]/60
          text-white font-medium text-sm rounded-xl
          shadow-md shadow-orange-200/50 hover:shadow-lg hover:shadow-orange-200/60
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:ring-offset-1
        "
      >
        {isPending || success ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {success ? "Entrando…" : "Criando conta…"}
          </>
        ) : (
          "Criar minha conta"
        )}
      </button>

      {/* Link para login */}
      <p className="text-center text-sm text-[#6B7280]">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-[#FB923C] font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
