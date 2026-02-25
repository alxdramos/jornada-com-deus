import Link from "next/link";
import Image from "next/image";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Criar Conta — Jornada com Deus",
  description: "Crie sua conta gratuita e comece sua jornada espiritual.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">

      {/* ── Coluna esquerda: imagem (md+) ── */}
      <div className="hidden md:block md:w-1/2 lg:w-3/5 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1400&auto=format&fit=crop&q=80"
          alt="Natureza serena ao amanhecer"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 0vw, 60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/30 via-transparent to-[#FB923C]/20" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#FAF9F6] to-transparent" />

        <div className="absolute bottom-12 left-10 right-10">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-white text-xl font-light italic leading-relaxed">
              "Buscar a Deus é o começo de toda sabedoria."
            </p>
            <p className="text-white/70 text-sm mt-2 font-medium tracking-wide">
              Provérbios 9:10
            </p>
          </div>
        </div>
      </div>

      {/* ── Coluna direita: formulário ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#FAF9F6] relative">

        {/* Fundo mobile */}
        <div className="md:hidden absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&auto=format&fit=crop&q=70"
            alt=""
            aria-hidden="true"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#FAF9F6]/85 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 w-full max-w-sm space-y-8">

          {/* Logo + título */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-xl shadow-green-200/60">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 5.15-4.97 13.5 0 18 4.97-4.5 4.97-12.85 0-18z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 4.97 4.5 9.03 9 9-4.5 0-9 4.03-9 9" opacity="0.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1F2937] tracking-tight">
                Criar minha conta
              </h1>
              <p className="text-[#6B7280] mt-1 text-base">
                Comece gratuitamente sua jornada com Deus
              </p>
            </div>
          </div>

          {/* Card glassmorphism */}
          <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-gray-200/60 p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#1F2937]">
                Bem-vindo! 🌿
              </h2>
              <p className="text-sm text-[#6B7280]">
                Preencha os dados abaixo para criar sua conta gratuita
              </p>
            </div>

            <RegisterForm />
          </div>

          {/* Versículo mobile */}
          <div className="md:hidden text-center space-y-1 px-2">
            <p className="text-sm text-[#6B7280] italic">
              "O temor do Senhor é o princípio da sabedoria."
            </p>
            <p className="text-xs text-[#9CA3AF]">Provérbios 9:10</p>
          </div>

          {/* Termos */}
          <p className="text-center text-xs text-[#9CA3AF] leading-relaxed">
            Ao criar uma conta, você concorda com nossos{" "}
            <Link href="/termos" className="text-[#FB923C] hover:underline">termos de uso</Link>
            {" "}e{" "}
            <Link href="/privacidade" className="text-[#FB923C] hover:underline">política de privacidade</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
