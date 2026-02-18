"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { Heart, Play, Lock, Crown, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaywallModal } from "@/components/PaywallModal";
import { MeditationPlayer } from "@/components/MeditationPlayer";
import { useFavorites } from "@/hooks/useFavorites";
import { MeditationCardSkeleton } from "@/components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

const CATEGORIAS = ["TUDO", "MENTE", "CORPO", "ESPÍRITO", "MÚSICA", "ESTUDOS"];
const CHIPS = ["TUDO", "DORMIR", "ANSIEDADE", "PAZ", "<5MINS", "MOTIVAÇÃO", "ORAÇÃO"];

interface MeditationCard {
  id: string;
  title: string;
  duration: string;
  category: string;
  plus: boolean;
  description?: string;
  tags: string[];
  image?: string;
  audioUrl?: string;
}

const MEDITACOES: MeditationCard[] = [
  {
    id: "renovacao-ceu-infinito",
    title: "Renovação Sob o Céu Infinito",
    duration: "8 min",
    category: "MENTE",
    plus: false,
    description: "Respire fundo e sinta a estabilidade dos seus pés firmemente plantados no chão. Imagine-se como uma árvore, suas raízes se estendendo profundamente na terra.",
    tags: ["RENOVAÇÃO", "PAZ", "FORÇA"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_20260217015141_620.mp3"
  },
  {
    id: "paz-aguas-tranquilas",
    title: "A Paz das Águas Tranquilas",
    duration: "12 min",
    category: "CORPO",
    plus: true,
    description: "Respire comigo, suavemente... sinta o peso de seu corpo... permita que suas pernas toquem o chão... Imagine-se em um vasto campo de trigo dourado ondulando suavemente ao toque de um vento morno.",
    tags: ["PAZ", "TRANQUILIDADE", "REPOUSO"],
    image: "https://images.unsplash.com/photo-1544006659-f0b21884ce1?w=400&h=300&fit=crop",
    audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_20260217171734_696.mp3"
  },
  {
    id: "rocha-firme-descanso",
    title: "A Rocha Firme: Descanso e Renovação",
    duration: "10 min",
    category: "ESPÍRITO",
    plus: false,
    description: "Comece encontrando o conforto do momento... permita que sua respiração se torne o centro da sua atenção. Sinta o peso do seu corpo... cada parte relaxando...",
    tags: ["ROCHA", "DESCANSO", "RENOVAÇÃO"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_20260217173441_397.mp3"
  },
  {
    id: "clareira-paz-jesus",
    title: "Na Clareira da Paz: Acalmando a Tempestade com Jesus",
    duration: "15 min",
    category: "MENTE",
    plus: true,
    description: "Respire... suavemente... Este é a sua pausa sagrada. Um momento apenas seu, separado do turbilhão da vida. Deixe seus ombros relaxarem... sinta a paz que envolve você...",
    tags: ["PAZ", "JESUS", "CALMA"],
    image: "https://images.unsplash.com/photo-1507692049790-de58290a4354?w=400&h=300&fit=crop",
    audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_20260217181219_878.mp3"
  },
  {
    id: "rocha-firme-jardim",
    title: "A Rocha Firme: Um Refúgio na Calmaria do Jardim",
    duration: "12 min",
    category: "ESPÍRITO",
    plus: false,
    description: "Sinta o peso de seu corpo... permita que suas pernas toquem o chão... firmes, estáveis. Você está seguro. Você está ancorado.",
    tags: ["REFÚGIO", "JARDIM", "CALMA"],
    image: "https://images.unsplash.com/photo-1511295742362-92c96b1cf68?w=400&h=300&fit=crop",
    audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_20260217181804_359.mp3"
  },
  {
    id: "luz-getsemani",
    title: "Sob a Luz do Getsêmani: Um Chamado à Plenitude",
    duration: "18 min",
    category: "CORPO",
    plus: true,
    description: "Respire devagar... permita que o ar preencha seus pulmões... Esta é a sua pausa sagrada. Concentre-se nos seus pés... sinta como eles tocam o solo... como seguram seu corpo com firmeza e segurança.",
    tags: ["GETSÊMANI", "PLENITUDE", "CHAMADO"],
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_20260218151008_325.mp3"
  }
];

const cardsEscrituras = [
  { id: "salmo-76", title: "Salmo 76", duration: "3 min", plus: false, category: "ESTUDOS" },
  { id: "salmo-51", title: "Salmo 51", duration: "4 min", plus: true, category: "ESTUDOS" },
  { id: "salmo-23", title: "Salmo 23", duration: "3 min", plus: false, category: "ESTUDOS" },
];

const cardsNovo = [
  { id: "crente-excecao", title: "O Crente é uma Exceção", duration: "3 min", plus: false, category: "ESTUDOS" },
  { id: "palavra-final", title: "Uma Palavra Final", duration: "8 min", plus: true, category: "ESTUDOS" },
  { id: "deus-fiel", title: "Deus É Fiel", duration: "5 min", plus: false, category: "ESTUDOS" },
];

export function TabExplorar() {
  const user = useUserStore((s) => s.user);
  const isPlus = user?.isPlus ?? false;
  const { toggleFavorite, isFavorite } = useFavorites();

  const [catAtiva, setCatAtiva] = useState("TUDO");
  const [chipAtivo, setChipAtivo] = useState("TUDO");
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'meditacoes' | 'escrituras' | 'novo'>('meditacoes');
  const [modalTestamento, setModalTestamento] = useState<"AT" | "NT">("AT");

  // Simular loading inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar meditações por categoria e chip
  const meditatacoesFiltradas = MEDITACOES.filter(med => {
    const categoriaMatch = catAtiva === "TUDO" || med.category === catAtiva;
    const chipMatch = chipAtivo === "TUDO" || med.tags.includes(chipAtivo);
    return categoriaMatch && chipMatch;
  });

  const handlePlayMeditation = (meditation: MeditationCard) => {
    if (meditation.plus && !isPlus) {
      setSelectedMeditation(meditation);
      setPaywallOpen(true);
    } else {
      setSelectedMeditation(meditation);
      setPlayerOpen(true);
    }
  };


  const handleUpgrade = () => {
    // Simular upgrade
    console.log("Upgrade realizado!");
    // Aqui seria chamada a API de pagamento
  };

  const openAllModal = (section: 'meditacoes' | 'escrituras' | 'novo') => {
    setSelectedSection(section);
    setShowAllModal(true);
  };

  // Função de debug para ativar Plus (remover em produção)
  const togglePlusForTesting = () => {
    const { togglePlus } = useUserStore.getState();
    togglePlus();
    window.location.reload(); // Recarregar para aplicar mudanças
  };

  return (
    <>
      <div className="min-h-screen bg-[#FAF9F6] p-6 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header: avatar + Explorar + Favoritos */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FB923C] flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <h1 className="text-xl font-bold text-[#1F2937]">Explorar</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlusForTesting}
                className="px-2 py-1 bg-[#10B981] text-white text-xs rounded hover:bg-[#059669] transition-colors"
                title={isPlus ? "Desativar Plus (debug)" : "Ativar Plus (debug)"}
              >
                {isPlus ? "PLUS" : "FREE"}
              </button>
              <button className="flex items-center gap-1 text-[#FB923C]">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">Favoritos</span>
              </button>
            </div>
          </div>

        {/* Abas de categoria */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              onClick={() => setCatAtiva(c)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap",
                catAtiva === c
                  ? "bg-[#1F2937] text-white"
                  : "bg-white text-[#1F2937] shadow-sm"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => setChipAtivo(c)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap",
                chipAtivo === c ? "bg-[#FB923C] text-white" : "bg-white/80 text-[#6B7280]"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Seção Meditações */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#1F2937]">Meditações</h2>
            <button
              onClick={() => openAllModal('meditacoes')}
              className="text-sm text-[#FB923C] font-medium hover:text-[#EA580C] transition-colors"
            >
              VER TUDO &gt;
            </button>
          </div>

          {isLoading ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <MeditationCardSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {meditatacoesFiltradas.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Imagem de fundo */}
                <div
                  className="h-32 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${med.image})` }}
                >
                  <div className="absolute inset-0 bg-black/20" />

                  {/* Overlay Plus */}
                  {med.plus && !isPlus && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Botão favorito */}
                  <button
                    onClick={() => toggleFavorite(med.id)}
                    className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Heart className={cn("w-4 h-4", isFavorite(med.id) ? "text-red-500 fill-current" : "text-white")} />
                  </button>

                  {/* Botão play */}
                  <button
                    onClick={() => handlePlayMeditation(med)}
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-lg"
                  >
                    <Play className="w-5 h-5 text-black ml-0.5" />
                  </button>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-[#1F2937] text-sm line-clamp-2">{med.title}</h3>
                  </div>

                  {med.description && (
                    <p className="text-xs text-[#6B7280] mb-3 line-clamp-2">{med.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6B7280]">{med.duration}</span>
                      {med.plus && (
                        <>
                          <span className="text-[#6B7280]">•</span>
                          <div className="flex items-center gap-1">
                            <Crown className="w-3 h-3 text-[#FB923C]" />
                            <span className="text-xs text-[#FB923C] font-medium">Plus</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-1">
                      {med.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Seção Escrituras */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#1F2937]">Escrituras</h2>
            <button
              onClick={() => openAllModal('escrituras')}
              className="text-sm text-[#FB923C] font-medium hover:text-[#EA580C] transition-colors"
            >
              VER TUDO &gt;
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cardsEscrituras.map((card) => (
              <div
                key={card.id}
                className="min-w-[140px] bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-24 bg-gradient-to-br from-slate-200 to-slate-300 relative">
                  {/* Overlay Plus */}
                  {card.plus && !isPlus && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Botão play */}
                  <button
                    onClick={() => handlePlayMeditation({
                      id: card.id,
                      title: card.title,
                      duration: card.duration,
                      category: card.category,
                      plus: card.plus,
                      tags: []
                    })}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-lg"
                  >
                    <Play className="w-4 h-4 text-black ml-0.5" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="font-medium text-[#1F2937] text-sm">{card.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-[#6B7280]">{card.duration}</p>
                    {card.plus && (
                      <div className="flex items-center gap-1">
                        <Crown className="w-3 h-3 text-[#FB923C]" />
                        <span className="text-xs text-[#FB923C] font-medium">Plus</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção Tudo novo, de novo */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#1F2937]">Tudo novo, de novo</h2>
            <button
              onClick={() => openAllModal('novo')}
              className="text-sm text-[#FB923C] font-medium hover:text-[#EA580C] transition-colors"
            >
              VER TUDO &gt;
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cardsNovo.map((card) => (
              <div
                key={card.id}
                className="min-w-[140px] bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-24 bg-gradient-to-br from-amber-100 to-orange-200 relative">
                  {/* Overlay Plus */}
                  {card.plus && !isPlus && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Botão play */}
                  <button
                    onClick={() => handlePlayMeditation({
                      id: card.id,
                      title: card.title,
                      duration: card.duration,
                      category: card.category,
                      plus: card.plus,
                      tags: []
                    })}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-lg"
                  >
                    <Play className="w-4 h-4 text-black ml-0.5" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="font-medium text-[#1F2937] text-sm">{card.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-[#6B7280]">{card.duration}</p>
                    {card.plus && (
                      <div className="flex items-center gap-1">
                        <Crown className="w-3 h-3 text-[#FB923C]" />
                        <span className="text-xs text-[#FB923C] font-medium">Plus</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        </div>

        {/* Modais */}
        <PaywallModal
          isOpen={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          onUpgrade={handleUpgrade}
          feature={selectedMeditation?.title}
        />

        {selectedMeditation && (
          <MeditationPlayer
            isOpen={playerOpen}
            onClose={() => setPlayerOpen(false)}
            titulo={selectedMeditation.title}
            descricao={selectedMeditation.description}
            duracao={selectedMeditation.duration}
            isPlus={isPlus || !selectedMeditation.plus}
            audioUrl={selectedMeditation.audioUrl}
          />
        )}

        {/* Modal VER TUDO */}
        <AnimatePresence>
          {showAllModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[1000] flex items-end"
                onClick={() => setShowAllModal(false)}
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  className="bg-white rounded-t-3xl p-6 w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#1F2937]">
                      {selectedSection === 'meditacoes' && 'Todas as Meditações'}
                      {selectedSection === 'escrituras' && 'Todas as Escrituras'}
                      {selectedSection === 'novo' && 'Conteúdo Novo'}
                    </h2>
                    <button
                      onClick={() => setShowAllModal(false)}
                      className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                    >
                      <X className="w-5 h-5 text-[#6B7280]" />
                    </button>
                  </div>

                  {/* Conteúdo baseado na seção selecionada */}
                  <div className="space-y-4">
                    {selectedSection === 'meditacoes' && (
                      <>
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                          {CATEGORIAS.slice(1).map((categoria) => (
                            <button
                              key={categoria}
                              onClick={() => setCatAtiva(categoria)}
                              className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0",
                                catAtiva === categoria
                                  ? "bg-[#FB923C] text-white"
                                  : "bg-white text-[#1F2937] border border-[#E5E7EB]"
                              )}
                            >
                              {categoria}
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {MEDITACOES.filter(med =>
                            catAtiva === "TUDO" || med.category === catAtiva
                          ).map((med) => (
                            <div
                              key={med.id}
                              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E5E7EB]"
                            >
                              <div
                                className="h-32 bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${med.image})` }}
                              >
                                <div className="absolute inset-0 bg-black/20" />
                                {med.plus && !isPlus && (
                                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                                    <Crown className="w-3 h-3 text-white" />
                                  </div>
                                )}
                                <button
                                  onClick={() => toggleFavorite(med.id)}
                                  className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
                                >
                                  <Heart className={cn("w-4 h-4", isFavorite(med.id) ? "text-red-500 fill-current" : "text-white")} />
                                </button>
                                <button
                                  onClick={() => {
                                    setShowAllModal(false);
                                    handlePlayMeditation(med);
                                  }}
                                  className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-lg"
                                >
                                  <Play className="w-5 h-5 text-black ml-0.5" />
                                </button>
                              </div>
                              <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold text-[#1F2937] text-sm line-clamp-2">{med.title}</h3>
                                </div>
                                {med.description && (
                                  <p className="text-xs text-[#6B7280] mb-3 line-clamp-2">{med.description}</p>
                                )}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#6B7280]">{med.duration}</span>
                                    {med.plus && (
                                      <div className="flex items-center gap-1">
                                        <Crown className="w-3 h-3 text-[#FB923C]" />
                                        <span className="text-xs text-[#FB923C] font-medium">Plus</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-1">
                                    {med.tags.slice(0, 2).map(tag => (
                                      <span
                                        key={tag}
                                        className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] text-xs rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {selectedSection === 'escrituras' && (
                      <div className="space-y-4">
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                          {["AT", "NT"].map((testamento) => (
                            <button
                              key={testamento}
                              onClick={() => setTestamento(testamento as "AT" | "NT")}
                              className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0",
                                testamento === testamento
                                  ? "bg-[#1F2937] text-white"
                                  : "bg-white text-[#1F2937] border border-[#E5E7EB]"
                              )}
                            >
                              {testamento === "AT" ? "ANTIGO TESTAMENTO" : "NOVO TESTAMENTO"}
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {testamento === "AT" ? LIVROS_AT : LIVROS_NT.map((livro) => (
                            <div
                              key={livro}
                              className="bg-white rounded-2xl px-4 py-4 shadow-sm text-[#1F2937] font-medium border border-[#E5E7EB]"
                            >
                              <div className="flex items-center justify-between">
                                <span>{livro}</span>
                                <BookOpen className="w-5 h-5 text-[#6B7280]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedSection === 'novo' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cardsNovo.map((card) => (
                          <div
                            key={card.id}
                            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E5E7EB]"
                          >
                            <div className="h-24 bg-gradient-to-br from-amber-100 to-orange-200 relative">
                              {card.plus && !isPlus && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                                  <Crown className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <button
                                onClick={() => {
                                  setShowAllModal(false);
                                  handlePlayMeditation({
                                    id: card.id,
                                    title: card.title,
                                    duration: card.duration,
                                    category: card.category,
                                    plus: card.plus,
                                    tags: []
                                  });
                                }}
                                className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-lg"
                              >
                                <Play className="w-4 h-4 text-black ml-0.5" />
                              </button>
                            </div>
                            <div className="p-3">
                              <p className="font-medium text-[#1F2937] text-sm">{card.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-[#6B7280]">{card.duration}</p>
                                {card.plus && (
                                  <div className="flex items-center gap-1">
                                    <Crown className="w-3 h-3 text-[#FB923C]" />
                                    <span className="text-xs text-[#FB923C] font-medium">Plus</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

