'use server'

import { createCredentialUser } from '@/lib/credentials-db'

interface RegisterState {
  success?: boolean
  error?: string
}

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''
  const confirmPassword = (formData.get('confirmPassword') as string | null) ?? ''

  if (name.length < 2) {
    return { success: false, error: 'O nome deve ter pelo menos 2 letras.' }
  }

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Informe um e-mail válido.' }
  }

  if (password.length < 6) {
    return { success: false, error: 'A senha deve ter pelo menos 6 caracteres.' }
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'As senhas não coincidem.' }
  }

  try {
    await createCredentialUser({ email, name, password })
    return { success: true }
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, error: err.message }
    }
    return { success: false, error: 'Erro ao criar conta. Tente novamente.' }
  }
}
