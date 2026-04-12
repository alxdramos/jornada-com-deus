import { emailLayout, primaryButton, bigStat, verseBlock, BRAND } from './base';

export interface StreakMilestoneEmailData {
  name: string | null;
  streak: number;
}

const MILESTONES: Record<number, { verse: string; ref: string; msg: string }> = {
  7:   { verse: 'O Senhor é bom para quem espera nele.',          ref: 'Lamentações 3:25', msg: 'Uma semana inteira de dedicação. Você está no caminho certo.' },
  14:  { verse: 'Tudo posso naquele que me fortalece.',            ref: 'Filipenses 4:13',  msg: 'Duas semanas sem parar. Sua constância é inspiradora.' },
  21:  { verse: 'Sede firmes e constantes.',                       ref: '1 Coríntios 15:58', msg: '21 dias — o hábito espiritual já faz parte da sua vida.' },
  28:  { verse: 'Mais 2 dias para 1 mês completo. Você consegue!', ref: 'Continue assim',   msg: '28 dias de chama viva. A linha de chegada está logo ali.' },
  30:  { verse: 'A fé sem obras é morta — sua fé tem fruto!',      ref: 'Tiago 2:17',       msg: 'Um mês completo de jornada diária. Isso é extraordinário.' },
  60:  { verse: 'Guardei a fé. Há uma coroa da justiça reservada.', ref: '2 Timóteo 4:7-8', msg: '2 meses consecutivos. Sua árvore espiritual está florescendo.' },
  90:  { verse: 'O justo florescerá como a palmeira.',              ref: 'Salmos 92:12',     msg: '3 meses de dedicação. Você é uma inspiração para todos.' },
  100: { verse: 'Bem-aventurado o homem que persevera na provação.', ref: 'Tiago 1:12',     msg: '100 dias. Você entrou para a história da Jornada com Deus.' },
};

const MILESTONE_EMOJIS: Record<number, string> = {
  7: '⭐', 14: '🌟', 21: '💫', 28: '🔥', 30: '🏆', 60: '👑', 90: '🌳', 100: '💎',
};

export const STREAK_MILESTONES = [7, 14, 21, 28, 30, 60, 90, 100] as const;

export function streakMilestoneEmailHtml(data: StreakMilestoneEmailData): string {
  const firstName = data.name?.split(' ')[0] ?? 'amigo(a)';
  const milestone = MILESTONES[data.streak] ?? {
    verse: 'Persevera — cada dia de fé transforma sua vida.',
    ref: 'Continue assim',
    msg: `${data.streak} dias de dedicação espiritual contínua. Incrível!`,
  };
  const emoji = MILESTONE_EMOJIS[data.streak] ?? '🔥';

  const body = `
    <!-- Badge de conquista -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:20px;">
      <tr>
        <td align="center">
          <div style="display:inline-block;background:linear-gradient(135deg,${BRAND.goldBright},${BRAND.gold});color:white;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:6px 18px;border-radius:99px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            ${emoji} Marco Atingido
          </div>
        </td>
      </tr>
    </table>

    <h2 style="margin:0 0 8px;color:${BRAND.text};font-size:26px;font-weight:800;letter-spacing:-0.6px;font-family:Georgia,'Times New Roman',serif;text-align:center;">
      Parabéns, ${firstName}!
    </h2>
    <p style="margin:0 0 24px;color:${BRAND.textMuted};font-size:15px;line-height:1.7;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      ${milestone.msg}
    </p>

    <!-- Stat do streak -->
    ${bigStat(String(data.streak), 'dias consecutivos', emoji)}

    <!-- Versículo -->
    ${verseBlock(milestone.verse, milestone.ref)}

    <p style="margin:0;color:${BRAND.text};font-size:15px;line-height:1.8;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      Sua árvore espiritual está crescendo a cada dia. Continue e veja até onde ela chega. 🌳
    </p>

    ${primaryButton('Ver meu progresso', BRAND.appUrl)}
  `;

  return emailLayout(
    body,
    `${firstName}, você atingiu ${data.streak} dias seguidos na Jornada com Deus! ${emoji}`
  );
}

export function streakMilestoneEmailSubject(data: StreakMilestoneEmailData): string {
  const emoji = MILESTONE_EMOJIS[data.streak] ?? '🔥';
  const firstName = data.name?.split(' ')[0] ?? 'amigo(a)';
  return `${emoji} ${firstName}, ${data.streak} dias consecutivos na Jornada!`;
}
