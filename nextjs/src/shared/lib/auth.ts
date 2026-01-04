import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface JWTPayload {
  userId: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password)
  
  return db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })
}

export async function authenticateUser(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  return user
}
