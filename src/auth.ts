// src/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Защита на уровне провайдера: принудительно очищаем email перед поиском в Neon
        const safeEmail = (credentials.email as string).trim().toLowerCase();

        // Ищем пользователя в базе данных Neon
        const user = await db.user.findUnique({
          where: { email: safeEmail },
        });

        if (!user || !user.password) return null;

        // Проверяем хэш пароля
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) return null;

        // Приводим к any, чтобы обойти строгую проверку локальных типов Prisma
        const dbUser = user as any;

        // Возвращаем объект, который запишется в сессию
        return {
          id: dbUser.id,
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          role: dbUser.role || 'USER', // Гарантируем передачу роли
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // При успешном входе переносим роль из authorize() в JWT-токен
      if (user) {
        token.id = user.id;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      // Из JWT-токена переносим роль прямо в сессию приложения
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
});