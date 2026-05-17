'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const router = useRouter(); // Создаем инструмент для навигации

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Формируем URL с параметром города и перенаправляем пользователя
    router.push(`/search?city=${encodeURIComponent(destination)}`);
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Куда едем?</label>
        <input
          type="text"
          placeholder="Например: Сочи или Москва"
          required
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Заезд</label>
        <input
          type="date"
          required
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Выезд</label>
        <input
          type="date"
          required
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2.5 px-4 rounded-md transition duration-200"
      >
        Найти
      </button>
    </form>
  );
}