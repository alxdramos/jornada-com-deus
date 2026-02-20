import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { CredentialUser } from '../credentials-db'

// Mock apenas fs antes de importar credentials-db
vi.mock('fs')

import fs from 'fs'
import bcrypt from 'bcryptjs'
import {
  findUserByEmail,
  createCredentialUser,
  verifyCredentials,
} from '../credentials-db'

describe('credentials-db', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('findUserByEmail', () => {
    it('retorna o usuário quando encontrado (case-insensitive)', async () => {
      const mockUsers: CredentialUser[] = [
        {
          id: 'user-1',
          email: 'user@example.com',
          name: 'Test User',
          passwordHash: 'hashed-pass',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ]

      vi.spyOn(fs, 'existsSync').mockReturnValue(true)
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockUsers) as any)

      const result = await findUserByEmail('USER@EXAMPLE.COM')
      expect(result).toEqual(mockUsers[0])
    })

    it('retorna null quando usuário não existe', async () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true)
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify([]) as any)

      const result = await findUserByEmail('nonexistent@example.com')
      expect(result).toBeNull()
    })

    it('retorna null quando arquivo não existe', async () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false)

      const result = await findUserByEmail('test@example.com')
      expect(result).toBeNull()
    })

    it('retorna null quando arquivo está corrompido', async () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true)
      vi.spyOn(fs, 'readFileSync').mockReturnValue('invalid json {' as any)

      const result = await findUserByEmail('test@example.com')
      expect(result).toBeNull()
    })
  })

  describe('createCredentialUser', () => {
    it('cria um usuário com sucesso', async () => {
      const mockUsers: CredentialUser[] = []

      vi.spyOn(fs, 'existsSync').mockReturnValue(true)
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockUsers) as any)
      const hashSpy = vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password123' as any)

      const result = await createCredentialUser({
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      })

      expect(result.email).toBe('new@example.com')
      expect(result.name).toBe('New User')
      expect(result.passwordHash).toBe('hashed-password123')
      expect(result.createdAt).toBeDefined()
      expect(hashSpy).toHaveBeenCalledWith('password123', 12)
    })

    it('cria diretório se não existir', async () => {
      const mockUsers: CredentialUser[] = []

      vi.spyOn(fs, 'existsSync').mockReturnValue(false)
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockUsers) as any)
      const mkdirSpy = vi.spyOn(fs, 'mkdirSync').mockReturnValue(undefined as any)
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-pass' as any)
      vi.spyOn(fs, 'writeFileSync').mockReturnValue(undefined as any)

      await createCredentialUser({
        email: 'test@example.com',
        name: 'Test',
        password: 'pass123',
      })

      expect(mkdirSpy).toHaveBeenCalledWith(expect.any(String), {
        recursive: true,
      })
    })

    it('lança erro se email já existe', async () => {
      const mockUsers: CredentialUser[] = [
        {
          id: 'user-1',
          email: 'existing@example.com',
          name: 'Existing User',
          passwordHash: 'hashed-pass',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ]

      vi.spyOn(fs, 'existsSync').mockReturnValue(true)
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockUsers) as any)

      await expect(
        createCredentialUser({
          email: 'EXISTING@EXAMPLE.COM',
          name: 'New User',
          password: 'password123',
        })
      ).rejects.toThrow('Este e-mail já está cadastrado.')
    })

    it('normaliza email para lowercase', async () => {
      const mockUsers: CredentialUser[] = []

      vi.spyOn(fs, 'existsSync').mockReturnValue(true)
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockUsers) as any)
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-pass' as any)
      vi.spyOn(fs, 'writeFileSync').mockReturnValue(undefined as any)

      const result = await createCredentialUser({
        email: 'TEST@EXAMPLE.COM',
        name: 'Test User',
        password: 'password123',
      })

      expect(result.email).toBe('test@example.com')
    })
  })

  describe('verifyCredentials', () => {
    it('retorna usuário com credenciais corretas', async () => {
      const mockUsers: CredentialUser[] = [
        {
          id: 'user-1',
          email: 'user@example.com',
          name: 'Test User',
          passwordHash: 'hashed-password123',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ]

      vi.spyOn(fs, 'existsSync').mockReturnValue(true)
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockUsers) as any)
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as any)

      const result = await verifyCredentials('user@example.com', 'password123')
      expect(result).toEqual(mockUsers[0])
    })

    it('retorna null com senha errada', async () => {
      const mockUsers: CredentialUser[] = [
        {
          id: 'user-1',
          email: 'user@example.com',
          name: 'Test User',
          passwordHash: 'hashed-password123',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ]

      vi.spyOn(fs, 'existsSync').mockReturnValue(true)
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockUsers) as any)
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(false as any)

      const result = await verifyCredentials('user@example.com', 'wrongpassword')
      expect(result).toBeNull()
    })

    it('retorna null com email inexistente', async () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true)
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify([]) as any)

      const result = await verifyCredentials('nonexistent@example.com', 'password123')
      expect(result).toBeNull()
    })
  })
})
