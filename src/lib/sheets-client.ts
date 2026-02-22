import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

export interface SheetRow {
  titulo: string;
  texto: string;
  audioUrl: string;
}

export interface MeditacaoSheetRow {
  titulo: string;
  texto: string;
  audioUrl: string;
  imagem?: string;
  duracao?: string;
  categoria?: string;
  tags?: string;
  plus?: string;
}

export class SheetsClient {
  private sheets: any;
  private spreadsheetId: string;

  constructor(credentialsPath: string, spreadsheetId: string) {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = spreadsheetId;
  }

  /**
   * Busca todas as orações da planilha
   * Coluna C: Título
   * Coluna D: Texto
   * Coluna K: Audio URL
   */
  async fetchOracoes(): Promise<SheetRow[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'A:K', // Busca todas as colunas até K
      });

      const rows = response.data.values || [];
      const oracoes: SheetRow[] = [];

      // Pula a primeira linha (headers)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];

        // Verifica se tem dados nas colunas necessárias
        if (!row[2] || !row[3] || !row[10]) continue; // C, D, K

        const titulo = String(row[2]).trim();
        const texto = String(row[3]).trim();
        const audioUrl = String(row[10]).trim();

        // Valida dados
        if (!titulo || !texto || !audioUrl) continue;

        oracoes.push({
          titulo,
          texto,
          audioUrl,
        });
      }

      console.log(`✅ Fetchado ${oracoes.length} orações da planilha`);
      return oracoes;
    } catch (error) {
      console.error('❌ Erro ao buscar orações:', error);
      throw error;
    }
  }
  /**
   * Busca todas as meditacoes da aba "Meditações"
   * Coluna A: Titulo
   * Coluna B: Texto/Descricao
   * Coluna C: Audio URL
   * Coluna D: Imagem (opcional)
   * Coluna E: Duracao (opcional)
   * Coluna F: Categoria (opcional)
   * Coluna G: Tags (opcional)
   * Coluna H: Plus (opcional)
   */
  async fetchMeditacoes(): Promise<MeditacaoSheetRow[]> {
    try {
      // Tenta primeiro com "Meditações", depois sem acento
      let response;
      try {
        response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: 'Meditações!A:H',
        });
      } catch {
        console.log('⚠️  Aba "Meditações" não encontrada, tentando "Meditacoes"...');
        response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: 'Meditacoes!A:H',
        });
      }

      const rows = response.data.values || [];
      const meditacoes: MeditacaoSheetRow[] = [];

      // Pula a primeira linha (headers)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];

        // Campos obrigatorios: titulo (A), texto (B), audioUrl (C)
        if (!row[0] || !row[1] || !row[2]) continue;

        const titulo = String(row[0]).trim();
        const texto = String(row[1]).trim();
        const audioUrl = String(row[2]).trim();

        if (!titulo || !texto || !audioUrl) continue;

        meditacoes.push({
          titulo,
          texto,
          audioUrl,
          imagem: row[3] ? String(row[3]).trim() : undefined,
          duracao: row[4] ? String(row[4]).trim() : undefined,
          categoria: row[5] ? String(row[5]).trim() : undefined,
          tags: row[6] ? String(row[6]).trim() : undefined,
          plus: row[7] ? String(row[7]).trim() : undefined,
        });
      }

      console.log(`✅ Fetchado ${meditacoes.length} meditações da planilha`);
      return meditacoes;
    } catch (error) {
      console.error('❌ Erro ao buscar meditações:', error);
      throw error;
    }
  }
}

export default SheetsClient;
