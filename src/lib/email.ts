import { Resend } from 'resend';

// ─── Cliente Resend ───────────────────────────────────────────────────────────

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY não configurado');
    _resend = new Resend(apiKey);
  }
  return _resend;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? 'Jornada com Deus <noreply@minhajornadadiaria.com.br>';
export const EMAIL_REPLY_TO = 'suporte@minhajornadadiaria.com.br';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  tags?: { name: string; value: string }[];
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ─── sendEmail ────────────────────────────────────────────────────────────────

export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: EMAIL_REPLY_TO,
      tags: opts.tags,
    });

    if (error) {
      console.error('[email] Erro Resend:', error);
      return { success: false, error: error.message };
    }

    console.log(`[email] Enviado para ${opts.to} — id: ${data?.id}`);
    return { success: true, id: data?.id ?? undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[email] Exceção ao enviar:', message);
    return { success: false, error: message };
  }
}
