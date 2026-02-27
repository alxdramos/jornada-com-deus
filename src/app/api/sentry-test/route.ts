import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

// Rota temporária de teste do Sentry — remover após validar
export async function GET() {
  try {
    // 1. Envia uma mensagem de teste
    const msgId = Sentry.captureMessage("🧪 Sentry teste manual — Jornada com Deus", "info");

    // 2. Simula um erro real para testar captura de exceptions
    const testError = new Error("Sentry test error — pode ignorar este erro");
    testError.name = "SentryTestError";
    const errId = Sentry.captureException(testError);

    // 3. Força o flush para garantir envio imediato
    await Sentry.flush(3000);

    return NextResponse.json({
      ok: true,
      message: "Eventos enviados ao Sentry",
      messageEventId: msgId,
      errorEventId: errId,
      dsnConfigured: !!process.env.SENTRY_DSN,
      instructions: "Verifique o dashboard do Sentry — dois eventos devem aparecer em segundos.",
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: String(e),
      dsnConfigured: !!process.env.SENTRY_DSN,
    }, { status: 500 });
  }
}
