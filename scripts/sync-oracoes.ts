import * as fs from 'fs';
import * as path from 'path';
import SheetsClient from '../src/lib/sheets-client';
import ImageMapper from '../src/lib/image-mapper';

/**
 * Remove tags em colchetes do texto
 * Ex: "Oração [inhales deeply] aqui" → "Oração aqui"
 */
function removeTagsFromText(text: string): string {
  return text
    .replace(/\[([^\]]*)\]/g, '') // Remove [tags]
    .replace(/\s+/g, ' ') // Remove espaços múltiplos
    .trim();
}

/**
 * Gera um ID único para a oração baseado no título
 */
function generateId(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Remove caracteres especiais
    .replace(/^-+|-+$/g, ''); // Remove hífens nas extremidades
}

interface Oracao {
  id: string;
  titulo: string;
  texto: string;
  audioUrl: string;
  imagem: {
    background: string;
    icon: string;
  };
  createdAt: string;
  theme: string;
}

async function syncOracoes(): Promise<void> {
  console.log('🚀 Iniciando sincronização de orações...\n');

  try {
    // 1️⃣ Busca credenciais do Google
    const credentialsPath = path.join(
      process.cwd(),
      'jornadacomdeus-ce9c0e55fc3e.json'
    );

    if (!fs.existsSync(credentialsPath)) {
      throw new Error(
        `Arquivo de credenciais não encontrado: ${credentialsPath}`
      );
    }

    console.log('✅ Credenciais Google encontradas');

    // 2️⃣ Inicializa cliente Google Sheets
    const spreadsheetId = '10Sla_3_ic0ZZ9WfKhaHcpnjhj6dddYa-O-oFPVkzs9Q';
    const sheetsClient = new SheetsClient(credentialsPath, spreadsheetId);

    // 3️⃣ Busca orações do Sheets
    console.log('\n📊 Buscando orações do Google Sheets...');
    const sheetData = await sheetsClient.fetchOracoes();

    if (sheetData.length === 0) {
      throw new Error('Nenhuma oração encontrada na planilha');
    }

    // 4️⃣ Processa e limpa dados
    console.log(`\n🧹 Processando ${sheetData.length} orações...`);
    const processedOracoes = sheetData.map((item) => ({
      titulo: item.titulo,
      texto: removeTagsFromText(item.texto),
      audioUrl: item.audioUrl,
    }));

    // 5️⃣ Mapeia imagens
    console.log('\n🖼️  Mapeando imagens...');
    const imageMapper = new ImageMapper();
    const imageMappings = imageMapper.mapOracoes(
      processedOracoes.map((o) => o.titulo)
    );

    // 6️⃣ Combina dados com imagens
    console.log('\n📝 Combinando dados...');
    const oracoes: Oracao[] = processedOracoes.map((oracao, index) => {
      const imageMapping = imageMappings.find((m) => m.titulo === oracao.titulo);
      return {
        id: generateId(oracao.titulo),
        titulo: oracao.titulo,
        texto: oracao.texto,
        audioUrl: oracao.audioUrl,
        imagem: imageMapping?.imagem || {
          background: 'default.png',
          icon: 'default.png',
        },
        createdAt: new Date().toISOString(),
        theme: 'default', // Pode ser expandido depois
      };
    });

    // 7️⃣ Salva em TypeScript
    const tsOutputPath = path.join(
      process.cwd(),
      'src',
      'data',
      'oracoes.ts'
    );

    const tsContent = `// AUTO-GENERATED: ${new Date().toISOString()}
// Este arquivo é gerado automaticamente pelo script sync-oracoes.ts
// NÃO EDITE MANUALMENTE

export interface Oracao {
  id: string;
  titulo: string;
  texto: string;
  audioUrl: string;
  imagem: {
    background: string;
    icon: string;
  };
  createdAt: string;
  theme: string;
}

export const ORACOES: Oracao[] = ${JSON.stringify(oracoes, null, 2)};

export const ORACOES_COUNT = ${oracoes.length};

export default ORACOES;
`;

    fs.writeFileSync(tsOutputPath, tsContent);
    console.log(`✅ Arquivo TypeScript salvo: ${tsOutputPath}`);

    // 8️⃣ Salva em JSON também (para referência)
    const jsonOutputPath = path.join(
      process.cwd(),
      'public',
      'data',
      'oracoes.json'
    );

    // Cria diretório se não existir
    fs.mkdirSync(path.dirname(jsonOutputPath), { recursive: true });

    fs.writeFileSync(jsonOutputPath, JSON.stringify(oracoes, null, 2));
    console.log(`✅ Arquivo JSON salvo: ${jsonOutputPath}`);

    // 9️⃣ Resumo
    console.log('\n' + '='.repeat(60));
    console.log('✨ SINCRONIZAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('='.repeat(60));
    console.log(`📊 Total de orações: ${oracoes.length}`);
    console.log(`📅 Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
    console.log(`💾 Salvo em: src/data/oracoes.ts`);
    console.log(`🌐 Público em: public/data/oracoes.json`);
    console.log(`🖼️  Imagens mapeadas: ${imageMappings.length}`);
    console.log('='.repeat(60));

    // 🔟 Mostra primeiras 3 orações como verificação
    console.log('\n🔍 Amostra das 3 primeiras orações:');
    oracoes.slice(0, 3).forEach((oracao) => {
      console.log(`\n  📌 ${oracao.titulo}`);
      console.log(`     ID: ${oracao.id}`);
      console.log(`     Áudio: ${oracao.audioUrl.substring(0, 50)}...`);
      console.log(`     Imagem: ${oracao.imagem.background}`);
    });
  } catch (error) {
    console.error('\n❌ ERRO NA SINCRONIZAÇÃO:');
    console.error(error);
    process.exit(1);
  }
}

// Executa script
syncOracoes();
