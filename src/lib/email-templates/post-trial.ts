import { emailLayout, goldButton, purpleBox, featureItem, divider, BRAND } from './base';

export interface PostTrialEmailData {
  name: string | null;
  expiresInDays: number;
}

export function postTrialEmailHtml(data: PostTrialEmailData): string {
  const firstName = data.name?.split(' ')[0] ?? 'amigo(a)';
  const isExpired = data.expiresInDays <= 0;
  const isUrgent = data.expiresInDays <= 3;

  const urgencyColor = isExpired ? BRAND.warningRed : isUrgent ? '#D97706' : BRAND.gold;
  const urgencyBg = isExpired ? '#FEF2F2' : isUrgent ? '#FFFBEB' : BRAND.goldLight;
  const urgencyText = isExpired
    ? 'Sua assinatura expirou'
    : data.expiresInDays === 1
    ? 'Último dia do seu Jornada Plus!'
    : `Expira em ${data.expiresInDays} dias`;

  const body = `
    <!-- Badge de urgência -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:20px;">
      <tr>
        <td align="center">
          <div style="display:inline-block;background:${urgencyBg};color:${urgencyColor};font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:6px 18px;border-radius:99px;border:1px solid ${urgencyColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            ⏰ ${urgencyText}
          </div>
        </td>
      </tr>
    </table>

    <h2 style="margin:0 0 8px;color:${BRAND.text};font-size:26px;font-weight:800;letter-spacing:-0.6px;font-family:Georgia,'Times New Roman',serif;">
      ${firstName}, ${isExpired ? 'não perca sua jornada' : 'continue sua fé sem parar'} 💜
    </h2>
    <p style="margin:0 0 28px;color:${BRAND.textMuted};font-size:15px;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      ${isExpired
        ? 'Seu Jornada Plus expirou, mas você pode reativar agora e continuar de onde parou — sem perder nada do seu progresso.'
        : `Renove agora e garanta que sua jornada espiritual não seja interrompida.`
      }
    </p>

    <!-- Features Plus -->
    <p style="margin:0 0 16px;color:${BRAND.text};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Com o Jornada Plus</p>

    ${featureItem('✨', 'Conteúdo ilimitado', 'Meditações, orações e estudos sem restrição', BRAND.purpleLight)}
    ${featureItem('📖', 'Estudos completos', 'Séries bíblicas exclusivas para membros Plus', BRAND.goldLight)}
    ${featureItem('🌳', 'Progresso mantido', 'Sua árvore e streak continuam crescendo', '#F0FDF4')}
    ${featureItem('🚫', 'Zero anúncios', 'Experiência limpa e focada na sua fé', '#FFF7ED')}

    ${divider()}

    ${purpleBox(`
      <p style="margin:0 0 4px;color:${BRAND.purple};font-size:15px;font-weight:700;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        Sua fé merece continuidade 🙏
      </p>
      <p style="margin:0;color:${BRAND.textMuted};font-size:14px;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        Renovar leva menos de 1 minuto. Seu progresso, streak e árvore espiritual estão todos guardados.
      </p>
    `)}

    ${goldButton(
      isExpired ? 'Reativar minha assinatura' : 'Renovar agora',
      `${BRAND.appUrl}?renew=1`
    )}

    <p style="margin:20px 0 0;color:${BRAND.textLight};font-size:13px;line-height:1.6;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      Dúvidas? Responda este email — estamos aqui.
    </p>
  `;

  return emailLayout(
    body,
    `${urgencyText}. Renove o Jornada Plus e continue sua caminhada com Deus.`
  );
}

export function postTrialEmailSubject(data: PostTrialEmailData): string {
  if (data.expiresInDays <= 0) return '⚠️ Sua assinatura Jornada Plus expirou';
  if (data.expiresInDays === 1) return '⏰ Último dia do seu Jornada Plus!';
  return `⏰ Seu Jornada Plus expira em ${data.expiresInDays} dias`;
}
