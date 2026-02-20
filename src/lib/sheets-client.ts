import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

export interface SheetRow {
  titulo: string;
  texto: string;
  audioUrl: string;
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
}

export default SheetsClient;
