import * as fs from 'fs';
import * as path from 'path';

export interface ImageMapping {
  titulo: string;
  imagem: {
    background: string;
    icon: string; // Mesma do background
  };
}

export interface ImageState {
  mappings: ImageMapping[];
  usedImages: string[];
  availableImages: string[];
  lastUpdated: string;
}

export class ImageMapper {
  private imagesDir: string;
  private stateFile: string;
  private state: ImageState;

  constructor(imagesDir: string = '/mnt/c/Users/User/Documents/Meu projeto/Imagens Paisagem') {
    this.imagesDir = imagesDir;
    this.stateFile = path.join(path.dirname(imagesDir), '.image-state.json');
    this.state = this.loadState();
  }

  /**
   * Carrega o estado anterior (imagens já usadas)
   */
  private loadState(): ImageState {
    if (fs.existsSync(this.stateFile)) {
      try {
        const data = fs.readFileSync(this.stateFile, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        console.warn('⚠️  Erro ao carregar state anterior, começando do zero');
      }
    }

    return {
      mappings: [],
      usedImages: [],
      availableImages: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Salva o estado (imagens usadas)
   */
  private saveState(): void {
    fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
    console.log('💾 State de imagens salvo');
  }

  /**
   * Obtém lista de imagens disponíveis
   */
  private getAvailableImages(): string[] {
    if (!fs.existsSync(this.imagesDir)) {
      throw new Error(`Diretório de imagens não encontrado: ${this.imagesDir}`);
    }

    const files = fs.readdirSync(this.imagesDir);
    return files
      .filter((f) => /\.(png|jpg|jpeg|gif)$/i.test(f))
      .sort();
  }

  /**
   * Seleciona uma imagem aleatória sem repetir
   */
  private selectRandomImage(): string {
    const available = this.getAvailableImages();

    // Se todas as imagens já foram usadas, reseta
    if (this.state.usedImages.length >= available.length) {
      console.log('🔄 Todas as imagens usadas, reiniciando rotação');
      this.state.usedImages = [];
    }

    // Encontra uma imagem não usada
    const unused = available.filter((img) => !this.state.usedImages.includes(img));

    if (unused.length === 0) {
      throw new Error('Nenhuma imagem disponível');
    }

    const selected = unused[Math.floor(Math.random() * unused.length)];
    this.state.usedImages.push(selected);

    return selected;
  }

  /**
   * Mapeia orações para imagens
   */
  mapOracoes(titulos: string[]): ImageMapping[] {
    const mappings: ImageMapping[] = [];

    for (const titulo of titulos) {
      // Verifica se já foi mapeada
      const existing = this.state.mappings.find((m) => m.titulo === titulo);
      if (existing) {
        mappings.push(existing);
        continue;
      }

      // Seleciona nova imagem
      const imgName = this.selectRandomImage();
      const mapping: ImageMapping = {
        titulo,
        imagem: {
          background: imgName,
          icon: imgName, // Mesma imagem para ambos
        },
      };

      mappings.push(mapping);
      this.state.mappings.push(mapping);
    }

    this.state.lastUpdated = new Date().toISOString();
    this.saveState();

    return mappings;
  }

  /**
   * Obtém mapeamento para um título específico
   */
  getMapping(titulo: string): ImageMapping | undefined {
    return this.state.mappings.find((m) => m.titulo === titulo);
  }

  /**
   * Reseta todo o mapeamento (para reiniciar)
   */
  reset(): void {
    this.state = {
      mappings: [],
      usedImages: [],
      availableImages: this.getAvailableImages(),
      lastUpdated: new Date().toISOString(),
    };
    this.saveState();
    console.log('🔄 Mapeamento de imagens resetado');
  }

  /**
   * Retorna o estado atual
   */
  getState(): ImageState {
    return this.state;
  }
}

export default ImageMapper;
