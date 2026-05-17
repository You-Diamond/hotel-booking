// src/components/MainSearchPanel.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MainSearchPanel() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Формируем query-параметры для каталога
    const params = new URLSearchParams();
    if (city.trim()) params.append('city', city.trim());
    if (guests) params.append('guests', guests);

    // Перенаправляем на страницу отелей с фильтрами
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="w-full bg-white/95 backdrop-blur-md p-3 rounded-2xl sm:rounded-full shadow-2xl border border-white/20 flex flex-col sm:flex-row items-stretch gap-2 transition-all focus-within:bg-white"
    >
      {/* Куда */}
      <div className="flex-1 text-left px-5 py-2 hover:bg-zinc-100/70 rounded-xl sm:rounded-full transition-colors cursor-pointer group">
        <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Направление</span>
        <input 
          type="text" 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Куда вы хотите поехать?" 
          className="w-full mt-0.5 bg-transparent text-zinc-950 placeholder-zinc-400 text-sm font-semibold focus:outline-none"
        />
      </div>

      <div className="w-px bg-zinc-200 my-3 hidden sm:block" />

      {/* Даты (декоративные, так как бронирование идет внутри конкретного номера) */}
      <div className="flex-1 text-left px-5 py-2 hover:bg-zinc-100/70 rounded-xl sm:rounded-full transition-colors cursor-pointer group">
        <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Даты поездки</span>
        <div className="flex items-center gap-1 mt-0.5">
          <input type="date" className="bg-transparent text-zinc-950 font-semibold text-xs focus:outline-none cursor-pointer w-full" />
          <span className="text-zinc-300 text-xs">—</span>
          <input type="date" className="bg-transparent text-zinc-950 font-semibold text-xs focus:outline-none cursor-pointer w-full" />
        </div>
      </div>

      <div className="w-px bg-zinc-200 my-3 hidden sm:block" />

      {/* Гости */}
      <div className="flex-1 text-left px-5 py-2 hover:bg-zinc-100/70 rounded-xl sm:rounded-full transition-colors cursor-pointer group">
        <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Кто едет</span>
        <select 
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full mt-0.5 bg-transparent text-zinc-950 font-semibold text-sm focus:outline-none cursor-pointer appearance-none"
        >
          <option value="2">2 гостя, 1 номер</option>
          <option value="1">1 гость, 1 номер</option>
          <option value="3">3+ гостя (Семейный)</option>
        </select>
      </div>

      {/* Кнопка активации */}
      <button 
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-8 py-3.5 rounded-xl sm:rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
      >
        <span>Искать</span>
      </button>
    </form>
  );
}