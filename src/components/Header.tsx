// src/components/Header.tsx
import Link from 'next/link';
import { auth, signOut } from '@/auth';

export default async function Header() {
  const session = await auth();
  const user = session?.user as any;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:bg-indigo-700 transition-colors">
            H
          </span>
          <span className="text-xl font-extrabold tracking-tight text-zinc-900">
            Hotel<span className="text-indigo-600">Space</span>
          </span>
        </Link>

        {/* Меню навигации */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <Link href="/hotels" className="hover:text-zinc-900 transition-colors">Отели</Link>
          <Link href="/about" className="hover:text-zinc-900 transition-colors">О нас</Link>
        </nav>

        {/* Блок пользователя */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              
              {/* Кнопка Админки — появляется только если роль ADMIN */}
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                >
                  ⚙️ Админка
                </Link>
              )}

              <Link 
                href="/profile" 
                className="text-sm font-bold text-zinc-700 hover:text-indigo-600 transition-colors flex items-center gap-2 bg-zinc-100 px-4 py-2 rounded-xl"
              >
                👤 {user.firstName || 'Кабинет'}
              </Link>
              
              <form action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}>
                <button 
                  type="submit"
                  className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer px-2 py-2"
                >
                  Выйти
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-colors px-3 py-2"
              >
                Войти
              </Link>
              <Link 
                href="/auth/register" 
                className="text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Создать аккаунт
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}