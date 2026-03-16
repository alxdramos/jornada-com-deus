import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const DB_PATH = path.join(process.cwd(), 'data', 'credentials-users.json')

export interface CredentialUser {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: string
}

function readUsers(): CredentialUser[] {
  try {
    if (!fs.existsSync(DB_PATH)) return []
    const raw = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(raw) as CredentialUser[]
  } catch {
    return null as unknown as CredentialUser[]
  }
}

export async function findUserByEmail(email: string): Promise<CredentialUser | null> {
  try {
    const users = readUsers()
    if (!users) return null
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  } catch {
    return null
  }
}

export async function createCredentialUser(data: {
  email: string
  name: string
  password: string
}): Promise<CredentialUser> {
  const existing = await findUserByEmail(data.email)
  if (existing) {
    throw new Error('Este e-mail já está cadastrado.')
  }

  const passwordHash = await bcrypt.hash(data.password, 12)

  let users: CredentialUser[] = []
  if (fs.existsSync(DB_PATH)) {
    try {
      users = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
    } catch {
      users = []
    }
  } else {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
  }

  const newUser: CredentialUser = {
    id: uuidv4(),
    email: data.email.toLowerCase(),
    name: data.name,
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8')

  return newUser
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<CredentialUser | null> {
  const user = await findUserByEmail(email)
  if (!user) return null

  const match = await bcrypt.compare(password, user.passwordHash)
  return match ? user : null
}
