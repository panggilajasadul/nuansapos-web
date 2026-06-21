import crypto from 'crypto';

const SECRET = process.env.SESSION_SECRET || 'fallback-secret-for-development-nuansapos-2026';

export interface SessionPayload {
  role: string;
  expiresAt: number;
}

/**
 * Creates a simple, secure HMAC-signed JWT-like token.
 */
export function createToken(payload: SessionPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

/**
 * Verifies the token integrity and expiration.
 */
export function verifyToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (Date.now() > payload.expiresAt) {
      return null; // Expired
    }
    
    return payload;
  } catch (e) {
    return null;
  }
}
