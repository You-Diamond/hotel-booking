// src/actions/auth-actions.ts
'use server';

import { db } from '@/lib/db';
import { signIn } from '@/auth';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';

// РЕГИСТРАЦИЯ
export async function registerUser(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const rawEmail = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!firstName || !lastName || !rawEmail || !password) {
    return { success: false, error: 'Пожалуйста, заполните все поля' };
  }

  // Защита: нормализуем email
  const email = rawEmail.trim().toLowerCase();

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: 'Пользователь с таким Email уже зарегистрирован' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });
  } catch (error) {
    return { success: false, error: 'Произошла ошибка при сохранении данных' };
  }

  // Редирект выносим за пределы блока try/catch, так как Next.js обрабатывает редиректы через внутренние исключения
  redirect('/auth/login?success=true');
}

// ВХОД
export async function loginUser(formData: FormData) {
  const rawEmail = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!rawEmail || !password) {
    return { success: false, error: 'Заполните все поля' };
  }

  // Защита от пробелов и регистра
  const email = rawEmail.trim().toLowerCase();

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });
    
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Неверный Email или пароль' };
        default:
          return { success: false, error: 'Что-то пошло не так. Попробуйте снова' };
      }
    }
    
    // ВНИМАНИЕ: Ошибки Next.js Redirect нельзя гасить, их нужно выбрасывать дальше,
    // иначе встроенный механизм перенаправления Next.js сломается!
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    return { success: false, error: 'Ошибка сервера при авторизации' };
  }
}