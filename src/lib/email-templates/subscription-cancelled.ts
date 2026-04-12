import { emailLayout, primaryButton, purpleBox, featureItem, verseBlock, divider, BRAND } from './base';

export interface SubscriptionCancelledEmailData {
  name: string | null;
}

export function subscriptionCancelledEmailHtml(data: SubscriptionCancelledEmailData): string {
  const firstName = data.name?.split(' ')[0] ?? 'amigo(a)';

  const body = `
    <h2 style="margin:0 0 8px;color:${BRAND.text};font-size:26px;font-weight:800;letter-spacing:-0.6px;font-family:Georgia,'Times New Roman',serif;">
      Sentiremos sua falta,<br />${firstName} 🙏
    </h2>
    <p style="margin:0 0 28px;color:${BRAND.textMuted};font-size:15px;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      Sua assinatura <strong>Jornada Plus</strong> foi cancelada. Seu acesso continua até o final do período pago — aproveite.
    </p>

    <!-- O que permanece gratuito -->
    <p style="margin:0 0 16px;color:${BRAND.text};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Você ainda pode contar com</p>

    ${featureItem('🙏', 'Orações e meditações', 'Acesso ao conteúdo gratuito do app', BRAND.purpleLight)}
    ${featureItem('🌳', 'Sua árvore espiritual', 'Progresso e streak continuam guardados', '#F0FDF4')}
    ${featureItem('📖', 'Estudos básicos', 'Estudos bíblicos gratuitos disponíveis', '#FFF7ED')}

    ${divider()}

    ${verseBlock(
      'Perseverai em oração, ficando nela vigilantes e gratos.',
      'Colossenses 4:2'
    )}

    <!-- CTA para reativar -->
    ${purpleBox(`
      <p style="margin:0 0 6px;color:${BRAND.purple};font-size:15px;font-weight:700;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Cancelou por engano?</p>
      <p style="margin:0;color:${BRAND.textMuted};font-size:14px;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Reativar sua assinatura leva menos de 1 minuto. Sua fé merece continuidade.</p>
    `)}

    ${primaryButton('Reativar minha assinatura', `${BRAND.appUrl}?reactivate=1`)}

    <p style="margin:20px 0 0;color:${BRAND.textLight};font-size:13px;line-height:1.6;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      Ficou com alguma dúvida? Responda este email. 💜
    </p>
  `;

  return emailLayout(body, `Sua assinatura Plus foi cancelada. Continue sua jornada gratuitamente.`);
}

export function subscriptionCancelledEmailSubject(): string {
  return 'Sua assinatura Jornada Plus foi cancelada';
}
