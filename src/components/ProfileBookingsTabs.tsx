// src/components/ProfileBookingsTabs.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProfileBookingsTabsProps {
  realBookings: any[];
  cancelBookingAction: (bookingId: string) => Promise<void>;
}

export default function ProfileBookingsTabs({ realBookings, cancelBookingAction }: ProfileBookingsTabsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'active'>('all');

  // Фильтруем бронирования на клиенте на основе выбранного таба
  const filteredBookings = realBookings.filter((booking) => {
    if (activeTab === 'active') return booking.status === 'active';
    return true; // для таба 'all'
  });

  const activeCount = realBookings.filter(b => b.status === 'active').length;

  return (
    <div className="space-y-8">
      {/* Табы фильтрации */}
      <div className="flex border-b border-zinc-200 text-sm font-bold text-zinc-400 gap-6 pb-px">
        <button 
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-1 transition-all relative cursor-pointer ${
            activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'hover:text-zinc-900'
          }`}
        >
          Все поездки ({realBookings.length})
        </button>
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-1 transition-all relative cursor-pointer ${
            activeTab === 'active' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'hover:text-zinc-900'
          }`}
        >
          Активные ({activeCount})
        </button>
      </div>

      {/* Условный рендеринг: если броней нет в выбранном табе */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center space-y-4">
          <p className="text-zinc-500 text-sm">
            {activeTab === 'active' 
              ? 'У вас нет активных бронирований на данный момент.' 
              : 'У вас пока нет активных или прошлых бронирования номеров.'}
          </p>
          <Link href="/hotels" className="inline-block bg-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Найти отель
          </Link>
        </div>
      ) : (
        /* Лента карточек бронирования */
        <div className="space-y-6">
          {filteredBookings.map((booking) => {
            const isCancelled = booking.status === 'cancelled';
            
            return (
              <div 
                key={booking.id} 
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 flex flex-col md:flex-row ${
                  isCancelled ? 'border-zinc-200/50 opacity-60' : 'border-zinc-200 hover:shadow-md'
                }`}
              >
                {/* Картинка отеля */}
                <div className={`relative w-full md:w-64 aspect-video md:aspect-auto bg-zinc-100 shrink-0 ${isCancelled ? 'grayscale' : ''}`}>
                  <img 
                    src={booking.image} 
                    alt={booking.hotelName} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Основное инфо */}
                <div className="p-6 flex flex-col justify-between flex-grow space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{booking.city}</span>
                      <h3 className={`text-lg font-bold tracking-tight leading-snug ${isCancelled ? 'text-zinc-500 line-through' : 'text-zinc-900'}`}>
                        {booking.hotelName}
                      </h3>
                      <p className="text-sm text-zinc-500 font-medium">{booking.roomName}</p>
                    </div>

                    {/* Статус */}
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${
                      isCancelled ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {isCancelled ? '✕ Отменено' : '● Подтверждено'}
                    </span>
                  </div>

                  {/* Нижняя строка: даты, цена и кнопка действия */}
                  <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400 block">Даты проживания</span>
                      <span className="text-sm font-semibold text-zinc-800 flex items-center gap-1.5">
                        📅 {booking.dates}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="sm:text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 block">
                          {isCancelled ? 'Сумма возврата' : 'Итого оплачено'}
                        </span>
                        <span className={`text-lg font-black ${isCancelled ? 'text-zinc-500' : 'text-zinc-900'}`}>
                          {booking.totalPrice.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>

                      {/* Кнопка отмены */}
                      {!isCancelled && (
                        <form action={async () => {
                          if(confirm('Вы уверены, что хотите отменить это бронирование?')) {
                            await cancelBookingAction(booking.id);
                          }
                        }}>
                          <button 
                            type="submit"
                            className="bg-zinc-50 hover:bg-red-50 text-zinc-700 hover:text-red-600 text-xs font-bold px-4 py-3 border border-zinc-200 hover:border-red-200 rounded-xl transition-all cursor-pointer"
                          >
                            Отменить
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}