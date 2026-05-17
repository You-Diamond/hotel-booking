// src/components/EditHotelForm.tsx
'use client';

import { useState } from 'react';
import { updateHotelByAdmin } from '@/actions/admin-actions';

interface EditHotelFormProps {
  hotel: any;
}

export default function EditHotelForm({ hotel }: EditHotelFormProps) {
  const [name, setName] = useState(hotel.name);
  const [city, setCity] = useState(hotel.city);
  const [image, setImage] = useState(hotel.image);
  const [description, setDescription] = useState(hotel.description);
  const [isPending, setIsPending] = useState(false);

  // Подгружаем комнаты, которые уже были у отеля в базе
  const [rooms, setRooms] = useState<any[]>(hotel.rooms.map((r: any) => ({
    name: r.name,
    capacity: r.capacity,
    pricePerNight: r.pricePerNight
  })));

  const addNewRoomField = () => {
    setRooms([...rooms, { name: '', capacity: 2, pricePerNight: 5000 }]);
  };

  const removeRoomField = (index: number) => {
    if (rooms.length === 1) return;
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleRoomChange = (index: number, field: string, value: any) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setRooms(updatedRooms);
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      // Отправляем данные на сервер
      await updateHotelByAdmin(hotel.id, { name, city, description, image, rooms });
    } catch (error: any) {
      // === ПРОВЕРКА НА РЕДИРЕКТ ===
      // Если сервер просто пытается нас перенаправить, не показываем ошибку
      if (
        error?.message?.includes('NEXT_REDIRECT') || 
        error?.digest?.includes('NEXT_REDIRECT')
      ) {
        return;
      }

      // Сюда попадут только реальные сбои (например, упала база данных Neon)
      alert(error.message || 'Ошибка обновления отеля');
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
      
      <div className="space-y-4">
        <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-2">🏨 Информация об отеле</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none" />
          <input type="text" value={city} onChange={e => setCity(e.target.value)} required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none" />
        </div>
        <input type="url" value={image} onChange={e => setImage(e.target.value)} required className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none resize-none" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
          <h3 className="text-base font-bold text-zinc-900">🛏️ Управление номерами ({rooms.length})</h3>
          <button type="button" onClick={addNewRoomField} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
            ➕ Добавить категорию
          </button>
        </div>

        <div className="space-y-4">
          {rooms.map((room, index) => (
            <div key={index} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 relative grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block ml-0.5">Категория</label>
                <input type="text" value={room.name} onChange={e => handleRoomChange(index, 'name', e.target.value)} required className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block ml-0.5">Места</label>
                <input type="number" min={1} value={room.capacity} onChange={e => handleRoomChange(index, 'capacity', e.target.value)} required className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none" />
              </div>
              <div className="space-y-1 flex gap-2 items-center">
                <div className="w-full">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block ml-0.5">Цена за ночь</label>
                  <input type="number" value={room.pricePerNight} onChange={e => handleRoomChange(index, 'pricePerNight', e.target.value)} required className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none" />
                </div>
                {rooms.length > 1 && (
                  <button type="button" onClick={() => removeRoomField(index)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl border border-rose-100 mt-4 transition-colors cursor-pointer">
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={isPending} className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-xs py-4 rounded-xl transition-all cursor-pointer">
        {isPending ? 'Сохранение изменений...' : '💾 Сохранить изменения отеля'}
      </button>
    </form>
  );
}