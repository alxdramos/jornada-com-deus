"use server";

import { createCredentialUser } from "@/lib/credentials-db";

export interface RegisterState {
  success: boolean;
  error?: string;
}

/**
 * Server Action para registrar um novo usuário com e-mail e senha.
 * Chamada pelo RegisterForm no cliente.
 */
export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validações básicas
  if (!name || name.trim().length < 2) {
    return { success: false, error: "Informe um nome com pelo menos 2 letras." };
  }

  if (!email || !email.includes("@")) {
    return { success: false, error: "Informe um e-mail válido." };
  }

  if (!password || password.length < 6) {
    return { success: false, error: "A senha deve ter no mínimo 6 caracteres." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "As senhas não coincidem." };
  }

  try {
    await createCredentialUser({ email, name: name.trim(), password });
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.";
    return { success: false, error: message };
  }
}
