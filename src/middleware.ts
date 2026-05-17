// src/middleware.ts
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;
  const { nextUrl } = req;

  const isProfileRoute = nextUrl.pathname.startsWith('/profile');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');

  // Защита профиля
  if (isProfileRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  // Защита админки: если не вошел ИЛИ зашел, но роль не ADMIN
  if (isAdminRoute && (!isLoggedIn || userRole !== 'ADMIN')) {
    return NextResponse.redirect(new URL('/', nextUrl)); // Выкидываем на главную
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};