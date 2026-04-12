import { emailLayout, goldButton, goldBox, featureItem, verseBlock, divider, BRAND } from './base';

export interface SubscriptionConfirmedEmailData {
  name: string | null;
  planInterval: string;
  expiresAt: string;
}

const INTERVAL_LABEL: Record<string, string> = {
  mensal: 'Mensal', trimestral: 'Trimestral', anual: 'Anual',
  monthly: 'Mensal', quarterly: 'Trimestral', annual: 'Anual',
};

export function subscriptionConfirmedEmailHtml(data: SubscriptionConfirmedEmailData): string {
  const firstName = data.name?.split(' ')[0] ?? 'amigo(a)';
  const planLabel = INTERVAL_LABEL[data.planInterval] ?? data.planInterval;
  const expiresFormatted = new Date(data.expiresAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const body = `
    <!-- Badge Plus -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <div style="display:inline-block;background:linear-gradient(135deg,${BRAND.goldBright},${BRAND.gold});color:white;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:6px 18px;border-radius:99px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            ⭐ Jornada Plus Ativo
          </div>
        </td>
      </tr>
    </table>

    <h2 style="margin:0 0 8px;color:${BRAND.text};font-size:26px;font-weight:800;letter-spacing:-0.6px;font-family:Georgia,'Times New Roman',serif;text-align:center;">
      Você é Plus agora, ${firstName}!
    </h2>
    <p style="margin:0 0 28px;color:${BRAND.textMuted};font-size:15px;line-height:1.7;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      Obrigado pela confiança. Sua fé merece o melhor — e agora você tem acesso completo.
    </p>

    <!-- Detalhes da assinatura -->
    ${goldBox(`
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
        <tr>
          <td style="padding:4px 0;">
            <span style="color:${BRAND.textMuted};font-size:13px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Plano</span>
          </td>
          <td align="right" style="padding:4px 0;">
            <strong style="color:${BRAND.text};font-size:14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Jornada Plus — ${planLabel}</strong>
          </td>
        </tr>
        <tr>
          <td style="padding:4px 0;">
            <span style="color:${BRAND.textMuted};font-size:13px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Válido até</span>
          </td>
          <td align="right" style="padding:4px 0;">
            <strong style="color:${BRAND.gold};font-size:14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${expiresFormatted}</strong>
          </td>
        </tr>
      </table>
    `)}

    <!-- O que foi desbloqueado -->
    <p style="margin:0 0 16px;color:${BRAND.text};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">O que você desbloqueou</p>

    ${featureItem('🎵', 'Conteúdo ilimitado', 'Meditações, orações e estudos sem restrições', BRAND.purpleLight)}
    ${featureItem('⭐', 'Conteúdo exclusivo Plus', 'Séries especiais só para membros Plus', BRAND.goldLight)}
    ${featureItem('🚫', 'Zero anúncios', 'Experiência limpa e sem interrupções', '#F0FDF4')}
    ${featureItem('🚀', 'Acesso antecipado', 'Primeiros a conhecer novos recursos', '#FFF7ED')}

    ${divider()}

    ${verseBlock(
      'Tudo posso naquele que me fortalece.',
      'Filipenses 4:13'
    )}

    ${goldButton('Acessar meu Jornada Plus', BRAND.appUrl)}

    <p style="margin:20px 0 0;color:${BRAND.textLight};font-size:13px;line-height:1.6;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      Dúvidas sobre sua assinatura? Responda este email.
    </p>
  `;

  return emailLayout(body, `${firstName}, sua assinatura Jornada Plus está ativa! Plano ${planLabel}.`);
}

export function subscriptionConfirmedEmailSubject(): string {
  return '⭐ Sua assinatura Jornada Plus está ativa!';
}
