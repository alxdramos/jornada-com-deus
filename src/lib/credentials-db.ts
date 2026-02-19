/**
 * Store de credenciais server-side (arquivo JSON local).
 *
 * ⚠️  APENAS PARA DESENVOLVIMENTO / MVP
 * Em produção, substitua por um banco de dados real (PostgreSQL, MongoDB, etc.)
 * e use bcryptjs (já integrado) com custo ≥ 12 para os hashes de senha.
 *
 * O arquivo `data/credentials-users.json` é criado automaticamente e está
 * listado no .gitignore para não ser versionado.
 */

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// Caminho do arquivo JSON que armazena os usuários
const DB_FILE = path.join(process.cwd(), "data", "credentials-users.json");

// Custo do bcrypt — 12 é o mínimo recomendado para produção
const BCRYPT_ROUNDS = 12;

export interface CredentialUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  avatar?: string;
  createdAt: string;
}

// ─── Helpers de I/O ────────────────────────────────────────────────────────────

function readUsers(): CredentialUser[] {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as CredentialUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: CredentialUser[]): void {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf-8");
}

// ─── API pública ────────────────────────────────────────────────────────────────

/** Busca um usuário pelo e-mail (case-insensitive). */
export async function findUserByEmail(
  email: string
): Promise<CredentialUser | null> {
  const users = readUsers();
  return (
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

/**
 * Registra um novo usuário com a senha já criptografada.
 * Lança erro se o e-mail já estiver cadastrado.
 */
export async function createCredentialUser(data: {
  email: string;
  name: string;
  password: string;
}): Promise<CredentialUser> {
  const users = readUsers();

  const emailExists = users.some(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  );
  if (emailExists) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

  const newUser: CredentialUser = {
    id: randomUUID(),
    email: data.email.trim().toLowerCase(),
    name: data.name.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, newUser]);
  return newUser;
}

/**
 * Verifica se a senha em texto plano corresponde ao hash armazenado.
 * Retorna o usuário autenticado ou null se inválido.
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<CredentialUser | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) return null;

  return user;
}
