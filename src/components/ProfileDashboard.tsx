// src/components/ProfileDashboard.tsx
'use client';

import { useState } from 'react';
import ProfileSettingsForm from './ProfileSettingsForm';
import ProfileBookingsTabs from './ProfileBookingsTabs';

interface ProfileDashboardProps {
  user: {
    id: string; 
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    joinedDate: string;
    role: string;
  };
  realBookings: any[];
  activeBookingsCount: number;
  totalSpent: number;
  cancelBookingAction: (bookingId: string) => Promise<void>;
}

export default function ProfileDashboard({ 
  user, 
  realBookings, 
  activeBookingsCount, 
  totalSpent, 
  cancelBookingAction 
}: ProfileDashboardProps) {
  // Текущая секция личного кабинета
  const [currentSection, setCurrentSection] = useState<'bookings' | 'settings'>('bookings');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      
      {/* === БОКОВАЯ КАРТОЧКА ПРОФИЛЯ === */}
      <aside className="space-y-6 lg:sticky lg:top-24">
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-zinc-100 border-2 border-zinc-100">
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-2">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-zinc-400 font-medium mt-0.5">{user.email}</p>
            </div>
            
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md inline-block ${
              user.role === 'ADMIN' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-zinc-100 text-zinc-600'
            }`}>
              {user.role === 'ADMIN' ? '⚡ Администратор' : 'Клиент'}
            </span>
          </div>
          
          <div className="h-px bg-zinc-100 w-full" />
          
          <div className="grid grid-cols-2 gap-2 text-left pt-2">
            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              <span className="text-[10px] font-bold text-zinc-400 uppercase block">Поездки</span>
              <span className="text-lg font-black text-zinc-900">{activeBookingsCount}</span>
            </div>
            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              <span className="text-[10px] font-bold text-zinc-400 uppercase block">Сумма</span>
              <span className="text-xs font-black text-indigo-600 block mt-1 truncate" title={`${totalSpent.toLocaleString()} ₽`}>
                {totalSpent.toLocaleString()} ₽
              </span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 font-medium pt-1">
            На HotelSpace с {user.joinedDate}
          </div>
        </div>

        {/* Интерактивная боковая навигация */}
        <nav className="bg-white border border-zinc-200 rounded-2xl p-2 shadow-sm flex flex-col gap-1 text-sm font-semibold text-zinc-600">
          <button 
            onClick={() => setCurrentSection('bookings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
              currentSection === 'bookings' ? 'bg-zinc-50 text-indigo-600' : 'hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            🧳 Мои бронирования
          </button>
          <button 
            onClick={() => setCurrentSection('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
              currentSection === 'settings' ? 'bg-zinc-50 text-indigo-600' : 'hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            👤 Личные данные
          </button>
          <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 text-zinc-400 rounded-xl text-left opacity-50 cursor-not-allowed" disabled>
            💳 Способы оплаты
          </button>
        </nav>
      </aside>

      {/* === ДИНАМИЧЕСКИЙ КОНТЕНТ === */}
      <section className="lg:col-span-3">
        {currentSection === 'bookings' ? (
          <div className="space-y-8">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
                Мои бронирования
              </h1>
              <p className="text-zinc-500 text-sm">Управляйте вашими текущими и прошлыми поездками</p>
            </div>
            <ProfileBookingsTabs 
              realBookings={realBookings} 
              cancelBookingAction={cancelBookingAction} 
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
                Настройки профиля
              </h1>
              <p className="text-zinc-500 text-sm">Управляйте личной информацией для бронирований</p>
            </div>
            <ProfileSettingsForm 
              initialData={{ 
                firstName: user.firstName, 
                lastName: user.lastName, 
                email: user.email 
              }} 
            />
          </div>
        )}
      </section>

    </div>
  );
}