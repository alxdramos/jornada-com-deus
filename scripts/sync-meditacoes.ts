import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';
import ImageMapper from '../src/lib/image-mapper';

/**
 * Remove tags em colchetes do texto
 * Ex: "Meditação [inhales deeply] aqui" -> "Meditação aqui"
 */
function removeTagsFromText(text: string): string {
  return text
    .replace(/\[([^\]]*)\]/g, '') // Remove [tags]
    .replace(/\s+/g, ' ') // Remove espaços múltiplos
    .trim();
}

/**
 * Gera um ID único para a meditação baseado no título
 */
function generateId(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Remove caracteres especiais
    .replace(/^-+|-+$/g, ''); // Remove hífens nas extremidades
}

/**
 * Parseia tags de uma string separada por vírgula
 */
function parseTags(tagsStr: string | undefined): string[] {
  if (!tagsStr) return [];
  return tagsStr
    .split(',')
    .map((tag) => tag.trim().toUpperCase())
    .filter((tag) => tag.length > 0);
}

/**
 * Parseia valor booleano de string
 */
function parseBoolean(val: string | undefined): boolean {
  if (!val) return false;
  const normalized = val.trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'sim' || normalized === 'yes';
}

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

async function syncMeditacoes(): Promise<void> {
  console.log('🚀 Iniciando sincronização de meditações...\n');

  try {
    // 1. Baixa arquivo Excel do Cloudflare R2
    console.log('📥 Baixando meditacao.xlsx do Cloudflare R2...');
    const cloudflareUrl = 'https://pub-561f3fcecd8945ba90a5b9c1683fac22.r2.dev/meditacao.xlsx';
    const response = await fetch(cloudflareUrl);

    if (!response.ok) {
      throw new Error(`Falha ao baixar arquivo: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    console.log('✅ Arquivo baixado com sucesso');

    // 2. Parse o arquivo Excel
    console.log('\n📊 Parseando arquivo Excel...');
    const workbook = xlsx.read(buffer, { type: 'buffer' });

    // Procura pela aba correta (case-insensitive)
    const sheetName = workbook.SheetNames.find(name =>
      name.toLowerCase().trim() === 'meditacoes' ||
      name.toLowerCase().trim() === 'meditação' ||
      name.toLowerCase().includes('meditação') ||
      name.toLowerCase().includes('meditacao')
    ) || workbook.SheetNames[0]; // Fallback para a primeira aba

    if (!sheetName) {
      throw new Error(`Nenhuma aba encontrada. Abas disponíveis: ${workbook.SheetNames.join(', ')}`);
    }

    console.log(`📋 Usando aba: "${sheetName}"`);

    const worksheet = workbook.Sheets[sheetName];
    const sheetData: any[] = xlsx.utils.sheet_to_json(worksheet);

    // Filtra linhas vazias (mantém só linhas com título)
    const validData = sheetData.filter(item => {
      const title = item.titulo || item['Título'] || item.title || item['titulo'] || '';
      return title.trim().length > 0;
    });

    if (validData.length === 0) {
      throw new Error('Nenhuma meditação encontrada na planilha');
    }

    // 3. Processa e limpa dados
    console.log(`\n🧹 Processando ${validData.length} meditações de ${sheetData.length} linhas...`);
    const processedMeditacoes = validData.map((item) => ({
      titulo: item.titulo || item['Título'] || item.title || '',
      texto: removeTagsFromText(item.texto || item['Texto'] || item.text || ''),
      audioUrl: item.audioUrl || item['URL de Áudio'] || item['Audio URL'] || '',
      imagem: item.imagem || item['Imagem'] || item.image || '',
      duracao: item.duracao || item['Duração'] || item.duration || '',
      categoria: item.categoria || item['Categoria'] || item.category || '',
      tags: item.tags || item['Tags'] || item.tag || '',
      plus: item.plus,
    }));

    // 5. Mapeia imagens para itens sem imagem definida
    console.log('\n🖼️  Mapeando imagens...');
    const imageMapper = new ImageMapper();
    const titulosSemImagem = processedMeditacoes
      .filter((m) => !m.imagem)
      .map((m) => m.titulo);

    const imageMappings = titulosSemImagem.length > 0
      ? imageMapper.mapMeditacoes(titulosSemImagem)
      : [];

    // 6. Combina dados
    console.log('\n📝 Combinando dados...');
    const meditacoes: MeditationCard[] = processedMeditacoes.map((med) => {
      // Determina a imagem
      let image: string | undefined;
      if (med.imagem) {
        // Se tem imagem na planilha, usa diretamente
        image = med.imagem;
      } else {
        // Usa ImageMapper
        const mapping = imageMappings.find((m) => m.titulo === med.titulo);
        if (mapping) {
          image = `/images/${mapping.imagem.background}`;
        }
      }

      return {
        id: generateId(med.titulo),
        title: med.titulo,
        duration: med.duracao || '--:--',
        category: med.categoria ? med.categoria.toUpperCase() : 'MENTE',
        plus: parseBoolean(med.plus),
        description: med.texto,
        tags: parseTags(med.tags),
        image,
        audioUrl: med.audioUrl,
      };
    });

    // 7. Verifica IDs únicos
    const ids = meditacoes.map((m) => m.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      console.warn(`⚠️  IDs duplicados encontrados: ${duplicateIds.join(', ')}`);
      // Adiciona sufixo numérico para duplicados
      const idCount: Record<string, number> = {};
      meditacoes.forEach((m) => {
        if (!idCount[m.id]) {
          idCount[m.id] = 0;
        }
        idCount[m.id]++;
        if (idCount[m.id] > 1) {
          m.id = `${m.id}-${idCount[m.id]}`;
        }
      });
    }

    // 8. Salva em TypeScript
    const tsOutputPath = path.join(
      process.cwd(),
      'src',
      'data',
      'meditacoes.ts'
    );

    const tsContent = `// AUTO-GENERATED: ${new Date().toISOString()}
// Este arquivo é gerado automaticamente pelo script sync-meditacoes.ts
// NÃO EDITE MANUALMENTE a seção MEDITACOES
// As constantes CATEGORIAS, CHIPS, LIVROS_AT, LIVROS_NT, CARDS_ESCRITURAS e CARDS_NOVO
// são mantidas manualmente e preservadas durante a sincronização.

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

export const MEDITACOES: MeditationCard[] = ${JSON.stringify(meditacoes, null, 2)};

export const MEDITACOES_COUNT = ${meditacoes.length};

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
`;

    fs.writeFileSync(tsOutputPath, tsContent);
    console.log(`✅ Arquivo TypeScript salvo: ${tsOutputPath}`);

    // 9. Salva em JSON
    const jsonOutputPath = path.join(
      process.cwd(),
      'public',
      'data',
      'meditacoes.json'
    );

    fs.mkdirSync(path.dirname(jsonOutputPath), { recursive: true });
    fs.writeFileSync(jsonOutputPath, JSON.stringify(meditacoes, null, 2));
    console.log(`✅ Arquivo JSON salvo: ${jsonOutputPath}`);

    // 10. Resumo
    console.log('\n' + '='.repeat(60));
    console.log('✨ SINCRONIZAÇÃO DE MEDITAÇÕES CONCLUÍDA COM SUCESSO!');
    console.log('='.repeat(60));
    console.log(`📊 Total de meditações: ${meditacoes.length}`);
    console.log(`📅 Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
    console.log(`💾 Salvo em: src/data/meditacoes.ts`);
    console.log(`🌐 Público em: public/data/meditacoes.json`);
    console.log('='.repeat(60));

    // Mostra primeiras 3 meditações como verificação
    console.log('\n🔍 Amostra das 3 primeiras meditações:');
    meditacoes.slice(0, 3).forEach((med) => {
      console.log(`\n  📌 ${med.title}`);
      console.log(`     ID: ${med.id}`);
      console.log(`     Duração: ${med.duration}`);
      console.log(`     Categoria: ${med.category}`);
      console.log(`     Tags: ${med.tags.join(', ')}`);
      console.log(`     Áudio: ${med.audioUrl?.substring(0, 50)}...`);
      console.log(`     Imagem: ${med.image?.substring(0, 50)}...`);
    });
  } catch (error) {
    console.error('\n❌ ERRO NA SINCRONIZAÇÃO:');
    console.error(error);
    process.exit(1);
  }
}

// Executa script
syncMeditacoes();
