"use client";

import { Share2, Sparkles } from "lucide-react";
import { useNativeShare } from "@/hooks/useNativeShare";

// 31 versículos — rotação diária pelo dia do mês
const DAILY_VERSES = [
  { verse: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13" },
  { verse: "O Senhor é o meu pastor, nada me faltará.", reference: "Salmos 23:1" },
  { verse: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.", reference: "João 3:16" },
  { verse: "Sede fortes e corajosos. Não temais nem vos assusteis diante deles, pois o Senhor, o teu Deus, é quem anda contigo.", reference: "Deuteronômio 31:6" },
  { verse: "Não vos conformeis com este século, mas transformai-vos pela renovação da vossa mente.", reference: "Romanos 12:2" },
  { verse: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", reference: "Provérbios 3:5" },
  { verse: "Buscai primeiro o reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas.", reference: "Mateus 6:33" },
  { verse: "O Senhor é a minha luz e a minha salvação; a quem temerei?", reference: "Salmos 27:1" },
  { verse: "Posso tudo por meio daquele que me fortalece.", reference: "Filipenses 4:13" },
  { verse: "Porque o Senhor teu Deus está contigo em todo lugar por onde andares.", reference: "Josué 1:9" },
  { verse: "Aquietai-vos e sabei que eu sou Deus.", reference: "Salmos 46:10" },
  { verse: "O amor é longânimo, é benigno; o amor não arde em ciúmes, não se ufana, não se ensoberbece.", reference: "1 Coríntios 13:4" },
  { verse: "Eu sou o caminho, a verdade e a vida.", reference: "João 14:6" },
  { verse: "A paz de Deus, que excede todo o entendimento, guardará os vossos corações.", reference: "Filipenses 4:7" },
  { verse: "Lança sobre o Senhor o teu cuidado, e ele te susterá.", reference: "Salmos 55:22" },
  { verse: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos darei descanso.", reference: "Mateus 11:28" },
  { verse: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.", reference: "Isaías 41:10" },
  { verse: "A esperança não nos envergonha, porque o amor de Deus foi derramado em nossos corações.", reference: "Romanos 5:5" },
  { verse: "Ele cura os que têm o coração quebrantado e lhes cura as feridas.", reference: "Salmos 147:3" },
  { verse: "Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias.", reference: "Isaías 40:31" },
  { verse: "Alegrai-vos no Senhor sempre; outra vez digo: alegrai-vos.", reference: "Filipenses 4:4" },
  { verse: "O Senhor é clemente e misericordioso, longânimo e cheio de graça.", reference: "Salmos 145:8" },
  { verse: "Não andeis ansiosos por coisa alguma, mas em tudo fazei os vossos pedidos conhecidos a Deus.", reference: "Filipenses 4:6" },
  { verse: "Porque dele, e por meio dele, e para ele são todas as coisas. A ele seja a glória eternamente.", reference: "Romanos 11:36" },
  { verse: "Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele.", reference: "Salmos 118:24" },
  { verse: "O fruto do Espírito é amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade.", reference: "Gálatas 5:22" },
  { verse: "Mas, se invocardes o Pai, aquele que, sem acepção de pessoas, julga segundo a obra de cada um, passai em temor o tempo da vossa peregrinação.", reference: "1 Pedro 1:17" },
  { verse: "Bem-aventurados os pacificadores, porque eles serão chamados filhos de Deus.", reference: "Mateus 5:9" },
  { verse: "Porque os meus pensamentos não são os vossos pensamentos, nem os vossos caminhos os meus caminhos.", reference: "Isaías 55:8" },
  { verse: "Com o amor eterno te amei; por isso, com benignidade te atraí.", reference: "Jeremias 31:3" },
  { verse: "Graças a Deus pela sua dádiva inefável.", reference: "2 Coríntios 9:15" },
];

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function VerseOfDayCard() {
  const dayOfMonth = new Date().getDate();
  const verse = DAILY_VERSES[(dayOfMonth - 1) % DAILY_VERSES.length];
  const { share } = useNativeShare();

  const handleShare = () => {
    share({
      title: "Versículo do Dia",
      text: `"${verse.verse}"\n— ${verse.reference}\n\nJornada com Deus`,
    });
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 text-white"
      style={{
        background: "linear-gradient(155deg, #004D35 0%, #006947 45%, #815100 100%)",
      }}
    >
      {/* Decoração de fundo — círculos sutis */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.04)", transform: "translate(30%, -40%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.04)", transform: "translate(-35%, 40%)" }}
        aria-hidden="true"
      />

      <div className="relative space-y-3">
        {/* Label + Share */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300/80" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Versículo do Dia
            </span>
          </div>
          <button
            onClick={handleShare}
            aria-label="Compartilhar versículo"
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Texto do versículo com Lora */}
        <blockquote
          className="font-heading text-[1.05rem] font-medium italic leading-relaxed text-white/95"
          style={{ fontFamily: "var(--font-newsreader), Newsreader, Georgia, serif" }}
        >
          "{verse.verse}"
        </blockquote>

        {/* Referência */}
        <cite className="block text-sm text-amber-200/80 not-italic font-semibold tracking-wide">
          — {verse.reference}
        </cite>
      </div>
    </div>
  );
}
