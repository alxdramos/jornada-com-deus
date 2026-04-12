import { emailLayout, primaryButton, bigStat, verseBlock, divider, BRAND } from './base';

export interface InactiveD3EmailData {
  name: string | null;
  currentStreak: number;
}

export function inactiveD3EmailHtml(data: InactiveD3EmailData): string {
  const firstName = data.name?.split(' ')[0] ?? 'amigo(a)';
  const hasStreak = data.currentStreak > 0;

  const body = `
    <h2 style="margin:0 0 8px;color:${BRAND.text};font-size:26px;font-weight:800;letter-spacing:-0.6px;font-family:Georgia,'Times New Roman',serif;">
      ${firstName}, sua árvore<br />sente sua falta 🌱
    </h2>
    <p style="margin:0 0 28px;color:${BRAND.textMuted};font-size:15px;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      Faz 3 dias que você não aparece. Cada dia de ausência é um dia que sua árvore espiritual poderia estar crescendo.
    </p>

    ${hasStreak
      ? bigStat(String(data.currentStreak), 'dias de sequência te esperando 🔥', '🔥')
      : `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:24px 0;">
          <tr>
            <td align="center" style="background:${BRAND.purpleLight};border-radius:16px;padding:24px;">
              <p style="margin:0;font-size:48px;line-height:1;">🌱</p>
              <p style="margin:8px 0 0;color:${BRAND.purple};font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Comece sua sequência hoje</p>
            </td>
          </tr>
        </table>`
    }

    <p style="margin:0;color:${BRAND.text};font-size:15px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      São apenas <strong>alguns minutos por dia</strong>. Uma meditação, uma oração — cada passo conta na sua jornada. 💜
    </p>

    ${divider()}

    ${verseBlock(
      'Perseverai em oração, ficando nela vigilantes e gratos.',
      'Colossenses 4:2'
    )}

    ${primaryButton('Retomar minha jornada agora', BRAND.appUrl)}

    <p style="margin:20px 0 0;color:${BRAND.textLight};font-size:13px;line-height:1.6;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      Sua fé, um passo por vez. 🙏
    </p>
  `;

  return emailLayout(
    body,
    `${firstName}, sua jornada espiritual sente sua falta. Volte hoje e continue crescendo.`
  );
}

export function inactiveD3EmailSubject(name: string | null): string {
  const firstName = name?.split(' ')[0] ?? 'amigo(a)';
  return `${firstName}, sua árvore espiritual sente sua falta 🌱`;
}
