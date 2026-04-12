import { emailLayout, primaryButton, featureItem, verseBlock, divider, BRAND } from './base';

export interface WelcomeEmailData {
  name: string | null;
}

export function welcomeEmailHtml(data: WelcomeEmailData): string {
  const firstName = data.name?.split(' ')[0] ?? 'amigo(a)';

  const body = `
    <!-- Saudação principal -->
    <h2 style="margin:0 0 6px;color:${BRAND.text};font-size:28px;font-weight:800;letter-spacing:-0.8px;font-family:Georgia,'Times New Roman',serif;">
      Bem-vindo(a),<br />${firstName}! 🎉
    </h2>
    <p style="margin:0 0 28px;color:${BRAND.textMuted};font-size:16px;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      Sua jornada espiritual começa agora. Estamos muito felizes em caminhar com você.
    </p>

    <!-- Features -->
    <p style="margin:0 0 16px;color:${BRAND.text};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">O que você encontra no app</p>

    ${featureItem('🙏', 'Orações guiadas', 'Momentos profundos de conexão com Deus', BRAND.purpleLight)}
    ${featureItem('🧘', 'Meditações', 'Paz, silêncio e reflexão espiritual diária', '#F0FDF4')}
    ${featureItem('📖', 'Estudos bíblicos', 'Aprofunde sua fé com ensinamentos completos', '#FFF7ED')}
    ${featureItem('🌳', 'Árvore espiritual', 'Veja seu crescimento a cada dia concluído', BRAND.goldLight)}

    ${divider()}

    <!-- Versículo -->
    ${verseBlock(
      'O Senhor é o meu pastor; nada me faltará. Deitar-me faz em verdes pastos.',
      'Salmos 23:1–2'
    )}

    <!-- CTA -->
    ${primaryButton('Começar minha primeira jornada', BRAND.appUrl)}

    <p style="margin:20px 0 0;color:${BRAND.textLight};font-size:13px;line-height:1.6;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      Alguma dúvida? Responda este email — estamos aqui. 💜
    </p>
  `;

  return emailLayout(
    body,
    `${firstName}, sua caminhada com Deus começa agora. Orações, meditações e estudos bíblicos te esperam.`
  );
}

export function welcomeEmailSubject(name: string | null): string {
  const firstName = name?.split(' ')[0] ?? 'amigo(a)';
  return `Bem-vindo(a) à Jornada com Deus, ${firstName}! 🙏`;
}
