'use server';

import { cookies } from 'next/headers';
import { createToken, verifyToken } from '@/lib/auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nuansaposadmin123';

/**
 * Handles the admin login authentication.
 */
export async function loginAction(password: string) {
  if (password === ADMIN_PASSWORD) {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const token = createToken({ role: 'admin', expiresAt });

    cookies().set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
    });

    return { success: true };
  }

  return { success: false, error: 'Kata sandi salah' };
}

/**
 * Logs out the admin by deleting the session cookie.
 */
export async function logoutAction() {
  cookies().set('admin_session', '', {
    path: '/',
    maxAge: 0,
  });
  return { success: true };
}

/**
 * Checks if the current request is authenticated.
 */
export async function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) return false;

  const payload = verifyToken(token);
  return payload !== null && payload.role === 'admin';
}
