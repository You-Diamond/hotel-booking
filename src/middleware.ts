// src/middleware.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

// Создаем легковесный экземпляр auth специально для Edge-окружения Vercel
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;
  const { nextUrl } = req;

  const isProfileRoute = nextUrl.pathname.startsWith('/profile');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');

  // Защита профиля (хотя у вас она уже частично есть в authorized, здесь дублируем для надежности)
  if (isProfileRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  // Защита админки: если не вошел ИЛИ вошел, но роль не ADMIN
  if (isAdminRoute && (!isLoggedIn || userRole !== 'ADMIN')) {
    return NextResponse.redirect(new URL('/', nextUrl)); 
  }

  return NextResponse.next();
});

export const config = {
  // Запускаем middleware для всех страниц, кроме статики, картинок и API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};