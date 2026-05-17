// src/app/auth/login/page.tsx
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { loginUser } from '@/actions/auth-actions';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      // Вызываем наш обновленный Server Action, который возвращает объект вместо throw
      const result = await loginUser(formData);
      
      // Если экшен вернул ошибку, записываем её в стейт
      if (result && !result.success) {
        setError(result.error || 'Произошла ошибка при входе');
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-zinc-50/50 relative overflow-hidden">
      
      {/* Декоративные элементы фона */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200/60 p-8 sm:p-10 relative z-10">
        
        {/* Заголовок */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">С возвращением!</h1>
          <p className="text-zinc-500 text-sm">Введите свои данные для входа в HotelSpace</p>
        </div>

        {/* ПЛАШКА ОШИБКИ ВВОДА */}
        {error && (
          <div className="mb-6 bg-rose-50 text-rose-700 border border-rose-100 p-4 rounded-xl text-xs font-bold transition-all animate-in fade-in-50 duration-200">
            ✕ {error}
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Email</label>
            <input 
              name="email"
              type="email" 
              required
              disabled={isPending}
              placeholder="name@example.com"
              className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Пароль</label>
              <Link href="#" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">Забыли?</Link>
            </div>
            <input 
              name="password"
              type="password" 
              required
              disabled={isPending}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium disabled:opacity-60"
            />
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Проверка данных...' : 'Войти в аккаунт'}
          </button>
        </form>

        {/* Разделитель */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
            <span className="bg-white px-3 text-zinc-400">или войти через</span>
          </div>
        </div>

        {/* Новые коммерческие социальные кнопки */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors text-xs font-bold text-zinc-700 cursor-pointer">
              <span>Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-950 hover:bg-zinc-900 text-white border border-transparent rounded-xl transition-colors text-xs font-bold cursor-pointer">
              <span>Apple ID</span>
            </button>
          </div>
          <button type="button" className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors text-xs font-bold text-zinc-700 cursor-pointer">
            <span className="text-red-500 font-extrabold text-sm mr-0.5">Y</span>
            <span>Войти с Яндекс ID</span>
          </button>
        </div>

        {/* Ссылка на регистрацию */}
        <p className="text-center mt-10 text-sm text-zinc-500">
          Нет аккаунта?{' '}
          <Link href="/auth/register" className="text-indigo-600 font-bold hover:underline transition-all">
            Создать бесплатно
          </Link>
        </p>
      </div>
    </div>
  );
}