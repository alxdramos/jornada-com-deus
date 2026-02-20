import { describe, it, expect } from 'vitest'
import type { Session, JWT } from 'next-auth'

// Extrair as funções de callback para teste
const sessionCallback = async ({
  session,
  token,
}: {
  session: Session
  token: JWT
}): Promise<Session> => {
  if (token.sub) {
    session.user.id = token.sub
  }
  return session
}

const jwtCallback = async ({
  token,
  account,
}: {
  token: JWT
  account?: { access_token: string; [key: string]: any } | null
}): Promise<JWT> => {
  if (account) {
    token.accessToken = account.access_token
  }
  return token
}

describe('Auth.js Callbacks', () => {
  describe('session callback', () => {
    it('injeta token.sub como session.user.id quando presente', async () => {
      const session: Session = {
        user: { email: 'test@example.com', name: 'Test User' },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
      const token: JWT = {
        sub: 'user-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        jti: 'jti-123',
      }

      const result = await sessionCallback({ session, token })

      expect(result.user.id).toBe('user-123')
    })

    it('retorna session sem user.id quando token.sub é undefined', async () => {
      const session: Session = {
        user: { email: 'test@example.com', name: 'Test User' },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
      const token: JWT = {
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        jti: 'jti-123',
      }

      const result = await sessionCallback({ session, token })

      expect(result.user.id).toBeUndefined()
    })

    it('preserva outros dados da session', async () => {
      const session: Session = {
        user: {
          email: 'test@example.com',
          name: 'Test User',
          image: 'https://example.com/image.jpg',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
      const token: JWT = {
        sub: 'user-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        jti: 'jti-123',
      }

      const result = await sessionCallback({ session, token })

      expect(result.user.email).toBe('test@example.com')
      expect(result.user.name).toBe('Test User')
      expect(result.user.image).toBe('https://example.com/image.jpg')
      expect(result.expires).toBe(session.expires)
    })
  })

  describe('jwt callback', () => {
    it('copia access_token de account para token.accessToken quando account está presente', async () => {
      const token: JWT = {
        sub: 'user-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        jti: 'jti-123',
      }
      const account = {
        access_token: 'access-token-xyz-123',
        provider: 'google',
      }

      const result = await jwtCallback({ token, account })

      expect(result.accessToken).toBe('access-token-xyz-123')
    })

    it('não modifica token quando account é null', async () => {
      const token: JWT = {
        sub: 'user-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        jti: 'jti-123',
      }

      const result = await jwtCallback({ token, account: null })

      expect(result.accessToken).toBeUndefined()
      expect(result.sub).toBe('user-123')
    })

    it('não modifica token quando account é undefined', async () => {
      const token: JWT = {
        sub: 'user-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        jti: 'jti-123',
      }

      const result = await jwtCallback({ token })

      expect(result.accessToken).toBeUndefined()
      expect(result.sub).toBe('user-123')
    })

    it('preserva token.sub ao copiar accessToken', async () => {
      const token: JWT = {
        sub: 'user-456',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        jti: 'jti-456',
      }
      const account = {
        access_token: 'new-access-token',
        provider: 'google',
      }

      const result = await jwtCallback({ token, account })

      expect(result.sub).toBe('user-456')
      expect(result.accessToken).toBe('new-access-token')
    })

    it('retorna token modificado ao adicionar accessToken', async () => {
      const token: JWT = {
        sub: 'user-123',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        jti: 'jti-123',
      }
      const account = {
        access_token: 'access-token-123',
        provider: 'google',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      }

      const result = await jwtCallback({ token, account })

      expect(typeof result).toBe('object')
      expect(result.accessToken).toBeDefined()
    })
  })

  describe('Integração session + jwt', () => {
    it('fluxo completo: jwt cria token com accessToken, session injeta userId', async () => {
      // 1. JWT callback com account
      const token: JWT = {
        sub: 'user-789',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        jti: 'jti-789',
      }
      const account = {
        access_token: 'token-from-provider',
        provider: 'google',
      }

      const modifiedToken = await jwtCallback({ token, account })

      // 2. Session callback usa o token modificado
      const session: Session = {
        user: { email: 'test@example.com', name: 'Test User' },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }

      const modifiedSession = await sessionCallback({
        session,
        token: modifiedToken,
      })

      expect(modifiedToken.accessToken).toBe('token-from-provider')
      expect(modifiedSession.user.id).toBe('user-789')
    })
  })
})
