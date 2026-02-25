"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export function CredentialsLoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email.trim(), password);
      router.push("/");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.toLowerCase().includes("email not confirmed")) {
        setError("E-mail ainda não confirmado. Verifique sua caixa de entrada e clique no link de confirmação.");
      } else {
        setError("E-mail ou senha incorretos. Verifique seus dados.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mensagem de erro */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Campo E-mail */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#1F2937]"
        >
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="
            w-full h-11 px-4 rounded-xl border border-gray-200
            bg-white/80 text-[#1F2937] text-sm placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:border-[#FB923C]
            transition-colors duration-150
          "
        />
      </div>

      {/* Campo Senha */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[#1F2937]"
        >
          Senha
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="
              w-full h-11 px-4 pr-11 rounded-xl border border-gray-200
              bg-white/80 text-[#1F2937] text-sm placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:border-[#FB923C]
              transition-colors duration-150
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FB923C] transition-colors"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Botão de entrar */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full h-11 flex items-center justify-center gap-2
          bg-[#FB923C] hover:bg-[#F97316] disabled:bg-[#FB923C]/60
          text-white font-medium text-sm rounded-xl
          shadow-md shadow-orange-200/50 hover:shadow-lg hover:shadow-orange-200/60
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:ring-offset-1
        "
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Entrando…
          </>
        ) : (
          "Entrar"
        )}
      </button>

      {/* Link para criar conta */}
      <p className="text-center text-sm text-[#6B7280]">
        Ainda não tem conta?{" "}
        <Link
          href="/register"
          className="text-[#FB923C] font-medium hover:underline"
        >
          Criar conta grátis
        </Link>
      </p>
    </form>
  );
}
