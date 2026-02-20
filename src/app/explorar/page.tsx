"use client";

import { useRouter } from "next/navigation";
import { AppCard } from "@/components/AppCard";
import { SectionHeader } from "@/components/SectionHeader";
import { BookOpen, Heart, Star, ArrowLeft } from "lucide-react";

export default function ExplorarPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header com botão voltar */}
        <SectionHeader
          title="Explorar"
          subtitle="Descubra novos conteúdos para sua jornada"
          action={
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          }
        />

        {/* Cards de exploração */}
        <div className="grid md:grid-cols-2 gap-6">

          <AppCard
            title="Devocionais"
            onClick={() => console.log("Ir para devocionais")}
          >
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Momentos de reflexão e paz com Deus
              </p>
              <div className="text-sm text-primary font-medium">
                Explorar devocionais →
              </div>
            </div>
          </AppCard>

          <AppCard
            title="Orações"
            onClick={() => console.log("Ir para orações")}
          >
            <div className="text-center">
              <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Conecte-se com Deus através da oração
              </p>
              <div className="text-sm text-accent font-medium">
                Ver orações →
              </div>
            </div>
          </AppCard>

        </div>

        {/* Coming soon */}
        <AppCard title="Em breve">
          <div className="text-center py-8">
            <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Mais conteúdos chegando!</h3>
            <p className="text-muted-foreground">
              Bíblia, grupos de estudo e muito mais em breve
            </p>
          </div>
        </AppCard>

      </div>
    </div>
  );
}