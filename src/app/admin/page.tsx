// src/app/admin/page.tsx
'use client';

import { useState } from 'react';
import { createHotelWithRooms } from '@/actions/admin-actions';

interface RoomField {
  name: string;
  capacity: number;
  pricePerNight: number;
}

export default function AdminPage() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isPending, setIsPending] = useState(false);

  // Динамический массив комнат (по умолчанию одна пустая стартовая комната)
  const [rooms, setRooms] = useState<RoomField[]>([
    { name: '', capacity: 2, pricePerNight: 5000 }
  ]);

  // Функция добавления нового пустого бланка комнаты в форму
  const addNewRoomField = () => {
    setRooms([...rooms, { name: '', capacity: 2, pricePerNight: 5000 }]);
  };

  // Функция удаления комнаты из формы по индексу
  const removeRoomField = (index: number) => {
    if (rooms.length === 1) return; // Нельзя удалить единственную комнату
    setRooms(rooms.filter((_, i) => i !== index));
  };

  // Изменение конкретного поля конкретной комнаты
  const handleRoomChange = (index: number, field: keyof RoomField, value: any) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: value
    };
    setRooms(updatedRooms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      await createHotelWithRooms({ name, city, description, image, rooms });
    } catch (error: any) {
      alert(error.message || 'Ошибка создания отеля');
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">Панель администратора</h1>
        <p className="text-zinc-500 text-sm mt-1">Гибкое создание отеля с неограниченным выбором номеров</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-zinc-200 rounded-3xl p-8 shadow-xs">
        
        {/* Блок Отеля */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-2">🏨 Информация об отеле</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Название отеля" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none" />
            <input type="text" placeholder="Город" value={city} onChange={e => setCity(e.target.value)} required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none" />
          </div>
          <input type="url" placeholder="Ссылка на фото отеля" value={image} onChange={e => setImage(e.target.value)} required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none" />
          <textarea placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none resize-none" />
        </div>

        {/* Блок Комнат */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
            <h3 className="text-base font-bold text-zinc-900">🛏️ Категории номеров ({rooms.length})</h3>
            <button type="button" onClick={addNewRoomField} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
              ➕ Добавить номер
            </button>
          </div>

          <div className="space-y-4">
            {rooms.map((room, index) => (
              <div key={index} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 relative grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block ml-0.5">Название категории</label>
                  <input type="text" placeholder="например, Люкс" value={room.name} onChange={e => handleRoomChange(index, 'name', e.target.value)} required className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block ml-0.5">Вместимость (чел)</label>
                  <input type="number" min={1} value={room.capacity} onChange={e => handleRoomChange(index, 'capacity', e.target.value)} required className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none" />
                </div>

                <div className="space-y-1 flex gap-2 items-center">
                  <div className="w-full space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block ml-0.5">Цена за ночь (₽)</label>
                    <input type="number" value={room.pricePerNight} onChange={e => handleRoomChange(index, 'pricePerNight', e.target.value)} required className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none" />
                  </div>
                  {rooms.length > 1 && (
                    <button type="button" onClick={() => removeRoomField(index)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl border border-rose-100 mt-5 transition-colors cursor-pointer">
                      🗑️
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isPending} className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-xs py-4 rounded-xl transition-all cursor-pointer">
          {isPending ? 'Публикация отеля...' : '🚀 Опубликовать отель со всеми номерами'}
        </button>
      </form>
    </div>
  );
}