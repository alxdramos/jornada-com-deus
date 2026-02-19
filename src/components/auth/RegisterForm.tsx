"use client";

import { useActionState, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { registerUser, RegisterState } from "@/app/actions/register";

const initialState: RegisterState = { success: false };

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [state, action, isPending] = useActionState(registerUser, initialState);

  // Após cadastro bem-sucedido, faz login automático
  useEffect(() => {
    if (!state.success) return;

    const formEl = document.getElementById("register-form") as HTMLFormElement | null;
    const email = formEl?.querySelector<HTMLInputElement>('[name="email"]')?.value ?? "";
    const password = formEl?.querySelector<HTMLInputElement>('[name="password"]')?.value ?? "";

    signIn("credentials", { email, password, redirect: false }).then(() => {
      router.push("/");
      router.refresh();
    });
  }, [state.success, router]);

  return (
    <form id="register-form" action={action} className="space-y-4">
      {/* Erro geral */}
      {state.error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Sucesso (brevíssimo — redireciona) */}
      {state.success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Conta criada! Entrando…</span>
        </div>
      )}

      {/* Nome */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-[#1F2937]">
          Seu nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Como podemos te chamar?"
          className="
            w-full h-11 px-4 rounded-xl border border-gray-200
            bg-white/80 text-[#1F2937] text-sm placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:border-[#FB923C]
            transition-colors duration-150
          "
        />
      </div>

      {/* E-mail */}
      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="block text-sm font-medium text-[#1F2937]">
          E-mail
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="seu@email.com"
          className="
            w-full h-11 px-4 rounded-xl border border-gray-200
            bg-white/80 text-[#1F2937] text-sm placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:border-[#FB923C]
            transition-colors duration-150
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
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
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
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="Repita a senha"
            className="
              w-full h-11 px-4 pr-11 rounded-xl border border-gray-200
              bg-white/80 text-[#1F2937] text-sm placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:border-[#FB923C]
              transition-colors duration-150
            "
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FB923C] transition-colors"
            aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Botão criar conta */}
      <button
        type="submit"
        disabled={isPending || state.success}
        className="
          w-full h-11 flex items-center justify-center gap-2
          bg-[#FB923C] hover:bg-[#F97316] disabled:bg-[#FB923C]/60
          text-white font-medium text-sm rounded-xl
          shadow-md shadow-orange-200/50 hover:shadow-lg hover:shadow-orange-200/60
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#FB923C]/40 focus:ring-offset-1
        "
      >
        {isPending || state.success ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {state.success ? "Entrando…" : "Criando conta…"}
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
