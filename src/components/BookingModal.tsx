'use client';

import { useState } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  price: number;
}

export default function BookingModal({ isOpen, onClose, hotelName, price }: BookingModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Генерируем случайный номер заказа для имитации бэкенда
    const generatedId = 'ROOM-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-black">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        
        {/* Кнопка закрытия (крестик) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ✕
        </button>

        {!isSuccess ? (
          /* Форма ввода данных */
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold text-gray-950 mb-2">Бронирование номера</h3>
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
              Отель: <strong className="text-gray-900">{hotelName}</strong> <br />
              К оплате: <strong className="text-gray-900">{price} ₽</strong>
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ФИО гостя</label>
              <input 
                type="text" 
                required 
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Электронная почта</label>
              <input 
                type="email" 
                required 
                placeholder="ivan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Номер телефона</label>
              <input 
                type="tel" 
                required 
                placeholder="+7 (999) 999-99-99"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition mt-4 shadow-md"
            >
              Подтвердить бронирование
            </button>
          </form>
        ) : (
          /* Экран успешного завершения */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-gray-950">Готово, {name}!</h3>
            <p className="text-gray-600 text-sm">
              Номер успешно забронирован. Мы отправили подтверждение на адрес <span className="font-semibold text-gray-900">{email}</span>.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 font-mono text-sm">
              Номер брони: <span className="font-bold text-blue-600">{orderId}</span>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition mt-4"
            >
              Закрыть окно
            </button>
          </div>
        )}

      </div>
    </div>
  );
}