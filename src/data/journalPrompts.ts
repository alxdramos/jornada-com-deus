/**
 * Prompts rotativos para o Diário Espiritual
 * Exibidos quando o usuário abre uma entrada em branco
 */

export interface JournalPrompt {
  id: number
  text: string
  category: 'reflexao' | 'gratidao' | 'intencao' | 'escuta' | 'compromisso'
}

export const JOURNAL_PROMPTS: JournalPrompt[] = [
  // Reflexão
  { id: 1, category: 'reflexao', text: 'O que Deus tem falado com você nesta semana?' },
  { id: 2, category: 'reflexao', text: 'Em que área da sua vida você sente mais necessidade da presença de Deus hoje?' },
  { id: 3, category: 'reflexao', text: 'Qual versículo tocou seu coração recentemente e por quê?' },
  { id: 4, category: 'reflexao', text: 'Como sua fé tem crescido nos últimos 30 dias?' },
  { id: 5, category: 'reflexao', text: 'Existe algo que você tem evitado trazer a Deus em oração? O que te impede?' },
  { id: 6, category: 'reflexao', text: 'Quando foi a última vez que você sentiu a paz de Deus de forma clara? Descreva esse momento.' },
  { id: 7, category: 'reflexao', text: 'O que a Bíblia diz sobre a situação que mais te desafia hoje?' },
  { id: 8, category: 'reflexao', text: 'Qual característica de Jesus você quer imitar mais em sua vida?' },

  // Gratidão
  { id: 9, category: 'gratidao', text: 'Liste três bênçãos específicas que você recebeu esta semana, por menores que pareçam.' },
  { id: 10, category: 'gratidao', text: 'Por qual pessoa em sua vida você é mais grato hoje? O que faz essa pessoa especial?' },
  { id: 11, category: 'gratidao', text: 'Qual dificuldade passada você hoje reconhece como um crescimento?' },
  { id: 12, category: 'gratidao', text: 'Escreva uma oração de gratidão com suas próprias palavras, sem pedir nada.' },
  { id: 13, category: 'gratidao', text: 'Qual aspecto da criação de Deus te inspira mais admiração?' },
  { id: 14, category: 'gratidao', text: 'Por qual resposta de oração você ainda não parou para agradecer adequadamente?' },

  // Intenção
  { id: 15, category: 'intencao', text: 'Qual é uma ação concreta que você fará esta semana para aproximar-se mais de Deus?' },
  { id: 16, category: 'intencao', text: 'Qual hábito espiritual você quer cultivar e por quê ele importa para você?' },
  { id: 17, category: 'intencao', text: 'A quem você pode demonstrar o amor de Deus hoje? De que forma?' },
  { id: 18, category: 'intencao', text: 'Qual área da sua vida você quer entregar a Deus nesta semana?' },
  { id: 19, category: 'intencao', text: 'Escreva uma palavra ou frase que será sua intenção espiritual para os próximos sete dias.' },
  { id: 20, category: 'intencao', text: 'O que você precisa soltar para que Deus tenha mais espaço em sua vida?' },

  // Escuta
  { id: 21, category: 'escuta', text: 'Em sua oração de hoje, o que você sentiu Deus dizendo ao seu coração?' },
  { id: 22, category: 'escuta', text: 'Qual sonho ou desejo profundo você acredita que pode ser de Deus para sua vida?' },
  { id: 23, category: 'escuta', text: 'Tem alguma porta que se fechou recentemente que pode ser a direção de Deus? O que você pensa sobre isso?' },
  { id: 24, category: 'escuta', text: 'Que mensagem de paz Deus colocou em seu coração em meio à tempestade atual?' },
  { id: 25, category: 'escuta', text: 'Qual conselho bíblico você sente que precisa colocar em prática agora?' },
  { id: 26, category: 'escuta', text: 'Se você pudesse fazer uma pergunta a Deus agora, qual seria?' },

  // Compromisso
  { id: 27, category: 'compromisso', text: 'Qual promessa de Deus você está escolhendo crer hoje, mesmo sem ver?' },
  { id: 28, category: 'compromisso', text: 'Como você vai honrar a Deus com seu tempo esta semana?' },
  { id: 29, category: 'compromisso', text: 'Escreva um compromisso de fé: algo que você vai agir como se já fosse verdade.' },
  { id: 30, category: 'compromisso', text: 'Qual pessoa em sua vida precisa das suas orações agora? Escreva uma oração por ela.' },
  { id: 31, category: 'compromisso', text: 'Qual medo você vai entregar a Deus nesta entrada do diário?' },
  { id: 32, category: 'compromisso', text: 'Em que área você precisa de mais coragem para obedecer a Deus?' },
  { id: 33, category: 'compromisso', text: 'O que você vai fazer diferente amanhã, com a ajuda de Deus?' },
]

/** Retorna um prompt aleatório, opcionalmente diferente do último exibido */
export function getRandomPrompt(excludeId?: number): JournalPrompt {
  const available = excludeId
    ? JOURNAL_PROMPTS.filter((p) => p.id !== excludeId)
    : JOURNAL_PROMPTS
  return available[Math.floor(Math.random() * available.length)]
}
