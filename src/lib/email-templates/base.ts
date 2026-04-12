// ─── Design System de Email — Jornada com Deus ───────────────────────────────
// Paleta: Purple #7C3AED · Gold #CA8A04 · Stone warm tones
// Compatível com: Gmail, Apple Mail, Outlook, Yahoo Mail

export const BRAND = {
  purple: '#7C3AED',
  purpleDark: '#5B21B6',
  purpleDeep: '#4C1D95',
  purpleLight: '#EDE9FE',
  purpleMid: '#DDD6FE',
  gold: '#CA8A04',
  goldLight: '#FEF3C7',
  goldBright: '#F59E0B',
  text: '#1C1917',
  textMuted: '#78716C',
  textLight: '#A8A29E',
  bg: '#F5F3FF',           // fundo levemente roxo para destacar o card
  white: '#FFFFFF',
  cardBg: '#FAFAF9',
  borderColor: '#E7E5E4',
  successGreen: '#059669',
  warningRed: '#DC2626',
  appUrl: 'https://app.minhajornadadiaria.com.br',
};

// ─── Layout principal ─────────────────────────────────────────────────────────

export function emailLayout(body: string, previewText: string = ''): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="pt-BR" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Jornada com Deus</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .email-card { width: 100% !important; }
      .email-body { padding: 28px 20px !important; }
      .email-header { padding: 28px 20px !important; }
      .btn-primary td { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .btn-primary a { display: block !important; text-align: center !important; }
      .feature-row td { display: block !important; width: 100% !important; padding-bottom: 12px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:${BRAND.bg};">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ''}

  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:${BRAND.bg};">
    <tr>
      <td align="center" style="padding:40px 16px 48px;">

        <!-- Card principal -->
        <table class="email-card" width="560" cellpadding="0" cellspacing="0" border="0" role="presentation"
          style="background-color:${BRAND.white};border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(124,58,237,0.12);">

          <!-- ══ HEADER ══════════════════════════════════════════════════════ -->
          <tr>
            <td class="email-header" style="background:linear-gradient(160deg,${BRAND.purpleDeep} 0%,${BRAND.purple} 55%,#8B5CF6 100%);padding:36px 40px 32px;text-align:center;position:relative;">

              <!-- Ornamento decorativo superior -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <!-- Círculo com ícone -->
                    <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;width:64px;height:64px;line-height:64px;text-align:center;font-size:30px;border:2px solid rgba(255,255,255,0.25);">🙏</div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin:0;color:${BRAND.white};font-size:22px;font-weight:800;letter-spacing:-0.5px;font-family:Georgia,'Times New Roman',serif;">Jornada com Deus</h1>
                    <!-- Linha ornamental dourada -->
                    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:10px auto 0;">
                      <tr>
                        <td style="width:24px;height:1px;background:rgba(255,255,255,0.25);"></td>
                        <td style="width:6px;height:6px;background:${BRAND.goldBright};border-radius:50%;padding:0 6px;"></td>
                        <td width="6" style="font-size:0;line-height:0;">&nbsp;</td>
                        <td style="width:6px;height:6px;background:${BRAND.white};border-radius:50%;"></td>
                        <td width="6" style="font-size:0;line-height:0;">&nbsp;</td>
                        <td style="width:6px;height:6px;background:${BRAND.goldBright};border-radius:50%;"></td>
                        <td style="width:24px;height:1px;background:rgba(255,255,255,0.25);"></td>
                      </tr>
                    </table>
                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;letter-spacing:0.5px;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Sua jornada espiritual diária</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ══ BODY ════════════════════════════════════════════════════════ -->
          <tr>
            <td class="email-body" style="padding:40px;background-color:${BRAND.white};">
              ${body}
            </td>
          </tr>

          <!-- ══ FOOTER ══════════════════════════════════════════════════════ -->
          <tr>
            <td style="background-color:${BRAND.cardBg};padding:28px 40px;border-top:1px solid ${BRAND.borderColor};">

              <!-- Links do app -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <a href="${BRAND.appUrl}" style="display:inline-block;margin:0 8px;color:${BRAND.purple};font-size:12px;font-weight:600;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Abrir App</a>
                    <span style="color:${BRAND.borderColor};">·</span>
                    <a href="${BRAND.appUrl}/suporte" style="display:inline-block;margin:0 8px;color:${BRAND.textMuted};font-size:12px;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Suporte</a>
                    <span style="color:${BRAND.borderColor};">·</span>
                    <a href="${BRAND.appUrl}/privacidade" style="display:inline-block;margin:0 8px;color:${BRAND.textMuted};font-size:12px;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Privacidade</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin:0;color:${BRAND.textLight};font-size:11px;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                      Você recebeu este email por ter uma conta na Jornada com Deus.<br />
                      © ${year} Jornada com Deus — feito com 💜 para sua fé
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Componentes reutilizáveis ────────────────────────────────────────────────

/** Botão CTA principal — largura total, gradiente roxo */
export function primaryButton(text: string, href: string): string {
  return `
  <table class="btn-primary" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%;margin-top:28px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" role="presentation">
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.purple} 0%,${BRAND.purpleDark} 100%);border-radius:12px;box-shadow:0 4px 12px rgba(124,58,237,0.35);">
              <a href="${href}" style="display:inline-block;padding:16px 40px;color:${BRAND.white};font-size:16px;font-weight:700;text-decoration:none;letter-spacing:-0.3px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${text} &rarr;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

/** Botão CTA dourado — para ações premium/urgentes */
export function goldButton(text: string, href: string): string {
  return `
  <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%;margin-top:28px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" role="presentation">
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.goldBright} 0%,${BRAND.gold} 100%);border-radius:12px;box-shadow:0 4px 12px rgba(202,138,4,0.35);">
              <a href="${href}" style="display:inline-block;padding:16px 40px;color:${BRAND.white};font-size:16px;font-weight:700;text-decoration:none;letter-spacing:-0.3px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${text} &rarr;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

/** Caixa de destaque roxa */
export function purpleBox(content: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:24px 0;">
    <tr>
      <td style="background:${BRAND.purpleLight};border-radius:14px;padding:20px 24px;border-left:4px solid ${BRAND.purple};">
        ${content}
      </td>
    </tr>
  </table>`;
}

/** Caixa dourada — para conquistas/celebrações */
export function goldBox(content: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:24px 0;">
    <tr>
      <td style="background:${BRAND.goldLight};border-radius:14px;padding:20px 24px;border-left:4px solid ${BRAND.goldBright};">
        ${content}
      </td>
    </tr>
  </table>`;
}

/** Versículo bíblico estilizado */
export function verseBlock(text: string, reference: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:24px 0;">
    <tr>
      <td style="background:linear-gradient(135deg,${BRAND.purpleDeep} 0%,${BRAND.purple} 100%);border-radius:14px;padding:24px 28px;text-align:center;">
        <p style="margin:0 0 4px;color:rgba(255,255,255,0.5);font-size:20px;line-height:1;">✦</p>
        <p style="margin:0 0 12px;color:${BRAND.white};font-size:15px;font-style:italic;line-height:1.7;font-family:Georgia,'Times New Roman',serif;">"${text}"</p>
        <p style="margin:0;color:${BRAND.goldBright};font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${reference}</p>
      </td>
    </tr>
  </table>`;
}

/** Item de feature com ícone em círculo colorido */
export function featureItem(emoji: string, title: string, desc: string, color = BRAND.purpleLight, iconColor = BRAND.purple): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:12px;" class="feature-row">
    <tr>
      <td width="48" valign="top" style="padding-right:14px;">
        <div style="width:44px;height:44px;background:${color};border-radius:12px;text-align:center;line-height:44px;font-size:20px;">${emoji}</div>
      </td>
      <td valign="middle">
        <p style="margin:0 0 2px;color:${BRAND.text};font-size:14px;font-weight:700;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${title}</p>
        <p style="margin:0;color:${BRAND.textMuted};font-size:13px;line-height:1.5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${desc}</p>
      </td>
    </tr>
  </table>`;
}

/** Divider ornamental */
export function divider(): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:28px 0;">
    <tr>
      <td style="height:1px;background:linear-gradient(90deg,transparent,${BRAND.borderColor} 30%,${BRAND.borderColor} 70%,transparent);"></td>
    </tr>
  </table>`;
}

/** Stat grande centralizado (streak, dias, etc.) */
export function bigStat(value: string, label: string, emoji: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:24px 0;">
    <tr>
      <td align="center" style="background:linear-gradient(160deg,${BRAND.purpleDeep},${BRAND.purple});border-radius:16px;padding:28px 20px;">
        <p style="margin:0 0 4px;font-size:36px;line-height:1;">${emoji}</p>
        <p style="margin:4px 0 0;color:${BRAND.white};font-size:52px;font-weight:900;line-height:1;letter-spacing:-2px;font-family:Georgia,'Times New Roman',serif;">${value}</p>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:14px;letter-spacing:0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${label}</p>
      </td>
    </tr>
  </table>`;
}
