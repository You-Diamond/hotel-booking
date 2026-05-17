// src/actions/booking-actions.ts
'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBooking(hotelId: string, roomId: string, dates: string, totalPrice: number) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) {
    redirect('/auth/login');
  }

  const hotel = await db.hotel.findUnique({
    where: { id: hotelId },
  });
  
  const room = await db.room.findUnique({
    where: { id: roomId }
  });

  if (!hotel || !room) {
    throw new Error('Отель или номер не найдены');
  }

  // Создаем бронирование на основе реальных данных из календаря клиента
  await db.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
      hotelName: hotel.name,
      city: hotel.city,
      roomName: room.name,
      image: hotel.image,
      dates: dates, // Сюда прилетит строка вида "10 июля — 15 июля 2026"
      totalPrice: totalPrice, // Сюда прилетит точная сумма
      status: 'active'
    }
  });

  revalidatePath('/profile');
  redirect('/profile');
}

export async function cancelBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Обновляем статус бронирования в Neon на "cancelled"
  await db.booking.update({
    where: { id: bookingId },
    data: { status: 'cancelled' }
  });

  // Перезагружаем кэш страницы профиля, чтобы интерфейс мгновенно перерисовался
  revalidatePath('/profile');
}