// src/components/RoomCard.tsx
'use client';

import { useState } from 'react';
import { createBooking } from '@/actions/booking-actions';

// Четко прописываем примитив number с маленькой буквы
interface RoomCardProps {
  hotelId: string;
  room: {
    id: string;
    name: string;
    capacity: number;      
    pricePerNight: number; 
  };
}

export default function RoomCard({ hotelId, room }: RoomCardProps) {
  // Состояние для дат заезда и выезда
  const [checkIn, setCheckIn] = useState<string>('2026-07-10');
  const [checkOut, setCheckOut] = useState<string>('2026-07-13');
  const [isPending, setIsPending] = useState<boolean>(false);

  // Вычисляем количество ночей с явным приведением типов
  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);
  const differenceInTime = date2.getTime() - date1.getTime();
  const calculatedNights = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  const nights: number = calculatedNights > 0 ? calculatedNights : 1;

  // Теперь умножение абсолютно безопасно для TypeScript
  const totalPrice: number = Number(room.pricePerNight) * nights;

  // Красивое форматирование дат для вывода в чек
  const formatDateString = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
      });
    } catch {
      return dateStr;
    }
  };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        
        try {
        const datesRangeString = `${formatDateString(checkIn)} — ${formatDateString(checkOut)} 2026`;
        
        // Вызываем экшен. Если всё ок, Next.js сам уведет нас на другую страницу
        await createBooking(hotelId, room.id, datesRangeString, totalPrice);
        } catch (error: any) {
        // ПРОВЕРКА: Если это системная ошибка редиректа Next.js, просто игнорируем её
        if (error?.message?.includes('NEXT_REDIRECT') || error?.digest?.includes('NEXT_REDIRECT')) {
            return;
        }
        
        // Сюда попадут только НАСТОЯЩИЕ ошибки базы данных или сети
        alert('Ошибка при бронировании. Попробуйте позже.');
        setIsPending(false);
        }
    };

  return (
    <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200/60 flex flex-col justify-between items-stretch gap-6">
      <div className="space-y-2">
        <h3 className="text-base font-bold text-zinc-900 tracking-tight">{room.name}</h3>
        {/* Принудительно приводим к строке через шаблонную строку, чтобы ReactNode не ругался */}
        <p className="text-xs text-zinc-500 font-medium">👨‍👩‍👦 Вместимость: до {`${room.capacity}`} гостей</p>
      </div>

      {/* Интерактивный блок выбора дат */}
      <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-zinc-200/50">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block ml-0.5">Заезд</label>
          <input 
            type="date" 
            value={checkIn}
            min="2026-01-01"
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full text-xs font-semibold text-zinc-800 focus:outline-none cursor-pointer"
          />
        </div>
        <div className="space-y-1 border-l border-zinc-100 pl-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block ml-0.5">Выезд</label>
          <input 
            type="date" 
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full text-xs font-semibold text-zinc-800 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Динамический расчет цены */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-200/50">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 block">
            Цена за {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}
          </span>
          <span className="text-xl font-black text-zinc-900">
            {totalPrice.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        <form onSubmit={handleBooking}>
          <button 
            type="submit"
            disabled={isPending}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 ${
              isPending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isPending ? 'Оформление...' : 'Забронировать'}
          </button>
        </form>
      </div>
    </div>
  );
}