// src/app/auth/register/page.tsx
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { registerUser } from '@/actions/auth-actions';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      // Вызываем наш безопасный экшен
      const result = await registerUser(formData);
      
      // Ловим ошибку валидации или дубликата из бэкенда
      if (result && !result.success) {
        setError(result.error || 'Произошла ошибка при регистрации');
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-zinc-50/50 relative overflow-hidden">
      
      {/* Декоративные элементы фона */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-200/60 p-8 sm:p-10 relative z-10">
        
        {/* Заголовок */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Создать профиль</h1>
          <p className="text-zinc-500 text-sm">Присоединяйтесь к HotelSpace для удобного бронирования</p>
        </div>

        {/* ПЛАШКА ОШИБКИ */}
        {error && (
          <div className="mb-6 bg-rose-50 text-rose-700 border border-rose-100 p-4 rounded-xl text-xs font-bold transition-all animate-in fade-in-50 duration-200">
            ✕ {error}
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Имя и Фамилия */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Имя</label>
              <input 
                name="firstName"
                type="text" 
                required
                disabled={isPending}
                placeholder="Александр"
                className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Фамилия</label>
              <input 
                name="lastName"
                type="text" 
                required
                disabled={isPending}
                placeholder="Иванов"
                className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium disabled:opacity-60"
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Пароль */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Пароль</label>
            <input 
              name="password"
              type="password" 
              required
              disabled={isPending}
              placeholder="Придумайте пароль"
              className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium disabled:opacity-60"
            />
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer mt-4 disabled:opacity-50"
          >
            {isPending ? 'Создание профиля...' : 'Начать путешествие'}
          </button>
        </form>

        {/* Соглашение */}
        <p className="text-[10px] text-zinc-400 text-center mt-6 px-4">
          Нажимая кнопку, вы соглашаетесь с условиями обслуживания и политикой конфиденциальности.
        </p>

        {/* Ссылка на вход */}
        <p className="text-center mt-8 text-sm text-zinc-500 pt-6 border-t border-zinc-50">
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="text-indigo-600 font-bold hover:underline transition-all">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}