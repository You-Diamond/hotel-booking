// src/components/ProfileSettingsForm.tsx
'use client';

import { useState, useTransition } from 'react';
import { updateProfileData } from '@/actions/profile-actions';

interface ProfileSettingsFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function ProfileSettingsForm({ initialData }: ProfileSettingsFormProps) {
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        await updateProfileData({ firstName, lastName });
        setMessage({ type: 'success', text: 'Личные данные успешно обновлены!' });
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message || 'Что-то пошло не так' });
      }
    });
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Личные данные</h3>
        <p className="text-zinc-400 text-xs">Обновите свою персональную информацию для документов бронирования</p>
      </div>

      <div className="h-px bg-zinc-100" />

      <form onSubmit={handleSubmit} className="space-y-5">
        {message && (
          <div className={`p-4 rounded-xl text-xs font-bold border ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            {message.type === 'success' ? '✓ ' : '✕ '} {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block">Имя</label>
            <input 
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block">Фамилия</label>
            <input 
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block">Email адрес</label>
          <input 
            type="email"
            value={initialData.email}
            disabled
            className="w-full px-3 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-400 cursor-not-allowed"
          />
          <p className="text-[10px] text-zinc-400">Смена email-адреса заблокирована в целях безопасности сессии.</p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
}