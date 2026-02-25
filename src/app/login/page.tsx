'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { CredentialsLoginForm } from '@/components/auth/CredentialsLoginForm'

export default function LoginPage() {
  const { signInWithGoogle, loading: authLoading } = useAuth()
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true)
      await signInWithGoogle()
      // Redirect will happen automatically after OAuth callback
    } catch (err) {
      console.error('Google sign in error:', err)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Coluna esquerda: imagem (md+) ── */}
      <div className="hidden md:block md:w-1/2 lg:w-3/5 relative overflow-hidden">
        {/* Placeholder Unsplash — natureza serena */}
        <img
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&auto=format&fit=crop&q=80"
          alt="Paisagem natural serena"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay gradiente suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F2937]/30 via-transparent to-[#FB923C]/20" />
        {/* Blend suave com a borda direita */}
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#FAF9F6] to-transparent" />

        {/* Versículo na imagem */}
        <div className="absolute bottom-12 left-10 right-10">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-white text-xl font-light italic leading-relaxed">
              &quot;Tudo posso naquele que me fortalece.&quot;
            </p>
            <p className="text-white/70 text-sm mt-2 font-medium tracking-wide">
              Filipenses 4:13
            </p>
          </div>
        </div>
      </div>

      {/* ── Coluna direita: formulário de login ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#FAF9F6] relative overflow-y-auto">

        {/* Fundo para mobile */}
        <div className="md:hidden absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=70"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#FAF9F6]/85 backdrop-blur-sm" />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 w-full max-w-sm space-y-8 py-8">

          {/* Logo + título */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center shadow-xl shadow-orange-200/60">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 5.15-4.97 13.5 0 18 4.97-4.5 4.97-12.85 0-18z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 4.97 4.5 9.03 9 9-4.5 0-9 4.03-9 9" opacity="0.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1F2937] tracking-tight">
                Jornada com Deus
              </h1>
              <p className="text-[#6B7280] mt-1 text-base">
                Cultive sua espiritualidade, um dia de cada vez
              </p>
            </div>
          </div>

          {/* Card glassmorphism */}
          <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-gray-200/60 p-8 space-y-6">

            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#1F2937]">
                Bem-vindo de volta 🙏
              </h2>
              <p className="text-sm text-[#6B7280]">
                Entre para continuar sua jornada espiritual
              </p>
            </div>

            {/* ── Botão Google (client component) ── */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || authLoading}
              className="
                w-full flex items-center justify-center gap-3
                h-11 px-6
                bg-white hover:bg-gray-50
                border border-gray-200 hover:border-[#FB923C]/40
                rounded-xl shadow-sm hover:shadow-md hover:shadow-orange-100/60
                text-[#1F2937] font-medium text-sm
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#FB923C]/30 focus:ring-offset-1
                group
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  {/* Logo Google com cores oficiais */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="group-hover:text-[#FB923C] transition-colors duration-200">
                    Continuar com Google
                  </span>
                </>
              )}
            </button>

            {/* Divisor "ou" */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-[#9CA3AF] font-medium">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* ── Formulário e-mail + senha (client component) ── */}
            <CredentialsLoginForm />
          </div>

          {/* Versículo mobile */}
          <div className="md:hidden text-center space-y-1 px-2">
            <p className="text-sm text-[#6B7280] italic">
              &quot;Tudo posso naquele que me fortalece.&quot;
            </p>
            <p className="text-xs text-[#9CA3AF]">Filipenses 4:13</p>
          </div>

          {/* Termos */}
          <p className="text-center text-xs text-[#9CA3AF] leading-relaxed">
            Ao entrar, você concorda com nossos{" "}
            <Link href="/termos" className="text-[#FB923C] hover:underline">termos de uso</Link>
            {" "}e{" "}
            <Link href="/privacidade" className="text-[#FB923C] hover:underline">política de privacidade</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
