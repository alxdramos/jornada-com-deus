import { describe, it, expect, beforeEach, vi } from 'vitest'
import { registerUser } from '../register'

// Mock credentials-db
vi.mock('@/lib/credentials-db', () => ({
  createCredentialUser: vi.fn(),
}))

import { createCredentialUser } from '@/lib/credentials-db'

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createFormData = (data: Record<string, string>) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.set(key, value)
    })
    return formData
  }

  describe('Validação de nome', () => {
    it('retorna erro quando nome é vazio', async () => {
      const formData = createFormData({
        name: '',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('nome')
      expect(result.error).toContain('2 letras')
    })

    it('retorna erro quando nome tem apenas 1 letra', async () => {
      const formData = createFormData({
        name: 'A',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('nome')
    })

    it('retorna erro quando nome tem apenas espaços em branco', async () => {
      const formData = createFormData({
        name: '   ',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('nome')
    })

    it('aceita nome com 2 ou mais caracteres', async () => {
      vi.mocked(createCredentialUser).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'AB',
        passwordHash: 'hashed',
        createdAt: new Date().toISOString(),
      })

      const formData = createFormData({
        name: 'AB',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(true)
    })
  })

  describe('Validação de email', () => {
    it('retorna erro quando email é vazio', async () => {
      const formData = createFormData({
        name: 'Test User',
        email: '',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('e-mail')
      expect(result.error).toContain('válido')
    })

    it('retorna erro quando email não tem @', async () => {
      const formData = createFormData({
        name: 'Test User',
        email: 'testexample.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('e-mail')
    })

    it('aceita email válido', async () => {
      vi.mocked(createCredentialUser).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed',
        createdAt: new Date().toISOString(),
      })

      const formData = createFormData({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(true)
    })
  })

  describe('Validação de senha', () => {
    it('retorna erro quando senha é vazia', async () => {
      const formData = createFormData({
        name: 'Test User',
        email: 'test@example.com',
        password: '',
        confirmPassword: '',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('senha')
      expect(result.error).toContain('6 caracteres')
    })

    it('retorna erro quando senha tem menos de 6 caracteres', async () => {
      const formData = createFormData({
        name: 'Test User',
        email: 'test@example.com',
        password: 'pass5',
        confirmPassword: 'pass5',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('senha')
    })

    it('aceita senha com 6 ou mais caracteres', async () => {
      vi.mocked(createCredentialUser).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed',
        createdAt: new Date().toISOString(),
      })

      const formData = createFormData({
        name: 'Test User',
        email: 'test@example.com',
        password: 'pass123',
        confirmPassword: 'pass123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(true)
    })
  })

  describe('Validação de confirmação de senha', () => {
    it('retorna erro quando senhas não coincidem', async () => {
      const formData = createFormData({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password456',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('senhas')
      expect(result.error).toContain('não coincidem')
    })

    it('sucesso quando senhas coincidem', async () => {
      vi.mocked(createCredentialUser).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed',
        createdAt: new Date().toISOString(),
      })

      const formData = createFormData({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(true)
    })
  })

  describe('Email duplicado', () => {
    it('retorna erro quando email já existe', async () => {
      const errorMessage = 'Este e-mail já está cadastrado.'
      vi.mocked(createCredentialUser).mockRejectedValue(new Error(errorMessage))

      const formData = createFormData({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe(errorMessage)
    })
  })

  describe('Erros desconhecidos', () => {
    it('retorna erro genérico quando erro é não-Error', async () => {
      vi.mocked(createCredentialUser).mockRejectedValue('Unknown error')

      const formData = createFormData({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Erro ao criar conta. Tente novamente.')
    })

    it('retorna mensagem do erro quando é Error', async () => {
      const customError = new Error('Custom error message')
      vi.mocked(createCredentialUser).mockRejectedValue(customError)

      const formData = createFormData({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Custom error message')
    })
  })

  describe('Fluxo de sucesso', () => {
    it('registra usuário com sucesso com dados válidos', async () => {
      vi.mocked(createCredentialUser).mockResolvedValue({
        id: 'new-user-id',
        email: 'newuser@example.com',
        name: 'New User',
        passwordHash: 'hashed-password123',
        createdAt: new Date().toISOString(),
      })

      const formData = createFormData({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()
      expect(vi.mocked(createCredentialUser)).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123',
      })
    })

    it('trim nome antes de enviar ao banco', async () => {
      vi.mocked(createCredentialUser).mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed',
        createdAt: new Date().toISOString(),
      })

      const formData = createFormData({
        name: '  Test User  ',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      const result = await registerUser({}, formData)

      expect(result.success).toBe(true)
      expect(vi.mocked(createCredentialUser)).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test User',
        })
      )
    })
  })
})
