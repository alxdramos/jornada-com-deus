/**
 * Dados de meditações e conteúdo do TabExplorar
 * Extraído de TabExplorar.tsx para facilitar manutenção
 */

export const CATEGORIAS = ["TUDO", "MENTE", "CORPO", "ESPÍRITO", "MÚSICA", "ESTUDOS"] as const;
export const CHIPS = ["TUDO", "DORMIR", "ANSIEDADE", "PAZ", "<5MINS", "MOTIVAÇÃO", "ORAÇÃO"] as const;

export const LIVROS_AT = [
  "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute",
  "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras", "Neemias",
  "Ester", "Jó", "Salmos", "Provérbios", "Eclesiastes", "Cantares", "Isaías", "Jeremias",
  "Lamentações", "Ezequiel", "Daniel", "Oséias", "Joel", "Amós", "Obadias", "Jonas",
  "Miquéias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias"
];

export const LIVROS_NT = [
  "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos", "1 Coríntios", "2 Coríntios",
  "Gálatas", "Efésios", "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses",
  "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus", "Tiago", "1 Pedro", "2 Pedro",
  "1 João", "2 João", "3 João", "Judas", "Apocalipse"
];

export interface MeditationCard {
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

export const MEDITACOES: MeditationCard[] = [
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

export const CARDS_ESCRITURAS: MeditationCard[] = [
  { id: "salmo-76", title: "Salmo 76", duration: "3 min", plus: false, category: "ESTUDOS", tags: ["ESCRITURA", "SALMOS"], image: "https://images.unsplash.com/photo-1507692049790-de58290a4354?w=400&h=300&fit=crop", audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_salmo76.mp3" },
  { id: "salmo-51", title: "Salmo 51", duration: "4 min", plus: true, category: "ESTUDOS", tags: ["ESCRITURA", "SALMOS"], image: "https://images.unsplash.com/photo-1507692049790-de58290a4354?w=400&h=300&fit=crop", audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_salmo51.mp3" },
  { id: "salmo-23", title: "Salmo 23", duration: "3 min", plus: false, category: "ESTUDOS", tags: ["ESCRITURA", "SALMOS"], image: "https://images.unsplash.com/photo-1507692049790-de58290a4354?w=400&h=300&fit=crop", audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_salmo23.mp3" },
];

export const CARDS_NOVO: MeditationCard[] = [
  { id: "crente-excecao", title: "O Crente é uma Exceção", duration: "3 min", plus: false, category: "ESTUDOS", tags: ["NOVO", "INSPIRAÇÃO"], image: "https://images.unsplash.com/photo-1511295742362-92c96b1cf68?w=400&h=300&fit=crop", audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_crente_excecao.mp3" },
  { id: "palavra-final", title: "Uma Palavra Final", duration: "8 min", plus: true, category: "ESTUDOS", tags: ["NOVO", "REFLEXÃO"], image: "https://images.unsplash.com/photo-1511295742362-92c96b1cf68?w=400&h=300&fit=crop", audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_palavra_final.mp3" },
  { id: "deus-fiel", title: "Deus É Fiel", duration: "5 min", plus: false, category: "ESTUDOS", tags: ["NOVO", "FÉ"], image: "https://images.unsplash.com/photo-1511295742362-92c96b1cf68?w=400&h=300&fit=crop", audioUrl: "https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/Med_deus_fiel.mp3" },
];
